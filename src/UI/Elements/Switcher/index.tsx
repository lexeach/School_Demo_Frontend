// @ts-nocheck
import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { HomeIcon } from '@heroicons/react/24/outline';

interface Option {
  value: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
}

interface UISelectProps {
  iconPosition?: 'left' | 'right';
  label?: string;
  options?: Option[];
  caption?: string;
  placeholder?: string;
}

const defaultOptions: Option[] = [
  {
    label: 'System HR',
    value: 'system_hr',
    icon: <HomeIcon className="h-5 w-5 text-yellow-500" />,
    description: 'Description',
  },
  {
    label: 'System Finance',
    value: 'system_finance',
    icon: <HomeIcon className="h-5 w-5 text-yellow-500" />,
    description: 'Description',
  },
  {
    label: 'System IT',
    value: 'system_it',
    icon: <HomeIcon className="h-5 w-5 text-yellow-500" />,
    description: 'Description',
  },
];

export default function UISwitcher({
  iconPosition = 'right',
  label = 'Label',
  options = defaultOptions,
  placeholder = 'Select...',
  caption = '',
}: UISelectProps) {
  const [selectedOption, setSelectedOption] = useState<Option | null>(
    options[0]
  );

  useEffect(() => {
    setSelectedOption(options[0]);
  }, [options]);

  const handleSelectChange = (value: string) => {
    const option = options.find(opt => opt.value === value);
    setSelectedOption(option || null);
  };

  const renderOptionContent = (item: Option) => (
    <div className="flex items-center">
      {item.icon && iconPosition === 'left' && (
        <span className="mr-2">{item.icon}</span>
      )}
      <div className="flex items-center">
        <span className="text-xs font-bold">System:</span>
        <span className="ml-4 mr-2 w-8 rounded h-8 bg-yellow-200 pt-[5px] pl-[6px]">
          HR
        </span>
        <span className="text-sm leading-5 font-medium">
          {item.label}{' '}
          <span className="text-gray-400 text-xs">({item.description})</span>
        </span>
      </div>
    </div>
  );

  const renderSelectedValue = (selectedOption: Option | null) => (
    <div className="flex items-center">
      {selectedOption && (
        <>
          {selectedOption.icon && iconPosition === 'left' && (
            <span className="mr-2">{selectedOption.icon}</span>
          )}
          <div className="flex items-center">
            <span className="text-xs font-bold">System:</span>
            <span className="ml-4 mr-2 w-8 rounded h-8 bg-yellow-200 pt-[5px]">
              HR
            </span>
            <span className="text-sm leading-5 font-medium">
              {selectedOption.label}{' '}
              <span className="text-gray-400 text-xs">
                ({selectedOption.description})
              </span>
            </span>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="max-w-[350px]">
      <Select value={selectedOption?.value} onValueChange={handleSelectChange}>
        <SelectTrigger
          className={`w-full h-16 ${selectedOption ? 'border-none' : 'border'}`}
        >
          <SelectValue placeholder={placeholder}>
            {renderSelectedValue(selectedOption)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map(item => (
              <SelectItem key={item.value} value={item.value}>
                {renderOptionContent(item)}
                {caption && (
                  <span className="text-gray-400 ml-2">{caption}</span>
                )}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
