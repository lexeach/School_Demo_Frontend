export const API_LOGIN = `api/users/login`;
export const API_LOGOUT = `api/logout`;
export const API_REGISTER = `api/users/register`;
export const API_CHILD_LOGIN = (id) => `api/users/childLogin/${id}`;

/****** Paper  ********/
export const API_ADD_PAPER = "/api/papers";
export const API_GET_PAPER_DETAIL = (id) => `/api/papers/${id}`;
export const API_GENERATE_NEW_OTP = (id) =>
  `/api/papers/generateQuestionOTP/${id}`;
export const API_UPDATE_PAPER_DETAIL = (id) => `/api/papers/${id}`;
export const API_ANSWER_PAPER_DETAIL = `/api/papers/answer`;
export const API_DELETE_PAPER_DETAIL = (id) => `/api/papers/${id}`;
export const API_POST_ASSIGN_PAPER = (id) =>
  `/api/papers/assign?questionId=${id}`;

/****** Learning Center ********/

export const API_GET_ALL_LEARNING_RESOURCES = (paperId) =>
  `/api/papers/learning/${paperId}`;

export const API_GET_LEARNING_RESOURCES = (id) =>
  `/api/papers/learning/resource/${id}`;

/****** Paper List ********/

export const API_GET_PAPER_LIST = (
  page = 1,
  pageSize = 10,
  search = "",
  filter = {},
  sorting = {}
) => {
  let filterString = "&";

  for (const key in filter) {
    if (filter[key]) {
      filterString += `&${key}=${filter[key]}&`;
    }
  }

  const sortingString = sorting?.id
    ? `&sort=${sorting.id}&order=${sorting.desc ? "desc" : "asc"}`
    : `&sort=id&order=desc`;

  return `/api/papers?page=${page}&limit=${pageSize}${sortingString}${
    search !== "" ? `&search=${search} ${filterString}` : ` ${filterString}`
  }`;
};

/****** Children ********/

export const API_ADD_CHILDREN = "/api/children";
export const API_GET_CHILDREN_LIST_CLASS = "api/children/classes/list";
export const API_GET_CHILDREN_DETAIL = (id) => `/api/children/${id}`;
export const API_UPDATE_CHILDREN_DETAIL = (id) => `/api/children/${id}`;
export const API_DELETE_CHILDREN_DETAIL = (id) => `/api/children/${id}`;

export const API_GET_CHILDREN_LIST = (
  page = 1,
  pageSize = 10,
  search = "",
  filter = {},
  sorting = {}
) => {
  let filterString = "&";

  for (const key in filter) {
    if (filter[key]) {
      filterString += `&${key}=${filter[key]}&`;
    }
  }

  const sortingString = sorting?.id
    ? `&sort=${sorting.id}&order=${sorting.desc ? "desc" : "asc"}`
    : `&sort=id&order=desc`;

  return `/api/children?page=${page}&limit=${pageSize}${sortingString}${
    search !== "" ? `&search=${search} ${filterString}` : ` ${filterString}`
  }`;
};

/****** Subject ********/

export const API_ADD_SUBJECT = "/api/subjects";
export const API_GET_SUBJECT_DETAIL = (id) => `/api/subjects/${id}`;
export const API_UPDATE_SUBJECT_DETAIL = (id) => `/api/subjects/${id}`;
export const API_DELETE_SUBJECT_DETAIL = (id) => `/api/subjects/${id}`;
export const API_GET_SUBJECT_LIST_Mutation =
  `/api/subjects/?page=1&limit=1000`;

export const API_GET_SUBJECT_LIST = (
  page = 1,
  pageSize = 10,
  search = "",
  filter = {},
  sorting = {}
) => {
  let filterString = "&";

  for (const key in filter) {
    if (filter[key]) {
      filterString += `&${key}=${filter[key]}&`;
    }
  }

  const sortingString = sorting?.id
    ? `&sort=${sorting.id}&order=${sorting.desc ? "desc" : "asc"}`
    : `&sort=id&order=desc`;

  return `/api/subjects?page=${page}&limit=${pageSize}${sortingString}${
    search !== "" ? `&search=${search} ${filterString}` : ` ${filterString}`
  }`;
};

/****** Syllabus ********/

export const API_ADD_SYLLABUS = "/api/syllabuses";
export const API_GET_SYLLABUS_DETAIL = (id) => `/api/syllabuses/${id}`;
export const API_UPDATE_SYLLABUS_DETAIL = (id) => `/api/syllabuses/${id}`;
export const API_DELETE_SYLLABUS_DETAIL = (id) => `/api/syllabuses/${id}`;
export const API_GET_SYLLABUS_LIST_OPTION =
  `/api/syllabuses?page=1&limit=1000`;

export const API_GET_SYLLABUS_LIST = (
  page = 1,
  pageSize = 10,
  search = "",
  filter = {},
  sorting = {}
) => {
  let filterString = "&";

  for (const key in filter) {
    if (filter[key]) {
      filterString += `&${key}=${filter[key]}&`;
    }
  }

  const sortingString = sorting?.id
    ? `&sort=${sorting.id}&order=${sorting.desc ? "desc" : "asc"}`
    : `&sort=id&order=desc`;

  return `/api/syllabuses?page=${page}&limit=${pageSize}${sortingString}${
    search !== "" ? `&search=${search} ${filterString}` : ` ${filterString}`
  }`;
};

/****** User ********/

export const API_GET_USER_LIST = (
  page = 1,
  pageSize = 10,
  search = "",
  filter = {},
  sorting = {}
) => {
  let filterString = "&";

  for (const key in filter) {
    if (filter[key]) {
      filterString += `&${key}=${filter[key]}&`;
    }
  }

  const sortingString = sorting?.id
    ? `&sort=${sorting.id}&order=${sorting.desc ? "desc" : "asc"}`
    : `&sort=id&order=desc`;

  return `/api/users?page=${page}&limit=${pageSize}${sortingString}${
    search !== "" ? `&search=${search} ${filterString}` : ` ${filterString}`
  }`;
};

export const API_GET_USER_DETAIL = (id) =>
  `/api/users/detail/${id}`;

export const API_UPDATE_USER_LIMIT = (id) =>
  `/api/users/${id}/limits`;

export const API_UPDATE_TOPIC_LIMIT = (id) =>
  `/api/users/topic/${id}/limits`;

/****** Learning Verification ********/

export const API_GENERATE_LEARNING_VERIFICATION =
  "/api/learning-verification/generate";

export const API_GET_LEARNING_VERIFICATION = (
  paperId,
  questionNumber
) =>
  `/api/learning-verification/${paperId}/${questionNumber}`;

export const API_SUBMIT_LEARNING_VERIFICATION =
  "/api/learning-verification/submit";
export const API_BULK_UPLOAD_USERS = "/api/users/bulk-upload";
