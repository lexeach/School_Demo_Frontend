import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useEffect, useState } from 'react';

import { useLocation } from 'react-router-dom';

export default function UIPopover({
  actionButton,
  children,
  handleChange,
  contentClassName = '',
  align = 'end',
}: {
  actionButton: React.ReactNode;
  children: React.ReactNode;
  handleChange?: () => void;
  contentClassName?: string;
  align?: 'end' | 'start' | 'center';
}) {
  const [open, setOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location]);

  const handleAction = () => {
    setOpen(!open);
    handleChange?.();
  };
  return (
    <Popover open={open} onOpenChange={handleAction}>
      <PopoverTrigger asChild>
        <div onClick={handleAction}>{actionButton}</div>
      </PopoverTrigger>
      <PopoverContent
        align={align}
        className={contentClassName ? contentClassName : 'min-w-[450px] p-0'}
      >
        {children}
      </PopoverContent>
    </Popover>
  );
}
