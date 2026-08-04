import * as yup from "yup";

// ====================================================================
// DYNAMIC TOPIC LOGIC
// ====================================================================
export const getTopicsByGrade = (selectedGrade?: string, selectedStream?: string) => {
  const grade = String(selectedGrade);

  if (grade === "6" || grade === "7") {
    return [
      { value: "English", label: "English" },
      { value: "Hindi", label: "Hindi" },
      { value: "Mathematics", label: "Mathematics" },
      { value: "Science", label: "Science" },
      { value: "Social Science", label: "Social Science" },
      { value: "Urdu", label: "Urdu" },
      { value: "Sanskrit", label: "Sanskrit" },
    ];
  } else if (grade === "8") {
    return [
      { value: "English", label: "English" },
      { value: "Hindi", label: "Hindi" },
      { value: "Mathematics", label: "Mathematics" },
      { value: "Science", label: "Science" },
      { value: "Social Science", label: "Social Science" },
      { value: "Urdu", label: "Urdu" },
      { value: "Sanskrit", label: "Sanskrit" },
    ];
  } else if (grade === "9" || grade === "10") {
    return [
      { value: "English", label: "English" },
      { value: "Hindi", label: "Hindi" },
      { value: "Mathematics", label: "Mathematics" },
      { value: "Science", label: "Science" },
      { value: "Social Science", label: "Social Science" },
      { value: "Urdu", label: "Urdu" },
      { value: "Sanskrit", label: "Sanskrit" },
      { value: "Information and Communication Technology", label: "Information and Communication Technology" },
      { value: "All Subject", label: "All Subject" },
    ];
  } else if (grade === "11" || grade === "12") {
    const commonLanguages = [
      { value: "English", label: "English" },
      { value: "Hindi", label: "Hindi" },
      { value: "Sanskrit", label: "Sanskrit" },
      { value: "Urdu", label: "Urdu" },
    ];

    if (selectedStream === "Science") {
      return [
        ...commonLanguages,
        { value: "Physics", label: "Physics" },
        { value: "Chemistry", label: "Chemistry" },
        { value: "Mathematics", label: "Mathematics" },
        { value: "Biology", label: "Biology" },
        { value: "Biotechnology", label: "Biotechnology" },
        { value: "Computer Science", label: "Computer Science" },
        { value: "Psychology", label: "Psychology" },
        { value: "Home Science", label: "Home Science" },
      ];
    } else if (selectedStream === "Commerce") {
      return [
        ...commonLanguages,
        { value: "Accountancy", label: "Accountancy" },
        { value: "Business Studies", label: "Business Studies" },
        { value: "Economics", label: "Economics" },
        { value: "Mathematics", label: "Mathematics" },
        { value: "Informatics Practices", label: "Informatics Practices" },
        { value: "Financial Accounting", label: "Financial Accounting" },
      ];
    } else if (selectedStream === "Humanities") {
      return [
        ...commonLanguages,
        { value: "History", label: "History" },
        { value: "Political Science", label: "Political Science" },
        { value: "Geography", label: "Geography" },
        { value: "Sociology", label: "Sociology" },
        { value: "Psychology", label: "Psychology" },
        { value: "Home Science", label: "Home Science" },
        { value: "Creative Writing and Translation", label: "Creative Writing and Translation" },
      ];
    }
    return [{ value: "", label: "← Select a Stream first", disabled: true }];
  }

  return [{ value: "", label: "← Select a Grade first", disabled: true }];
};

// ====================================================================
// FORM FIELDS CONFIGURATION
// ====================================================================
export const fields = [
  {
    name: "name",
    label: "Name",
    placeholder: "Enter Name ...",
    type: "text",
    wrapperClassName: "mb-6",
    fieldWrapperClassName: "col-span-6",
  },
  {
    name: "age",
    label: "Age",
    placeholder: "Enter Age ...",
    type: "number",
    wrapperClassName: "mb-6",
    fieldWrapperClassName: "col-span-6",
  },
  {
    name: "grade",
    label: "Grade",
    placeholder: "Select Grade ...",
    type: "select",
    options: [
      { value: "6", label: "6th Grade" },
      { value: "7", label: "7th Grade" },
      { value: "8", label: "8th Grade" },
      { value: "9", label: "9th Grade" },
      { value: "10", label: "10th Grade" },
      { value: "11", label: "11th Grade" },
      { value: "12", label: "12th Grade" },
    ],
    wrapperClassName: "mb-6",
    fieldWrapperClassName: "col-span-6",
  },
  {
    name: "stream",
    label: "Stream",
    placeholder: "Select Stream ...",
    type: "select",
    options: [
      { value: "Science", label: "Science" },
      { value: "Commerce", label: "Commerce" },
      { value: "Humanities", label: "Humanities/Arts" },
    ],
    wrapperClassName: "mb-6",
    fieldWrapperClassName: "col-span-6",
  },
  {
    name: "topics",
    label: "Subject",
    placeholder: "Select Topics ...",
    type: "select",
    multi: true,
    options: [],
    wrapperClassName: "mb-6",
    fieldWrapperClassName: "col-span-6",
  },
];

// ====================================================================
// YUP SCHEMA
// ====================================================================
export const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  age: yup.number().typeError("Age must be a number").required("Age is required").positive().integer(),
  grade: yup.string().required("Grade is required"),
  stream: yup.string().when("grade", {
    is: (grade: string) => grade === "11" || grade === "12",
    then: (schema) => schema.required("Stream is required for 11th & 12th"),
    otherwise: (schema) => schema.nullable().notRequired(),
  }),
  topics: yup.array().of(yup.string()).min(1, "Select at least one topic").required("Topics are required"),
}).required();
