import React, { useState } from 'react';
import Logo from '../components/Logo';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { dbService } from '../firebase';
import { Mail, Lock, User, Phone, CheckCircle, ArrowLeft, AlertCircle } from 'lucide-react';

interface AuthPageProps {
  onBack: () => void;
  onSuccess: (userProfile: any) => void;
  initialMode?: 'register' | 'login';
}

export default function AuthPage({ onBack, onSuccess, initialMode = 'register' }: AuthPageProps) {
  const [mode, setMode] = useState<'register' | 'login'>(initialMode);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  // States
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Parse UTM parameters from URL query if any
  const getUTMs = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      return {
        utm_source: params.get('utm_source') || 'direct',
        utm_campaign: params.get('utm_campaign') || undefined,
        utm_content: params.get('utm_content') || undefined,
      };
    } catch {
      return { utm_source: 'direct' };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Common validations
    if (!email) {
      setErrorMessage("Por favor, informe seu email.");
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage("A senha precisa ter no mínimo 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      if (mode === 'register') {
        if (!name) {
          setErrorMessage("O nome completo é obrigatório.");
          setLoading(false);
          return;
        }
        if (!phone.trim()) {
          setErrorMessage("O número de WhatsApp com DDD é obrigatório.");
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setErrorMessage("As senhas não coincidem.");
          setLoading(false);
          return;
        }
        if (!acceptedTerms) {
          setErrorMessage("Você precisa aceitar os termos de recebimento de materiais.");
          setLoading(false);
          return;
        }

        const utms = getUTMs();
        const profile = {
          nome: name,
          email: email.trim(),
          telefone: phone.trim(),
          source: utms.utm_source,
          utm_source: utms.utm_source,
          utm_campaign: utms.utm_campaign,
          utm_content: utms.utm_content,
          acceptedTerms: acceptedTerms
        };

        const newUser = await dbService.signUp(profile, password);
        onSuccess(newUser);
      } else {
        // Login mode
        const loggedUser = await dbService.signIn(email.trim(), password);
        onSuccess(loggedUser);
      }
    } catch (err: any) {
      console.warn("Auth submit error: ", err);
      // Translate common Firebase errors
      if (err.message && err.message.includes('auth/email-already-in-use')) {
        setErrorMessage("Este endereço de e-mail já está sendo utilizado.");
      } else if (err.message && err.message.includes('auth/user-not-found')) {
        setErrorMessage("Não há nenhuma conta cadastrada com este e-mail.");
      } else if (err.message && err.message.includes('auth/wrong-password')) {
        setErrorMessage("Senha incorreta. Por favor, tente novamente.");
      } else if (err.message && err.message.includes('auth/invalid-credential')) {
        setErrorMessage("Credenciais inválidas. Verifique seu e-mail e senha.");
      } else {
        setErrorMessage(
          mode === 'register' 
            ? "Erro ao criar conta. Certifique-se de que o formato do e-mail está correto." 
            : "Senha ou usuário incorretos. Tente novamente."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#f8fafc] flex flex-col justify-center items-center px-4 py-12">
      {/* Visual top/bottom flares */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#0057A8]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#00A6D6]/3 rounded-full blur-3xl pointer-events-none"></div>

      {/* Back to landing link */}
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 text-slate-500 hover:text-slate-800 flex items-center gap-2 text-sm font-semibold transition-colors bg-white hover:bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs"
      >
        <ArrowLeft className="w-4 h-4 text-slate-400" /> Volta ao início
      </button>

      <div className="w-full max-w-md relative z-10 w-full">
        {/* Brand center header */}
        <div className="flex flex-col items-center mb-8">
          <Logo size="lg" showText={true} />
          <p className="text-slate-500 text-sm mt-2 text-center font-medium">
            {mode === 'register' ? 'Crie seu cadastro gratuito em menos de 1 minuto' : 'Acesse seus simulados da Jornada BB'}
          </p>
        </div>

        {/* Auth Box Container */}
        <Card variant="premium" className="shadow-2xl border-slate-200/80 relative overflow-hidden">
          <h2 className="font-display font-bold text-2xl text-slate-850 tracking-tight mb-6 text-center">
            {mode === 'register' ? 'Crie seu Acesso Gratuito' : 'Acesse seu Painel'}
          </h2>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl flex items-start gap-2.5 mb-5 animate-pulse-subtle">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-slate-500 mb-1.5">
                  Nome Completo *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#0057A8] focus:bg-white text-slate-850 text-sm placeholder-slate-400 outline-hidden transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-slate-500 mb-1.5">
                Endereço de E-mail *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@exemplo.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#0057A8] focus:bg-white text-slate-850 text-sm placeholder-slate-400 outline-hidden transition-colors"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-slate-500 mb-1.5">
                  WhatsApp com DDD *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(00) 99999-9999"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#0057A8] focus:bg-white text-slate-850 text-sm placeholder-slate-400 outline-hidden transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-slate-500 mb-1.5">
                Senha *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#0057A8] focus:bg-white text-slate-850 text-sm placeholder-slate-400 outline-hidden transition-colors"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-slate-500 mb-1.5">
                  Confirmar Senha *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#0057A8] focus:bg-white text-slate-850 text-sm placeholder-slate-400 outline-hidden transition-colors"
                  />
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div className="flex items-start gap-2.5 mt-3 pt-1 select-none">
                <input
                  type="checkbox"
                  id="notificationsCheck"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded-sm border-slate-300 text-[#0057A8] focus:ring-[#0057A8]/30 accent-[#0057A8] bg-slate-50 cursor-pointer"
                />
                <label htmlFor="notificationsCheck" className="text-xs text-slate-500 leading-relaxed cursor-pointer hover:text-slate-800 font-medium">
                  Aceito receber informações sobre simulados, recomendações estratégicas de estudos e materiais gratuitos da Jornada BB.
                </label>
              </div>
            )}

            <Button 
              type="submit"
              variant="primary" 
              size="lg" 
              loading={loading}
              className="w-full mt-4 py-3"
            >
              {mode === 'register' ? 'Criar acesso gratuito' : 'Acessar Plataforma'}
            </Button>
          </form>

          {/* Toggle link */}
          <div className="mt-6 pt-5 border-t border-slate-200 text-center text-sm">
            {mode === 'register' ? (
              <p className="text-slate-500 font-medium">
                Já tem cadastro?{' '}
                <button 
                  type="button"
                  onClick={() => { setMode('login'); setErrorMessage(null); }}
                  className="font-extrabold text-[#0057A8] hover:underline cursor-pointer"
                >
                  Entrar com minha conta
                </button>
              </p>
            ) : (
              <p className="text-slate-500 font-medium">
                Ainda não tem acesso?{' '}
                <button 
                  type="button"
                  onClick={() => { setMode('register'); setErrorMessage(null); }}
                  className="font-extrabold text-[#0057A8] hover:underline cursor-pointer"
                >
                  Criar conta gratuita
                </button>
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
export type { AuthPageProps };
