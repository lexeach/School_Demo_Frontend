
import {
  API_GENERATE_LEARNING_VERIFICATION,
  API_GET_LEARNING_VERIFICATION,
  API_SUBMIT_LEARNING_VERIFICATION,
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
} = learningVerificationApi;
