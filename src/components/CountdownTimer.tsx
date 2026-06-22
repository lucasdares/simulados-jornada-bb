import React, { useState, useEffect } from 'react';
import { formatTimeRemaining } from '../utils/time';

interface CountdownTimerProps {
  targetTimestamp: number;
  onExpiry?: () => void;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function CountdownTimer({
  targetTimestamp,
  onExpiry,
  label,
  className = '',
  size = 'md'
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetTimestamp - Date.now();
      if (difference <= 0) {
        setTimeLeft(0);
        if (onExpiry) {
          onExpiry();
        }
        return false;
      }
      setTimeLeft(difference);
      return true;
    };

    calculateTimeLeft();
    const interval = setInterval(() => {
      const active = calculateTimeLeft();
      if (!active) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTimestamp, onExpiry]);

  const sizeClasses = {
    sm: 'text-sm px-2.5 py-1 text-slate-300 font-medium',
    md: 'text-lg px-4 py-2 font-semibold text-white',
    lg: 'text-3xl sm:text-4xl px-6 py-4 font-bold text-bb-yellow font-display tracking-tight',
  };

  const formatted = formatTimeRemaining(timeLeft);

  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      {label && (
        <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-1">
          {label}
        </span>
      )}
      <div className={`font-mono border border-bb-gold/20 bg-slate-900/80 rounded-xl leading-none flex items-center justify-center ${sizeClasses[size]} shadow-[0_0_15px_rgba(229,169,0,0.05)]`}>
        {formatted.split('').map((char, index) => {
          if (char === ':') {
            return (
              <span key={index} className="animate-pulse duration-1000 text-bb-gold px-1">
                :
              </span>
            );
          }
          return (
            <span key={index} className="inline-block min-w-[0.6em] text-center">
              {char}
            </span>
          );
        })}
      </div>
    </div>
  );
}
