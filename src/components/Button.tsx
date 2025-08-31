import React from 'react';
import { buttonStyles, cn, conditionalStyle } from '../styles/components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <button
      className={cn(
        buttonStyles[variant],
        buttonStyles[size],
        conditionalStyle(loading, buttonStyles.loading),
        conditionalStyle(disabled || loading, buttonStyles.disabled),
        icon && 'gap-2' || '',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="loading-spinner w-4 h-4" />
      )}
      {!loading && icon && icon}
      {children}
    </button>
  );
};

// Usage examples:
// <Button variant="primary">Sign In</Button>
// <Button variant="secondary" size="sm">Cancel</Button>
// <Button variant="danger" loading>Delete</Button>
