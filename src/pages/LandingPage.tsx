import React from 'react';
import Logo from '../components/Logo';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import ThemeToggle from '../components/ThemeToggle';
import { WHATSAPP_NUMBER } from '../firebase';
import { CheckCircle, ShieldCheck, Flame, CalendarClock, MessageCircleCode, ArrowRight, BookOpen } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onGoToLogin: () => void;
  onGoToAdmin: () => void;
}

export default function LandingPage({ onStart, onGoToLogin, onGoToAdmin }: LandingPageProps) {
  const benefits = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-bb-cyan" />,
      title: "Simulado Gratuito",
      description: "Acesso 100% gratuito ao conteúdo completo, sem cadastrar cartão de crédito."
    },
    {
      icon: <Flame className="w-6 h-6 text-bb-yellow" />,
      title: "Estilo Cesgranrio",
      description: "70 questões autorais estruturadas exatamente com a distribuição e rigor da banca oficial."
    },
    {
      icon: <CalendarClock className="w-6 h-6 text-bb-cyan" />,
      title: "Prazo de 24 horas",
      description: "Simulação de pressão temporal real da prova, com 24 horas para submeter após a abertura."
    },
    {
      icon: <MessageCircleCode className="w-6 h-6 text-bb-yellow" />,
      title: "Gabarito pelo WhatsApp",
      description: "Receba as respostas comentadas detalhadas e o cronograma diretamente no celular."
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between transition-colors duration-300">
      {/* Visual background flares */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#0057A8]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-[#00A6D6]/4 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-[#E5A900]/3 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Navbar */}
      <header className="relative z-10 w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 backdrop-blur-md px-6 py-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-2.5 sm:gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                const text = encodeURIComponent("Olá! Gostaria de receber os gabaritos da Jornada BB.");
                window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
              }}
              className="border-emerald-300 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-xs font-bold shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <BookOpen className="w-4 h-4 text-emerald-500" />
              <span className="hidden sm:inline">Gabaritos</span>
            </Button>
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={onGoToLogin} className="text-slate-600 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-xs">
              Acessar Painel
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl w-full mx-auto px-6 py-12 md:py-20 flex flex-col lg:flex-row items-center gap-12 flex-1 justify-center">
        {/* Left textual contents */}
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-[#E5A900]/10 text-[#E5A900] border border-[#E5A900]/25 mb-6 uppercase tracking-wider animate-pulse">
            ★ Simulado Exclusivo Banco do Brasil
          </div>
          
          <h1 className="font-display font-extrabold text-slate-900 dark:text-white text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight mb-6">
            Descubra se você está estudando na <span className="bg-linear-to-r from-[#0057A8] to-[#00A6D6] bg-clip-text text-transparent">direção certa</span>.
          </h1>
          
          <p className="text-slate-600 dark:text-slate-350 text-lg sm:text-xl leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">
            Realize um simulado autoral gratuito no estilo <strong className="text-slate-900 dark:text-white font-black">Cesgranrio</strong> para Escriturário (Agente Comercial) e obtenha clareza imediata sobre sua preparação.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Button 
              variant="primary" 
              size="lg" 
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-4 font-bold text-base shadow-xl shadow-[#E5A900]/20 group hover:scale-[1.02]"
              icon={<ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />}
            >
              Entrar no Simulado
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={onGoToLogin}
              className="w-full sm:w-auto"
            >
              Já tenho cadastro
            </Button>
          </div>

          <div className="mt-8 flex items-center justify-center lg:justify-start gap-3 text-sm text-slate-500 font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>Mais de 1.400 candidatos já participaram</span>
          </div>
        </div>

        {/* Right Benefits Column - Bento Presentation */}
        <div className="flex-1 w-full max-w-xl">
          <Card variant="premium" className="p-8 border border-slate-200/80 dark:border-slate-800 relative overflow-hidden shadow-2xl">
            {/* Gloss light accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#00A6D6]/5 to-transparent p-4 opacity-50"></div>
            
            <h2 className="font-display font-bold text-slate-800 dark:text-slate-100 text-2xl tracking-tight mb-6 text-center lg:text-left">
              Regras e Benefícios da Prova
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {benefits.map((b, idx) => (
                <div key={idx} className="flex flex-col items-start p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-150 dark:border-slate-800">
                  <div className="mb-3 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-[#0057A8] dark:text-[#00A6D6]">
                    {b.icon}
                  </div>
                  <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm mb-1">{b.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{b.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-201 dark:border-slate-800 text-center">
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Gabarito completo e cronograma estratégico atualizado serão liberados pelo WhatsApp após submissão de respostas.
              </p>
            </div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 px-6 text-center shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" showText={true} className="opacity-90 transition-all" />
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            © 2026 Jornada BB. Todos os direitos reservados. Este aplicativo é um simulado autoral e não possui filiação direta ou jurídica com o Banco do Brasil S.A.
          </p>
          <button 
            onClick={onGoToAdmin} 
            className="text-[10px] text-slate-400 hover:text-slate-650 dark:hover:text-slate-300 font-mono tracking-wider uppercase border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0"
          >
            Acesso Admin
          </button>
        </div>
      </footer>
    </div>
  );
}
