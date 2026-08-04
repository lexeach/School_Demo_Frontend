import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      'relative h-2 w-full overflow-hidden rounded-full bg-neutral-900/20 dark:bg-neutral-50/20',
      className
    )}
    {...props}
    dir="rtl"
  >
    <ProgressPrimitive.Indicator
      className={`h-full w-full flex-1 bg-[#3fa0fc] transition-all dark:bg-neutral-50 ${props?.barColor ? props.barColor : ''}`}
      style={{
        transform:
          props.dir === 'rtl'
            ? `translateX(${100 - (value || 0)}%)` // RTL Mode
            : `translateX(-${100 - (value || 0)}%)`, // LTR Mode
      }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
