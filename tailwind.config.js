/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Colores primarios - Azul vibrante pero suave
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',  // Principal claro
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          light: "#3b82f6",
          dark: "#60a5fa",
        },
        
        // Fondos principales
        background: {
          light: "#fafafa",    // Gris muy claro, más cálido
          dark: "#0a0a0a",     // Negro profundo pero no puro
        },
        
        // Superficies (cards, modales, etc.)
        surface: {
          light: "#ffffff",
          dark: "#141414",     // Gris oscuro suave
        },
        
        // Superficies secundarias
        card: {
          light: "#f8fafc",
          dark: "#1a1a1a",
        },
        
        // Color de acento - Verde menta moderno
        accent: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          light: "#10b981",    // Verde esmeralda
          dark: "#34d399",     // Verde menta claro
        },
        
        // Textos
        text: {
          primary: {
            light: "#0f172a",  // Gris muy oscuro, más legible
            dark: "#f8fafc",   // Blanco suave
          },
          secondary: {
            light: "#475569",  // Gris medio
            dark: "#cbd5e1",   // Gris claro
          },
          muted: {
            light: "#64748b",  // Gris más sutil
            dark: "#94a3b8",   // Gris medio claro
          },
        },
        
        // Bordes
        border: {
          light: "#e2e8f0",
          dark: "#334155",
        },
        
        // Estados
        success: {
          light: "#059669",
          dark: "#10b981",
        },
        warning: {
          light: "#d97706",
          dark: "#f59e0b",
        },
        error: {
          light: "#dc2626",
          dark: "#ef4444",
        },
        
        // Colores adicionales modernos
        indigo: {
          light: "#6366f1",
          dark: "#818cf8",
        },
        purple: {
          light: "#8b5cf6",
          dark: "#a78bfa",
        },
        pink: {
          light: "#ec4899",
          dark: "#f472b6",
        },
        
        // Neutrales mejorados
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
      },
      
      // Gradientes modernos
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        'gradient-accent': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      },
      
      // Sombras suaves
      boxShadow: {
        'soft': '0 2px 8px 0 rgba(0, 0, 0, 0.05)',
        'medium': '0 4px 16px 0 rgba(0, 0, 0, 0.1)',
        'strong': '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
        'colored': '0 4px 16px 0 rgba(59, 130, 246, 0.15)',
      },
    },
  },
  plugins: [],
};