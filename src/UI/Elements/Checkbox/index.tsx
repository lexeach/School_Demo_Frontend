import React, { useEffect } from 'react';

import { useTranslation } from 'react-i18next';

interface Option {
  label: string;
  value: string;
}

interface UICheckboxProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  labelClassName?: string;
  name?: string;
  options?: Option[];
  className?: string;
  isRTL?: boolean;
  error?: { message: string };
  setFormValue?: (name: string, values: string[]) => void;
  exclusiveOption?: string;
}

const UICheckbox: React.FC<UICheckboxProps> = ({
  label,
  values = [],
  onChange,
  labelClassName = '',
  name,
  options,
  className = '',
  isRTL = false,
  error,
  setFormValue,
  exclusiveOption,
}) => {
  const { t } = useTranslation();
  useEffect(() => {
    if (options?.length && setFormValue) {
      const initialValues = options
        .map(option => option.value)
        .filter(optionValue => values.includes(optionValue));
      if (initialValues.length !== values.length) {
        setFormValue(name || '', initialValues);
      }
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleChange = (optionValue: string, isChecked: boolean) => {
    let updatedValues = [...values];

    if (exclusiveOption && optionValue === exclusiveOption && isChecked) {
      // If the exclusive option is selected, deselect all others
      updatedValues = [optionValue];
    } else if (exclusiveOption && isChecked) {
      // If a non-exclusive option is selected, deselect the exclusive option
      updatedValues = updatedValues.filter(val => val !== exclusiveOption);
      updatedValues.push(optionValue);
    } else if (isChecked) {
      updatedValues.push(optionValue);
    } else {
      updatedValues = updatedValues.filter(val => val !== optionValue);
    }

    onChange(updatedValues);
  };

  if (options) {
    return (
      <div className={`my-4 ${className}`}>
        <p className="text-sm leading-5 font-medium mb-3 pb-1">{t(label)}</p>
        <div className={`flex ${isRTL ? 'flex-row-reverse' : ''}`}>
          {options.map(item => (
            <label
              key={item.value}
              className="flex items-center cursor-pointer"
            >
              <input
                type="checkbox"
                className="form-checkbox"
                value={item.value}
                name={item.value}
                checked={values.includes(item.value)}
                onChange={e => handleChange(item.value, e.target.checked)}
              />
              <span className={`mx-2 ${labelClassName}`}>{t(item.label)}</span>
            </label>
          ))}
        </div>
        {error && <p className="mt-1 text-gray-500 text-sm">{error.message}</p>}
      </div>
    );
  }

  return (
    <label className={`flex items-center cursor-pointer ${className}`}>
      <input
        type="checkbox"
        className="form-checkbox"
        checked={values.includes(name || '')}
        name={name}
        onChange={e => handleChange(name || '', e.target.checked)}
      />
      <span className={`ml-2 ${labelClassName}`}>{t(label)}</span>
    </label>
  );
};

export default UICheckbox;
