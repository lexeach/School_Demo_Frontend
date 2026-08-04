import * as yup from "yup";
export const fields = [
  {
    name: "name",
    label: "Name",
    placeholder: "Enter Name ...",
    type: "text",
    wrapperClassName: "mb-6",
    fieldWrapperClassName: "col-span-6",
  },
];

export const schema = yup
  .object()
  .shape({
    name: yup.string().required("This field required"),
  })
  .required();
