import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,

    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      headers.set("Content-Type", "application/json");

      return headers;
    },
  }),

  tagTypes: ["User"],

  endpoints: (builder) => ({
    /**
     * Register
     */
    register: builder.mutation({
      query: (body) => ({
        url: "/users/register",
        method: "POST",
        body,
      }),
    }),

    /**
     * Login
     */
    login: builder.mutation({
      query: (body) => ({
        url: "/users/login",
        method: "POST",
        body,
      }),
    }),

    /**
     * Get Logged In User
     */
    getProfile: builder.query({
      query: () => ({
        url: "/users/profile",
      }),
      providesTags: ["User"],
    }),

    /**
     * Update Profile
     */
    updateProfile: builder.mutation({
      query: (body) => ({
        url: "/users/profile",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = apiSlice;

export default apiSlice;