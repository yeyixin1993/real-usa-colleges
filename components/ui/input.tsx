import * as React from 'react';

import { cn } from '@/lib/utils';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'flex h-11 w-full rounded-2xl border border-border bg-white/90 px-4 py-2 text-sm text-foreground shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10',
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';
