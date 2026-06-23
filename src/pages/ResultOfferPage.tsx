import React, { useState } from 'react';
import Logo from '../components/Logo';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { dbService, WHATSAPP_NUMBER } from '../firebase';
import { ExamAttempt } from '../types';
import { formatDuration } from '../utils/time';
import { CheckCircle2, MessageCircle, Clock, BookOpen, Gift, Trophy, ArrowRight, ChevronRight } from 'lucide-react';

interface ResultOfferPageProps {
  attempt: ExamAttempt;
  onGoToDashboard: () => void;
}

export default function ResultOfferPage({ attempt, onGoToDashboard }: ResultOfferPageProps) {
  const [clickedWhatsapp, setClickedWhatsapp] = useState(attempt.whatsappClicked || false);
  const [loading, setLoading] = useState(false);

  // Parse time spent
  const durationStr = formatDuration(attempt.timeSpent);

  // Subject translation and nice color codes for light theme
  const subjectIcons: Record<string, string> = {
    "Língua Portuguesa": "bg-blue-50 text-blue-600",
    "Língua Inglesa": "bg-indigo-55 text-indigo-600",
    "Matemática": "bg-red-50 text-red-600",
    "Atualidades do Mercado Financeiro": "bg-amber-50 text-amber-600",
    "Matemática Financeira": "bg-pink-50 text-pink-600",
    "Conhecimentos Bancários": "bg-yellow-50 text-yellow-700",
    "Conhecimentos de Informática": "bg-purple-50 text-purple-600",
    "Vendas e Negociação": "bg-emerald-50 text-emerald-600",
  };

  const handleWhatsappRedirect = async () => {
    setLoading(true);
    try {
      await dbService.clickWhatsapp(attempt.id);
      setClickedWhatsapp(true);
    } catch (err) {
      console.warn("Telemetry log for Whatsapp click failed: ", err);
    } finally {
      setLoading(false);
    }

    // Build perfect target URL encoding message safely
    const message = encodeURIComponent(
      "Oi, finalizei o simulado gratuito do Banco do Brasil e quero receber o gabarito e conhecer a Jornada BB com cronograma atualizado."
    );
    const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    
    // Open in parent tab to bypass iframe sandbox redirections
    window.open(link, '_blank', 'noreferrer');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between py-6">
      
      {/* Top navbar bar */}
      <div className="max-w-4xl w-full mx-auto px-6 mb-6 flex items-center justify-between">
        <Logo size="md" />
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={onGoToDashboard} 
          className="text-xs text-slate-500 hover:text-slate-800 border border-slate-200 bg-white"
        >
          Voltar ao painel
        </Button>
      </div>

      <main className="max-w-4xl w-full mx-auto px-6 flex-grow flex flex-col justify-center gap-8 py-4">
        
        {/* Header congratulations Card */}
        <Card variant="premium" className="text-center relative p-8 border border-slate-200 shadow-xl bg-white rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h1 className="font-display font-black text-3xl text-slate-850 tracking-tight mb-2">
            Simulado enviado com sucesso!
          </h1>
          <p className="text-slate-500 font-medium text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Sua prova foi devidamente registrada na nossa base segura. Parabéns pelo primeiro grande passo para alinhar o seu estudo de forma focada e produtiva.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 flex flex-col items-center">
              <BookOpen className="w-5 h-5 text-[#00A6D6] mb-1" />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Questões Respondidas</p>
              <p className="text-slate-800 font-bold text-lg">{attempt.totalAnswered} de 70</p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 flex flex-col items-center">
              <Clock className="w-5 h-5 text-[#E5A900] mb-1" />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Tempo de Resolução</p>
              <p className="text-slate-800 font-bold text-lg">{durationStr}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 flex flex-col items-center">
              <Trophy className="w-5 h-5 text-emerald-550 mb-1" />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Desempenho Geral</p>
              <p className="text-emerald-600 font-extrabold text-lg">{attempt.score}% de acertos</p>
            </div>
          </div>
        </Card>

        {/* Breakdown by subject list */}
        <Card variant="default" className="p-6 md:p-8 bg-white border-slate-205 shadow-sm rounded-2xl">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h3 className="font-display font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight flex items-center gap-2.5">
              <Trophy className="w-5.5 h-5.5 text-amber-500 shrink-0" />
              Rendimento por Área de Conhecimento
            </h3>
            <p className="text-slate-450 text-xs sm:text-sm mt-1 font-medium">
              Detalhamento de acertos e desempenho percentual em cada tópico cobrado no programa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {attempt.scoreBySubject && Object.entries(attempt.scoreBySubject).map(([subject, stats]) => {
              const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
              
              return (
                <div key={subject} className="bg-[#f8fafc] p-4 rounded-xl border border-slate-200/60 flex items-center justify-between gap-4 shadow-3xs">
                  <div className="flex-grow">
                    <p className="text-sm font-bold text-slate-800 leading-tight">{subject}</p>
                    <div className="w-full bg-slate-200/70 h-2 rounded-full mt-2.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-[#00A6D6] to-[#0057A8] h-full rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-extrabold text-[#0057A8]">{stats.correct} de {stats.total}</p>
                    <p className="text-[10px] uppercase font-bold text-slate-400 mt-1 font-mono">{pct}% corretas</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Gabarito disponível no WhatsApp box */}
          <div className="mt-8 p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 text-center text-xs text-amber-900 leading-relaxed font-sans font-medium flex flex-col sm:flex-row items-center justify-center gap-3">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0"></span>
            <span>
              <strong>Gabarito disponível no WhatsApp!</strong> Clique no link abaixo para liberar o acesso ao PDF com as resoluções comentadas detalhadamente e receber o cronograma de estudos tático.
            </span>
          </div>
        </Card>

        {/* Special workbook Offer section */}
        <Card variant="premium" className="p-6 md:p-8 relative overflow-hidden border border-amber-200/50 bg-gradient-to-br from-white via-white to-amber-50/10 rounded-2xl shadow-xl">
          {/* Subtle gold ray effect */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#E5A900]/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-700 border border-amber-500/20 mb-6 uppercase tracking-wider">
            <Gift className="w-3.5 h-3.5 text-amber-600" /> OFERTA ESPECIAL PARA VOCÊ
          </div>

          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight leading-tight mb-4">
            Método Jornada BB — <span className="bg-gradient-to-r from-[#0057A8] to-[#00A6D6] bg-clip-text text-transparent">Cronograma Tático de Elite</span>
          </h2>
          
          <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed mb-4">
            Estudar para o Banco do Brasil sem uma direção clara é o principal motivo de reprovações. Ficar perdido em excesso de PDFs ou sem saber como organizar seus ciclos de revisão torna tudo muito mais desafiador.
          </p>
          <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed mb-6">
            Por ter finalizado este simulado hoje, você tem o direito de resgatar uma condição especial exclusiva para acessar a plataforma <strong className="text-amber-600 font-extrabold font-sans">Jornada BB</strong> completa, acompanhada do nosso cronograma estratégico 100% atualizado.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-150 transition-all hover:bg-white hover:border-slate-300">
              <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 font-extrabold text-xs">✓</span>
              <p className="text-xs sm:text-sm font-bold text-slate-700">Plano de Estudos Inteligente Diário</p>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-150 transition-all hover:bg-white hover:border-slate-300">
              <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 font-extrabold text-xs">✓</span>
              <p className="text-xs sm:text-sm font-bold text-slate-700">Cronograma Tático Pós-Edital</p>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-150 transition-all hover:bg-white hover:border-slate-300">
              <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 font-extrabold text-xs">✓</span>
              <p className="text-xs sm:text-sm font-bold text-slate-700">PDFs de Resumos Direcionados</p>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-150 transition-all hover:bg-white hover:border-slate-300">
              <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 font-extrabold text-xs">✓</span>
              <p className="text-xs sm:text-sm font-bold text-slate-700">Simulados Inéditos Comentados</p>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-150 transition-all hover:bg-white hover:border-slate-300">
              <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 font-extrabold text-xs">✓</span>
              <p className="text-xs sm:text-sm font-bold text-slate-700">Treinamento específico de Redação</p>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-150 transition-all hover:bg-white hover:border-slate-300">
              <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 font-extrabold text-xs">✓</span>
              <p className="text-xs sm:text-sm font-bold text-slate-700">Acompanhamento e Mentoria Ativa</p>
            </div>
          </div>

          {/* Golden action button targeting Whatsapp */}
          <div className="space-y-4">
            <Button
              variant="primary"
              size="xl"
              onClick={handleWhatsappRedirect}
              loading={loading}
              className="py-4 w-full text-sm sm:text-base tracking-wide bg-[#25D366] hover:bg-[#20ba59] text-white hover:brightness-105 border-none font-extrabold flex justify-center items-center gap-3 shadow-md cursor-pointer transition-all duration-300 rounded-xl"
            >
              <MessageCircle className="w-5 h-5 text-white fill-current shrink-0 animate-bounce" />
              <span>ACESSAR JORNADA BB E RECEBER GABARITO NO WHATSAPP</span>
            </Button>
            
            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
              O gabarito oficial de resolução será liberado diretamente no WhatsApp
            </p>
          </div>
        </Card>
      </main>

      {/* Footer copyright */}
      <footer className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider max-w-4xl w-full mx-auto px-6 mt-10">
        <span>Práticas corporativas focadas em transparência, direção organizada e clareza de método.</span>
      </footer>
    </div>
  );
}
export type { ResultOfferPageProps };
