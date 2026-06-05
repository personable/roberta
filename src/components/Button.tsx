import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const buttonVariants = cva(
  // Base styles shared by all variants
  'inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-40 shrink-0',
  {
    variants: {
      variant: {
        // Solid dark — primary actions
        primary:
          'bg-slate-900 text-white hover:bg-slate-700',
        // Muted fill — secondary actions
        secondary:
          'bg-slate-100 text-slate-800 hover:bg-slate-200',
        // Border only — tertiary / alongside a primary
        outline:
          'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400',
        // No background — low-emphasis inline actions
        ghost:
          'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
        // Destructive — delete / irreversible actions
        destructive:
          'bg-red-500 text-white hover:bg-red-600',
        // Destructive ghost — delete without weight
        'destructive-ghost':
          'text-red-500 hover:bg-red-50 hover:text-red-600',
      },
      size: {
        sm:  'h-8  px-3 text-xs rounded-md',
        md:  'h-10  px-5   text-sm rounded-lg',
        lg:  'h-12 px-7   text-base rounded-xl',
        // Icon-only square — pair with size sm/md/lg and no label
        icon: 'h-8 w-8 rounded-full text-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as a child element (e.g. a link) instead of a <button> */
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';

export { Button, buttonVariants };
