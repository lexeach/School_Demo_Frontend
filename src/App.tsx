import "./App.css";
import "./index.css";

import { RouterProvider, createHashRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Layout from "./Pages/Layout";
import Login from "./Pages/Auth/Login";
import Logo from "./UI/Container/Logo";
import ProtectedRoute from "./routes/protected";
import Register from "./Pages/Auth/Register";
import { RootState } from "./store";
import Paper from "./Pages/Paper/index";
import PaperView from "./Pages/Paper/view";
import Children from "./Pages/Children";
import Subject from "./Pages/Subject";
import Syllabus from "./Pages/Syllabus";
import Answer from "./Pages/Answer";
import Users from "./Pages/User";
import Dashboard from "./Pages/Dashboard";
import { loadTokenFromStorage } from "./slice/authSlice";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import ResultView from "./Pages/Paper/AnswerView";
import OtpExpire from "./Pages/Answer/expireOTP";
import ThankYouPage from "./Pages/Answer/thankyou";
import LogOut from "./Pages/Auth/LogOut";
import AnswerByStudent from "./Pages/Answer/answerByStudent";
import LearningView from "./Pages/Paper/LearningView";

const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/",
            element: <Dashboard />,
          },
          {
            path: "papers",
            element: <Paper />,
          },
          {
            path: "users",
            element: <Users />,
          },
          {
            path: "student-answer/:id",
            element: <AnswerByStudent />,
          },
          {
            path: "papers/:id",
            element: <PaperView />,
          },
          {
            path: "papers/learning/:id",
            element: <LearningView />,
          },
          {
            path: "children",
            element: <Children />,
          },
          {
            path: "subject",
            element: <Subject />,
          },
          {
            path: "syllabus",
            element: <Syllabus />,
          },
          {
            path: "*",
            element: <Dashboard />,
          },
          {
            path: "logout",
            element: <LogOut />,
          },
        ],
      },
    ],
  },
  {
    path: "/auth",
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "answer/:id",
        element: <Answer />,
      },
      {
        path: "result/:id",
        element: <ResultView />,
      },
      {
        path: "otp-expire",
        element: <OtpExpire />,
      },
      {
        path: "thankyou",
        element: <ThankYouPage />,
      },
    ],
  },
  {
    path: "/thankyou",
    element: <ThankYouPage />,
  },
]);

export default function App() {
  const { isAuthenticated } = useSelector(
  (state: RootState) => state.auth
);

// Optional: you can keep the Logo if you later add an auth loading state.

return <RouterProvider router={router} />;
}
