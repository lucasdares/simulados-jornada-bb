import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  
  // Explicitly defined common HTML element configurations for cross-React version compile safety
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  id?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  id,
  type = 'button',
  onClick,
  ...props
}: ButtonProps) {
  const baseStyle = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-bb-cyan focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variants = {
    primary: 'bg-[#E5A900] text-white hover:bg-[#C99600] shadow-lg shadow-[#E5A900]/20 font-bold',
    secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200/80',
    accent: 'bg-[#0057A8] text-white hover:bg-[#062B61]/90 shadow-md shadow-[#0057A8]/10',
    outline: 'bg-transparent border-2 border-slate-300 text-slate-700 hover:bg-slate-50',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100/80 border border-red-100',
    ghost: 'bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100',
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3 py-3.5 text-base gap-2.5 min-h-[44px]',
    xl: 'px-8 py-4 text-lg gap-3 min-h-[50px] w-full',
  };

  return (
    <button
      id={id}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
export default Button;
