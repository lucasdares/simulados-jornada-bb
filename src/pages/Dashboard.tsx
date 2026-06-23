import React, { useState, useEffect } from 'react';
import Logo from '../components/Logo';
import SimuladoCard from '../components/SimuladoCard';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import ThemeToggle from '../components/ThemeToggle';
import { dbService, WHATSAPP_NUMBER } from '../firebase';
import { User, ExamAttempt } from '../types';
import { getExamStatus, ExamStatus, getExamTimes } from '../utils/time';
import { LogOut, BookOpen, Clock, Award, CheckCircle2, ChevronRight, GraduationCap, Shield } from 'lucide-react';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onStartExam: () => void;
  onViewResults: (attempt: ExamAttempt) => void;
  onGoToAdmin: () => void;
}

export default function Dashboard({ user, onLogout, onStartExam, onViewResults, onGoToAdmin }: DashboardProps) {
  const [examStatus, setExamStatus] = useState<ExamStatus>('blocked');
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Determine exam status
    setExamStatus(getExamStatus(user.email));

    // Pull any previous attempts taken by the user
    const fetchAttempts = async () => {
      try {
        const list = await dbService.getAttempts(user.uid);
        setAttempts(list);
      } catch (err) {
        console.error("Error fetching user attempts: ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();

    // Setup an interval to update the countdown eligibility in real-time
    const interval = setInterval(() => {
      setExamStatus(getExamStatus(user.email));
    }, 1000);

    return () => clearInterval(interval);
  }, [user.uid, user.email]);

  // Find if Simulado 01 was completed or in progress
  const simulado1Attempts = attempts
    .filter(a => a.simuladoId === '01')
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

  const activeUnresolved = simulado1Attempts.find(a => a.status === 'started');
  const hasStartedButNotSubmitted = !!activeUnresolved;

  const latestCompletedAttempt = simulado1Attempts.find(a => a.status === 'submitted');
  const isCompleted = !!latestCompletedAttempt;
  const attemptsCount = simulado1Attempts.length;

  // Stats calculation
  const totalCompleted = attempts.filter(a => a.status === 'submitted').length;
  const averageScore = totalCompleted > 0 
    ? Math.round(attempts.filter(a => a.status === 'submitted').reduce((acc, curr) => acc + (curr.score || 0), 0) / totalCompleted)
    : null;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between transition-colors duration-300">
      {/* Decorative top background gradient */}
      <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-slate-100 to-transparent dark:from-slate-900/10 pointer-events-none"></div>

      {/* Header element */}
      <header className="relative z-10 w-full border-b border-slate-250 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xs">
        <div className="max-w-7xl w-full mx-auto px-6 py-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap sm:flex-nowrap justify-center sm:justify-end">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider leading-none font-mono">Candidato Autenticado</p>
              <p className="text-slate-800 dark:text-slate-200 font-bold text-sm leading-tight mt-1">{user.nome}</p>
            </div>
            {user.email && ['dareslucas@gmail.com', 'guilhermeamiti007@gmail.com'].includes(user.email.toLowerCase()) && (
              <Button 
                variant="primary" 
                size="sm" 
                onClick={onGoToAdmin}
                className="bg-[#0057A8] hover:bg-[#004b91] text-white border-none font-bold text-xs"
                icon={<Shield className="w-4 h-4" />}
              >
                Painel Admin
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                const text = encodeURIComponent("Olá! Gostaria de receber os gabaritos da Jornada BB.");
                window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
              }}
              className="border-emerald-300 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-xs font-bold shadow-xs whitespace-nowrap flex items-center gap-1 shrink-0"
            >
              <BookOpen className="w-4 h-4 text-emerald-500" />
              <span>Gabaritos</span>
            </Button>

            <ThemeToggle />

            <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onLogout}
              className="text-slate-500 dark:text-slate-400 hover:text-red-650 dark:hover:text-red-400 border border-slate-205 dark:border-slate-800 hover:bg-red-50/50 dark:hover:bg-red-950/20 font-medium text-xs"
              icon={<LogOut className="w-4 h-4" />}
            >
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Grid View */}
      <main className="relative z-10 max-w-7xl w-full mx-auto px-6 py-8 sm:py-12 flex-1">
        {/* Welcome Salutation banner */}
        <div className="mb-10 text-center sm:text-left">
          <h2 className="font-display font-extrabold text-slate-900 dark:text-white text-2xl sm:text-3.5xl tracking-tight leading-tight">
            Olá, <span className="text-[#0057A8] dark:text-[#00A6D6]">{user.nome.split(' ')[0]}</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 sm:text-base font-medium">
            Painel de Estudos Banco do Brasil — Desejamos uma excelente rotina de estudos estruturada.
          </p>
        </div>

        {/* Dynamic Statistics Track Bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card variant="default" className="flex items-center gap-4 border-slate-250 dark:border-slate-800 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-bb-cyan/10 border border-bb-cyan/20 flex items-center justify-center text-[#00A6D6]">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-450 dark:text-slate-505 font-bold uppercase tracking-wider">Simulados Ativos</p>
              <p className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100 mt-0.5">1 Liberado</p>
            </div>
          </Card>

          <Card variant="default" className="flex items-center gap-4 border-slate-250 dark:border-slate-800 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-450 dark:text-slate-505 font-bold uppercase tracking-wider">Metas Enviadas</p>
              <p className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100 mt-0.5">
                {totalCompleted} de 1
              </p>
            </div>
          </Card>

          <Card variant="default" className="flex items-center gap-4 border-slate-250 dark:border-slate-800 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-[#E5A900]/10 border border-[#E5A900]/20 flex items-center justify-center text-[#E5A900]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-450 dark:text-slate-505 font-bold uppercase tracking-wider">Desempenho Médio</p>
              <p className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100 mt-0.5">
                {averageScore !== null ? `${averageScore}%` : 'Aguardando'}
              </p>
            </div>
          </Card>
        </div>

        {/* Active Simulator Block */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="font-display font-bold text-lg text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#0057A8]" /> Simulados Programados
            </h3>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Foco: Agente Comercial</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Primary active exam card */}
            <div className="space-y-4">
              {loading ? (
                <Card variant="default" className="animate-pulse p-12 text-center text-slate-405">
                  Carregando informações do simulado...
                </Card>
              ) : (
                <SimuladoCard
                  id="01"
                  title="Simulado 01 — Banco do Brasil"
                  description="Composto por 70 questões objetivas, seguindo rigorosamente a divisão de pesos, itens e regras do edital oficial Cesgranrio BB 2023."
                  status={isCompleted ? 'submitted' : examStatus}
                  releaseStr="Hoje às 20h00"
                  score={latestCompletedAttempt?.score}
                  attemptsCount={attemptsCount}
                  onRetake={onStartExam}
                  onAction={() => {
                    if (isCompleted && latestCompletedAttempt) {
                      onViewResults(latestCompletedAttempt);
                    } else if (examStatus === 'available') {
                      onStartExam();
                    }
                  }}
                />
              )}

              {/* In Progress Recovery Warning */}
              {hasStartedButNotSubmitted && (
                <div className="bg-amber-50 dark:bg-amber-950/10 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                    </span>
                    <div className="text-sm">
                      <p className="text-amber-800 dark:text-amber-400 font-bold leading-none">Simulado em andamento</p>
                      <p className="text-slate-600 dark:text-slate-400 text-xs mt-1">Sua sessão de respostas está ativa. Clique ao lado para retomar de onde parou.</p>
                    </div>
                  </div>
                  <Button 
                    variant="accent" 
                    size="sm" 
                    onClick={onStartExam}
                    icon={<ChevronRight className="w-4 h-4" />}
                  >
                    Retomar
                  </Button>
                </div>
              )}

              {/* Historical Attempts Log */}
              {simulado1Attempts.length > 0 && (
                <Card variant="default" className="p-5 border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                  <h4 className="font-display font-bold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2 flex justify-between items-center">
                    <span>Suas Tentativas ({simulado1Attempts.length}/3)</span>
                    {3 - attemptsCount > 0 && (
                      <span className="text-[10px] bg-[#0057A8]/10 dark:bg-[#00A6D6]/10 text-[#0057A8] dark:text-[#00A6D6] px-2 py-0.5 rounded-full font-bold">
                        Restam {3 - attemptsCount}
                      </span>
                    )}
                  </h4>
                  <div className="space-y-3">
                    {simulado1Attempts.map((att, idx) => {
                      const attemptNum = simulado1Attempts.length - idx;
                      const isSub = att.status === 'submitted';
                      const dateStr = att.startedAt ? new Date(att.startedAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : '';

                      return (
                        <div key={att.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/80 hover:bg-slate-150/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${
                              isSub ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 border border-emerald-100' : 'bg-amber-50 dark:bg-amber-955/20 text-amber-600 dark:text-amber-450 border border-amber-100'
                            }`}>
                              #{attemptNum}
                            </span>
                            <div>
                              <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
                                {isSub ? `Concluído: ${att.score}%` : 'Em andamento'}
                              </p>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">{dateStr}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-[#0057A8] dark:text-[#00A6D6] hover:bg-[#0057A8]/5 px-3 py-1 bg-white dark:bg-slate-800 shadow-2xs border border-slate-200 dark:border-slate-700 hover:text-[#004b91]"
                            onClick={() => {
                              if (isSub) {
                                onViewResults(att);
                              } else {
                                onStartExam();
                              }
                            }}
                          >
                            {isSub ? 'Ver Detalhes' : 'Retomar'}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              )}
            </div>

            {/* List of upcoming blocked examinations */}
            <div className="space-y-4">
              <SimuladoCard
                id="02"
                title="Simulado 02"
                description="Matérias integradas focadas em Vendas, Negociação e Novidades Financeiras."
                status="blocked"
                releaseStr="Próxima semana"
                isUpcoming={true}
              />
              <SimuladoCard
                id="03"
                title="Simulado 03"
                description="Estudo aprofundado de Conhecimentos Bancários e Informática."
                status="blocked"
                releaseStr="Em 2 semanas"
                isUpcoming={true}
              />
              <SimuladoCard
                id="04"
                title="Simulado 04"
                description="Simulação geral final unificada pós-edital."
                status="blocked"
                releaseStr="Em 3 semanas"
                isUpcoming={true}
              />

              {/* Upgraded Premium Friendly CTA to Jornada BB */}
              <div 
                id="jornada-bb-app-cta"
                className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-br from-[#0057A8]/5 via-[#00A6D6]/5 to-slate-50 dark:from-slate-900/40 dark:via-slate-950/20 dark:to-slate-900 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00A6D6]/5 dark:bg-[#00A6D6]/10 rounded-full blur-2xl pointer-events-none"></div>
                
                <div>
                  <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/10 shrink-0">
                      Plataforma Oficial
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0057A8]/10 text-[#0057A8] dark:text-[#00A6D6] border border-[#0057A8]/10 shrink-0">
                      Ciclos Inteligentes
                    </span>
                  </div>
                  
                  <h4 className="font-display font-extrabold text-[#0057A8] dark:text-[#00A6D6] text-base tracking-tight leading-snug mb-1.5">
                    Estude Completo com a Jornada BB
                  </h4>
                  
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-4">
                    Tenha acesso a ciclos inteligentes de estudo, mais de 2.500 questões, flashcards dinâmicos de alta memorização e ferramentas estatísticas completas feitas sob medida para você gabaritar o Banco do Brasil.
                  </p>
                </div>
                
                <div className="pt-2">
                  <a 
                    href="https://jornada-bb.netlify.app/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0057A8] to-[#00A6D6] hover:from-[#00478a] hover:to-[#008db6] text-white font-bold text-xs sm:text-sm tracking-wide shadow-xs hover:shadow-sm transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 group"
                  >
                    <span>Conhecer Plataforma Completa</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Study Strategy Tip Card - Upgraded Premium Aesthetic */}
        <Card variant="default" className="mt-12 p-6 border border-amber-200/70 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/10 rounded-2xl flex flex-col sm:flex-row items-start gap-4 shadow-xs">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl border border-amber-200/50 dark:border-amber-900/45 shrink-0">
            <GraduationCap className="w-6 h-6 animate-pulse" />
          </div>
          <div className="flex-1">
            <h4 className="font-display font-extrabold text-amber-900 dark:text-amber-400 text-base sm:text-lg tracking-tight">
              Instruções de Simulação Realista
            </h4>
            <p className="text-sm text-amber-800/90 dark:text-amber-300/85 mt-2 max-w-3xl leading-relaxed">
              Procure um local reservado e silencioso, ative o modo silencioso no celular e feche abas secundárias. Ao prosseguir, o cronômetro oficial de <strong className="text-amber-950 dark:text-amber-200 font-extrabold font-sans">5 horas</strong> começará a rodar sem interrupções. Seu progresso de respostas será sincronizado de forma automática e instantânea.
            </p>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 px-6 text-center mt-12 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" showText={true} className="opacity-80" />
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            Plataforma Jornada BB © 2026. Feito com rigor metodológico para impulsionar seus acertos em direção ao cargo público.
          </p>
        </div>
      </footer>
    </div>
  );
}
export type { DashboardProps };
