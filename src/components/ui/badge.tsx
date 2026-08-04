import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border border-neutral-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:border-neutral-800 dark:focus:ring-neutral-300',
  {
    variants: {
      variant: {
        default: ' rounded-[10px] cursor-pointer border-transparent	',
        secondary:
          ' hover:bg-neutral-100/80 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80',
        destructive:
          'border-transparent   hover:bg-red-500/80 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/80',
        outline: 'text-neutral-950 dark:text-neutral-50',
      },
      size: {
        small: 'text-xs leading-4 px-[10px] py-[2px] font-medium tracking-wide',
        large: 'text-sm leading-5 px-[12px] py-[2px] font-medium tracking-wide',
      },
      colorStyle: {
        default: ' text-gray-800',
        red: 'bg-red-100 text-red-800 ',
        yellow: 'bg-yellow-100 text-yellow-800 ',
        green: 'bg-green-100 text-green-800 ',
        blue: 'bg-blue-100 text-blue-800 ',
        primary: 'bg-primary-100 text-primary-800 ',
        purple: 'bg-purple-100 text-purple-800 ',
        pink: 'bg-pink-100 text-pink-800 ',
        gray: 'bg-gray-100 text-black',
      },
    },
    defaultVariants: {
      variant: 'default',
      colorStyle: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, colorStyle, size, variant, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size, colorStyle }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
