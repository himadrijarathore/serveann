'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'arch';
  padding?: 'sm' | 'md' | 'lg' | 'none';
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export function Card({
  className,
  variant = 'default',
  padding = 'md',
  header,
  footer,
  children,
  ...props
}: CardProps) {
  const variants = {
    default: 'bg-white border border-[var(--color-cream-dark)] shadow-sm rounded-xl',
    elevated: 'bg-white shadow-md rounded-xl border border-transparent hover:shadow-lg transition-shadow',
    glass: 'glass-card rounded-xl',
    arch: 'indian-arch bg-white',
  };

  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8',
  };

  return (
    <div className={cn('overflow-hidden', variants[variant], className)} {...props}>
      {header && (
        <div className={cn('border-b border-[var(--color-cream-dark)]', paddings[padding])}>
          {header}
        </div>
      )}
      <div className={paddings[padding]}>
        {children}
      </div>
      {footer && (
        <div className={cn('border-t border-[var(--color-cream-dark)] bg-opacity-50', paddings[padding])}>
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card;
