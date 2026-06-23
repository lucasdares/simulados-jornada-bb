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

console.log('SUPABASE URL:', rawSupabaseUrl);
console.log('SUPABASE KEY EXISTE:', !!rawSupabaseAnonKey);

let tempSupabaseClient: any = null;
let initError: string | null = null;

if (!rawSupabaseUrl) {
  initError = "A variável VITE_SUPABASE_URL está vazia ou não foi configurada. Certifique-se de configurar suas Variáveis de Ambiente no painel do Netlify ou no arquivo .env.";
} else if (!rawSupabaseUrl.startsWith('http://') && !rawSupabaseUrl.startsWith('https://')) {
  initError = `A URL do Supabase fornecida "${rawSupabaseUrl}" é inválida. Ela deve começar com http:// ou https:// e não deve conter sufixos adicionais como /rest/v1.`;
} else if (!rawSupabaseAnonKey) {
  initError = "A variável VITE_SUPABASE_ANON_KEY está vazia ou não foi configurada. Certifique-se de configurar suas Variáveis de Ambiente no painel do Netlify ou no arquivo .env.";
} else {
  try {
    tempSupabaseClient = createClient(rawSupabaseUrl, rawSupabaseAnonKey);
  } catch (err: any) {
    initError = `Erro interno ao inicializar o Supabase: ${err?.message || err}`;
    console.error("Erro crítico ao instanciar o Supabase:", err);
  }
}

// Se houver qualquer falha ou falta de configuração, criamos um Proxy seguro para interceptar acessos e evitar quebra por TypeError
if (initError || !tempSupabaseClient) {
  console.warn("⚠️ ALERTA: SUPABASE NÃO CONFIGURADO OU APRESENTA ERRO DE INICIALIZAÇÃO ⚠️");
  console.warn("- Detalhe do Erro:", initError);
  
  const createSafeProxy = (path: string = ''): any => {
    const dummy = () => {};
    return new Proxy(dummy, {
      get(target, prop) {
        if (typeof prop === 'symbol') return undefined;
        const nextPath = path ? `${path}.${String(prop)}` : String(prop);
        
        if (prop === 'onAuthStateChange') {
          return (callback: any) => {
            console.warn(`[Supabase SafeProxy] onAuthStateChange interceptado seguro.`);
            // Simula deslogado com segurança (timeout pequeno) para que a landing page consiga renderizar normalmente sem quebrar
            setTimeout(() => callback(null), 10);
            return { data: { subscription: { unsubscribe: () => {} } } };
          };
        }
        return createSafeProxy(nextPath);
      },
      apply(target, thisArg, argumentsList) {
        console.warn(`[Supabase SafeProxy] Chamada de método interceptada em "${path}()"`);
        return Promise.resolve({
          data: null,
          error: {
            message: `Supabase indisponível: ${initError || 'Configuração em falta.'}`,
            status: 400
          }
        });
      }
    });
  };
  
  tempSupabaseClient = createSafeProxy();
}

export const supabase = tempSupabaseClient;
export const supabaseConfigError = initError;

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
      // @ts-ignore
      userId: supabaseClient?.auth?.user?.()?.id || null,
      // @ts-ignore
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

          // Cache in local storage for resilient offline/hybrid access
          const usersList = getLocal<User[]>('jornada_bb_users', []);
          const index = usersList.findIndex(u => u.uid === finalUser.uid || u.email.toLowerCase() === finalUser.email.toLowerCase());
          if (index > -1) {
            usersList[index] = finalUser;
          } else {
            usersList.push(finalUser);
          }
          setLocal('jornada_bb_users', usersList);
          setLocal('jornada_bb_current_uid_profile', finalUser);
          localCurrentUser = finalUser;

          callback(finalUser);
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
    
    console.log("=================================================");
    console.log("DBService.signUp TRIGGERED!");
    console.log("- isLocalStorageMode state:", isLocalStorageMode);
    console.log("- Does supabaseClient exist?:", !!supabaseClient);
    console.log("- VITE_SUPABASE_URL initialized?:", !!rawSupabaseUrl);
    console.log("- VITE_SUPABASE_ANON_KEY initialized?:", !!rawSupabaseAnonKey);
    console.log("- Target email:", profile.email);
    console.log("=================================================");

    if (!isLocalStorageMode && supabaseClient) {
      try {
        console.log(">>> CALLING supabaseClient.auth.signUp()");
        console.log("Credential details:", {
          email: profile.email.trim(),
          passwordLength: password ? password.length : 0,
          userMetadata: {
            nome: profile.nome,
            telefone: profile.telefone,
          }
        });

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
          console.error(">>> ERROR RETURNED FROM supabase.auth.signUp:", authError);
          console.error("- Complete raw authError JSON:", JSON.stringify(authError, null, 2));
          throw authError; // handled in the catch block
        }
        
        console.log(">>> SUCCESS FROM supabase.auth.signUp! Result AuthData:", JSON.stringify(authData, null, 2));
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

        // Write to local cache for admin board auto-sync & hybrid resiliency
        const usersList = getLocal<User[]>('jornada_bb_users', []);
        const index = usersList.findIndex(u => u.uid === newUser.uid || u.email.toLowerCase() === newUser.email.toLowerCase());
        if (index > -1) {
          usersList[index] = newUser;
        } else {
          usersList.push(newUser);
        }
        setLocal('jornada_bb_users', usersList);
        setLocal('jornada_bb_current_uid_profile', newUser);
        localCurrentUser = newUser;

        return newUser;
      } catch (error) {
        console.error(">>> CRITICAL EXCEPTION CAUGHT INSIDE dbService.signUp loop:", error);
        if (error && typeof error === 'object') {
          console.error("- Full Exception detail keys:", Object.keys(error));
          console.error("- JSON representation:", JSON.stringify(error, null, 2));
        }
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
          
        let finalUser: User;
        if (dbError || !dbUser) {
          // If the profile list row failed to register originally, build inline
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
          // Update login timestamp
          await supabaseClient
            .from('users')
            .update({ lastLoginAt: timestamp })
            .eq('uid', uid);
            
          finalUser = {
            ...dbUser,
            lastLoginAt: timestamp
          };
        }

        // Write to local cache for resilient administration/dashboard use
        const usersList = getLocal<User[]>('jornada_bb_users', []);
        const index = usersList.findIndex(u => u.uid === finalUser.uid || u.email.toLowerCase() === finalUser.email.toLowerCase());
        if (index > -1) {
          usersList[index] = finalUser;
        } else {
          usersList.push(finalUser);
        }
        setLocal('jornada_bb_users', usersList);
        setLocal('jornada_bb_current_uid_profile', finalUser);
        localCurrentUser = finalUser;
        
        return finalUser;
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
    const local = getLocal<ExamAttempt[]>('jornada_bb_attempts', []);
    const localUserMap = new Map<string, ExamAttempt>();
    local.filter(a => a.userId === userId).forEach(a => localUserMap.set(a.id, a));

    if (!isLocalStorageMode && supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('attempts')
          .select('*')
          .eq('userId', userId);
          
        if (error) {
          throw error;
        }

        // Merge local and remote
        if (data) {
          data.forEach((att: any) => {
            const existing = localUserMap.get(att.id);
            if (!existing || att.status === 'submitted' || (new Date(att.submittedAt || att.startedAt).getTime() > new Date(existing.submittedAt || existing.startedAt).getTime())) {
              localUserMap.set(att.id, att);
            }
          });
        }
        
        const merged = Array.from(localUserMap.values());
        // sync merged back to local storage
        const allLocal = getLocal<ExamAttempt[]>('jornada_bb_attempts', []);
        const otherUsersLocal = allLocal.filter(a => a.userId !== userId);
        setLocal('jornada_bb_attempts', [...otherUsersLocal, ...merged]);
        
        return merged;
      } catch (error) {
        console.warn("Failed to get attempts from Supabase, operating from local cache:", error);
        return Array.from(localUserMap.values());
      }
    } else {
      return Array.from(localUserMap.values());
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

    // Resilient local write first!
    const attempts = getLocal<ExamAttempt[]>('jornada_bb_attempts', []);
    attempts.push(newAttempt);
    setLocal('jornada_bb_attempts', attempts);
    
    if (!isLocalStorageMode && supabaseClient) {
      try {
        const { error } = await supabaseClient
          .from('attempts')
          .insert([newAttempt]);
          
        if (error) {
          throw error;
        }
        
        await this.logAppEvent(userId, 'simulado_started', { attemptId, simuladoId });
      } catch (error) {
        console.warn("Failed to insert attempt in Supabase, running with local mode overlay:", error);
        await this.logAppEvent(userId, 'simulado_started_local', { attemptId, simuladoId });
      }
    } else {
      await this.logAppEvent(userId, 'simulado_started', { attemptId, simuladoId });
    }

    return newAttempt;
  },

  async saveAnswers(attemptId: string, answers: Record<number, string>, timeSpent: number): Promise<void> {
    const totalAnswered = Object.keys(answers).length;
    
    // Always update LocalStorage baseline
    const attempts = getLocal<ExamAttempt[]>('jornada_bb_attempts', []);
    const index = attempts.findIndex(a => a.id === attemptId);
    if (index > -1) {
      attempts[index].answers = answers;
      attempts[index].totalAnswered = totalAnswered;
      attempts[index].timeSpent = timeSpent;
      setLocal('jornada_bb_attempts', attempts);
    }

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
        console.warn("Autosave remote to Supabase failed (silent warning):", error);
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
    
    // Always update LocalStorage baseline first
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
        
        await this.logAppEvent(userId, 'simulado_submitted', { attemptId, score, timeSpent });
      } catch (error) {
        console.error("Failed to submit attempt remotely (silent fallback active):", error);
        await this.logAppEvent(userId, 'simulado_submitted_local_fallback', { attemptId, score, timeSpent });
      }
    } else {
      if (userId !== 'unknown') {
        await this.logAppEvent(userId, 'simulado_submitted', { attemptId, score, timeSpent });
      }
    }
  },

  async clickWhatsapp(attemptId: string): Promise<void> {
    // ALWAYS save to LocalStorage first
    const attempts = getLocal<ExamAttempt[]>('jornada_bb_attempts', []);
    const index = attempts.findIndex(a => a.id === attemptId);
    let userId = 'unknown';
    if (index > -1) {
      attempts[index].whatsappClicked = true;
      userId = attempts[index].userId;
      setLocal('jornada_bb_attempts', attempts);
    }

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
        
        await this.logAppEvent(userId, 'whatsapp_offer_clicked', { attemptId });
      } catch (error) {
        console.warn("Failed to register whatsapp Click remotely (using local fallback logs):", error);
        await this.logAppEvent(userId, 'whatsapp_offer_clicked_local_fallback', { attemptId });
      }
    } else {
      if (userId !== 'unknown') {
        await this.logAppEvent(userId, 'whatsapp_offer_clicked', { attemptId });
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
    const localUsers = getLocal<User[]>('jornada_bb_users', []);
    const localAttempts = getLocal<ExamAttempt[]>('jornada_bb_attempts', []);

    if (!isLocalStorageMode && supabaseClient) {
      try {
        const [usersRes, attemptsRes] = await Promise.all([
          supabaseClient.from('users').select('*'),
          supabaseClient.from('attempts').select('*')
        ]);
        
        if (usersRes.error) throw usersRes.error;
        if (attemptsRes.error) throw attemptsRes.error;
        
        const remoteUsers: User[] = usersRes.data || [];
        const remoteAttempts: ExamAttempt[] = attemptsRes.data || [];

        // Dynamic synchronizer: push any local-only data to the cloud database
        const remoteEmailSet = new Set(remoteUsers.map(u => u.email.toLowerCase()));
        const remoteUidSet = new Set(remoteUsers.map(u => u.uid));

        const unsyncedUsers = localUsers.filter(u => u.email && !remoteEmailSet.has(u.email.toLowerCase()) && !remoteUidSet.has(u.uid));
        if (unsyncedUsers.length > 0) {
          console.log(`Syncing ${unsyncedUsers.length} local-only profiles to cloud database...`);
          for (const u of unsyncedUsers) {
            try {
              const { error } = await supabaseClient.from('users').insert([u]);
              if (!error) {
                remoteUsers.push(u);
              }
            } catch (err) {
              console.error("Auto-sync local profile failed:", u, err);
            }
          }
        }

        const remoteAttemptIdSet = new Set(remoteAttempts.map(a => a.id));
        const unsyncedAttempts = localAttempts.filter(a => !remoteAttemptIdSet.has(a.id));
        if (unsyncedAttempts.length > 0) {
          console.log(`Syncing ${unsyncedAttempts.length} local-only attempts to cloud database...`);
          for (const a of unsyncedAttempts) {
            try {
              const { error } = await supabaseClient.from('attempts').insert([a]);
              if (!error) {
                remoteAttempts.push(a);
              }
            } catch (err) {
              console.error("Auto-sync local attempt failed:", a, err);
            }
          }
        }

        // Deduplicate consolidated lists
        const dedupedUsersMap = new Map<string, User>();
        // local users first
        localUsers.forEach(u => u.email && dedupedUsersMap.set(u.email.toLowerCase(), u));
        // remote users take precedence
        remoteUsers.forEach(u => u.email && dedupedUsersMap.set(u.email.toLowerCase(), u));

        const consolidatedUsers = Array.from(dedupedUsersMap.values());

        const dedupedAttemptsMap = new Map<string, ExamAttempt>();
        localAttempts.forEach(a => dedupedAttemptsMap.set(a.id, a));
        remoteAttempts.forEach(a => dedupedAttemptsMap.set(a.id, a));

        const consolidatedAttempts = Array.from(dedupedAttemptsMap.values());

        const totalStarted = consolidatedAttempts.length;
        const totalSubmitted = consolidatedAttempts.filter(a => a.status === 'submitted').length;
        const totalWhatsappClicks = consolidatedAttempts.filter(a => a.whatsappClicked).length;
        
        return {
          totalUsers: consolidatedUsers.length,
          totalStarted,
          totalSubmitted,
          totalWhatsappClicks,
          users: consolidatedUsers,
          attempts: consolidatedAttempts
        };
      } catch (error) {
        console.warn("Failed to gather complete dataset from Supabase. Displaying local data only:", error);
        
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
    } else {
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
  }
};
