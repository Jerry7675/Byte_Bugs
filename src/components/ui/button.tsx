import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-green-50 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-green-600 text-white hover:bg-green-700 shadow-soft hover:shadow-elevated',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
        outline:
          'border-2 border-green-700 bg-transparent text-green-700 hover:bg-green-50 hover:text-green-900',
        secondary: 'bg-green-100 text-green-700 hover:bg-green-200 shadow-soft',
        ghost: 'hover:bg-green-100 hover:text-green-700',
        link: 'text-green-700 underline-offset-4 hover:underline',
        hero: 'bg-gradient-to-r from-green-400 via-green-200 to-green-500 text-green-900 shadow-elevated hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]',
        heroOutline:
          'border-2 border-green-200 bg-green-50 text-green-700 backdrop-blur-sm hover:bg-green-100 hover:border-green-300',
        accent:
          'bg-gradient-to-r from-green-600 via-green-400 to-green-700 text-white shadow-soft hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-9 rounded-md px-4 text-xs',
        lg: 'h-12 rounded-xl px-8 text-base',
        xl: 'h-14 rounded-xl px-10 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
