const theme = {
  colors: {
    primary: '#2563EB', // Blue
    secondary: '#10B981', // Green
    accent: '#F59E0B', // Yellow
    danger: '#EF4444', // Red
    success: '#10B981', // Green
    warning: '#F59E0B', // Yellow
    text: {
      primary: '#1F2937',
      secondary: '#4B5563',
      muted: '#9CA3AF',
    },
    background: '#F9FAFB',
    card: '#FFFFFF',
    border: '#E5E7EB',
    chart: {
      line: '#0066FF',
      areaFill: 'rgba(0, 102, 255, 0.1)',
      green: '#10b981',
      orange: '#f97316',
      red: '#ef4444',
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    full: '9999px',
  },
  typography: {
    fontFamily: 
      "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      xxl: '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semiBold: 600,
      bold: 700,
      extraBold: 800,
    },
    headings: {
      h1: {
        fontSize: '40px',
        lineHeight: '52px',
        fontWeight: 800,
      },
      h2: {
        fontSize: '30px',
        lineHeight: '34px',
        fontWeight: 800,
      },
      h3: {
        fontSize: '28px',
        lineHeight: '34px',
        fontWeight: 700,
      },
      h4: {
        fontSize: '22px',
        lineHeight: '31px',
        fontWeight: 900,
      },
    },
    body: {
      fontSize: '18px',
      lineHeight: '32px',
      fontWeight: 400,
    },
    small: {
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: 400,
    },
    metrics: {
      fontSize: '18px',
      lineHeight: '24px',
      fontWeight: 600,
    },
    growth: {
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: 500,
    },
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  transitions: {
    default: 'all 0.3s ease',
    fast: 'all 0.15s ease',
    slow: 'all 0.5s ease',
  },
};

export { theme }; 