// Time Configuration Constants
export const FIRST_SIMULADO_RELEASE = "2026-06-22T20:00:00-03:00"; // Timezone America/Fortaleza UTC-3
export const DEADLINE_HOURS = 24;

export type ExamStatus = 'blocked' | 'available' | 'expired';

export function getExamTimes() {
  const releaseTime = new Date(FIRST_SIMULADO_RELEASE).getTime();
  const deadlineTime = releaseTime + (DEADLINE_HOURS * 60 * 60 * 1000);
  return { releaseTime, deadlineTime };
}

export function getExamStatus(userEmail?: string): ExamStatus {
  return 'available';
}

export function formatTimeRemaining(ms: number) {
  if (ms <= 0) return "00:00:00";
  
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function formatDuration(seconds: number) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  const parts: string[] = [];
  if (hrs > 0) parts.push(`${hrs}h`);
  if (mins > 0) parts.push(`${mins}min`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
  
  return parts.join(' ');
}
