import React, { useState, useEffect } from 'react';
import Logo from '../components/Logo';
import SimuladoCard from '../components/SimuladoCard';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { dbService } from '../firebase';
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
  const firstExamAttempt = attempts.find(a => a.simuladoId === '01');
  const isCompleted = firstExamAttempt?.status === 'submitted';
  const hasStartedButNotSubmitted = firstExamAttempt && firstExamAttempt.status === 'started';

  // Stats calculation
  const totalCompleted = attempts.filter(a => a.status === 'submitted').length;
  const averageScore = totalCompleted > 0 
    ? Math.round(attempts.reduce((acc, curr) => acc + (curr.score || 0), 0) / totalCompleted)
    : null;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col justify-between">
      {/* Decorative top background gradient */}
      <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-slate-100 to-transparent pointer-events-none"></div>

      {/* Header element */}
      <header className="relative z-10 w-full border-b border-slate-250 bg-white shadow-xs">
        <div className="max-w-7xl w-full mx-auto px-6 py-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Candidato Autenticado</p>
              <p className="text-slate-800 font-bold text-sm leading-tight mt-1">{user.nome}</p>
            </div>
            {user.email?.toLowerCase() === 'dareslucas@gmail.com' && (
              <Button 
                variant="primary" 
                size="sm" 
                onClick={onGoToAdmin}
                className="bg-[#0057A8] hover:bg-[#004b91] text-white border-none font-bold"
                icon={<Shield className="w-4 h-4" />}
              >
                Painel Admin
              </Button>
            )}
            <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onLogout}
              className="text-slate-500 hover:text-red-650 border border-slate-205 hover:bg-red-50/50 font-medium"
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
          <h2 className="font-display font-extrabold text-slate-900 text-2xl sm:text-3.5xl tracking-tight leading-tight">
            Olá, <span className="text-[#0057A8]">{user.nome.split(' ')[0]}</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1 sm:text-base font-medium">
            Painel de Estudos Banco do Brasil — Desejamos uma excelente rotina de estudos estruturada.
          </p>
        </div>

        {/* Dynamic Statistics Track Bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card variant="default" className="flex items-center gap-4 border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-bb-cyan/10 border border-bb-cyan/20 flex items-center justify-center text-[#00A6D6]">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-450 font-bold uppercase tracking-wider">Simulados Ativos</p>
              <p className="text-2xl font-bold font-display text-slate-900 mt-0.5">1 Liberado</p>
            </div>
          </Card>

          <Card variant="default" className="flex items-center gap-4 border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-450 font-bold uppercase tracking-wider">Metas Enviadas</p>
              <p className="text-2xl font-bold font-display text-slate-900 mt-0.5">
                {totalCompleted} de 1
              </p>
            </div>
          </Card>

          <Card variant="default" className="flex items-center gap-4 border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-[#E5A900]/10 border border-[#E5A900]/20 flex items-center justify-center text-[#E5A900]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-450 font-bold uppercase tracking-wider">Desempenho Médio</p>
              <p className="text-2xl font-bold font-display text-slate-900 mt-0.5">
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
                  score={firstExamAttempt?.score}
                  onAction={() => {
                    if (isCompleted && firstExamAttempt) {
                      onViewResults(firstExamAttempt);
                    } else if (examStatus === 'available') {
                      onStartExam();
                    }
                  }}
                />
              )}

              {/* In Progress Recovery Warning */}
              {hasStartedButNotSubmitted && !isCompleted && (
                <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00A6D6] animate-ping"></span>
                    <div className="text-sm">
                      <p className="text-[#0057A8] font-bold leading-none">Simulado em andamento</p>
                      <p className="text-slate-600 text-xs mt-1">Sua sessão de respostas está ativa. Clique ao lado para retomar de onde parou.</p>
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
            </div>
          </div>
        </div>

        {/* Study Strategy Tip Card */}
        <Card variant="accent" className="mt-12 p-6 flex flex-col sm:flex-row items-center gap-6 justify-between">
          <div className="flex-1 text-center sm:text-left">
            <h4 className="font-display font-bold text-white text-lg">💡 Como realizar a prova corretamente:</h4>
            <p className="text-sm text-blue-105 mt-1 max-w-3xl leading-relaxed">
              Procure um local silencioso, mantenha seu celular no modo silencioso, desligue abas secundárias e simule o tempo real. Ao prosseguir, seu cronômetro geral de <strong className="text-[#FFD43B] font-bold">5 horas</strong> funcionará sem pausas. Todo o seu progresso de respostas é salvo de maneira automática instantânea.
            </p>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 bg-white py-8 px-6 text-center mt-12 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" showText={true} className="opacity-80" />
          <p className="text-xs text-slate-400 font-medium">
            Plataforma Jornada BB © 2026. Feito com rigor metodológico para impulsionar seus acertos em direção ao cargo público.
          </p>
        </div>
      </footer>
    </div>
  );
}
export type { DashboardProps };
