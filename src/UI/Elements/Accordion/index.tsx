import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';


export const UIAccordion = ({
  type = 'single',
  options = [],
  itemClassName = '',
  triggerClassName = '',
  className = '',
  onChange,
  component = '',
  value,
}) => {
  const handleChange = newValue => {
    if (onChange) {
      onChange(newValue);
    }
  };
  const { t } = useTranslation();
  return (
    <Accordion
      type={type}
      collapsible
      className={className}
      value={value}
      onValueChange={handleChange}
    >
      {options.map((item, index) => (
        <AccordionItem
          key={`item-${index}`}
          value={index.toString()}
          className={itemClassName}
        >
          <AccordionTrigger className={triggerClassName}>
            {t(item.action_name) || item.action_name}
          </AccordionTrigger>
          <AccordionContent>
            {index.toString() === value ? component : null}{' '}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
