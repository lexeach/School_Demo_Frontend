import { FieldError } from 'react-hook-form';

import UICheckbox from '../Elements/Checkbox';
import UIDatepicker from '../Elements/Datepicker';
import UIDropdown from '../Elements/Dropdown';
import UIInput from '../Elements/Input';
import UIRadio from '../Elements/Radio';
import UISelect from '../Elements/Select';
import UITextArea from '../Elements/TextArea';

const FieldRender = ({
  field,
  errors,
  methods,
  control,
  controller,
  index,
  repeaterName,
  defaultValues,
}) => {
  const fieldName = repeaterName ? `${repeaterName}.${field.name}` : field.name;
  // Added for radio button for handling the default setting of radio
  const defaultValue = defaultValues?.[field.name];
  const Control = controller;
  return (
    <Control
      name={fieldName}
      control={control}
      defaultValue={field.defaultValue || (field.multi ? [] : '')}
      render={({ field: controllerField }) => {
        if (field.customComponent) {
          const CustomComponent = field.customComponent;
          return (
            <CustomComponent
              {...controllerField}
              label={field.label}
              className={field.className}
              error={errors[fieldName] as FieldError}
            />
          );
        }

        switch (field.type) {
          case 'text':
          case 'number':
          case 'email':
          case 'password':
            return (
              <UIInput
                {...controllerField}
                {...field}
                label={field.label}
                type={field.type}
                placeholder={field.placeholder}
                className={field.className}
                error={errors[fieldName] as FieldError}
              />
            );
          

          case 'textarea':
            return (
              <UITextArea
                {...controllerField}
                {...field}
                label={field.label}
                placeholder={field.placeholder}
                className={field.className}
                error={errors[fieldName] as FieldError}
              />
            );

          case 'checkbox':
            return (
              <UICheckbox
                {...controllerField}
                label={field.label}
                values={controllerField.value || []}
                options={field.options}
                className={field.className}
                setFormValue={methods.setValue}
                error={errors[fieldName] as FieldError}
                onChange={value => {
                  console.log('value >> fields', value);

                  if (field.getValueCallback) field.getValueCallback(value);
                  controllerField.onChange(value);
                }}
              />
            );

          case 'radio':
            return (
              <UIRadio
                {...controllerField}
                label={field.label}
                options={field.options}
                defaultValue={defaultValue}
                className={field.className}
                setFormValue={methods.setValue}
                error={errors[fieldName] as FieldError}
                onChange={value => {
                  if (field.getValueCallback) field.getValueCallback(value);
                  controllerField.onChange(value);
                }}
              />
            );

          case 'dropdown':
            return (
              <UIDropdown
                {...controllerField}
                label={field.label}
                options={field.options}
                className={field.className}
                error={errors[fieldName] as FieldError}
              />
            );

          case 'select':
            return (
              <UISelect
                {...controllerField}
                {...field}
                label={field.label}
                options={field.options}
                fetchData={field.fetchData}
                fetchId={field.fetchId}
                multi={field.multi}
                setFormValue={methods.setValue}
                className={field.className}
                error={errors[fieldName] as FieldError}
                getValueCallback={value => {
                  if (field.getValueCallback)
                    field.getValueCallback(value, index);
                }}
              />
            );

          case 'datepicker':
            return (
              <UIDatepicker
                {...controllerField}
                label={field.label}
                isFutureDates={field.isFutureDates || false}
                className={field.className}
                error={errors[fieldName] as FieldError}
              />
            );

          default:
            return null;
        }
      }}
    />
  );
};

export default FieldRender;
