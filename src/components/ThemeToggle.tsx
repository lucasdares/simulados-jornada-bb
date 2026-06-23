import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('jornada_bb_theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('jornada_bb_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('jornada_bb_theme', 'light');
    }
  }, [isDark]);

  return (
    <button
      id="theme-toggler"
      onClick={() => setIsDark(!isDark)}
      className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 hover:scale-105 active:scale-95 transition-all duration-200 shadow-xs flex items-center justify-center cursor-pointer"
      title={isDark ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
      aria-label="Alternar tema de cores"
    >
      {isDark ? (
        <Sun className="w-4.5 h-4.5 text-bb-yellow animate-spin-slow" />
      ) : (
        <Moon className="w-4.5 h-4.5 text-bb-royal" />
      )}
    </button>
  );
}
