import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva('inline-flex items-center justify-center mx-2', {
  variants: {
    variant: {
      default:
        'bg-blue-600 text-white tracking-wide hover:bg-blue-700 focus:outline focus:outline-2 focus:outline-offset-2 focus:ring-indigo-500',
      sky: 'bg-blue-100 text-blue-700 tracking-wide hover:bg-blue-200 focus:outline focus:outline-2 focus:outline-offset-2 focus:ring-indigo-500',
      success:
        'bg-green-50 text-green-700 tracking-wide hover:bg-green-200 focus:outline focus:outline-2 focus:outline-offset-2 focus:ring-indigo-500',
      white:
        'bg-white text-gray-700 border border-gray-300 tracking-wide focus:outline focus:outline-2 focus:outline-offset-2 focus:ring-indigo-500',
      destructive:
        'bg-red-500 text-blue-50 shadow-sm hover:bg-red-500/90 dark:bg-red-900 dark:text-blue-50 dark:hover:bg-red-900/90',
      outline:
        'border border-blue-200 bg-white shadow-sm hover:bg-blue-100 hover:text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:hover:bg-blue-800 dark:hover:text-blue-50',
      secondary:
        'bg-blue-100 text-blue-900 shadow-sm hover:bg-blue-100/80 dark:bg-blue-800 dark:text-blue-50 dark:hover:bg-blue-800/80',
      ghost:
        'hover:bg-blue-100 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-50',
      link: 'text-blue-600 hover:text-blue-700',
    },
    size: {
      default:
        'px-[17px] py-[9px] rounded-[6px] text-sm font-medium leading-5 text-left ',
      md: 'px-[17px] py-[9px] rounded-[6px] text-sm font-medium leading-5 text-left ',
      xs: 'px-[11px] py-[7px] rounded-[4px] text-xs',
      sm: 'px-[13px] py-[9px] rounded-[6px] text-sm font-medium leading-4 text-left ',
      lg: 'px-[17px] py-[9px] rounded-[6px] text-base font-medium leading-6 text-left ',
      xl: 'px-[25px] py-[13px] rounded-[6px] text-base font-medium leading-6 text-left ',
      sidebar: 'w-[11px] text-center',
      icon: '',
    },
    rounded: {
      default: '',
      icon: 'rounded-[50%] py-2 px-[10px] bg-blue-100 hover:bg-hoverBlue',
      md: 'rounded-[19px]',
      xs: 'rounded-[15px]',
      sm: 'rounded-[17px] ',
      lg: 'rounded-[21px] ',
      xl: 'rounded-[25px]',
    },
    iconSize: {
      default: '',
      small: 'w-[16px] h-[16px]',
      large: 'w-[20px] h-[20px]',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    rounded: 'default',
    iconSize: 'default',
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, rounded, size, iconSize, asChild = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(
          buttonVariants({ iconSize, variant, size, rounded, className })
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
