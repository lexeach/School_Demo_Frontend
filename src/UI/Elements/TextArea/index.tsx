import Exclamation from '../../../assets/Exclamation.svg?react';
import React from 'react';
// @ts-nocheck
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from 'react-i18next';
interface UIInputProps {
  className?: string;
  type?: string;
  error?: string;
  placeholder?: string;
  label?: string;
  wrapperClassName?: string;
  [key: string]: any;
}

const UITextArea: React.FC<UIInputProps> = ({
  className = '',
  wrapperClassName = '',
  type = 'text',
  error = '',
  placeholder = 'test',
  label = '',
  ...props
}) => {
  const { t } = useTranslation();
  return (
    <div
      className={`text-left relative ml-auto flex-1 md:grow-0  mb-6 ${wrapperClassName}`}
    >
      {label && (
        <p className="text-sm leading-5 font-medium pb-1 rtl:float-right">
          {t(label)}
        </p>
      )}
      <Textarea
        rows={6}
        type={type}
        value={props.value || ''}
        placeholder={t(placeholder)}
        {...props.register}
        className={`w-full rounded-lg bg-background ${
          error ? 'border border-red-300 text-red-900' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <Exclamation
          className="absolute left-2.5"
          style={{
            left: 'calc(100% - 28px)',
            top: '2rem',
          }}
        />
      )}
      {error && <p className="mt-1 text-gray-500 text-sm">{error.message}</p>}
    </div>
  );
};

export default UITextArea;
