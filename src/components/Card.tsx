import React from 'react';
import { cardStyles, cn } from '../styles/components';

interface CardProps {
  children: React.ReactNode;
  variant?: 'base' | 'elevated' | 'flat' | 'interactive';
  className?: string;
  onClick?: () => void;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  variant = 'base',
  className,
  onClick 
}) => {
  return (
    <div 
      className={cn(cardStyles[variant], className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
  return (
    <div className={cn(cardStyles.header, className)}>
      {children}
    </div>
  );
};

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
  return (
    <div className={cn(cardStyles.content, className)}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => {
  return (
    <div className={cn(cardStyles.footer, className)}>
      {children}
    </div>
  );
};

// Usage example:
// <Card variant="elevated">
//   <CardHeader>
//     <h3>Chat Session</h3>
//   </CardHeader>
//   <CardContent>
//     <p>Current chat: session_123</p>
//   </CardContent>
//   <CardFooter>
//     <Button variant="primary">Continue Chat</Button>
//   </CardFooter>
// </Card>
