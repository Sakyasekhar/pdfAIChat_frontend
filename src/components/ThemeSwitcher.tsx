import React from 'react';
import { useThemeContext } from '../contexts/theme/ThemeContext';
import { Button } from './Button';
import { Card, CardHeader, CardContent } from './Card';

export const ThemeSwitcher: React.FC = () => {
  const { currentTheme, switchTheme, availableThemes } = useThemeContext();

  return (
    <Card variant="elevated">
      <CardHeader>
        <h3 className="text-lg font-semibold text-primary">Theme Settings</h3>
      </CardHeader>
      <CardContent>
        <p className="text-secondary mb-4">Current theme: {currentTheme}</p>
        <div className="grid grid-cols-2 gap-2">
          {availableThemes.map((theme) => (
            <Button
              key={theme}
              variant={currentTheme === theme ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => switchTheme(theme)}
            >
              {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Usage: <ThemeSwitcher /> anywhere in your app
