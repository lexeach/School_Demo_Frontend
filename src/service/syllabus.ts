import {
  API_ADD_SYLLABUS,
  API_DELETE_SYLLABUS_DETAIL,
  API_GET_SYLLABUS_DETAIL,
  API_GET_SYLLABUS_LIST,
  API_GET_SYLLABUS_LIST_OPTION,
  API_UPDATE_SYLLABUS_DETAIL,
} from '@/config/url-constants';
import baseQuery from './baseQuery';
import { createApi } from '@reduxjs/toolkit/query/react';

export const syllabusSlice = createApi({
  reducerPath: 'syllabusApi',
  baseQuery,
  endpoints: builder => ({
    getSyllabusList: builder.query({
      query: ({ page = 1, pageSize = 10, search = '', filter = {}, sorting = {} }) => ({
        url: API_GET_SYLLABUS_LIST(page, pageSize, search, filter, sorting),
        method: 'GET',
      }),
    }),
    getSyllabusOptions: builder.mutation({
      query: () => ({
        url: API_GET_SYLLABUS_LIST_OPTION,
        method: 'GET',
      }),
    }),
    addSyllabus: builder.mutation({
      query: newData => ({
        url: API_ADD_SYLLABUS,
        method: 'POST',
        body: newData,
      }),
    }),
    getSingleSyllabus: builder.query({
      query: id => ({
        url: API_GET_SYLLABUS_DETAIL(id),
        method: 'GET',
      }),
    }),
    updateSyllabus: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: API_UPDATE_SYLLABUS_DETAIL(id),
        method: 'PUT',
        body: updatedData,
      }),
    }),
    deleteSyllabus: builder.mutation({
      query: id => ({
        url: API_DELETE_SYLLABUS_DETAIL(id),
        method: 'DELETE',
      }),
    }),

  
  }),
});

export const {
  useGetSyllabusOptionsMutation,
  useAddSyllabusMutation,
  useGetSingleSyllabusQuery,
  useGetSyllabusListQuery,
  useUpdateSyllabusMutation,
  useDeleteSyllabusMutation,
} = syllabusSlice;
