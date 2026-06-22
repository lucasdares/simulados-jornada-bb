import React, { useState, useEffect, useRef } from 'react';
import Logo from '../components/Logo';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { SIMULADO_QUESTIONS, Question } from '../data/simulados';
import { dbService } from '../firebase';
import { ExamAttempt, ScoreBySubject } from '../types';
import { formatTimeRemaining, formatDuration } from '../utils/time';
import { ChevronLeft, ChevronRight, Bookmark, Send, List, Clock, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface ExamPageProps {
  attempt: ExamAttempt;
  onSubmitted: () => void;
}

export default function ExamPage({ attempt, onSubmitted }: ExamPageProps) {
  // Navigation & Answers state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>(attempt.answers || {});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [showQuestionMapMobile, setShowQuestionMapMobile] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Time & Timer tracking
  const [timeSpent, setTimeSpent] = useState<number>(attempt.timeSpent || 0); // in seconds
  const [timeLeftMs, setTimeLeftMs] = useState<number>(5 * 60 * 60 * 1000); // 5 hours in ms
  const totalDurationSeconds = 5 * 60 * 60; // 5 hours limit

  const currentQuestion: Question = SIMULADO_QUESTIONS[currentIndex];

  // Ref to track elapsed time increments
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Calculate precise time left based on startedAt timestamp
    const startTimestamp = new Date(attempt.startedAt).getTime();
    const limitMs = totalDurationSeconds * 1000;
    
    const updateTimer = () => {
      const elapsedMs = Date.now() - startTimestamp;
      const computedTimeSpent = Math.floor(elapsedMs / 1000);
      
      // Update state
      setTimeSpent(computedTimeSpent);
      
      const computedTimeLeft = limitMs - elapsedMs;
      if (computedTimeLeft <= 0) {
        setTimeLeftMs(0);
        // Force auto submit when time expires!
        handleAutoSubmit();
      } else {
        setTimeLeftMs(computedTimeLeft);
      }
    };

    updateTimer();
    timerRef.current = setInterval(updateTimer, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [attempt.startedAt]);

  // Periodic autosave to database/localStorage
  useEffect(() => {
    const saveState = async () => {
      try {
        await dbService.saveAnswers(attempt.id, answers, timeSpent);
      } catch (err) {
        console.error("Autosave answers failed: ", err);
      }
    };

    // Save on answers change
    if (Object.keys(answers).length > 0) {
      saveState();
    }
  }, [answers, timeSpent, attempt.id]);

  // Force automatic submission on timer expiration
  const handleAutoSubmit = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    await executeSubmission();
  };

  const handleSelectOption = (option: 'A' | 'B' | 'C' | 'D' | 'E') => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: option
    }));
  };

  const toggleFlag = () => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id]
    }));
  };

  // Compile final results and submit attempt page
  const executeSubmission = async () => {
    setIsSubmitting(true);
    
    try {
      // Calculate grade scores
      let correctAttempts = 0;
      const subjectsMap: ScoreBySubject = {};

      SIMULADO_QUESTIONS.forEach(q => {
        const selected = answers[q.id];
        const isCorrect = selected === q.correctAlternative;
        
        if (isCorrect) correctAttempts++;

        // Subject breakdown accumulation
        if (!subjectsMap[q.subject]) {
          subjectsMap[q.subject] = { total: 0, correct: 0 };
        }
        subjectsMap[q.subject].total++;
        if (isCorrect) {
          subjectsMap[q.subject].correct++;
        }
      });

      const finalScorePercentage = Math.round((correctAttempts / SIMULADO_QUESTIONS.length) * 100);

      await dbService.submitAttempt(
        attempt.id,
        answers,
        finalScorePercentage,
        subjectsMap,
        timeSpent
      );

      setIsSubmitting(false);
      setShowSubmitModal(false);
      onSubmitted();
    } catch (err) {
      console.error("Failed to compile score submit attempt: ", err);
      setIsSubmitting(false);
    }
  };

  // Calculations for legend summary
  const totalAnswered = Object.keys(answers).length;
  const questionsCount = SIMULADO_QUESTIONS.length;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between text-slate-800">
      
      {/* Test Runner Top Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-4 shadow-xs">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between gap-4">
          <Logo size="sm" showText={false} className="hidden sm:flex" />
          
          {/* Active status clock helper */}
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl font-mono text-red-600 font-bold">
            <Clock className="w-4 h-4 animate-pulse text-red-500" />
            <span className="text-xs font-semibold uppercase tracking-wider hidden md:inline">Restam:</span>
            <span className="font-bold">{formatTimeRemaining(timeLeftMs)}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Progresso de Resolução</p>
              <p className="text-sm font-bold text-slate-700 mt-0.5">
                {totalAnswered} de {questionsCount} <span className="text-slate-400 font-medium">({Math.round((totalAnswered / questionsCount) * 100)}%)</span>
              </p>
            </div>
            
            {/* Mobile Map drawer toggle switch */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowQuestionMapMobile(true)}
              className="lg:hidden"
              icon={<List className="w-4 h-4" />}
            >
              Mapa
            </Button>

            <Button
              variant="primary"
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white hover:brightness-100 border-none shadow-emerald-750/10 shadow-md font-bold"
              onClick={() => setShowSubmitModal(true)}
              icon={<Send className="w-4 h-4" />}
            >
              Enviar Simulado
            </Button>
          </div>
        </div>
      </header>

      {/* Main interactive grid frame */}
      <div className="max-w-7xl w-full mx-auto px-6 py-6 flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 items-start relative">
        
        {/* Left Side: Question active sheet */}
        <div className="lg:col-span-3 space-y-6">
          <Card variant="premium" className="p-6 md:p-8 relative border border-slate-205 shadow-xl">
            
            {/* Subject Tag & Context */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-200 pb-4 mb-6">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-[#0057A8]">
                  {currentQuestion.subject}
                </span>
                <span className="mx-2 text-slate-350 hidden sm:inline">|</span>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider inline-block mt-1 sm:mt-0 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded">
                  Nível: {currentQuestion.level}
                </span>
              </div>
              <p className="text-xs text-slate-450 font-bold font-mono">Questão {currentIndex + 1} de {questionsCount}</p>
            </div>

            {/* Reference */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 mb-6">
              <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed font-mono">
                {currentQuestion.reference}
              </p>
            </div>

            {/* Question Text */}
            <div className="mb-8">
              <strong className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">ENUNCIADO DA QUESTÃO</strong>
              <div className="text-slate-800 text-base sm:text-lg leading-relaxed whitespace-pre-wrap font-sans font-medium">
                {currentQuestion.enunciado}
              </div>
            </div>

            {/* Alternatives Selector Sheet */}
            <div className="space-y-4">
              <strong className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">ALTERNATIVAS OBJETIVAS</strong>
              {(['A', 'B', 'C', 'D', 'E'] as const).map((letter) => {
                const text = currentQuestion.alternatives[letter];
                const isSelected = answers[currentQuestion.id] === letter;

                return (
                  <button
                    key={letter}
                    onClick={() => handleSelectOption(letter)}
                    className={`w-full text-left p-4 rounded-xl border flex items-start gap-4 transition-all duration-150 cursor-pointer ${
                      isSelected 
                        ? 'bg-[#0057A8]/10 border-[#0057A8] text-slate-900 shadow-md ring-1 ring-[#0057A8]/40' 
                        : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold font-display text-xs border flex-shrink-0 transition-colors ${
                      isSelected 
                        ? 'bg-[#0057A8] border-[#0057A8] text-white' 
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}>
                      {letter}
                    </span>
                    <span className="text-sm sm:text-base pt-0.5 leading-relaxed font-sans font-medium">{text}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Question Flow Controllers */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="md"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(prev => prev - 1)}
                icon={<ChevronLeft className="w-4 h-4" />}
              >
                Anterior
              </Button>
              <Button
                variant="secondary"
                size="md"
                disabled={currentIndex === questionsCount - 1}
                onClick={() => setCurrentIndex(prev => prev + 1)}
                className="flex-row-reverse"
                icon={<ChevronRight className="w-4 h-4" />}
              >
                Próxima
              </Button>
            </div>

            <Button
              variant={flaggedQuestions[currentQuestion.id] ? "outline" : "ghost"}
              size="md"
              onClick={toggleFlag}
              className={`transition-all ${flaggedQuestions[currentQuestion.id] ? 'border-[#E5A900] text-[#E5A900] bg-[#E5A900]/5' : 'text-slate-500 hover:text-[#E5A900]'}`}
              icon={<Bookmark className={`w-4 h-4 ${flaggedQuestions[currentQuestion.id] ? 'fill-current' : ''}`} />}
            >
              {flaggedQuestions[currentQuestion.id] ? "Revisar Ativo" : "Marcar para revisar"}
            </Button>
          </div>
        </div>

        {/* Right Side: Desktop Question map grid navigator */}
        <div className="hidden lg:block bg-white p-1 rounded-2xl border border-slate-200 max-h-[85vh] sticky top-28 overflow-y-auto shadow-xs">
          <QuestionMapContent 
            answers={answers}
            flaggedQuestions={flaggedQuestions}
            currentIndex={currentIndex}
            onSelectIndex={(idx) => setCurrentIndex(idx)}
          />
        </div>
      </div>

      {/* Mobile Map modal backdrop */}
      {showQuestionMapMobile && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-sm bg-white h-full p-6 border-l border-slate-200 shadow-2xl overflow-y-auto flex flex-col justify-between animate-fade-in text-slate-800">
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                <h3 className="font-display font-bold text-slate-850 uppercase tracking-wider text-sm">Mapa de Respostas</h3>
                <button 
                  onClick={() => setShowQuestionMapMobile(false)}
                  className="text-slate-400 hover:text-slate-800 font-semibold text-lg p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <QuestionMapContent 
                answers={answers}
                flaggedQuestions={flaggedQuestions}
                currentIndex={currentIndex}
                onSelectIndex={(idx) => {
                  setCurrentIndex(idx);
                  setShowQuestionMapMobile(false);
                }}
              />
            </div>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setShowQuestionMapMobile(false)}
              className="mt-6 w-full"
            >
              Voltar ao exame
            </Button>
          </div>
        </div>
      )}

      {/* Confirmation Submit Dialog */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <Card variant="premium" className="w-full max-w-md shadow-2xl relative overflow-hidden border border-slate-200 text-center p-8 bg-white text-slate-800">
            <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-100 text-red-600 flex items-center justify-center mx-auto mb-6">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <h3 className="font-display font-black text-slate-850 text-2xl tracking-tight mb-2">Finalizar Simulado?</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
              Você respondeu <strong className="text-slate-850 font-bold">{totalAnswered} de {questionsCount}</strong> questões totais. Tem certeza de que deseja submeter e concluir seu simulado agora? Esta ação não poderá ser desfeita.
            </p>

            {totalAnswered < questionsCount && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl mb-6 text-xs flex items-center gap-2 text-left">
                <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
                <span>Atenção: Você tem <strong>{questionsCount - totalAnswered} questões pendentes</strong> sem resposta assinalada.</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setShowSubmitModal(false)}
                className="w-full sm:flex-1"
              >
                Voltar à prova
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={executeSubmission}
                loading={isSubmitting}
                className="w-full sm:flex-1 bg-emerald-600 hover:bg-emerald-700 text-white hover:brightness-100 font-bold border-none"
              >
                Sim, finalizar!
              </Button>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
}

// Subcomponent: Question grid summary panel content
interface MapContentProps {
  answers: Record<number, string>;
  flaggedQuestions: Record<number, boolean>;
  currentIndex: number;
  onSelectIndex: (idx: number) => void;
}

function QuestionMapContent({ answers, flaggedQuestions, currentIndex, onSelectIndex }: MapContentProps) {
  // Stats
  const answeredCount = Object.keys(answers).length;
  const flaggedCount = Object.values(flaggedQuestions).filter(Boolean).length;
  const totalCount = SIMULADO_QUESTIONS.length;

  return (
    <div className="p-4 space-y-6 text-slate-800">
      <div>
        <h4 className="font-display font-bold text-slate-700 text-xs uppercase tracking-wider mb-2">Resumo da sessão</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-150">
            <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Respondidas</p>
            <p className="text-slate-800 font-extrabold mt-0.5 text-base">{answeredCount} de {totalCount}</p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-150">
            <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Para revisar</p>
            <p className="text-[#E5A900] font-extrabold mt-0.5 text-base">{flaggedCount}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-4">
        <h4 className="font-display font-bold text-slate-700 text-xs uppercase tracking-wider mb-3">Mapa de Questões</h4>
        
        {/* Scrollable bento map */}
        <div className="grid grid-cols-5 sm:grid-cols-7 lg:grid-cols-5 gap-2 max-h-[30vh] lg:max-h-[45vh] overflow-y-auto pr-1">
          {SIMULADO_QUESTIONS.map((q, idx) => {
            const isCurrent = currentIndex === idx;
            const isAnswered = !!answers[q.id];
            const isFlagged = !isCurrent && flaggedQuestions[q.id];

            let cellBg = 'bg-slate-50 border-slate-200 text-slate-450 hover:border-slate-350 hover:bg-slate-100 cursor-pointer';
            if (isAnswered) {
              cellBg = 'bg-[#00A6D6]/10 border-[#00A6D6]/50 text-[#00A6D6] font-bold cursor-pointer';
            }
            if (isFlagged) {
              cellBg = 'bg-[#E5A900]/10 border-[#E5A900]/50 text-[#E5A900] font-bold cursor-pointer';
            }
            if (isCurrent) {
              cellBg = 'bg-[#0057A8] border-[#0057A8] text-white font-extrabold scale-105 cursor-pointer shadow-sm';
            }

            return (
              <button
                key={q.id}
                onClick={() => onSelectIndex(idx)}
                className={`w-full aspect-square text-xs rounded-lg border flex items-center justify-center transition-all duration-150 ${cellBg}`}
              >
                {q.id}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend guides */}
      <div className="border-t border-slate-200 pt-4 space-y-2 text-xs">
        <h4 className="font-display font-bold text-slate-700 text-[11px] uppercase tracking-wider">Legenda</h4>
        <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0057A8]"></span>
            <span>Atual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00A6D6]/20 border border-[#00A6D6]/80 animate-pulse"></span>
            <span>Respondida</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E5A900]/10 border border-[#E5A900]/80"></span>
            <span>Revisar</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-50 border border-slate-200"></span>
            <span>Pendente</span>
          </div>
        </div>
      </div>
    </div>
  );
}
