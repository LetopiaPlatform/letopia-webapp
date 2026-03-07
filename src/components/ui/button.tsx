import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        brand:
          'bg-[#834496] text-[#EEE9FF] rounded-xl hover:bg-[#6f3a80] disabled:bg-[#D4D2D5] disabled:text-white disabled:cursor-not-allowed disabled:opacity-100',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        brand: 'h-11 px-6 text-body font-semibold',
        icon: 'size-9',
        'icon-xs': "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const CURVED_PATH =
  'M 12 6 A 12 12 0 0 0 0 18 L 0 26 A 12 12 0 0 0 12 38 Q 171.5 44 331 38 A 12 12 0 0 0 343 26 L 343 18 A 12 12 0 0 0 331 6 Q 171.5 0 12 6 Z';

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  children,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : 'button';
  const isBrand = variant === 'brand';

  if (isBrand && !asChild) {
    return (
      <button
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(
          'group relative inline-flex items-center justify-center text-body font-semibold text-[#EEE9FF] h-11 px-6 cursor-pointer transition-colors disabled:cursor-not-allowed disabled:text-white',
          className
        )}
        {...props}
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 343 44"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d={CURVED_PATH}
            fill={props.disabled ? '#D4D2D5' : '#834496'}
            className="transition-colors group-hover:opacity-90"
          />
        </svg>
        <span className="relative z-10">{children}</span>
      </button>
    );
  }

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </Comp>
  );
}

export { Button, buttonVariants };
