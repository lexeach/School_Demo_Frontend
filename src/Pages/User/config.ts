import * as yup from "yup";
export const fields = [
  {
    name: "childLimit",
    label: "Child Limit",
    placeholder: "Enter Limit ...",
    type: "number",
    wrapperClassName: "mb-6",
    fieldWrapperClassName: "col-span-6",
  },
];

export const schema = yup
  .object()
  .shape({
    childLimit: yup.string().required("This field required"),
  })
  .required();
