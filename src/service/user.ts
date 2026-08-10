import {
  API_GET_USER_DETAIL,
  API_GET_USER_LIST,
  API_UPDATE_TOPIC_LIMIT,
  API_UPDATE_USER_LIMIT,
} from "@/config/url-constants";
import baseQuery from "./baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const userSlice = createApi({
  reducerPath: "userApi",
  baseQuery,
  endpoints: (builder) => ({
    getUserList: builder.query({
      query: ({
        page = 1,
        pageSize = 1000,
        search = "",
        filter = {},
        sorting = {},
      }) => ({
        url: API_GET_USER_LIST(page, pageSize, search, filter, sorting),
        method: "GET",
      }),
    }),

    getSingleUser: builder.query({
      query: (id) => ({
        url: API_GET_USER_DETAIL(id),
        method: "GET",
      }),
    }),

    updateUserLimit: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: API_UPDATE_USER_LIMIT(id),
        method: "PUT",
        body: payload,
      }),
    }),
    updateTopicLimit: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: API_UPDATE_TOPIC_LIMIT(id),
        method: "PUT",
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetUserListQuery,
  useGetSingleUserQuery,
  useUpdateUserLimitMutation,
  useUpdateTopicLimitMutation,
} = userSlice;
