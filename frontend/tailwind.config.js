/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        'primary-dark': '#4f46e5',
        secondary: '#06b6d4',
        accent: '#f59e0b',
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f97316',
        info: '#3b82f6',
        background: '#f8fafc',
        surface: '#ffffff',
        text: '#1e293b',
        'text-muted': '#64748b',
        border: '#e2e8f0',
      },
    },
  },
  plugins: [],
}