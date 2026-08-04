import { useEffect, useState } from 'react';

import { Switch } from '@/components/ui/switch';
import { useTranslation } from 'react-i18next';

const UISwitch = ({
  label,
  value,
  onChange,
  dir
}: {
  label: string;
  value?: boolean;
  onChange?: (val) => void;
  dir?:boolean

}) => {

  const { t } = useTranslation();
  const [isChecked, setIsChecked] = useState(value);

  useEffect(() => {
    setIsChecked(value);
  }, [value]);

  const handleToggle = () => {
    console.log(isChecked);
    setIsChecked(!isChecked);
    onChange(!isChecked);
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch dir={dir} checked={isChecked} onCheckedChange={handleToggle} />
      <p className="rtl:pr-2">{t(label)}</p>
    </div>
  );
};

export default UISwitch;
