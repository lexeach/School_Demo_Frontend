import {
  API_ADD_PAPER,
  API_ANSWER_PAPER_DETAIL,
  API_DELETE_PAPER_DETAIL,
  API_GENERATE_NEW_OTP,
  API_GET_PAPER_DETAIL,
  API_GET_PAPER_LIST,
  API_POST_ASSIGN_PAPER,
  API_UPDATE_PAPER_DETAIL,
  
  API_GET_CHILDREN_LIST_CLASS,
  API_GET_LEARNING_RESOURCES,
  API_GET_ALL_LEARNING_RESOURCES,
  API_GENERATE_LEARNING_VERIFICATION,
API_SUBMIT_LEARNING_VERIFICATION,
} from '@/config/url-constants';
import baseQuery from './baseQuery';
import { createApi } from '@reduxjs/toolkit/query/react';

export const paperSlice = createApi({
  reducerPath: 'papersApi',
  baseQuery,
  endpoints: builder => ({
   

    getPaperList: builder.query({
      query: ({ page = 1, pageSize = 10, search = '', filter = {}, sorting = {} }) => ({
        url: API_GET_PAPER_LIST(page, pageSize, search, filter, sorting),
        method: 'GET',
      }),
    }),
    addPaper: builder.mutation({
      query: newData => ({
        url: API_ADD_PAPER,
        method: 'POST',
        body: newData,
      }),
    }),
    
    getSinglePaper: builder.query({
      query: id => ({
        url: API_GET_PAPER_DETAIL(id),
        method: 'GET',
      }),
    }),
    updatePaper: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: API_UPDATE_PAPER_DETAIL(id),
        method: 'PUT',
        body: updatedData,
      }),
    }),
    deletePaper: builder.mutation({
      query: id => ({
        url: API_DELETE_PAPER_DETAIL(id),
        method: 'DELETE',
      }),
    }),
    assignPaper: builder.mutation({
      query: ({childId, paperId, url}) => ({
        url: API_POST_ASSIGN_PAPER(paperId),
        method: 'POST',
        body: {childId, url},
      }),
    }),
    answerPaper: builder.mutation({
      query: (updatedData) => ({
        url: API_ANSWER_PAPER_DETAIL,
        method: 'PATCH',
        body: updatedData,
      }),
    }),
    generateNewOTP: builder.mutation({
      query: id => ({
        url: API_GENERATE_NEW_OTP(id),
        method: 'POST',
      }),
    }),
    getLearningResources: builder.query({
  query: id => ({
    url: API_GET_LEARNING_RESOURCES(id),
    method: "GET",
  }),
}),

getAllLearningResources: builder.query({
  query: paperId => ({
    url: API_GET_ALL_LEARNING_RESOURCES(paperId),
    method: "GET",
  }),
}),

generateVerificationQuiz: builder.mutation({
  query: ({ paperId, questionNumber }) => ({
    url: API_GENERATE_LEARNING_VERIFICATION,
    method: "POST",
    body: {
      paperId,
      questionNumber,
    },
  }),
}),

submitVerificationQuiz: builder.mutation({
  query: ({ verificationId, answers }) => ({
    url: API_SUBMIT_LEARNING_VERIFICATION,
    method: "POST",
    body: {
      verificationId,
      answers,
    },
  }),
}),
    getChildrenListClass: builder.query({
      query: () => ({
        url: API_GET_CHILDREN_LIST_CLASS,
        method: 'GET',
      }),
    }),

  
  }),
});

export const {
  useGetChildrenListClassQuery,
  useGenerateNewOTPMutation,
  useAnswerPaperMutation,
  useAssignPaperMutation,
  useAddPaperMutation,
  useGetSinglePaperQuery,
  useGetPaperListQuery,
  useUpdatePaperMutation,
  useDeletePaperMutation,
  
  useGetLearningResourcesQuery,
useGetAllLearningResourcesQuery,
useGenerateVerificationQuizMutation,
useSubmitVerificationQuizMutation,
} = paperSlice;
