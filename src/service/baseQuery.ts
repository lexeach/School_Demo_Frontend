import { apiUrl } from "../config";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: apiUrl,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    headers.set("Accept", "application/json");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  // const token = localStorage.getItem("token");
  // if (!token) {
  //   window.location.href = "/auth/login";
  //   return;
  // }
  const result = await baseQuery(args, api, extraOptions);
  // console.log("args-----",args,"----", api,  "aaaaaa-----" , extraOptions)
  if (result.error && result.error.status === 401) {
    localStorage.removeItem("token");
    window.location.reload();
  }
  return result;
};

export default baseQueryWithReauth;
