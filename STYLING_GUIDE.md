# Modular Tailwind CSS Styling Guide

This project uses a modular approach to Tailwind CSS styling, making it easy to maintain consistency and change themes across the entire application.

## 📁 File Structure

```
src/
├── styles/
│   ├── theme.css          # CSS variables and component classes
│   ├── components.ts      # TypeScript style objects  
│   └── themes.ts          # Theme configurations
├── contexts/
│   ├── auth/
│   │   └── AuthContext.tsx    # Authentication context
│   └── theme/
│       └── ThemeContext.tsx   # Theme context provider
├── components/
│   ├── Button.tsx         # Reusable button component
│   ├── Card.tsx          # Reusable card component
│   └── ThemeSwitcher.tsx  # Theme switching component
└── app/
    └── globals.css        # Global styles with theme import
```

## 🎨 Theme System

### 1. CSS Variables (`theme.css`)
The foundation of our theming system uses CSS custom properties:

```css
:root {
  --color-primary-500: #3b82f6;
  --color-bg-primary: #ffffff;
  --color-text-primary: #0f172a;
  /* ... more variables */
}
```

### 2. Component Classes
Reusable CSS classes for common patterns:

```css
.btn-primary {
  @apply px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors;
  background-color: var(--color-primary-600);
}
```

### 3. TypeScript Style Objects (`components.ts`)
Centralized style definitions for JavaScript usage:

```typescript
export const buttonStyles = {
  primary: "btn-primary w-full flex items-center justify-center",
  secondary: "btn-secondary w-full flex items-center justify-center",
  // ... more styles
} as const;
```

## 🔧 Usage Examples

### Using CSS Classes Directly
```tsx
<button className="btn-primary">
  Sign In
</button>
```

### Using TypeScript Style Objects
```tsx
import { buttonStyles, cn } from '../styles/components';

<button className={cn(buttonStyles.primary, "w-full")}>
  Sign In
</button>
```

### Using Reusable Components
```tsx
import { Button } from '../components/Button';

<Button variant="primary" size="md">
  Sign In
</Button>
```

## 🎯 Theme Switching

### Setting Up Theme Provider
Wrap your app with the ThemeProvider:

```tsx
// app/layout.tsx
import { ThemeProvider } from '../contexts/theme/ThemeContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Using Theme Context
```tsx
import { useThemeContext } from '../contexts/theme/ThemeContext';

function MyComponent() {
  const { currentTheme, switchTheme } = useThemeContext();
  
  return (
    <button onClick={() => switchTheme('dark')}>
      Switch to Dark Theme
    </button>
  );
}
```

## 🎨 Available Themes

1. **Blue Theme** (default) - Professional blue color scheme
2. **Green Theme** - Nature-inspired green colors  
3. **Purple Theme** - Creative purple palette
4. **Dark Theme** - Dark mode with blue accents

## 🚀 Creating New Themes

### 1. Define Theme Object
```typescript
// styles/themes.ts
export const myCustomTheme: Theme = {
  name: 'custom',
  colors: {
    primary: {
      500: '#your-color',
      600: '#your-darker-color',
      // ... more shades
    },
    // ... other color groups
  },
  backgrounds: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
  },
  // ... text and border colors
};
```

### 2. Register Theme
```typescript
// Add to themes registry
export const themes = {
  blue: blueTheme,
  green: greenTheme,
  purple: purpleTheme,
  dark: darkTheme,
  custom: myCustomTheme, // Add your theme
} as const;
```

### 3. Use New Theme
```tsx
const { switchTheme } = useThemeContext();
switchTheme('custom');
```

## 🔄 Refactoring Existing Components

### Before (Hardcoded Tailwind)
```tsx
<button className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
  Sign In
</button>
```

### After (Modular Approach)
```tsx
import { Button } from '../components/Button';

<Button variant="primary">
  Sign In
</Button>
```

### Or with Style Objects
```tsx
import { buttonStyles, cn } from '../styles/components';

<button className={cn(buttonStyles.primary)}>
  Sign In
</button>
```

## 📝 Style Categories

### Buttons
- `btn-primary` - Primary action buttons
- `btn-secondary` - Secondary action buttons  
- `btn-danger` - Destructive action buttons

### Cards
- `card` - Basic card container
- `card-header` - Card header section
- `card-footer` - Card footer section

### Inputs
- `input-primary` - Standard input field
- Focus states and error variants included

### Layout
- `sidebar` - Sidebar container
- `header` - Header container
- `chat-container` - Chat message container

### Utilities
- `text-primary`, `text-secondary`, `text-tertiary` - Text colors
- `bg-primary`, `bg-secondary`, `bg-tertiary` - Background colors
- `border-primary`, `border-secondary` - Border colors

## 🎯 Benefits

### 1. Consistency
All components use the same design tokens, ensuring visual consistency.

### 2. Maintainability  
Change a color once in the theme, and it updates everywhere.

### 3. Flexibility
Easy to create new themes or modify existing ones.

### 4. Developer Experience
Type-safe style objects with autocomplete.

### 5. Performance
Reusable CSS classes reduce bundle size.

## 🚦 Best Practices

### 1. Use Semantic Names
```typescript
// Good
const messageStyles = {
  user: "message-user",
  bot: "message-bot"
};

// Avoid  
const messageStyles = {
  blue: "bg-blue-500",
  gray: "bg-gray-500"
};
```

### 2. Prefer Component Classes Over Utility Classes
```css
/* Good - Semantic and reusable */
.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white rounded-lg;
}

/* Avoid - Too specific */
.blue-button-with-padding {
  @apply px-4 py-2 bg-blue-600 text-white rounded-lg;
}
```

### 3. Use TypeScript for Style Objects
Ensures type safety and better developer experience.

### 4. Group Related Styles
Keep button styles together, card styles together, etc.

### 5. Test Theme Switching
Ensure all components work well with different themes.

## 🔧 Utility Functions

### `cn()` - Class Name Utility
Combines multiple class names safely:
```typescript
cn("btn-primary", "w-full", someCondition && "disabled")
```

### `conditionalStyle()` - Conditional Styling
Applies styles based on conditions:
```typescript
conditionalStyle(isLoading, "opacity-50", "opacity-100")
```

## 📱 Example: Refactoring the Main Page

Instead of:
```tsx
<button className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
```

Use:
```tsx
<Button variant="primary">Sign In</Button>
```

This approach makes your code:
- More readable
- Easier to maintain
- Consistent across components
- Theme-aware automatically

## 🎨 Future Theming

To change the entire app's theme in the future:

1. **Update CSS variables** in `theme.css`
2. **Create new theme objects** in `themes.ts`  
3. **Switch themes** using the ThemeProvider
4. **All components update automatically!**

This system makes your app infinitely customizable while maintaining clean, maintainable code.
