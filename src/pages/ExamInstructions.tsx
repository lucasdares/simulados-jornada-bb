import React from 'react';
import Logo from '../components/Logo';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Clock, Info, CheckCircle2, ChevronRight, BookOpen, AlertTriangle } from 'lucide-react';

interface ExamInstructionsProps {
  onBack: () => void;
  onStartExam: () => void;
}

export default function ExamInstructions({ onBack, onStartExam }: ExamInstructionsProps) {
  const structureBasics = [
    { subject: "Língua Portuguesa", count: 10 },
    { subject: "Língua Inglesa", count: 5 },
    { subject: "Matemática", count: 5 },
    { subject: "Atualidades do Mercado Financeiro", count: 5 }
  ];

  const structureSpecifics = [
    { subject: "Matemática Financeira", count: 5 },
    { subject: "Conhecimentos Bancários", count: 10 },
    { subject: "Conhecimentos de Informática", count: 15 },
    { subject: "Vendas e Negociação", count: 15 }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col justify-between py-6">
      {/* Navbar info */}
      <div className="max-w-4xl w-full mx-auto px-6 mb-4">
        <Logo size="md" />
      </div>

      <main className="max-w-4xl w-full mx-auto px-6 flex-1 flex flex-col justify-center my-6">
        <Card variant="premium" className="shadow-2xl relative overflow-hidden border border-slate-200/85">
          <h1 className="font-display font-extrabold text-[#0057A8] text-2xl sm:text-3xl tracking-tight mb-4 text-center sm:text-left">
            Simulado 01 — Banco do Brasil
          </h1>
          <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6 border-b border-slate-200 pb-4">
            Você está prestes a iniciar a avaliação. Por favor, leia com atenção todas as instruções e regras abaixo para garantir o melhor desempenho.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Rigor rules and structure */}
            <div>
              <h3 className="font-display font-bold text-slate-800 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#00A6D6]" /> Estrutura do Simulado
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                  <p className="text-xs uppercase tracking-wider font-bold text-[#0057A8] mb-2">Conhecimentos Básicos (25 Questões)</p>
                  <ul className="text-sm space-y-1.5 text-slate-600 font-medium">
                    {structureBasics.map((item, idx) => (
                      <li key={idx} className="flex justify-between items-center bg-white border border-slate-150 px-2.5 py-1 rounded">
                        <span>• {item.subject}</span>
                        <strong className="text-slate-800 font-bold">{item.count} questões</strong>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                  <p className="text-xs uppercase tracking-wider font-bold text-[#E5A900] mb-2">Conhecimentos Específicos (45 Questões)</p>
                  <ul className="text-sm space-y-1.5 text-slate-600 font-medium">
                    {structureSpecifics.map((item, idx) => (
                      <li key={idx} className="flex justify-between items-center bg-white border border-slate-150 px-2.5 py-1 rounded">
                        <span>• {item.subject}</span>
                        <strong className="text-slate-800 font-bold">{item.count} questões</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Practical instructions warnings */}
            <div>
              <h3 className="font-display font-bold text-slate-800 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#E5A900]" /> Regulação do Tempo e Envios
              </h3>

              <div className="space-y-4 text-sm text-slate-600">
                <div className="flex gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 shadow-xs">
                  <Info className="w-5 h-5 text-[#00A6D6] flex-shrink-0" />
                  <div>
                    <p className="font-bold text-slate-800">Cronômetro de 5 horas</p>
                    <p className="text-xs text-slate-500 mt-1">Este é o tempo equivalente ao do concurso real do Banco do Brasil. Mantenha foco.</p>
                  </div>
                </div>

                <div className="flex gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 shadow-xs">
                  <AlertTriangle className="w-5 h-5 text-[#E5A900] flex-shrink-0" />
                  <div>
                    <p className="font-bold text-slate-800">Salvamento Automático</p>
                    <p className="text-xs text-slate-500 mt-1">Suas respostas são capturadas instantaneamente. Se sua janela fechar, suas escolhas estarão seguras.</p>
                  </div>
                </div>

                <div className="flex gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 shadow-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-slate-800">Conexão Segura</p>
                    <p className="text-xs text-slate-500 mt-1">Suas respostas são enviadas em tempo real. Evite recarregar a tela para reter o fluxo de atenção.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-200 pt-6 mt-6">
            <Button 
              variant="secondary" 
              size="lg" 
              onClick={onBack}
              className="w-full sm:w-auto"
            >
              Voltar ao painel
            </Button>
            <Button 
              variant="primary" 
              size="lg" 
              onClick={onStartExam}
              className="w-full sm:w-auto px-8"
              icon={<ChevronRight className="w-5 h-5" />}
            >
              Começar agora
            </Button>
          </div>
        </Card>
      </main>

      {/* Footer warning */}
      <footer className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider max-w-4xl w-full mx-auto px-6">
        <span>As questões exibidas são de cunho autoral elaborado de acordo com diretrizes de exames Cesgranrio.</span>
      </footer>
    </div>
  );
}
