import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import ChevDown from '@/assets/ChevDown.svg?react';
import { useTranslation } from 'react-i18next';

interface Option {
  label: string;
  value: string;
  icon?: JSX.Element;
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
  onChange?: (value: string[]) => void;
  noLabel?: boolean;
  side?: 'bottom' | 'top' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  reset?: boolean; // Add reset prop
}

const UIPopover: React.FC<UIPopoverProps> = ({
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
  reset = false, // Add reset prop
}) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const { t } = useTranslation();
  useEffect(() => {
    if (reset) {
      setSelectedValues([]);
    }
  }, [reset]);

  const handleCheckboxChange = (value: string) => {
    const updatedSelectedValues = [...selectedValues];

    const existingIndex = updatedSelectedValues.findIndex(val => val === value);
    if (existingIndex !== -1) {
      updatedSelectedValues.filter(v => v !== value);
      setSelectedValues(pre => pre.filter(v => v !== value));
      onChange(updatedSelectedValues.filter(v => v !== value));
    } else {
      updatedSelectedValues.push(value);
      setSelectedValues(updatedSelectedValues);
      onChange(updatedSelectedValues);
    }
  };

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(filter.toLowerCase())
  );

  // console.log('options', options);
  // console.log('filteredOptions', filteredOptions);
  // console.log('type >> ', type);

  const labelName =
    name === '' ? (
      <Button variant="link">{customName}</Button>
    ) : (
      <Button variant="outline" className={`py-2 px-4 ${className}`}>
        {!noLabel && t(name)}{' '}
        {selectedValues.length > 0 && (
          <span className="text-blue-800 ml-2">{selectedValues.length}</span>
        )}{' '}
        <ChevDown className="ml-[8px] rtl:mr-[8px] rtl:ml-0" />
      </Button>
    );

  return (
    <>
      {/* <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{labelName}</PopoverTrigger>
        <PopoverContent
          align={align}
          side={side}
          className="px-0 py-1 max-w-[200px] max-h-[300px] overflow-auto"
        >
          {label !== '' && (
            <p className="py-[9px] px-[16px]">
              {label}{' '}
              {selectedValues.length > 0 && `: ${selectedValues.join(', ')}`}
            </p>
          )}
          {filteredOptions.map(item => {
            console.log('item', item);
            if (item.label && !item.value)
              return <input type="date" className="form-checkbox ml-3" />;

            return (
              <label className={`flex items-center cursor-pointer py-2 pr-3`}>
                <input
                  type="checkbox"
                  className="form-checkbox ml-3"
                  checked={selectedValues.includes(item.value) || false}
                  onClick={() => handleCheckboxChange(item.value)}
                />
                <span className={`ml-2 `}>{item?.label}</span>
              </label>
            );
          })}
        </PopoverContent>
      </Popover> */}

      <>
        {filteredOptions.every(option => option.value === undefined) ? (
          filteredOptions.map(option => (
            <>
              <div className="group border border-[#bfdbfe] rounded-[4px] px-2 py-1 hover:bg-[#dceafe]">
                <label className='mx-1'>{t(option.label)}</label>
                <input key={option.label} type="date" className="ml-3 group-hover:bg-[#dceafe] focus:outline-none hover:outline-none" />
              </div>
            </>
          ))
        ) : (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>{labelName}</PopoverTrigger>
            <PopoverContent
              align={align}
              side={side}
              className="px-0 py-1 max-w-[200px] max-h-[300px] overflow-auto"
            >
              {label !== '' && (
                <p className="py-[9px] px-[16px]">
                  {label}{' '}
                  {selectedValues.length > 0 &&
                    `: ${selectedValues.join(', ')}`}
                </p>
              )}
              {filteredOptions.map(option =>
                option.value === undefined ? (
                  <input
                    key={option.label}
                    type="date"
                    className="form-checkbox ml-3"
                  />
                ) : (
                  <label
                    key={option.value}
                    className="flex items-center cursor-pointer py-2 pr-3"
                  >
                    <input
                      type="checkbox"
                      className="form-checkbox ml-3"
                      checked={selectedValues.includes(option.value)}
                      onClick={() => handleCheckboxChange(option.value!)}
                    />
                    <span className="ml-2">{option.label}</span>
                  </label>
                )
              )}
            </PopoverContent>
          </Popover>
        )}
      </>
    </>
  );
};

export default UIPopover;
