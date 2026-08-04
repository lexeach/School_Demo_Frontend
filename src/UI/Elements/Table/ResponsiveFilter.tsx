import ChevLeft from '@/assets/ChevRight.svg?react';
import ChevRight from '@/assets/ChevLeft.svg?react';
import { Cross1Icon } from '@radix-ui/react-icons';
import UIButton from '../Button';
import UICheckbox from '../Checkbox';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
// import Cross from '@/assets/C';

interface FilterOption {
  name: string;
  filterName: string;
  options?: { label: string; value: string }[];
  handleCancel: () => void;
}

interface ResponsiveFilterProps {
  filterConfig: FilterOption[];
  filterCallback?: (name: [], value: string) => void;
  handleCancel?: () => void;
}

const ResponsiveFilter: React.FC<ResponsiveFilterProps> = ({
  filterConfig,
  handleCancel,
  filterCallback,
}) => {
  const { t } = useTranslation();
  const [option, setOption] = useState<FilterOption | null>(null);
  const [selectedValues, setSelectedValues] = useState<Record<string, boolean>>(
    {}
  );

  const handleCheckboxChange = (value: string, checked: boolean) => {
    setSelectedValues(prev => ({
      ...prev,
      [value]: checked,
    }));
  };

  const handleApplyFilter = () => {
    let arr = [];
    if (option) {
      for (const key in selectedValues) {
        if (selectedValues[key]) {
          arr.push(key);
        }
      }
      filterCallback(option.filterName, arr);
    }
    handleCancel();
  };

  const handleClear = () => {
    setSelectedValues({});
    handleApplyFilter();
  };

  return (
    <div className="px-[20px] py-8 h-full">
      <div className="flex mt-1">
        <span
          className="min-w-[40px] h-[40px] bg-gray-100 rounded hover:bg-gray-200 cursor-pointer"
          onClick={!option ? handleCancel : () => setOption(null)}
        >
          {option ? (
            <ChevRight width={16} className="mt-3 ml-3" />
          ) : (
            <Cross1Icon width={16} height={16} className="mt-3 ml-3" />
          )}
        </span>
        <p className="font-semibold text-2xl pb-7 mt-1 ml-3 w-full">
          {option?.name || t('filter')}
        </p>
        <div className="w-[160px] text-right">
          <UIButton variant="outline" size="sm" onClick={handleClear}>
            Clear All
          </UIButton>
        </div>
      </div>
      {!option
        ? filterConfig.map(item => (
            <div
              key={item.name}
              className="stroke-gray-200 py-3 px-2 hover:bg-gray-50 flex justify-between"
              onClick={() => setOption(item)}
            >
              <p className="font-medium text-lg">{item.name}</p>
              <ChevLeft className="mt-1" />
            </div>
          ))
        : option.options?.map(item => (
            <div
              key={item.value}
              className="stroke-gray-200 py-3 px-2 hover:bg-gray-50 flex justify-between"
            >
              <UICheckbox
                label={item.label}
                value={selectedValues[item.value] || false}
                labelClassName="font-medium text-lg"
                onChange={checked => handleCheckboxChange(item.value, checked)}
              />
            </div>
          ))}
      <UIButton className="w-full mt-8" onClick={handleApplyFilter}>
        Apply Filter
      </UIButton>
    </div>
  );
};

export default ResponsiveFilter;
