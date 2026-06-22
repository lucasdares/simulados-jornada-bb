import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Lock, Unlock, Calendar, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import CountdownTimer from './CountdownTimer';
import { ExamStatus, getExamTimes } from '../utils/time';

interface SimuladoCardProps {
  id: string;
  title: string;
  description: string;
  status: ExamStatus | 'submitted'; // custom status 'submitted' if already completed!
  releaseStr: string;
  isUpcoming?: boolean;
  score?: number; // if completed
  onAction?: () => void;
}

export default function SimuladoCard({
  id,
  title,
  description,
  status,
  releaseStr,
  isUpcoming = false,
  score,
  onAction
}: SimuladoCardProps) {
  const { releaseTime } = getExamTimes();

  if (isUpcoming) {
    return (
      <Card variant="default" className="opacity-80 border-slate-200 bg-white shadow-xs relative overflow-hidden group">
        <div className="absolute top-3 right-3 bg-slate-100 text-slate-400 p-2 rounded-full border border-slate-200/80">
          <Lock className="w-4 h-4" />
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-200">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-slate-600 uppercase tracking-tight">{title}</h3>
            <p className="text-xs text-[#00A6D6] uppercase tracking-widest font-bold">Em Breve</p>
          </div>
        </div>
        <p className="text-sm text-slate-500 mb-4">{description}</p>
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 p-2.5 rounded-lg border border-slate-150">
          <Calendar className="w-3.5 h-3.5 text-slate-450" />
          <span>Liberação automática na próxima semana</span>
        </div>
      </Card>
    );
  }

  // Active or expired card
  return (
    <Card 
      variant="premium" 
      className={`relative overflow-hidden ${status === 'available' ? 'ring-1 ring-[#00A6D6]/30' : ''}`}
    >
      {/* Background logo shape styling */}
      <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-[#00A6D6]/5 rounded-full blur-2xl pointer-events-none"></div>

      {/* Top Badge */}
      <div className="absolute top-4 right-4 animate-fade-in">
        {status === 'available' && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200 animate-pulse">
            <Unlock className="w-3 h-3" /> Disponível
          </span>
        )}
        {status === 'blocked' && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FFD43B]/10 text-[#E5A900] border border-[#FFD43B]/30">
            <Clock className="w-3 h-3" /> Liberando Hoje
          </span>
        )}
        {status === 'expired' && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-200">
            <AlertTriangle className="w-3 h-3" /> Encerrado
          </span>
        )}
        {status === 'submitted' && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Enviado
          </span>
        )}
      </div>

      <div className="flex items-start gap-4 mb-5">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 ${
          status === 'available' ? 'bg-[#00A6D6]/10 border-[#00A6D6] text-[#00A6D6]' :
          status === 'submitted' ? 'bg-emerald-50 border-emerald-400 text-emerald-650' :
          status === 'expired' ? 'bg-red-50 border-red-300 text-red-500' :
          'bg-[#E5A900]/10 border-[#E5A900] text-[#E5A900]'
        }`}>
          {status === 'submitted' ? <CheckCircle2 className="w-6 h-6" /> : <Unlock className="w-6 h-6" />}
        </div>
        
        <div>
          <h3 className="font-display font-extrabold text-xl text-slate-800 tracking-tight uppercase">{title}</h3>
          <p className="text-sm text-slate-500 font-medium">{description}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs">
            <span className="text-slate-400 font-medium">Escopo: <strong className="text-slate-700 font-semibold">Agente Comercial</strong></span>
            <span className="text-slate-400 font-medium">Estilo: <strong className="text-slate-700 font-semibold">Cesgranrio</strong></span>
          </div>
        </div>
      </div>

      {status === 'blocked' ? (
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80 mb-5 text-center flex flex-col items-center">
          <p className="text-[11px] uppercase tracking-wider text-slate-500 font-black mb-3">O simulado será liberado em:</p>
          <CountdownTimer targetTimestamp={releaseTime} size="md" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 p-3.5 rounded-xl bg-slate-50/50 border border-slate-200/65">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#00C2A0] lg:text-[#00A6D6]" />
            <div className="text-xs">
              <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Liberação</p>
              <p className="text-slate-700 font-extrabold">Hoje às 20h00</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#E5A900]" />
            <div className="text-xs">
              <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Prazo para envio</p>
              <p className="text-slate-700 font-extrabold">24 horas</p>
            </div>
          </div>
        </div>
      )}

      {status === 'available' && onAction && (
        <Button 
          variant="primary" 
          size="lg" 
          className="w-full text-base"
          onClick={onAction}
        >
          Iniciar Simulado
        </Button>
      )}

      {status === 'blocked' && (
        <Button 
          variant="secondary" 
          size="lg" 
          className="w-full text-base cursor-not-allowed text-slate-400"
          disabled
        >
          Aguardando Liberação
        </Button>
      )}

      {status === 'expired' && (
        <div className="bg-red-500/5 text-red-400 rounded-xl p-4 border border-red-500/10 text-center text-sm font-medium">
          O prazo de 24 horas para este simulado já se esgotou.
        </div>
      )}

      {status === 'submitted' && onAction && (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 bg-emerald-500/5 text-emerald-400 border border-emerald-500/10 rounded-xl px-4 py-3 text-sm text-center font-semibold">
            Pontuação registrada {score !== undefined ? `: ${score}%` : ''}
          </div>
          <Button 
            variant="outline" 
            size="md" 
            className="w-full sm:w-auto"
            onClick={onAction}
          >
            Ver Resultados
          </Button>
        </div>
      )}
    </Card>
  );
}
export type { SimuladoCardProps };
