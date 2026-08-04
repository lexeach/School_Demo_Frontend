import * as React from 'react';

import { useEffect, useMemo, useState } from 'react';

import Select from 'react-select';
import { useTranslation } from 'react-i18next';

interface Option {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

interface UISelectProps {
  iconPosition?: 'left' | 'right';
  label?: string;
  options?: Option[];
  query?: any;
  caption?: string;
  error?: string | { message?: string };
  noLabel?: boolean;
  placeholder?: string;
  onChange?: (value: string | string[]) => void;
  value?:
    | { id: string | number; [key: string]: any }
    | string
    | number
    | { id: string | number }[];
  multi?: boolean;
  menuPosition?: 'absolute' | 'fixed';
  fetchData?: any;
  fetchId?: string;
  optionLabel?: string;
  getValueCallback?: (value: any) => void;
  getSelectedOption?: (option: any) => void;
  setFormValue?: (name: string, value: any) => void;
  wrapperClassName?: string;
  name?: string;
}

const defaultOptions: Option[] = [{ label: 'test', value: 'test' }];

export default function UISelect({
  iconPosition = 'right',
  label = 'Label',
  options = defaultOptions,
  fetchData = null,
  placeholder = 'select',
  caption = '',
  error = '',
  noLabel = false,
  fetchId = '',
  multi = false,
  optionLabel = 'name',
  getValueCallback = val => {},
  getSelectedOption = opt => {},
  menuPosition = 'fixed',
  setFormValue,
  wrapperClassName = 'mb-6',
  ...props
}: UISelectProps) {
  const { t } = useTranslation();
  const [localOptions, setLocalOptions] = useState<Option[]>(options);
  const [getData] = typeof fetchData === 'function' ? fetchData() : [];

  // console.log('Get Data >>> ', getData);

  useEffect(() => {
    setLocalOptions(options);
  }, [options]);

  useEffect(() => {
    async function fetchData() {
      try {
        let res;
        if (fetchId) {
          res = await getData(fetchId);
        } else {
          res = await getData();
        }
        
        const optionArr = Array.isArray(res.data) ? res.data : res.data.data;
        const arr = optionArr.map(item => ({
          label: item[optionLabel]?.en || item[optionLabel] || item['title'],
          value: item[optionLabel]?.en || item[optionLabel] || item['title'],
        }));
        setLocalOptions(arr);
        if (
          multi &&
          Array.isArray(props.value) &&
          props.value.length > 0 &&
          typeof props.value[0] !== 'number' &&
          typeof props.value[0] !== 'string'
        ) {
          const arr = props.value.map((item: any) => item._id);
          setFormValue(props.name, arr);
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (typeof getData !== 'undefined') {
      fetchData();
    }
  }, [getData, fetchId]);

  const handleChange = selectedOption => {
    let value;
    if (!Array.isArray(selectedOption)) {
      value = selectedOption ? selectedOption.value : '';
    } else {
      value = selectedOption.map(option => option.value);
    }
    getSelectedOption(selectedOption);
    if (props?.onChange) {
      props?.onChange(value);
    }
    getValueCallback(value);
  };

  const mappedValue = useMemo(() => {
    if (multi) {
      // Multi-select: map array of objects to options
      if (Array.isArray(props.value)) {
        return props.value.map(val =>
          localOptions.find(option => option.value == String(val.id || val))
        );
      }
      return [];
    } else {
      // Non-multi select: handle both id (number/string) and object with id
      const valueAsId =
        typeof props.value === 'object' && props.value !== null
          ? String((props.value as { id: string | number }).id)
          : String(props.value);
      return localOptions.find(option => option.value == valueAsId) || null;
    }
  }, [localOptions, props.value, multi]);

  return (
    <div className={`mb-6 relative ${wrapperClassName}`}>
      {!noLabel && (
        <p className="text-left pb-1 text-sm font-medium rtl:text-right">
          {t(label)}
        </p>
      )}
      <Select
        options={localOptions}
        onChange={handleChange}
        placeholder={t(placeholder)}
        isMulti={multi}
        menuPosition={menuPosition}
        value={mappedValue}
        classNamePrefix={error ? 'react-select-error' : ''}
        styles={{
          control: provided => ({
            ...provided,
            borderColor: error ? 'red' : provided.borderColor,
          }),
          menu: provided => ({
            ...provided,
          }),
          menuPortal: base => ({ ...base, zIndex: 9999 }),
        }}
        noOptionsMessage={() => t('no_records_found')}
        // Disable keyboard on mobile devices
        onMenuOpen={() => {
          // Prevent keyboard from opening on mobile
          setTimeout(() => {
            const inputs = document.querySelectorAll('.react-select__input input');
            inputs.forEach((input: HTMLInputElement) => {
              input.setAttribute('inputmode', 'none');
              input.setAttribute('readonly', 'readonly');
              input.style.caretColor = 'transparent';
            });
          }, 0);
        }}
        onMenuClose={() => {
          // Remove readonly attribute when menu closes
          const inputs = document.querySelectorAll('.react-select__input input');
          inputs.forEach((input: HTMLInputElement) => {
            input.removeAttribute('readonly');
            input.removeAttribute('inputmode');
            input.style.caretColor = '';
          });
        }}
        // Additional mobile-specific props
        isSearchable={false}
        blurInputOnSelect={true}
      />
      {caption && !error && (
        <p className="mt-1 text-gray-500 text-sm">
          {caption}
        </p>
      )}
      {error && (
        <>
          <p className="mt-1 text-gray-500 text-sm">
            {t(typeof error === 'string' ? error : error?.message || '')}
          </p>
        </>
      )}
    </div>
  );
}
