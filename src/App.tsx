import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ExamInstructions from './pages/ExamInstructions';
import ExamPage from './pages/ExamPage';
import ResultOfferPage from './pages/ResultOfferPage';
import AdminPage from './pages/AdminPage';
import { dbService, supabaseConfigError } from './firebase';
import { User, ExamAttempt } from './types';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from './components/Button';

type Screen = 'landing' | 'auth' | 'dashboard' | 'instructions' | 'exam' | 'result' | 'admin';

export default function App() {
  // Se houver erro de configuração de variáveis do Supabase, exibe um painel de diagnóstico detalhado para evitar tela branca
  if (supabaseConfigError) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-slate-100 select-none">
        <div className="max-w-md w-full bg-slate-900 border border-red-900/40 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-red-500"></div>
          <div className="flex flex-col items-center mb-6">
            <span className="p-3 bg-red-500/10 text-red-400 rounded-2xl mb-4">
              <ShieldCheck className="w-10 h-10" />
            </span>
            <h2 className="font-display font-black text-xl text-white tracking-tight uppercase">
              Supabase Sem Configuração
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-1 text-center uppercase tracking-widest">
              Erro de Ambiente de Produção
            </p>
          </div>
          
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 mb-6 text-left">
            <p className="text-[13px] text-slate-300 font-medium leading-relaxed mb-3">
              O aplicativo foi carregado com sucesso, mas a conexão com o banco de dados Supabase falhou:
            </p>
            <p className="text-xs font-mono text-red-400 bg-red-950/25 p-3 rounded-xl border border-red-900/30 break-words leading-relaxed">
              {supabaseConfigError}
            </p>
          </div>

          <div className="text-xs text-slate-400 leading-relaxed text-left space-y-2.5 mb-6">
            <p className="font-bold text-slate-300 uppercase tracking-wide text-[10px]">Como corrigir no Netlify:</p>
            <ol className="list-decimal pl-4 space-y-1 text-slate-450">
              <li>Acesse o painel do seu site no <strong>Netlify</strong>.</li>
              <li>Acesse <strong>Site Configuration</strong> &gt; <strong>Environment variables</strong>.</li>
              <li>Adicione as variáveis exatamente com estes nomes:
                <ul className="list-disc pl-4 mt-1 font-mono text-[11px] text-slate-300">
                  <li><code>VITE_SUPABASE_URL</code></li>
                  <li><code>VITE_SUPABASE_ANON_KEY</code></li>
                </ul>
              </li>
              <li>Faça um novo deploy (Redeploy) para carregar as novas variáveis de ambiente no cliente.</li>
            </ol>
          </div>

          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
            Jornada BB — Conexão e Segurança Ativa
          </p>
        </div>
      </div>
    );
  }

  // Navigation State
  const [screen, setScreen] = useState<Screen>('landing');
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');

  // Authenticated Profile State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeAttempt, setActiveAttempt] = useState<ExamAttempt | null>(null);
  
  // App initialization/session hydration state
  const [initializing, setInitializing] = useState(true);
  const [busyLoading, setBusyLoading] = useState(false);

  // Monitor user login state dynamically
  useEffect(() => {
    const unsubscribe = dbService.onAuthStateChange(async (userProfile) => {
      if (userProfile) {
        setCurrentUser(userProfile);
        
        // Hydrate attempts to see if there is an active exam sessions
        try {
          const userAttempts = await dbService.getAttempts(userProfile.uid);
          // Find any incomplete started attempt
          const startedAttempt = userAttempts.find(a => a.simuladoId === '01' && a.status === 'started');
          
          if (startedAttempt) {
            setActiveAttempt(startedAttempt);
          }
        } catch (err) {
          console.warn("Hydrate attempts error: ", err);
        }

        // Auto move to dashboard if user is authenticated and was on landing/auth
        setScreen((prev) => (prev === 'landing' || prev === 'auth') ? 'dashboard' : prev);
      } else {
        setCurrentUser(null);
        setActiveAttempt(null);
        setScreen((prev) => prev !== 'admin' ? 'landing' : 'admin');
      }
      setInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    setBusyLoading(true);
    try {
      await dbService.signOut();
      setCurrentUser(null);
      setActiveAttempt(null);
      setScreen('landing');
    } catch (err) {
      console.error("Sign out error: ", err);
    } finally {
      setBusyLoading(false);
    }
  };

  const handleStartExamFlow = async () => {
    if (!currentUser) return;
    setBusyLoading(true);

    try {
      // Find if they already have an attempt in progress
      const userAttempts = await dbService.getAttempts(currentUser.uid);
      const unresolved = userAttempts.find(a => a.simuladoId === '01' && a.status === 'started');

      if (unresolved) {
        setActiveAttempt(unresolved);
        setScreen('instructions');
      } else {
        const simulado1Attempts = userAttempts.filter(a => a.simuladoId === '01');
        if (simulado1Attempts.length >= 3) {
          console.warn("Max 3 attempts reached for this simulado.");
          return;
        }

        // Build new attempt object
        const newAttempt = await dbService.startAttempt(
          currentUser.uid,
          currentUser.nome,
          currentUser.email,
          '01'
        );
        setActiveAttempt(newAttempt);
        setScreen('instructions');
      }
    } catch (err) {
      console.error("Initiate trial sequence error: ", err);
    } finally {
      setBusyLoading(false);
    }
  };

  // Triggering after exam submission completes
  const handleExamSubmissionSuccess = async (submittedId?: string) => {
    if (!currentUser || !activeAttempt) return;
    setBusyLoading(true);

    try {
      const attemptsList = await dbService.getAttempts(currentUser.uid);
      let finalised = null;
      if (submittedId) {
        finalised = attemptsList.find(a => a.id === submittedId);
      }
      if (!finalised) {
        // Sort by submittedAt descending or startedAt descending to get the newest submitted attempt
        const submittedAttempts = attemptsList
          .filter(a => a.simuladoId === '01' && a.status === 'submitted')
          .sort((a, b) => {
            const dateA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
            const dateB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
            return dateB - dateA;
          });
        finalised = submittedAttempts[0];
      }
      
      if (finalised) {
        setActiveAttempt(finalised);
      } else {
        // Safe robust state overlay as a fallback
        setActiveAttempt({
          ...activeAttempt,
          status: 'submitted',
          submittedAt: new Date().toISOString()
        });
      }
      setScreen('result');
    } catch (err) {
      console.error("Hydrating completed exam state failed: ", err);
    } finally {
      setBusyLoading(false);
    }
  };

  // Loading Splash Screen
  if (initializing || busyLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-bb-cyan/10 blur-md scale-125 animate-pulse"></div>
          <Loader2 className="w-12 h-12 text-bb-cyan animate-spin relative" />
        </div>
        <p className="font-display font-bold text-white text-lg tracking-tight uppercase">Jornada BB</p>
        <p className="text-xs text-slate-500 font-mono mt-1.5 uppercase tracking-widest">Sincronizando ambiente seguro...</p>
      </div>
    );
  }

  // Render correct view state
  switch (screen) {
    case 'landing':
      return (
        <LandingPage 
          onStart={() => {
            setAuthMode('register');
            setScreen('auth');
          }}
          onGoToLogin={() => {
            setAuthMode('login');
            setScreen('auth');
          }}
          onGoToAdmin={() => setScreen('admin')}
        />
      );

    case 'auth':
      return (
        <AuthPage 
          initialMode={authMode}
          onBack={() => setScreen('landing')}
          onSuccess={(profile) => {
            setCurrentUser(profile);
            setScreen('dashboard');
          }}
        />
      );

    case 'dashboard':
      if (!currentUser) {
        setScreen('landing');
        return null;
      }
      return (
        <Dashboard 
          user={currentUser}
          onLogout={handleLogout}
          onStartExam={handleStartExamFlow}
          onViewResults={(attempt) => {
            setActiveAttempt(attempt);
            setScreen('result');
          }}
          onGoToAdmin={() => setScreen('admin')}
        />
      );

    case 'instructions':
      return (
        <ExamInstructions 
          onBack={() => setScreen('dashboard')}
          onStartExam={() => setScreen('exam')}
        />
      );

    case 'exam':
      if (!activeAttempt) {
        setScreen('dashboard');
        return null;
      }
      return (
        <ExamPage 
          attempt={activeAttempt}
          onSubmitted={handleExamSubmissionSuccess}
        />
      );

    case 'result':
      if (!activeAttempt) {
        setScreen('dashboard');
        return null;
      }
      return (
        <ResultOfferPage 
          attempt={activeAttempt}
          onGoToDashboard={() => setScreen('dashboard')}
        />
      );

    case 'admin':
      return (
        <AdminPage 
          currentUser={currentUser}
          onBack={() => {
            if (currentUser) {
              setScreen('dashboard');
            } else {
              setScreen('landing');
            }
          }}
        />
      );

    default:
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-slate-400 font-mono">
          <ShieldCheck className="w-12 h-12 text-red-500 mb-4" />
          <span>ESTADO INCONSISTENTE DETECTADO.</span>
          <Button variant="secondary" size="sm" onClick={() => setScreen('landing')} className="mt-4">
            Voltar ao Início
          </Button>
        </div>
      );
  }
}
