import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';

interface CustomInputProps {
  englishLabel: string;
  arabicLabel: string;
  arabicInput?: boolean;
  englishName: string;
  arabicName?: string;
  englishPlaceholder?: string;
  arabicPlaceholder?: string;
  type?: string;
  options?: { value: string; label: string }[];
  setFile?: any;
}

const CustomInput: React.FC<CustomInputProps> = ({
  englishLabel,
  arabicLabel,
  arabicInput = false,
  englishName,
  arabicName = '',
  englishPlaceholder = '',
  arabicPlaceholder = '',
  type = 'text',
  options = [],
  setFile,
}) => {
  const {
    register,
    formState: { errors },
    getValues,
  } = useFormContext();
  const renderInputField = (
    name: string,
    placeholder: string,
    dir: string,
    error: any
  ) => {
    if (type === 'select') {
      return (
        <select
          className={`w-full rounded-lg bg-white border-gray-900 ${error ? 'border-red-300 text-red-900' : ''}`}
          dir={dir}
          {...register(name)}
        >
          <option value="">{placeholder}</option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    } else {
      return (
        <Input
          type={type}
          className={`w-full rounded-lg bg-background ${error ? 'border border-red-300 text-red-900' : ''}`}
          dir={dir}
          placeholder={placeholder}
          {...register(name)}
        />
      );
    }
  };

  return (
    <div
      style={{ direction: 'ltr' }}
      className="flex flex-col md:flex-row items-center justify-between mt-4  space-y-4 md:space-y-0"
    >
      <div className="w-full md:w-1/2 text-left mr-5">
        <p className="text-sm leading-5  font-medium pb-1">{englishLabel}:</p>
        <div className="w-full mb-4">
          {(
            renderInputField(
              englishName,
              englishPlaceholder,
              'ltr',
              errors[englishName]
            )
          )}
          {errors[englishName] && (
            <p className="mt-1 text-gray-500 text-sm">
              {errors[englishName]?.message?.toString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomInput;
