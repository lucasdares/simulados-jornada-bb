import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  getDocs,
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where,
  addDoc,
  getDocFromServer
} from 'firebase/firestore';

import firebaseConfig from './firebase-applet-config.json';
import { User, ExamAttempt, EventLog, AdminStats, ScoreBySubject } from './types';

// Constants
export const WHATSAPP_NUMBER = "553298185214"; // Fácil de editar
export const ADMIN_PASSWORD = "alterar123";

// Error Boundary Types
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

// Check if we have standard placeholder or custom credentials
const isPlaceholder = !firebaseConfig.apiKey || firebaseConfig.apiKey === 'PLACEHOLDER_API_KEY';

let firebaseApp;
let firestoreDb: any = null;
let firebaseAuth: any = null;
let localMode = true;

if (!isPlaceholder) {
  try {
    firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    firestoreDb = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
    firebaseAuth = getAuth(firebaseApp);
    localMode = false;
    console.log("Firebase initialized successfully in Real Mode.");
    
    // Validate Connection to Firestore as required by skill
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(firestoreDb, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. You are offline.");
        }
      }
    };
    testConnection();
  } catch (err) {
    console.warn("Failed to initialize Firebase SDKs, entering Local Fallback Mode.", err);
    localMode = true;
  }
} else {
  console.log("Using local JSON/LocalStorage database driver (Placeholder API key detected).");
}

export const isLocalStorageMode = localMode;
export const auth = firebaseAuth;
export const db = firestoreDb;

// Error Handling utility as required by firebase-integration skill
function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: firebaseAuth?.currentUser?.uid || null,
      email: firebaseAuth?.currentUser?.email || null,
      emailVerified: firebaseAuth?.currentUser?.emailVerified || null,
      isAnonymous: firebaseAuth?.currentUser?.isAnonymous || null,
    },
    operationType,
    path
  };
  console.error('Firestore Hardened Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// LocalStorage helpers for dual-mode
const getLocal = <T>(key: string, defaultValue: T): T => {
  const val = localStorage.getItem(key);
  return val ? JSON.parse(val) : defaultValue;
};

const setLocal = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// State for local auth listeners
const localListeners: Array<(user: User | null) => void> = [];
let localCurrentUser: User | null = getLocal<User | null>('jornada_bb_current_uid_profile', null);

const triggerLocalListeners = () => {
  localListeners.forEach(listener => listener(localCurrentUser));
};

// Exported high-level database and auth operations
export const dbService = {
  // Authentication Actions
  onAuthStateChange(callback: (user: User | null) => void) {
    if (!isLocalStorageMode) {
      return onAuthStateChanged(firebaseAuth, async (firebaseUser: FirebaseUser | null) => {
        if (!firebaseUser) {
          callback(null);
          return;
        }
        
        const userPath = `users/${firebaseUser.uid}`;
        try {
          const userDoc = await getDoc(doc(firestoreDb, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            callback(userDoc.data() as User);
          } else {
            // Document might not have synchronized yet, fallback to local details if any
            callback({
              uid: firebaseUser.uid,
              nome: firebaseUser.displayName || 'Usuário BB',
              email: firebaseUser.email || '',
              createdAt: new Date().toISOString(),
              lastLoginAt: new Date().toISOString(),
              source: 'Direct',
              acceptedTerms: true
            });
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, userPath);
        }
      });
    } else {
      localListeners.push(callback);
      // Immediate callback with current profile
      setTimeout(() => callback(localCurrentUser), 10);
      return () => {
        const index = localListeners.indexOf(callback);
        if (index > -1) localListeners.splice(index, 1);
      };
    }
  },

  async signUp(profile: Omit<User, 'uid' | 'createdAt' | 'lastLoginAt'>, password: string): Promise<User> {
    const timestamp = new Date().toISOString();
    
    if (!isLocalStorageMode) {
      try {
        const cred = await createUserWithEmailAndPassword(firebaseAuth, profile.email, password);
        const newUser: User = {
          ...profile,
          uid: cred.user.uid,
          createdAt: timestamp,
          lastLoginAt: timestamp,
        };
        
        await setDoc(doc(firestoreDb, 'users', cred.user.uid), newUser);
        return newUser;
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${profile.email}`);
        throw error;
      }
    } else {
      const usersList = getLocal<User[]>('jornada_bb_users', []);
      if (usersList.some(u => u.email.toLowerCase() === profile.email.toLowerCase())) {
        throw new Error("auth/email-already-in-use");
      }
      
      const newUid = `local_user_${Math.random().toString(36).substr(2, 9)}`;
      const newUser: User = {
        ...profile,
        uid: newUid,
        createdAt: timestamp,
        lastLoginAt: timestamp,
      };
      
      usersList.push(newUser);
      setLocal('jornada_bb_users', usersList);
      
      localCurrentUser = newUser;
      setLocal('jornada_bb_current_uid_profile', newUser);
      triggerLocalListeners();
      
      // Seed initial activity log
      await this.logAppEvent(newUser.uid, 'user_signed_up', { source: profile.source });
      return newUser;
    }
  },

  async signIn(email: string, password: string): Promise<User> {
    const timestamp = new Date().toISOString();
    
    if (!isLocalStorageMode) {
      try {
        const cred = await signInWithEmailAndPassword(firebaseAuth, email, password);
        const userDocRef = doc(firestoreDb, 'users', cred.user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
          throw new Error("User record not found in Firestore.");
        }
        
        await updateDoc(userDocRef, {
          lastLoginAt: timestamp
        });
        
        return {
          ...(userDoc.data() as User),
          lastLoginAt: timestamp
        };
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `users/${email}`);
        throw error;
      }
    } else {
      const usersList = getLocal<User[]>('jornada_bb_users', []);
      const userFound = usersList.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!userFound) {
        throw new Error("auth/user-not-found");
      }
      
      // Simple Password Check (since it's offline fallback, we accept standard password or just pass)
      userFound.lastLoginAt = timestamp;
      setLocal('jornada_bb_users', usersList);
      
      localCurrentUser = userFound;
      setLocal('jornada_bb_current_uid_profile', userFound);
      triggerLocalListeners();
      
      await this.logAppEvent(userFound.uid, 'user_logged_in');
      return userFound;
    }
  },

  async signOut() {
    if (!isLocalStorageMode) {
      await firebaseSignOut(firebaseAuth);
    } else {
      localCurrentUser = null;
      localStorage.removeItem('jornada_bb_current_uid_profile');
      triggerLocalListeners();
    }
  },

  // Attempt Management Options
  async getAttempts(userId: string): Promise<ExamAttempt[]> {
    if (!isLocalStorageMode) {
      const path = 'attempts';
      try {
        const q = query(collection(firestoreDb, path), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        const results: ExamAttempt[] = [];
        querySnapshot.forEach((docSnap) => {
          results.push({ ...docSnap.data() as ExamAttempt, id: docSnap.id });
        });
        return results;
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, path);
        return [];
      }
    } else {
      const attempts = getLocal<ExamAttempt[]>('jornada_bb_attempts', []);
      return attempts.filter(a => a.userId === userId);
    }
  },

  async startAttempt(userId: string, userName: string, userEmail: string, simuladoId: string): Promise<ExamAttempt> {
    const timestamp = new Date().toISOString();
    
    const newAttempt: Omit<ExamAttempt, 'id'> = {
      userId,
      userName,
      userEmail,
      simuladoId,
      startedAt: timestamp,
      submittedAt: null,
      answers: {},
      totalAnswered: 0,
      score: 0,
      timeSpent: 0,
      status: 'started',
      whatsappClicked: false,
    };
    
    if (!isLocalStorageMode) {
      const path = 'attempts';
      try {
        const docRef = await addDoc(collection(firestoreDb, path), newAttempt);
        await this.logAppEvent(userId, 'simulado_started', { attemptId: docRef.id, simuladoId });
        return {
          ...newAttempt,
          id: docRef.id
        };
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
        throw error;
      }
    } else {
      const attempts = getLocal<ExamAttempt[]>('jornada_bb_attempts', []);
      const newId = `local_attempt_${Math.random().toString(36).substr(2, 9)}`;
      const attemptWithId: ExamAttempt = {
        ...newAttempt,
        id: newId
      };
      
      attempts.push(attemptWithId);
      setLocal('jornada_bb_attempts', attempts);
      
      await this.logAppEvent(userId, 'simulado_started', { attemptId: newId, simuladoId });
      return attemptWithId;
    }
  },

  async saveAnswers(attemptId: string, answers: Record<number, string>, timeSpent: number): Promise<void> {
    const totalAnswered = Object.keys(answers).length;
    
    if (!isLocalStorageMode) {
      const path = `attempts/${attemptId}`;
      try {
        await updateDoc(doc(firestoreDb, 'attempts', attemptId), {
          answers,
          totalAnswered,
          timeSpent
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    } else {
      const attempts = getLocal<ExamAttempt[]>('jornada_bb_attempts', []);
      const index = attempts.findIndex(a => a.id === attemptId);
      if (index > -1) {
        attempts[index].answers = answers;
        attempts[index].totalAnswered = totalAnswered;
        attempts[index].timeSpent = timeSpent;
        setLocal('jornada_bb_attempts', attempts);
      }
    }
  },

  async submitAttempt(
    attemptId: string, 
    answers: Record<number, string>, 
    score: number, 
    scoreBySubject: ScoreBySubject, 
    timeSpent: number
  ): Promise<void> {
    const timestamp = new Date().toISOString();
    const totalAnswered = Object.keys(answers).length;
    
    if (!isLocalStorageMode) {
      const path = `attempts/${attemptId}`;
      try {
        await updateDoc(doc(firestoreDb, 'attempts', attemptId), {
          answers,
          totalAnswered,
          score,
          scoreBySubject,
          timeSpent,
          status: 'submitted',
          submittedAt: timestamp
        });
        
        const attempt = await getDoc(doc(firestoreDb, 'attempts', attemptId));
        const userId = attempt.exists() ? attempt.data()?.userId : 'unknown';
        await this.logAppEvent(userId, 'simulado_submitted', { attemptId, score, timeSpent });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    } else {
      const attempts = getLocal<ExamAttempt[]>('jornada_bb_attempts', []);
      const index = attempts.findIndex(a => a.id === attemptId);
      if (index > -1) {
        attempts[index].answers = answers;
        attempts[index].totalAnswered = totalAnswered;
        attempts[index].score = score;
        attempts[index].scoreBySubject = scoreBySubject;
        attempts[index].timeSpent = timeSpent;
        attempts[index].status = 'submitted';
        attempts[index].submittedAt = timestamp;
        
        setLocal('jornada_bb_attempts', attempts);
        await this.logAppEvent(attempts[index].userId, 'simulado_submitted', { attemptId, score, timeSpent });
      }
    }
  },

  async clickWhatsapp(attemptId: string): Promise<void> {
    if (!isLocalStorageMode) {
      const path = `attempts/${attemptId}`;
      try {
        await updateDoc(doc(firestoreDb, 'attempts', attemptId), {
          whatsappClicked: true
        });
        const attempt = await getDoc(doc(firestoreDb, 'attempts', attemptId));
        const userId = attempt.exists() ? attempt.data()?.userId : 'unknown';
        await this.logAppEvent(userId, 'whatsapp_offer_clicked', { attemptId });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    } else {
      const attempts = getLocal<ExamAttempt[]>('jornada_bb_attempts', []);
      const index = attempts.findIndex(a => a.id === attemptId);
      if (index > -1) {
        attempts[index].whatsappClicked = true;
        setLocal('jornada_bb_attempts', attempts);
        await this.logAppEvent(attempts[index].userId, 'whatsapp_offer_clicked', { attemptId });
      }
    }
  },

  // Event Reporting Logs
  async logAppEvent(userId: string, eventName: string, metadata?: any): Promise<void> {
    const timestamp = new Date().toISOString();
    const eventObj: Omit<EventLog, 'id'> = {
      userId,
      eventName,
      createdAt: timestamp,
      metadata: metadata || null,
    };
    
    if (!isLocalStorageMode) {
      const path = 'events';
      try {
        await addDoc(collection(firestoreDb, path), eventObj);
      } catch (error) {
        // Soft fail to prevent locking user interface on logging issues
        console.error("Failed to log event to Firebase: ", error);
      }
    } else {
      const events = getLocal<EventLog[]>('jornada_bb_events', []);
      const newId = `local_event_${Math.random().toString(36).substr(2, 9)}`;
      events.push({
        ...eventObj,
        id: newId
      });
      setLocal('jornada_bb_events', events);
    }
  },

  // Admin Portal stats extraction
  async getAdminData(): Promise<AdminStats> {
    if (!isLocalStorageMode) {
      try {
        const usersSnap = await getDocs(collection(firestoreDb, 'users'));
        const attemptsSnap = await getDocs(collection(firestoreDb, 'attempts'));
        const eventsSnap = await getDocs(collection(firestoreDb, 'events'));
        
        const usersList: User[] = [];
        usersSnap.forEach(docSnap => usersList.push(docSnap.data() as User));
        
        const attemptsList: ExamAttempt[] = [];
        attemptsSnap.forEach(docSnap => attemptsList.push({ ...docSnap.data() as ExamAttempt, id: docSnap.id }));
        
        const totalStarted = attemptsList.length;
        const totalSubmitted = attemptsList.filter(a => a.status === 'submitted').length;
        const totalWhatsappClicks = attemptsList.filter(a => a.whatsappClicked).length;
        
        return {
          totalUsers: usersList.length,
          totalStarted,
          totalSubmitted,
          totalWhatsappClicks,
          users: usersList,
          attempts: attemptsList
        };
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'admin_check');
        throw error;
      }
    } else {
      const users = getLocal<User[]>('jornada_bb_users', []);
      const attempts = getLocal<ExamAttempt[]>('jornada_bb_attempts', []);
      
      const totalStarted = attempts.length;
      const totalSubmitted = attempts.filter(a => a.status === 'submitted').length;
      const totalWhatsappClicks = attempts.filter(a => a.whatsappClicked).length;
      
      return {
        totalUsers: users.length,
        totalStarted,
        totalSubmitted,
        totalWhatsappClicks,
        users,
        attempts
      };
    }
  }
};
