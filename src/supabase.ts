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
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
// @ts-ignore
const supabaseKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

console.log('VITE_SUPABASE_URL', supabaseUrl);
console.log('VITE_SUPABASE_ANON_KEY EXISTS', !!supabaseKey);

export const supabase = createClient(supabaseUrl, supabaseKey);
export const supabaseConfigError = null;

// Maintain compatibility with existing references to supabaseClient
const supabaseClient = supabase;

// Support dynamic activation of LocalStorage Mode if Supabase is offline or forced
function getLocal<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.warn(`Error reading localStorage key "${key}":`, e);
    return defaultValue;
  }
}

function setLocal<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing localStorage key "${key}":`, e);
  }
}

let localMode = false;
if (typeof window !== 'undefined') {
  localMode = localStorage.getItem('jornada_bb_use_local_mode') === 'true';
  
  // Default to true if using the filed domain and not explicitly set to false
  if (supabaseUrl.includes('kpkqaqdcuuviqwkstej') && localStorage.getItem('jornada_bb_use_local_mode') === null) {
    console.warn("Detectou-se o domínio Supabase inativo/pausado 'kpkqaqdcuuviqwkstej'. Ativando o Modo Local/Offline por padrão para evitar travamento.");
    localStorage.setItem('jornada_bb_use_local_mode', 'true');
    localMode = true;
  }
}

export let isLocalStorageMode = localMode;

export function forceLocalStorageMode() {
  localStorage.setItem('jornada_bb_use_local_mode', 'true');
  isLocalStorageMode = true;
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
}

export function restoreFirebaseMode() {
  localStorage.removeItem('jornada_bb_use_local_mode');
  isLocalStorageMode = false;
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
}

// Keep a backward compatible name
export const restoreSupabaseMode = restoreFirebaseMode;

function handleSupabaseError(error: unknown, operationType: OperationType, path: string | null) {
  // Extract and print complete raw error object to console
  console.error("=== RAW ERROR RETURNED BY SUPABASE ===");
  console.error(error);
  
  const rawMsg = error instanceof Error 
    ? error.message 
    : (error && typeof error === 'object' && 'message' in error ? (error as any).message : String(error));
  
  throw new Error(rawMsg || 'Unknown Supabase Error');
}

const authCallbacks: ((user: User | null) => void)[] = [];

export const dbService = {
  // Authentication Actions
  onAuthStateChange(callback: (user: User | null) => void) {
    if (isLocalStorageMode) {
      authCallbacks.push(callback);
      const guest = localStorage.getItem('jornada_bb_current_user');
      if (guest) {
        try {
          callback(JSON.parse(guest));
        } catch (e) {
          callback(null);
        }
      } else {
        callback(null);
      }
      return () => {
        const idx = authCallbacks.indexOf(callback);
        if (idx > -1) authCallbacks.splice(idx, 1);
      };
    }

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
          
        let finalUser: User;
        if (dbUser && !error) {
          finalUser = dbUser as User;
        } else {
          finalUser = {
            uid: session.user.id,
            nome: session.user.user_metadata?.nome || 'Usuário BB',
            email: session.user.email || '',
            telefone: session.user.user_metadata?.telefone || '',
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
            source: 'Direct',
            acceptedTerms: true
          };
        }

        callback(finalUser);
      } catch (err) {
        console.error("Error loading profile details on state change:", err);
        callback(null);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  },

  async signUp(profile: Omit<User, 'uid' | 'createdAt' | 'lastLoginAt'>, password: string): Promise<User> {
    const timestamp = new Date().toISOString();
    
    console.log("=================================================");
    console.log("DBService.signUp TRIGGERED!");
    // @ts-ignore
    console.log("URL:", import.meta.env.VITE_SUPABASE_URL)
    // @ts-ignore
    console.log("KEY:", !!import.meta.env.VITE_SUPABASE_ANON_KEY)
    console.log("- Target email:", profile.email);
    console.log("=================================================");

    if (isLocalStorageMode) {
      const users = getLocal<User[]>('jornada_bb_users', []);
      const existing = users.find(u => u.email.toLowerCase() === profile.email.toLowerCase());
      if (existing) {
        throw new Error("Este e-mail já está cadastrado no simulador local.");
      }
      const newUid = `user_${Math.random().toString(36).substr(2, 9)}`;
      const newUser: User = {
        ...profile,
        uid: newUid,
        createdAt: timestamp,
        lastLoginAt: timestamp,
      };
      users.push(newUser);
      setLocal('jornada_bb_users', users);
      setLocal('jornada_bb_current_user', newUser);
      
      // Trigger callbacks
      authCallbacks.forEach(cb => cb(newUser));
      return newUser;
    }

    try {
      console.log(">>> CALLING supabaseClient.auth.signUp()");
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
        console.error("signUp authError:", authError);
        throw authError;
      }
      
      const newUid = authData.user?.id;
      if (!newUid) {
        throw new Error("Cadastro retornado sem ID de usuário.");
      }
      
      const newUser: User = {
        ...profile,
        uid: newUid,
        createdAt: timestamp,
        lastLoginAt: timestamp,
      };
      
      console.log("- Inserting user row into public.users table:", JSON.stringify(newUser));
      const { error: dbError } = await supabaseClient
        .from('users')
        .insert([newUser]);
        
      if (dbError) {
        console.error("signUp dbError:", dbError);
        throw dbError;
      }
      
      return newUser;
    } catch (error) {
      handleSupabaseError(error, OperationType.WRITE, `users/${profile.email}`);
      throw error;
    }
  },

  async signIn(email: string, password: string): Promise<User> {
    const timestamp = new Date().toISOString();
    
    console.log("=================================================");
    console.log("DBService.signIn TRIGGERED!");
    // @ts-ignore
    console.log("URL:", import.meta.env.VITE_SUPABASE_URL)
    // @ts-ignore
    console.log("KEY:", !!import.meta.env.VITE_SUPABASE_ANON_KEY)
    console.log("- Target email:", email);
    console.log("=================================================");

    if (isLocalStorageMode) {
      const users = getLocal<User[]>('jornada_bb_users', []);
      const userObj = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!userObj) {
        throw new Error("E-mail não cadastrado no Simulador Local. Por favor, faça o cadastro primeiro.");
      }
      const updatedUser = {
        ...userObj,
        lastLoginAt: timestamp
      };
      const updatedUsers = users.map(u => u.uid === updatedUser.uid ? updatedUser : u);
      setLocal('jornada_bb_users', updatedUsers);
      setLocal('jornada_bb_current_user', updatedUser);
      
      // Trigger callbacks
      authCallbacks.forEach(cb => cb(updatedUser));
      return updatedUser;
    }

    try {
      const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });
      
      if (authError) {
        console.error("signIn authError:", authError);
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
        
      let finalUser: User;
      if (dbError || !dbUser) {
        finalUser = {
          uid,
          nome: authData.user?.user_metadata?.nome || 'Usuário BB',
          email: authData.user?.email || email,
          telefone: authData.user?.user_metadata?.telefone || '',
          createdAt: timestamp,
          lastLoginAt: timestamp,
          source: 'Direct',
          acceptedTerms: true
        };
        
        await supabaseClient.from('users').insert([finalUser]);
      } else {
        await supabaseClient
          .from('users')
          .update({ lastLoginAt: timestamp })
          .eq('uid', uid);
          
        finalUser = {
          ...dbUser,
          lastLoginAt: timestamp
        };
      }
      
      return finalUser;
    } catch (error) {
      handleSupabaseError(error, OperationType.GET, `users/${email}`);
      throw error;
    }
  },

  async signOut() {
    if (isLocalStorageMode) {
      localStorage.removeItem('jornada_bb_current_user');
      authCallbacks.forEach(cb => cb(null));
      return;
    }
    await supabaseClient.auth.signOut();
  },

  // Attempt Management Options
  async getAttempts(userId: string): Promise<ExamAttempt[]> {
    if (isLocalStorageMode) {
      const attempts = getLocal<ExamAttempt[]>('jornada_bb_attempts', []);
      return attempts.filter(a => a.userId === userId);
    }

    try {
      const { data, error } = await supabaseClient
        .from('attempts')
        .select('*')
        .eq('userId', userId);
        
      if (error) {
        throw error;
      }
      
      return (data || []) as ExamAttempt[];
    } catch (error) {
      handleSupabaseError(error, OperationType.GET, `attempts/${userId}`);
      throw error;
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

    if (isLocalStorageMode) {
      const attempts = getLocal<ExamAttempt[]>('jornada_bb_attempts', []);
      attempts.push(newAttempt);
      setLocal('jornada_bb_attempts', attempts);
      await this.logAppEvent(userId, 'simulado_started', { attemptId, simuladoId });
      return newAttempt;
    }

    try {
      const { error } = await supabaseClient
        .from('attempts')
        .insert([newAttempt]);
        
      if (error) {
        throw error;
      }
      
      await this.logAppEvent(userId, 'simulado_started', { attemptId, simuladoId });
    } catch (error) {
      handleSupabaseError(error, OperationType.WRITE, `attempts/${attemptId}`);
    }

    return newAttempt;
  },

  async saveAnswers(attemptId: string, answers: Record<number, string>, timeSpent: number): Promise<void> {
    const totalAnswered = Object.keys(answers).length;
    
    if (isLocalStorageMode) {
      const attempts = getLocal<ExamAttempt[]>('jornada_bb_attempts', []);
      const index = attempts.findIndex(a => a.id === attemptId);
      if (index > -1) {
        attempts[index].answers = answers;
        attempts[index].totalAnswered = totalAnswered;
        attempts[index].timeSpent = timeSpent;
        setLocal('jornada_bb_attempts', attempts);
      }
      return;
    }

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
      console.error("Autosave remote to Supabase failed:", error);
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
    
    if (isLocalStorageMode) {
      const attempts = getLocal<ExamAttempt[]>('jornada_bb_attempts', []);
      const index = attempts.findIndex(a => a.id === attemptId);
      let userId = 'unknown';
      if (index > -1) {
        attempts[index].answers = answers;
        attempts[index].totalAnswered = totalAnswered;
        attempts[index].score = score;
        attempts[index].scoreBySubject = scoreBySubject;
        attempts[index].timeSpent = timeSpent;
        attempts[index].status = 'submitted';
        attempts[index].submittedAt = timestamp;
        userId = attempts[index].userId;
        setLocal('jornada_bb_attempts', attempts);
      }
      await this.logAppEvent(userId, 'simulado_submitted', { attemptId, score, timeSpent });
      return;
    }

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
      
      // Look up attempt to get userId
      const { data: attemptData } = await supabaseClient
        .from('attempts')
        .select('userId')
        .eq('id', attemptId)
        .single();

      const userId = attemptData?.userId || 'unknown';
      await this.logAppEvent(userId, 'simulado_submitted', { attemptId, score, timeSpent });
    } catch (error) {
      handleSupabaseError(error, OperationType.WRITE, `attempts/${attemptId}`);
    }
  },

  async clickWhatsapp(attemptId: string): Promise<void> {
    if (isLocalStorageMode) {
      const attempts = getLocal<ExamAttempt[]>('jornada_bb_attempts', []);
      const index = attempts.findIndex(a => a.id === attemptId);
      let userId = 'unknown';
      if (index > -1) {
        attempts[index].whatsappClicked = true;
        userId = attempts[index].userId;
        setLocal('jornada_bb_attempts', attempts);
      }
      await this.logAppEvent(userId, 'whatsapp_offer_clicked', { attemptId });
      return;
    }

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
      
      // Look up attempt to get userId
      const { data: attemptData } = await supabaseClient
        .from('attempts')
        .select('userId')
        .eq('id', attemptId)
        .single();

      const userId = attemptData?.userId || 'unknown';
      await this.logAppEvent(userId, 'whatsapp_offer_clicked', { attemptId });
    } catch (error) {
      console.warn("Failed to register whatsapp click remotely:", error);
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
    
    if (isLocalStorageMode) {
      const events = getLocal<EventLog[]>('jornada_bb_events', []);
      events.push(eventObj);
      setLocal('jornada_bb_events', events);
      return;
    }

    try {
      await supabaseClient
        .from('events')
        .insert([eventObj]);
    } catch (error) {
      console.error("Failed to log event dynamically in Supabase: ", error);
    }
  },

  // Admin Portal Stats
  async getAdminData(): Promise<AdminStats> {
    if (isLocalStorageMode) {
      const localUsers = getLocal<User[]>('jornada_bb_users', []);
      const localAttempts = getLocal<ExamAttempt[]>('jornada_bb_attempts', []);
      const totalStarted = localAttempts.length;
      const totalSubmitted = localAttempts.filter(a => a.status === 'submitted').length;
      const totalWhatsappClicks = localAttempts.filter(a => a.whatsappClicked).length;
      
      return {
        totalUsers: localUsers.length,
        totalStarted,
        totalSubmitted,
        totalWhatsappClicks,
        users: localUsers,
        attempts: localAttempts
      };
    }

    try {
      const [usersRes, attemptsRes] = await Promise.all([
        supabaseClient.from('users').select('*'),
        supabaseClient.from('attempts').select('*')
      ]);
      
      if (usersRes.error) throw usersRes.error;
      if (attemptsRes.error) throw attemptsRes.error;
      
      const remoteUsers: User[] = usersRes.data || [];
      const remoteAttempts: ExamAttempt[] = attemptsRes.data || [];

      const totalStarted = remoteAttempts.length;
      const totalSubmitted = remoteAttempts.filter(a => a.status === 'submitted').length;
      const totalWhatsappClicks = remoteAttempts.filter(a => a.whatsappClicked).length;
      
      return {
        totalUsers: remoteUsers.length,
        totalStarted,
        totalSubmitted,
        totalWhatsappClicks,
        users: remoteUsers,
        attempts: remoteAttempts
      };
    } catch (error) {
      handleSupabaseError(error, OperationType.GET, 'admin_data');
      throw error;
    }
  }
};
