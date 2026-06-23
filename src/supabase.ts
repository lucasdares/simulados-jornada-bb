import { createClient } from '@supabase/supabase-js';
import { User, ExamAttempt, EventLog, AdminStats, ScoreBySubject } from './types';

// Constants
export const WHATSAPP_NUMBER = "553298185214";
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

interface SupabaseErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  }
}

// Retrieve configuration from Vite bundle/secrets
// @ts-ignore
const rawSupabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
// @ts-ignore
const rawSupabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

// Sanitize Supabase URL: remove trailing slashes and any trailing /rest/v1 or rest/v1/ suffix
let sanitizedSupabaseUrl = rawSupabaseUrl;
if (sanitizedSupabaseUrl) {
  // Remove trailing slashes
  sanitizedSupabaseUrl = sanitizedSupabaseUrl.replace(/\/+$/, '');
  // Remove trailing /rest/v1 or rest/v1/ if they exist
  sanitizedSupabaseUrl = sanitizedSupabaseUrl.replace(/\/rest\/v1\/?$/, '');
}

// Logs as explicitly requested by the user
console.log("=== SUPABASE DIAGNOSTIC CONFIGURATION ===");
console.log("- Raw VITE_SUPABASE_URL from env:", rawSupabaseUrl);
console.log("- Sanitized URL being used:", sanitizedSupabaseUrl);
console.log("- Does VITE_SUPABASE_ANON_KEY exist?:", !!rawSupabaseAnonKey);
if (rawSupabaseAnonKey) {
  console.log("- VITE_SUPABASE_ANON_KEY length:", rawSupabaseAnonKey.length);
  console.log("- VITE_SUPABASE_ANON_KEY snippet (Prefix/Suffix):", rawSupabaseAnonKey.slice(0, 8) + "..." + rawSupabaseAnonKey.slice(-8));
} else {
  console.warn("- WARNING: VITE_SUPABASE_ANON_KEY is missing or empty.");
}

const forceLocalPref = localStorage.getItem('jornada_bb_force_local_mode') === 'true';

let supabaseClient: any = null;
// CRITICAL: We removed the automatic placeholder checks fallback as requested to let the real error show.
// localMode is only active if the user explicitly forced it inside the UI/LocalStorage.
let localMode = forceLocalPref;

if (!localMode) {
  console.log("Attempting to initialize Supabase Client with:", sanitizedSupabaseUrl);
  try {
    if (!sanitizedSupabaseUrl || !rawSupabaseAnonKey) {
      console.warn("WARNING: Initializing Supabase client with empty URL or Anon Key. This might trigger 'Failed to fetch' or CORS errors.");
    }
    supabaseClient = createClient(sanitizedSupabaseUrl, rawSupabaseAnonKey);
    console.log("Supabase Client instance constructed successfully!");
  } catch (err) {
    console.error("CRITICAL error during Supabase Client creation:", err);
    // Do not set localMode = true automatically, let authentic errors reach the caller as requested
  }
} else {
  console.log("Using Local Storage Mode (actively forced by local preference).");
}

export let isLocalStorageMode = localMode;

export function forceLocalStorageMode() {
  isLocalStorageMode = true;
  localStorage.setItem('jornada_bb_force_local_mode', 'true');
  console.log("Forced Local Mode permanently.");
}

export function restoreFirebaseMode() {
  localStorage.removeItem('jornada_bb_force_local_mode');
  window.location.reload();
}

// Keep a backward compatible name
export const restoreSupabaseMode = restoreFirebaseMode;

function handleSupabaseError(error: unknown, operationType: OperationType, path: string | null) {
  // Extract and print complete raw error object to console
  console.error("=== RAW ERROR RETURNED BY SUPABASE ===");
  console.error("- Object detail:", error);
  if (error && typeof error === 'object') {
    console.error("- Keys available in error object:", Object.keys(error));
    console.error("- string representation of error:", String(error));
    try {
      console.error("- JSON stringified version:", JSON.stringify(error, null, 2));
    } catch (e) {
      console.error("- Could not stringify error with JSON.stringify:", e);
    }
  }
  
  const rawMsg = error instanceof Error 
    ? error.message 
    : (error && typeof error === 'object' && 'message' in error ? (error as any).message : JSON.stringify(error));

  const errInfo: SupabaseErrorInfo = {
    error: rawMsg || 'Unknown Supabase Error',
    authInfo: {
      userId: supabaseClient?.auth?.user?.()?.id || null,
      email: supabaseClient?.auth?.user?.()?.email || null,
    },
    operationType,
    path
  };
  console.error('=== PARSED SUPABASE ERROR INFO ===', JSON.stringify(errInfo, null, 2));
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

export const dbService = {
  // Authentication Actions
  onAuthStateChange(callback: (user: User | null) => void) {
    if (!isLocalStorageMode && supabaseClient) {
      const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(async (event: string, session: any) => {
        if (!session?.user) {
          callback(null);
          return;
        }
        
        try {
          const { data: dbUser, error } = await supabaseClient
            .from('users')
            .select('*')
            .eq('uid', session.user.id)
            .single();
            
          if (dbUser && !error) {
            callback(dbUser as User);
          } else {
            callback({
              uid: session.user.id,
              nome: session.user.user_metadata?.nome || 'Usuário BB',
              email: session.user.email || '',
              createdAt: new Date().toISOString(),
              lastLoginAt: new Date().toISOString(),
              source: 'Direct',
              acceptedTerms: true
            });
          }
        } catch (err) {
          console.error("Error loading profile details on state change:", err);
          callback(null);
        }
      });
      
      return () => {
        subscription.unsubscribe();
      };
    } else {
      localListeners.push(callback);
      // Staggered immediate response
      const timer = setTimeout(() => callback(localCurrentUser), 10);
      return () => {
        clearTimeout(timer);
        const index = localListeners.indexOf(callback);
        if (index > -1) localListeners.splice(index, 1);
      };
    }
  },

  async signUp(profile: Omit<User, 'uid' | 'createdAt' | 'lastLoginAt'>, password: string): Promise<User> {
    const timestamp = new Date().toISOString();
    
    if (!isLocalStorageMode && supabaseClient) {
      console.log("=== DBService.signUp Triggered ===");
      console.log("- Target email:", profile.email);
      console.log("- Profile details to save:", JSON.stringify(profile));
      
      try {
        console.log("- Attempting auth.signUp with credentials...");
        const { data: authData, error: authError } = await supabaseClient.auth.signUp({
          email: profile.email.trim(),
          password: password,
          options: {
            data: {
              nome: profile.nome,
              telefone: profile.telefone,
            }
          }
        });
        
        if (authError) {
          console.error("- auth.signUp failed. Raw error object:", authError);
          throw authError; // handled in the catch block
        }
        
        console.log("- auth.signUp completed! AuthData:", JSON.stringify(authData));
        const newUid = authData.user?.id || `user_${Math.random().toString(36).substr(2, 9)}`;
        const newUser: User = {
          ...profile,
          uid: newUid,
          createdAt: timestamp,
          lastLoginAt: timestamp,
        };
        
        console.log("- Inserting user row into public.users database table:", JSON.stringify(newUser));
        const { error: dbError } = await supabaseClient
          .from('users')
          .insert([newUser]);
          
        if (dbError) {
          console.error("- Database insert into public.users failed. Raw error object:", dbError);
          throw dbError; // handled in the catch block
        }
        
        console.log("- public.users insert completed successfully!");
        return newUser;
      } catch (error) {
        console.error("- Exception raised inside dbService.signUp loop:", error);
        handleSupabaseError(error, OperationType.WRITE, `users/${profile.email}`);
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
      
      await this.logAppEvent(newUser.uid, 'user_signed_up', { source: profile.source });
      return newUser;
    }
  },

  async signIn(email: string, password: string): Promise<User> {
    const timestamp = new Date().toISOString();
    
    if (!isLocalStorageMode && supabaseClient) {
      try {
        const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
          email,
          password
        });
        
        if (authError) {
          throw authError;
        }
        
        const uid = authData.user?.id;
        if (!uid) {
          throw new Error("No user ID found in session response.");
        }
        
        const { data: dbUser, error: dbError } = await supabaseClient
          .from('users')
          .select('*')
          .eq('uid', uid)
          .single();
          
        if (dbError || !dbUser) {
          // If the profile list row failed to register originally, build inline
          const newUser: User = {
            uid,
            nome: authData.user?.user_metadata?.nome || 'Usuário BB',
            email: authData.user?.email || email,
            telefone: authData.user?.user_metadata?.telefone || '',
            createdAt: timestamp,
            lastLoginAt: timestamp,
            source: 'Direct',
            acceptedTerms: true
          };
          
          await supabaseClient.from('users').insert([newUser]);
          return newUser;
        }
        
        // Update login timestamp
        await supabaseClient
          .from('users')
          .update({ lastLoginAt: timestamp })
          .eq('uid', uid);
          
        return {
          ...dbUser,
          lastLoginAt: timestamp
        };
      } catch (error) {
        handleSupabaseError(error, OperationType.GET, `users/${email}`);
        throw error;
      }
    } else {
      const usersList = getLocal<User[]>('jornada_bb_users', []);
      const userFound = usersList.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!userFound) {
        throw new Error("auth/user-not-found");
      }
      
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
    if (!isLocalStorageMode && supabaseClient) {
      await supabaseClient.auth.signOut();
    } else {
      localCurrentUser = null;
      localStorage.removeItem('jornada_bb_current_uid_profile');
      triggerLocalListeners();
    }
  },

  // Attempt Management Options
  async getAttempts(userId: string): Promise<ExamAttempt[]> {
    if (!isLocalStorageMode && supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('attempts')
          .select('*')
          .eq('userId', userId);
          
        if (error) {
          throw error;
        }
        return data || [];
      } catch (error) {
        handleSupabaseError(error, OperationType.LIST, `attempts/${userId}`);
        return [];
      }
    } else {
      const attempts = getLocal<ExamAttempt[]>('jornada_bb_attempts', []);
      return attempts.filter(a => a.userId === userId);
    }
  },

  async startAttempt(userId: string, userName: string, userEmail: string, simuladoId: string): Promise<ExamAttempt> {
    const timestamp = new Date().toISOString();
    const attemptId = `attempt_${Math.random().toString(36).substr(2, 9)}`;
    
    const newAttempt: ExamAttempt = {
      id: attemptId,
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
    
    if (!isLocalStorageMode && supabaseClient) {
      try {
        const { error } = await supabaseClient
          .from('attempts')
          .insert([newAttempt]);
          
        if (error) {
          throw error;
        }
        
        await this.logAppEvent(userId, 'simulado_started', { attemptId, simuladoId });
        return newAttempt;
      } catch (error) {
        handleSupabaseError(error, OperationType.WRITE, `attempts/${attemptId}`);
        throw error;
      }
    } else {
      const attempts = getLocal<ExamAttempt[]>('jornada_bb_attempts', []);
      attempts.push(newAttempt);
      setLocal('jornada_bb_attempts', attempts);
      
      await this.logAppEvent(userId, 'simulado_started', { attemptId, simuladoId });
      return newAttempt;
    }
  },

  async saveAnswers(attemptId: string, answers: Record<number, string>, timeSpent: number): Promise<void> {
    const totalAnswered = Object.keys(answers).length;
    
    if (!isLocalStorageMode && supabaseClient) {
      try {
        const { error } = await supabaseClient
          .from('attempts')
          .update({
            answers,
            totalAnswered,
            timeSpent
          })
          .eq('id', attemptId);
          
        if (error) {
          throw error;
        }
      } catch (error) {
        handleSupabaseError(error, OperationType.WRITE, `attempts/${attemptId}`);
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
    
    if (!isLocalStorageMode && supabaseClient) {
      try {
        const { error } = await supabaseClient
          .from('attempts')
          .update({
            answers,
            totalAnswered,
            score,
            scoreBySubject,
            timeSpent,
            status: 'submitted',
            submittedAt: timestamp
          })
          .eq('id', attemptId);
          
        if (error) {
          throw error;
        }
        
        const { data } = await supabaseClient
          .from('attempts')
          .select('userId')
          .eq('id', attemptId)
          .single();
          
        const userId = data?.userId || 'unknown';
        await this.logAppEvent(userId, 'simulado_submitted', { attemptId, score, timeSpent });
      } catch (error) {
        handleSupabaseError(error, OperationType.WRITE, `attempts/${attemptId}`);
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
    if (!isLocalStorageMode && supabaseClient) {
      try {
        const { error } = await supabaseClient
          .from('attempts')
          .update({
            whatsappClicked: true
          })
          .eq('id', attemptId);
          
        if (error) {
          throw error;
        }
        
        const { data } = await supabaseClient
          .from('attempts')
          .select('userId')
          .eq('id', attemptId)
          .single();
          
        const userId = data?.userId || 'unknown';
        await this.logAppEvent(userId, 'whatsapp_offer_clicked', { attemptId });
      } catch (error) {
        handleSupabaseError(error, OperationType.WRITE, `attempts/${attemptId}`);
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
    const eventId = `event_${Math.random().toString(36).substr(2, 9)}`;
    const eventObj = {
      id: eventId,
      userId,
      eventName,
      createdAt: timestamp,
      metadata: metadata || null,
    };
    
    if (!isLocalStorageMode && supabaseClient) {
      try {
        await supabaseClient
          .from('events')
          .insert([eventObj]);
      } catch (error) {
        console.error("Failed to log event dynamically in Supabase: ", error);
      }
    } else {
      const events = getLocal<EventLog[]>('jornada_bb_events', []);
      events.push(eventObj);
      setLocal('jornada_bb_events', events);
    }
  },

  // Admin Portal Stats
  async getAdminData(): Promise<AdminStats> {
    if (!isLocalStorageMode && supabaseClient) {
      try {
        const [usersRes, attemptsRes] = await Promise.all([
          supabaseClient.from('users').select('*'),
          supabaseClient.from('attempts').select('*')
        ]);
        
        if (usersRes.error) throw usersRes.error;
        if (attemptsRes.error) throw attemptsRes.error;
        
        const usersList: User[] = usersRes.data || [];
        const attemptsList: ExamAttempt[] = attemptsRes.data || [];
        
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
        handleSupabaseError(error, OperationType.LIST, 'admin_check');
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
