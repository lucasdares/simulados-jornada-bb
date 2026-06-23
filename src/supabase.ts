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

// We strictly disable any fake or local mode to avoid interference with live users
export const isLocalStorageMode = false;

export function forceLocalStorageMode() {
  console.log("forceLocalStorageMode está desativado. Rodando em modo Supabase puro.");
}

export function restoreFirebaseMode() {
  console.log("restoreFirebaseMode está desativado. Rodando em modo Supabase puro.");
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

export const dbService = {
  // Authentication Actions
  onAuthStateChange(callback: (user: User | null) => void) {
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
    await supabaseClient.auth.signOut();
  },

  // Attempt Management Options
  async getAttempts(userId: string): Promise<ExamAttempt[]> {
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
