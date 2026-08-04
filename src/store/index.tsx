import LayoutReducer from "../slice/layoutSlice";
import { apiSlice } from "../service/apiSlice";
import authReducer from "../slice/authSlice";
import { configureStore } from "@reduxjs/toolkit";
import { paperSlice } from "@/service/paper";
import { childrenSlice } from "@/service/children";
import { userSlice } from "@/service/user";
import { subjectSlice } from "@/service/subject";
import { syllabusSlice } from "@/service/syllabus";
import { learningVerificationApi } from "@/service/learningVerification";

export const store = configureStore({
  reducer: {
    layout: LayoutReducer,
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [paperSlice.reducerPath]: paperSlice.reducer,
    [childrenSlice.reducerPath]: childrenSlice.reducer,
    [userSlice.reducerPath]: userSlice.reducer,
    [subjectSlice.reducerPath]: subjectSlice.reducer,
    [syllabusSlice.reducerPath]: syllabusSlice.reducer,
    [learningVerificationApi.reducerPath]: learningVerificationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiSlice.middleware,
      paperSlice.middleware,
      childrenSlice.middleware,
      userSlice.middleware,
      subjectSlice.middleware,
      syllabusSlice.middleware,
      learningVerificationApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
