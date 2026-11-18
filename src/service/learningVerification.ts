
import {
  API_GENERATE_LEARNING_VERIFICATION,
  API_GET_LEARNING_VERIFICATION,
  API_SUBMIT_LEARNING_VERIFICATION,
  API_R3_GENERATE,
  API_R3_VERIFY,
  API_R3_EXPAND,
  API_R3_LEARNING_CONTENT,
} from "@/config/url-constants";

import baseQuery from "./baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const learningVerificationApi = createApi({
  reducerPath: "learningVerificationApi",
  baseQuery,
  tagTypes: ["LearningVerification"],

  endpoints: (builder) => ({
    /**
     * Generate Verification Paper
     */
    generateLearningVerification: builder.mutation({
      query: (body) => ({
        url: API_GENERATE_LEARNING_VERIFICATION,
        method: "POST",
        body,
      }),
      invalidatesTags: ["LearningVerification"],
    }),

    /**
     * Submit Verification Paper
     */
    submitLearningVerification: builder.mutation({
      query: (body) => ({
        url: API_SUBMIT_LEARNING_VERIFICATION,
        method: "POST",
        body,
      }),
      invalidatesTags: ["LearningVerification"],
    }),

    generateR3Factor: builder.mutation({
      query: (body) => ({ url: API_R3_GENERATE, method: "POST", body }),
      invalidatesTags: ["LearningVerification"],
    }),
    submitR3FactorVerification: builder.mutation({
      query: (body) => ({ url: API_R3_VERIFY, method: "POST", body }),
      invalidatesTags: ["LearningVerification"],
    }),
    expandR3Factor: builder.mutation({
      query: (body) => ({ url: API_R3_EXPAND, method: "POST", body }),
      invalidatesTags: ["LearningVerification"],
    }),

    generateR3FactorLearningContent: builder.mutation({
      query: (body) => ({ url: API_R3_LEARNING_CONTENT, method: "POST", body }),
      invalidatesTags: ["LearningVerification"],
    }),

    /**
     * Get Verification Status
     */
    getLearningVerification: builder.query({
      query: ({ paperId, questionNumber }) => ({
        url: API_GET_LEARNING_VERIFICATION(
          paperId,
          questionNumber
        ),
        method: "GET",
      }),

      providesTags: ["LearningVerification"],
    }),
  }),
});

export const {
  useGenerateLearningVerificationMutation,
  useSubmitLearningVerificationMutation,
  useGetLearningVerificationQuery,
  useLazyGetLearningVerificationQuery,
  useGenerateR3FactorMutation,
  useSubmitR3FactorVerificationMutation,
  useExpandR3FactorMutation,
  useGenerateR3FactorLearningContentMutation,
} = learningVerificationApi;
