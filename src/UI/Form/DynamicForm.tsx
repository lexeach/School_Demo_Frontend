import * as yup from "yup";
import {
  Controller,
  Path,
  Resolver,
  UseFormReturn,
  useFieldArray,
  useForm,
} from "react-hook-form";
import React, { useEffect, useMemo } from "react";
import FieldRender from "./Fields";
import UIButton from "../Elements/Button";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { yupResolver } from "@hookform/resolvers/yup";

interface Option {
  label: string;
  value: string | number;
}

interface Field {
  hide?: any;
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  defaultValue?: any;
  className?: string;
  wrapperClassName?: string;
  fieldWrapperClassName?: string;
  flex?: number;
  validation?: any;
  options?: Option[];
  customComponent?: React.ElementType<any>;
  fetchData?: any;
  fetchId?: any;
  getValueCallback?: (value?: any) => void;
  isRepeater?: boolean; // For repeater fields
  fields?: Field[]; // Repeater's internal fields
}

interface DynamicFormProps<T> {
  fields: Field[];
  onSubmit: (data: T) => void;
  useFormMethods?: UseFormReturn<T>; // Optional useForm methods prop
  apiErrors?: { [key: string]: string };
  buttonConfig?: { label: string; type: "reset" | "submit"; className: string };
  showButton?: boolean;
  showRepeaterButton?: boolean;
  defaultValues?: any;
  beforeButtonComponent?: any;
  fetchData?: any;
}
const DynamicForm = <T,>({
  fields = [],
  onSubmit,
  useFormMethods,
  apiErrors,
  buttonConfig,
  beforeButtonComponent,
  defaultValues,
  showRepeaterButton = true,
  showButton = true,
}: DynamicFormProps<T>) => {
  const validationSchema = useMemo(
    () =>
      yup.object().shape(
        fields.reduce((schema, field) => {
          if (field.validation) {
            schema[field.name] = field?.validation;
          }
          return schema;
        }, {})
      ),
    [fields]
  );
  

  

  const internalMethods = useForm<T>({
    resolver: yupResolver(validationSchema) as Resolver<T, any>,
    defaultValues: fields.reduce(
      (acc, field) => {
        const updatedAcc = Object.assign({}, acc);
        if (field.isRepeater) {
          updatedAcc[field.name] = defaultValues?.[field.name] || [{}];
        } else {
          updatedAcc[field.name] =
            defaultValues?.[field.name] || field?.defaultValue || "";
        }
        return updatedAcc;
      },
      { ...defaultValues }
    ),
  });

  const methods = useFormMethods || internalMethods;
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (apiErrors) {
      Object.keys(apiErrors).forEach((key) => {
        setError(key as `root.${string}` | Path<T>, {
          type: "manual",
          message: apiErrors[key],
        });
      });
    }
  }, [apiErrors, setError]);

  // Helper function to generate an empty object for new repeater form
  const generateEmptyRepeaterField = (fields: Field[]) => {
    const emptyField = {};
    fields.forEach((field) => {
      if (field.multi) {
        emptyField[field.name] = [];
      } else {
        emptyField[field.name] = field.defaultValue || "";
      }
    });
    return emptyField;
  };

  const fieldArrays = fields.map((field) => {
    if (field.isRepeater) {
      return useFieldArray({
        control,
        name: field.name as Path<T>,
      });
    }
    return null;
  });

  const renderedFields = useMemo(() => {
    return fields.map((field, index) => {
      if (field?.hide) return null;

      const fieldArray = fieldArrays[index];

      if (field.isRepeater && field.fields && fieldArray) {
        const { fields: repeatedFields, append, remove } = fieldArray;
        return (
          <div
            key={field.name}
            className={field.wrapperClassName || "col-span-6"}
          >
            {repeatedFields.map((repeaterItem, repeaterIndex) => (
              <div key={repeaterItem.id} className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3>
                    {field.label} {repeaterIndex > 0 ? repeaterIndex + 1 : ""}
                  </h3>
                  <UIButton
                    variant="ghost"
                    type="button"
                    onClick={() => remove(repeaterIndex)}
                    className="btn-remove"
                  >
                    <XMarkIcon height={24} />
                  </UIButton>
                </div>
                <div className="grid grid-cols-6 gap-4">
                  {field.fields?.map((innerField) => (
                    <div
                      key={innerField.name}
                      className={`px-4 ${innerField.fieldWrapperClassName || "col-span-6"}`}
                    >
                      <FieldRender
                        field={innerField}
                        control={control}
                        errors={errors}
                        methods={methods}
                        controller={Controller}
                        index={repeaterIndex}
                        defaultValues={defaultValues}
                        repeaterName={`${field.name}[${repeaterIndex}]`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="float-right">
              <UIButton
                type="button"
                onClick={() => {
                  const val = generateEmptyRepeaterField(field.fields);
                  append(val);
                }}
                className="mr-3"
              >
                {"Add"}
              </UIButton>
              {showRepeaterButton && (
                <UIButton
                  type={buttonConfig?.type || "submit"}
                  className={buttonConfig?.className || "btn btn-primary"}
                >
                  {buttonConfig?.label || "submit"}
                </UIButton>
              )}
            </div>
          </div>
        );
      }

      return (
        <div
          key={field.name}
          className={`px-4 ${field.fieldWrapperClassName || "col-span-6"}`} // Apply wrapperClassName
        >
          <FieldRender
            field={field}
            control={control}
            errors={errors}
            methods={methods}
            controller={Controller}
          />
        </div>
      );
    });
  }, [
    fields,
    fieldArrays,
    control,
    errors,
    methods,
    buttonConfig?.type,
    buttonConfig?.className,
    buttonConfig?.label,
  ]);

  const renderButton = useMemo(() => {
    if (!showButton) return null;
    return (
      <div className="w-full px-4 col-span-6 text-right">
        <UIButton
          type={buttonConfig?.type || "submit"}
          className={buttonConfig?.className || "btn btn-primary"}
        >
          {buttonConfig?.label || "submit"}
        </UIButton>
      </div>
    );
  }, [showButton, buttonConfig]);

  const renderBeforeButton = useMemo(
    () => beforeButtonComponent,
    [beforeButtonComponent]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-0">
      {renderedFields}
      {renderBeforeButton}
      {renderButton}
    </form>
  );
};

export default DynamicForm;
