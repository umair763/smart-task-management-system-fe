import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "./components/layout/main.layout";
import {
  LoginPage,
  RegisterPage,
  DashboardPage,
  LandingPage,
  NotFoundPage,
} from "./pages";

export const routes = createBrowserRouter([
  {
    path: "*",
    element: <NotFoundPage />,
  },
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <RegisterPage />,
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
    ],
  },
]);
