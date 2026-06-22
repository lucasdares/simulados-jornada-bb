export interface User {
  uid: string;
  nome: string;
  email: string;
  telefone?: string;
  createdAt: string;
  lastLoginAt: string;
  source: string;
  utm_source?: string;
  utm_campaign?: string;
  utm_content?: string;
  acceptedTerms: boolean;
}

export interface ScoreBySubject {
  [subject: string]: {
    total: number;
    correct: number;
  };
}

export interface ExamAttempt {
  id: string; // Document ID (Firestore or LocalStorage key)
  userId: string;
  userName: string;
  userEmail: string;
  simuladoId: string;
  startedAt: string;
  submittedAt: string | null; // null if in progress
  answers: Record<number, string>; // questionId -> chosenOption ('A'|'B'|'C'|'D'|'E')
  totalAnswered: number;
  score: number; // percentage or correct questions count
  scoreBySubject?: ScoreBySubject;
  timeSpent: number; // in seconds
  status: 'started' | 'submitted';
  whatsappClicked: boolean;
}

export interface EventLog {
  id: string;
  userId: string;
  eventName: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface AdminStats {
  totalUsers: number;
  totalStarted: number;
  totalSubmitted: number;
  totalWhatsappClicks: number;
  users: User[];
  attempts: ExamAttempt[];
}
