import {
  API_ADD_SUBJECT,
  API_DELETE_SUBJECT_DETAIL,
  API_GET_SUBJECT_DETAIL,
  API_GET_SUBJECT_LIST,
  API_GET_SUBJECT_LIST_Mutation,
  API_UPDATE_SUBJECT_DETAIL,
} from "@/config/url-constants";
import baseQuery from "./baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const subjectSlice = createApi({
  reducerPath: "subjectApi",
  baseQuery,
  endpoints: (builder) => ({
    getSubjectList: builder.query({
      query: ({
        page = 1,
        pageSize = 10,
        search = "",
        filter = {},
        sorting = {},
      }) => ({
        url: API_GET_SUBJECT_LIST(page, pageSize, search, filter, sorting),
        method: "GET",
      }),
    }),
    getSubjectOptions: builder.mutation({
      query: () => ({
        url: API_GET_SUBJECT_LIST_Mutation,
        method: "GET",
      }),
    }),
    addSubject: builder.mutation({
      query: (newData) => ({
        url: API_ADD_SUBJECT,
        method: "POST",
        body: newData,
      }),
    }),
    getSingleSubject: builder.query({
      query: (id) => ({
        url: API_GET_SUBJECT_DETAIL(id),
        method: "GET",
      }),
    }),
    updateSubject: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: API_UPDATE_SUBJECT_DETAIL(id),
        method: "PUT",
        body: updatedData,
      }),
    }),
    deleteSubject: builder.mutation({
      query: (id) => ({
        url: API_DELETE_SUBJECT_DETAIL(id),
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetSubjectOptionsMutation,
  useAddSubjectMutation,
  useGetSingleSubjectQuery,
  useGetSubjectListQuery,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
} = subjectSlice;
