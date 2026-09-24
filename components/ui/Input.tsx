'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  as?: 'input' | 'textarea';
}

export function Input({
  className,
  label,
  error,
  helperText,
  iconLeft,
  iconRight,
  as = 'input',
  id,
  ...props
}: InputProps) {
  const inputId = id || React.useId();
  const Component = as;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[var(--color-charcoal)]">
          {label}
        </label>
      )}
      <div className="relative">
        {iconLeft && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            {iconLeft}
          </div>
        )}
        <Component
          id={inputId}
          className={cn(
            'flex w-full rounded-md border bg-white px-3 py-2 text-sm text-[var(--color-charcoal)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50',
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300',
            iconLeft ? 'pl-10' : '',
            iconRight ? 'pr-10' : '',
            className
          )}
          {...(props as any)}
        />
        {iconRight && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
            {iconRight}
          </div>
        )}
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
      {helperText && !error && <span className="text-xs text-gray-500">{helperText}</span>}
    </div>
  );
}

export default Input;
