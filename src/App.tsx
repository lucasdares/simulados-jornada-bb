import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ExamInstructions from './pages/ExamInstructions';
import ExamPage from './pages/ExamPage';
import ResultOfferPage from './pages/ResultOfferPage';
import AdminPage from './pages/AdminPage';
import { dbService } from './firebase';
import { User, ExamAttempt } from './types';
import { Loader2, Shield } from 'lucide-react';
import { Button } from './components/Button';

type Screen = 'landing' | 'auth' | 'dashboard' | 'instructions' | 'exam' | 'result' | 'admin';

export default function App() {
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
          <Shield className="w-12 h-12 text-red-500 mb-4" />
          <span>ESTADO INCONSISTENTE DETECTADO.</span>
          <Button variant="secondary" size="sm" onClick={() => setScreen('landing')} className="mt-4">
            Voltar ao Início
          </Button>
        </div>
      );
  }
}
