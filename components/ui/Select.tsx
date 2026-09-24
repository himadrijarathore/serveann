'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { label: string; value: string | number }[];
}

export function Select({
  className,
  label,
  error,
  helperText,
  options,
  id,
  ...props
}: SelectProps) {
  const selectId = id || React.useId();

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-[var(--color-charcoal)]">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          'flex w-full rounded-md border bg-white px-3 py-2 text-sm text-[var(--color-charcoal)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50 appearance-none',
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300',
          className
        )}
        {...props}
      >
        <option value="" disabled>Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-500">{error}</span>}
      {helperText && !error && <span className="text-xs text-gray-500">{helperText}</span>}
    </div>
  );
}

export default Select;
