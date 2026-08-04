import {
  API_ADD_CHILDREN,
  API_DELETE_CHILDREN_DETAIL,
  API_GET_CHILDREN_DETAIL,
  API_GET_CHILDREN_LIST,
  API_GET_USER_LIST,
  API_UPDATE_CHILDREN_DETAIL,
} from "@/config/url-constants";
import baseQuery from "./baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const childrenSlice = createApi({
  reducerPath: "childrenApi",
  baseQuery,
  endpoints: (builder) => ({
    getChildrenList: builder.query({
      query: ({
        page = 1,
        pageSize = 10,
        search = "",
        filter = {},
        sorting = {},
      }) => ({
        url: API_GET_CHILDREN_LIST(page, pageSize, search, filter, sorting),
        method: "GET",
      }),
    }),
    addChildren: builder.mutation({
      query: (newData) => ({
        url: API_ADD_CHILDREN,
        method: "POST",
        body: newData,
      }),
    }),
    getSingleChildren: builder.query({
      query: (id) => ({
        url: API_GET_CHILDREN_DETAIL(id),
        method: "GET",
      }),
    }),
    updateChildren: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: API_UPDATE_CHILDREN_DETAIL(id),
        method: "PUT",
        body: updatedData,
      }),
    }),
    deleteChildren: builder.mutation({
      query: (id) => ({
        url: API_DELETE_CHILDREN_DETAIL(id),
        method: "DELETE",
      }),
    }),

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
  }),
});

export const {
  useGetUserListQuery,
  useAddChildrenMutation,
  useGetSingleChildrenQuery,
  useGetChildrenListQuery,
  useUpdateChildrenMutation,
  useDeleteChildrenMutation,
} = childrenSlice;
