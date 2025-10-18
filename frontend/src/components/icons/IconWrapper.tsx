import React from 'react';
import { cn } from '@/lib/utils';

interface IconWrapperProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'info';
}

const sizeClasses = {
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const variantClasses = {
  default: 'text-foreground',
  primary: 'text-primary',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-orange-600 dark:text-orange-400',
  info: 'text-blue-600 dark:text-blue-400',
};

export function IconWrapper({
  children,
  className,
  size = 'md',
  variant = 'default',
}: IconWrapperProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {children}
    </div>
  );
}
