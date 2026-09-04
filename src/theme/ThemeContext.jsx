import { createContext, useContext, useState } from 'react';
import { motion } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { Themes } from './Themes';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = isDarkMode ? Themes.dark : Themes.light;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme: () => setIsDarkMode((v) => !v), theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}

export function ThemeToggle() {
  const { isDarkMode, toggleTheme, theme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative w-13 h-7 rounded-full shrink-0 transition-colors duration-500"
      style={{ background: theme.accentSoft, border: `1px solid ${theme.border}` }}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        className="absolute top-0.5 flex items-center justify-center w-5.5 h-5.5 rounded-full"
        style={{ left: isDarkMode ? 'calc(100% - 1.6rem)' : '0.15rem', background: theme.accent }}
      >
        {isDarkMode ? <Moon size={11} color={theme.panelSolid} /> : <Sun size={11} color={theme.panelSolid} />}
      </motion.span>
    </button>
  );
}