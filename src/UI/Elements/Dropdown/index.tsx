// @ts-nocheck

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

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

interface UIDropdownProps {
  name?: string;
  label?: string;
  value?: string;
  customName?: JSX.Element;
  options?: Option[];
  className?: string;
  onChange?: (value: string) => void;
  noLabel?: boolean;
  side?: '"bottom" | "top" | "left" | "right" | undefined';
}

const UIDropdown: React.FC<UIDropdownProps> = ({
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
 
  const { t, i18n } = useTranslation();

  const handleChange = (val: string) => {
    setVal(val);
    onChange(val);
  };
  const [val, setVal] = useState(value);
  const labelName =
    name === '' ? (
      <Button className={className} variant="link">
        {customName}
      </Button>
    ) : (
      <Button variant="outline" className={`py-2 px-4 ${className}`}>
        {!noLabel && name} {val !== '' && ` ${!noLabel ? `:` : ''} ${val}`}{' '}
        <ChevDown className="ml-[8px] rtl:mr-[8px] rtl:ml-0" />
      </Button>
    );

    
  return (
    <DropdownMenu className="">
      <DropdownMenuTrigger asChild>{labelName}</DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        side={side}
        className={`max-h-[170px] overflow-y-auto ${i18n.language === 'ar' ? 'left-0' : 'right-0'}`}
      >
        {label !== '' && (
          <>
            <DropdownMenuLabel className="py-[9px] px-[16px]">
              {label} {val !== '' && `: ${val}`}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        {options.map(item => (
          <React.Fragment key={item.value}>
            <DropdownMenuItem
              onClick={() => handleChange(item.value)}
              style={{direction: i18n.language === 'ar' ?"rtl":'ltr'}}
              className={
                item.className + i18n.language === 'ar'
                  ? 'flex flex-row justify-end'
                  : '' || ''
              }
            >
              {item.icon && (
                <span className="px-2">{item.icon}</span>
              )}
              {t(item.value)}
           
            </DropdownMenuItem>
            {item.divider && <DropdownMenuSeparator />}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UIDropdown;
