import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'premium' | 'accent' | 'dark';
  hoverable?: boolean;
  glow?: boolean;
  
  // Explicitly defined common HTML attributes for cross-React version compile safety
  className?: string;
  id?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export function Card({ 
  children, 
  variant = 'default', 
  hoverable = false, 
  glow = false,
  className = '', 
  id,
  onClick,
  ...props 
}: CardProps) {
  const baseStyle = 'rounded-2xl border transition-all duration-300';
  
  const variants = {
    default: 'bg-white dark:bg-slate-900 border-slate-250 dark:border-slate-800 text-slate-800 dark:text-slate-100 shadow-sm',
    premium: 'bg-white dark:bg-slate-900/90 border-slate-250 dark:border-slate-800/80 text-slate-900 dark:text-white shadow-xl shadow-slate-100 dark:shadow-none relative overflow-hidden',
    accent: 'bg-[#0057A8] text-white border-transparent shadow-lg shadow-[#0057A8]/10',
    dark: 'bg-[#062B61] text-white border-transparent shadow-lg',
  };

  const hoverStyle = hoverable 
    ? 'hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-none' 
    : '';

  const glowStyle = (glow || variant === 'premium')
    ? 'border-l-4 border-l-[#FFD43B] shadow-[0_10px_30px_rgba(6,43,97,0.06)] dark:shadow-none'
    : '';

  return (
    <div 
      className={`${baseStyle} ${variants[variant]} ${hoverStyle} ${glowStyle} p-6 ${className}`}
      id={id}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
export default Card;
