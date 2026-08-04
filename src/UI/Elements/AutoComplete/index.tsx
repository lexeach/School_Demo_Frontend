import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
import Select, { components } from 'react-select';
import { useTranslation } from 'react-i18next';
import Exclamation from '@/assets/Exclamation.svg?react';

const isObject = value =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const getUniqueById = array => {
  const ids = new Set();
  return array.filter(item => {
    if (!ids.has(item.value)) {
      ids.add(item.value);
      return true;
    }
    return false;
  });
};

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const HighlightedOption = ({ data, searchTerm, ...props }) => {
  const { Option } = components;
  const highlightedLabel = searchTerm
    ? data.label.replace(
        new RegExp(`(${searchTerm})`, 'i'),
        `<span style="color: blue; font-weight: bold;">$1</span>`
      )
    : data.label;

  return (
    <Option {...props}>
      <span dangerouslySetInnerHTML={{ __html: highlightedLabel }} />
    </Option>
  );
};

export function UIAutoComplete({
  onChange,
  fetchData,
  label = 'AutoComplete',
  placeholder = '',
  multi = false,
  style = 'mb-6',
  getSelectedOption = () => {},
  getValueCallback = () => {},
  menuPosition = 'fixed',
  ...props
}) {
  const { t } = useTranslation();

  const [value, setValue] = useState(multi ? [] : null);
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState([]);
  const [page, setPage] = useState(1);
  const [trigger, { data, error, isLoading }] = fetchData();

  // Use useRef instead of state to track mounted status
  const mountedRef = useRef(false);

  const handleMissingOption = useCallback(
    async missingValue => {
      const result = await trigger({
        page: 1,
        search: missingValue,
      });
      const newOption = result?.data?.data?.[0];
      if (newOption) {
        const formattedOption = {
          value: newOption.id,
          label: newOption.name || newOption.title,
        };
        setOptions(prev => getUniqueById([...prev, formattedOption]));
        setValue(prev =>
          multi ? [...prev, formattedOption] : formattedOption
        );
      }
    },
    [multi, trigger]
  );

  const [isNext, setIsNext] = useState(null);

  const handleMenuScrollToBottom = useCallback(async () => {
    if (isNext) {
      try {
        const result = await trigger({ page, search: searchTerm });
        if (result?.data?.data?.length) {
          const newOptions = result.data.data.map(option => ({
            value: option.id,
            label: option.name || option.title,
          }));

          const updatedOptions = getUniqueById([...options, ...newOptions]);

          setOptions(updatedOptions);
          setPage(result?.data?.meta?.current_page + 1);
          setIsNext(result?.data?.links.next);
        }
      } catch {
        // Log error or handle accordingly
      }
    }
  }, [page, options, searchTerm, trigger, isNext]);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      trigger({ page: 1, search: '' });
    }
  }, [mountedRef, trigger]);

  useEffect(() => {
    if (data?.data) {
      const formattedOptions = data.data.map(option => ({
        value: option.id,
        label: option.name || option.title,
      }));

      // Avoid unnecessary updates if options are the same
      const updatedOptions = getUniqueById([...options, ...formattedOptions]);

      // Only update if there are changes
      if (updatedOptions.length !== options.length) {
        setOptions(updatedOptions);
        setPage(data?.meta?.current_page ? data?.meta?.current_page + 1 : 1);
        setIsNext(data.links.next);
      }

      if (props.value) {
        const findMatchingOptions = valuesToMatch => {
          return updatedOptions.filter(opt =>
            Array.isArray(valuesToMatch)
              ? valuesToMatch.includes(opt.value)
              : opt.value ===
                (isObject(valuesToMatch) ? valuesToMatch.id : valuesToMatch)
          );
        };

        const selectedOption = multi
          ? findMatchingOptions(props.value)
          : findMatchingOptions(props.value)?.[0];

        if (!selectedOption && props.value) {
          handleMissingOption(props.value);
        } else {
          const formattedValue = multi
            ? selectedOption.map(opt => ({
                value: opt.value,
                label: opt.label,
              }))
            : selectedOption;
          setValue(formattedValue);
        }
      }
    }
  }, [data, props.value, multi, handleMissingOption, options]);

  useEffect(() => {
    if (searchTerm) {
      trigger({ page: 1, search: searchTerm });
    }
  }, [searchTerm, trigger]);

  const handleInputChange = useMemo(
    () => debounce(inputValue => setSearchTerm(inputValue), 100),
    []
  );

  const handleChange = useCallback(
    selectedOption => {

      if (multi) {
        const values = selectedOption.map(opt => ({
          value: opt.value,
          label: opt.label,
        }));
        setValue(values);
        onChange?.(values.map(opt => opt.value));
        getValueCallback(values);
        getSelectedOption(values);
      } else {
        setValue(selectedOption);
        onChange?.(selectedOption?.value || null);
        getValueCallback(selectedOption?.value);
        getSelectedOption(selectedOption);
      }
    },
    [multi, onChange, getValueCallback, getSelectedOption]
  );

  return (
    <div className={`relative ${style}`}>
      {label && (
        <p className="text-left pb-1 text-sm font-medium rtl:text-right">
          {t(label)}
        </p>
      )}
      <Select
        value={value}
        onChange={handleChange}
        onInputChange={handleInputChange}
        options={options}
        isLoading={isLoading}
        isClearable
        isMulti={multi}
        menuPosition={menuPosition}
        onMenuScrollToBottom={handleMenuScrollToBottom}
        placeholder={t(placeholder || label)}
        components={{
          Option: props => (
            <HighlightedOption {...props} searchTerm={searchTerm} />
          ),
        }}
        styles={{
          control: provided => ({
            ...provided,
            borderColor: props.error ? 'red' : provided.borderColor,
          }),
          menu: provided => ({
            ...provided,
          }),
          menuPortal: base => ({ ...base, zIndex: 99999 }),
        }}
        noOptionsMessage={() =>
          isLoading
            ? 'Loading...'
            : error
              ? 'Error loading data.'
              : 'No options found.'
        }
      />
      {props.error && (
        <>
          <Exclamation
            className="absolute"
            style={{
              top: '33px',
            }}
          />
          <p className="mt-1 text-gray-500 text-sm">{t(props.error.message)}</p>
        </>
      )}
    </div>
  );
}
