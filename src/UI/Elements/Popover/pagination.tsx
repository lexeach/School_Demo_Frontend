import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import ChevDown from '@/assets/ChevDown.svg?react';

interface Option {
  label: string;
  value: string;
  icon?: JSX.Element;
  divider?: boolean;
}

const defaultOptions: Option[] = [
  { label: 'Status Bar', value: 'status' },
  { label: 'Activity Bar', value: 'Activity Bar' },
  { label: 'Panel', value: 'panel' },
];

interface UIPopoverProps {
  name?: string;
  label?: string;
  value?: string;
  customName?: JSX.Element;
  options?: Option[];
  className?: string;
  onChange?: (value: string) => void;
  noLabel?: boolean;
  side?: 'bottom' | 'top' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
}

const PaginationPopover: React.FC<UIPopoverProps> = ({
  name = '',
  label = '',
  customName = '',
  className = '',
  value = '',
  options = defaultOptions,
  onChange = () => {},
  noLabel = false,
  side = 'bottom',
  align = 'end',
}) => {
  const [val, setVal] = useState(value);
  const [open, setOpen] = useState(false);

  const handleChange = (val: string) => {
    setVal(val);
    onChange(val);
    setOpen(false);
  };

  const labelName =
    name === '' ? (
      <Button variant="link">{customName}</Button>
    ) : (
      <Button variant="outline" className={`py-2 px-4 ${className}`}>
        {!noLabel && name} {val !== '' && ` ${!noLabel ? `:` : ''} ${val}`}{' '}
        <ChevDown className="ml-[8px] rtl:mr-[8px] rtl:ml-0" />
      </Button>
    );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{labelName}</PopoverTrigger>
      <PopoverContent align={align} side={side} className="px-0 py-1">
        {label !== '' && (
          <>
            <p className="py-[9px] px-[16px]">
              {label} {val !== '' && `: ${val}`}
            </p>
          </>
        )}
        {options.map(item => (
          <p
            key={item.value}
            className="px-3 rounded-2 cursor-pointer hover:bg-gray-100 py-2 text-sm font-medium"
            onClick={() => handleChange(item.value)}
          >
            {item.icon && <span className="pr-2">{item.icon}</span>}
            {item.label}
          </p>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default PaginationPopover;
