// @ts-nocheck
import Exclamation from '../../../assets/Exclamation.svg?react';
import { Input } from '@/components/ui/input';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface UIInputProps {
  className?: string;
  type?: string;
  error?: string;
  placeholder?: string;
  label?: string;
  wrapperClassName?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const UIInput = React.forwardRef<UIInputProps, HTMLInputElement>(
  (
    {
      className = '',
      wrapperClassName = 'ml-auto',
      type = 'text',
      error = '',
      placeholder = 'test',
      label = '',
      ...props
    },
    ref = null
  ) => {
    const { t } = useTranslation();

    return (
      <div
        className={`text-left relative flex-1 md:grow-0 mb-4 rtl:text-right ${wrapperClassName}`}
      >
        {label && (
          <p className="text-sm leading-5 font-medium pb-1">{t(label)}</p>
        )}
        <Input
          type={type}
          placeholder={t(placeholder)}
          {...props.register}
          className={`w-full rounded-lg bg-background ${
            error ? 'border border-red-300 text-red-900' : ''
          } ${className}`}
          ref={ref || undefined}
          {...props}
        />
        {error && (
          <>
            <Exclamation
              className="absolute"
              style={{
                top: '33px',
              }}
            />
            <p className="mt-1 text-gray-500 text-sm">{t(error.message)}</p>
          </>
        )}
      </div>
    );
  }
);

export default UIInput;
