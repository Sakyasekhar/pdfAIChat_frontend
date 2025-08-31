// Component Style Objects - Centralized styling for React components
// This approach allows for dynamic theming and easy maintenance

export const buttonStyles = {
  primary: "btn-primary w-full flex items-center justify-center",
  secondary: "btn-secondary w-full flex items-center justify-center", 
  danger: "btn-danger w-full flex items-center justify-center",
  icon: "flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-lg transition-colors",
  
  // Size variants
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-sm", 
  lg: "px-6 py-3 text-base",
  
  // State variants
  disabled: "opacity-50 cursor-not-allowed",
  loading: "opacity-75 cursor-wait",
} as const;

export const cardStyles = {
  base: "card",
  header: "card-header",
  content: "p-4",
  footer: "card-footer",
  
  // Variants
  elevated: "card shadow-lg",
  flat: "card border-0",
  interactive: "card hover:shadow-md transition-shadow cursor-pointer",
} as const;

export const inputStyles = {
  base: "input-primary",
  error: "input-primary border-red-500 focus:border-red-500 focus:ring-red-200",
  success: "input-primary border-green-500 focus:border-green-500 focus:ring-green-200",
  
  // Size variants
  sm: "input-primary text-sm py-1",
  md: "input-primary",
  lg: "input-primary text-lg py-3",
} as const;

export const messageStyles = {
  user: "message-user",
  bot: "message-bot", 
  system: "mx-auto max-w-md p-2 text-center text-sm bg-tertiary text-tertiary rounded-lg",
  
  // State variants
  streaming: "message-bot opacity-75",
  error: "message-bot border-red-200 bg-red-50 text-red-800",
} as const;

export const sidebarStyles = {
  container: "sidebar",
  header: "sidebar-header",
  content: "sidebar-content", 
  footer: "sidebar-footer",
  
  // Item styles
  item: "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer",
  itemActive: "flex items-center gap-3 px-3 py-2 text-sm rounded-lg bg-primary-100 text-primary-800",
  itemHover: "hover:bg-secondary",
} as const;

export const headerStyles = {
  container: "header",
  content: "header-content",
  title: "header-title",
  subtitle: "header-subtitle",
  
  // Logo/Brand
  brand: "flex items-center gap-3",
  logo: "w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary flex items-center justify-center",
  logoIcon: "w-4 h-4 sm:w-5 sm:h-5 text-primary",
} as const;

export const chatStyles = {
  container: "chat-container container-responsive",
  messageContainer: "space-y-4",
  inputContainer: "px-4 sm:px-6 py-4 border-t border-primary bg-primary",
  
  // Welcome screen
  welcome: "welcome-container",
  welcomeTitle: "welcome-title",
  welcomeHighlight: "welcome-highlight", 
  welcomeDescription: "welcome-description",
} as const;

export const layoutStyles = {
  main: "flex h-screen bg-primary",
  content: "flex flex-col flex-1 min-w-0",
  
  // Responsive utilities
  mobile: "sm:hidden",
  desktop: "hidden sm:flex",
  responsive: "px-2 sm:px-4 lg:px-40",
} as const;

export const utilityStyles = {
  // Text utilities  
  textPrimary: "text-primary",
  textSecondary: "text-secondary", 
  textTertiary: "text-tertiary",
  
  // Background utilities
  bgPrimary: "bg-primary",
  bgSecondary: "bg-secondary",
  bgTertiary: "bg-tertiary",
  
  // Border utilities
  borderPrimary: "border-primary",
  borderSecondary: "border-secondary",
  
  // Status utilities
  statusOnline: "w-2 h-2 rounded-full status-online",
  statusOffline: "w-2 h-2 rounded-full status-offline", 
  statusError: "w-2 h-2 rounded-full status-error",
  
  // Loading utilities
  loadingSpinner: "loading-spinner w-4 h-4",
  loadingSpinnerLg: "loading-spinner w-8 h-8",
  
  // Common patterns
  flexCenter: "flex items-center justify-center",
  flexBetween: "flex items-center justify-between",
  gridCols: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
} as const;

// Theme configuration for dynamic theming
export const themeConfig = {
  colors: {
    primary: {
      50: "var(--color-primary-50)",
      100: "var(--color-primary-100)", 
      500: "var(--color-primary-500)",
      600: "var(--color-primary-600)",
      700: "var(--color-primary-700)",
    },
    gray: {
      50: "var(--color-gray-50)",
      100: "var(--color-gray-100)",
      500: "var(--color-gray-500)",
      600: "var(--color-gray-600)",
      900: "var(--color-gray-900)",
    },
    success: {
      500: "var(--color-success-500)",
      600: "var(--color-success-600)",
    },
    error: {
      500: "var(--color-error-500)", 
      600: "var(--color-error-600)",
    },
  },
  spacing: {
    xs: "var(--spacing-xs)",
    sm: "var(--spacing-sm)",
    md: "var(--spacing-md)",
    lg: "var(--spacing-lg)",
    xl: "var(--spacing-xl)",
  },
  borderRadius: {
    sm: "var(--radius-sm)",
    md: "var(--radius-md)",
    lg: "var(--radius-lg)",
  },
} as const;

// Helper function to combine styles
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Helper function for conditional styles
export const conditionalStyle = (
  condition: boolean,
  trueStyle: string,
  falseStyle: string = ''
): string => {
  return condition ? trueStyle : falseStyle;
};

// Dynamic theme style generator
export const createThemeStyles = (theme: 'light' | 'dark') => {
  const baseStyles = {
    background: theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50',
    text: theme === 'dark' ? 'text-white' : 'text-gray-900',
    border: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
  };
  
  return baseStyles;
};
