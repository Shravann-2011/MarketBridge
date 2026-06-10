import React from "react";
import { useTheme } from "./ThemeContext.jsx";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <motion.button
      className="theme-toggle-simple"
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        background: theme === 'dark' 
          ? 'linear-gradient(135deg, #1a1a2e, #16213e)' 
          : 'linear-gradient(135deg, #fff7ed, #fed7aa)',
        border: `1px solid ${theme === 'dark' ? 'rgba(124, 58, 237, 0.3)' : 'rgba(255, 165, 0, 0.3)'}`,
        borderRadius: '20px',
        padding: '0.5rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        cursor: 'pointer',
        color: 'var(--text-color)',
        fontSize: '0.9rem',
        fontWeight: '500',
        transition: 'all 0.3s ease',
        boxShadow: theme === 'dark' 
          ? '0 2px 8px rgba(124, 58, 237, 0.2)' 
          : '0 2px 8px rgba(255, 165, 0, 0.2)'
      }}
    >
      <motion.span
        animate={{ rotate: theme === 'dark' ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'dark' ? '🌙' : '☀️'}
      </motion.span>
      <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
    </motion.button>
  );
}
