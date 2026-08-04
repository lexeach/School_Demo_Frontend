import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { Label } from '@/components/ui/label';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const UIRadio = ({
  name,
  label,
  options,
  isDefaultValue = true,
  onChange,
  defaultValue,
  value,
  ...props
}) => {
  const { t } = useTranslation();
  useEffect(() => {
    if (!value && options.length > 0 && isDefaultValue) {
      props.setFormValue(name, options[0].value);
    }
  }, [value, options, onChange]);

  useEffect(() => {
    if (defaultValue) {
      props.setFormValue(name, value);
    }
  }, [defaultValue]);

  return (
    <div className="my-4">
      <p className="text-sm leading-5 font-medium mb-3 pb-1">{t(label)}</p>
      <RadioGroup
        onValueChange={onChange}
        value={value}
        className="flex ml-4"
      >
        {options.map((item, index) => (
          <div key={item.value} className={`flex items-center mr-3 rtl:pr-3`}>
            <RadioGroupItem
              key={item.value}
              className={`${item?.color ? 'text-' + item.color : ''} `}
              value={item.value}
              id={`${name}-${index}`}
            />
            <Label
              htmlFor={`${name}-${index}`}
              className={`ml-3 rtl:mr-3 ${item?.color ? 'text-' + item.color : ''}`}
            >
              {t(item.label)}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {props.error && (
        <>
          <p className="mt-1 text-gray-500 text-sm">{t(props.error.message)}</p>
        </>
      )}
    </div>
  );
};

export default UIRadio;
