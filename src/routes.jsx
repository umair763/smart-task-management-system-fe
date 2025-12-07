import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "./components/layout/main.layout";
import {
  LoginPage,
  RegisterPage,
  DashboardPage,
  LandingPage,
  NotFoundPage,
  TasksPage,
  AnalyticsPage,
  Settings,
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
      {
        path: "/tasks",
        element: <TasksPage />,
      },
      {
        path: "/analytics",
        element: <AnalyticsPage />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
    ],
  },
]);
