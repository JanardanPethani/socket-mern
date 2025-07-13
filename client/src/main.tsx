import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import { QueryProvider } from "./lib/QueryProvider";
import { ThemeProvider } from "./components/ThemeProvider";
import App from "./App";
import { MainLayout } from "./layouts/MainLayout";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SettingsPage } from "./pages/SettingsPage";
import { ProtectedRoute, AuthRoute } from "./components/ProtectedRoute";
import { AuthLayout } from "./layouts/AuthLayout";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";

const router = createBrowserRouter([
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          {
            element: <ProtectedRoute />,
            children: [
              {
                index: true,
                element: <HomePage />,
              },
              {
                path: "profile",
                element: <ProfilePage />,
              },
              {
                path: "settings",
                element: <SettingsPage />,
              },
              {
                path: "friends",
                element: (
                  <div className="p-4 bg-card rounded-lg border border-border">
                    <h1 className="text-2xl font-bold mb-4">Friends</h1>
                    <p className="text-muted-foreground">
                      This feature is coming soon.
                    </p>
                  </div>
                ),
              },
              {
                path: "notifications",
                element: (
                  <div className="p-4 bg-card rounded-lg border border-border">
                    <h1 className="text-2xl font-bold mb-4">Notifications</h1>
                    <p className="text-muted-foreground">
                      This feature is coming soon.
                    </p>
                  </div>
                ),
              },
              {
                path: "posts",
                element: (
                  <div className="p-4 bg-card rounded-lg border border-border">
                    <h1 className="text-2xl font-bold mb-4">Posts</h1>
                    <p className="text-muted-foreground">
                      This feature is coming soon.
                    </p>
                  </div>
                ),
              },
              {
                path: "analytics",
                element: (
                  <div className="p-4 bg-card rounded-lg border border-border">
                    <h1 className="text-2xl font-bold mb-4">Analytics</h1>
                    <p className="text-muted-foreground">
                      This feature is coming soon.
                    </p>
                  </div>
                ),
              },
              {
                path: "help",
                element: (
                  <div className="p-4 bg-card rounded-lg border border-border">
                    <h1 className="text-2xl font-bold mb-4">Help Center</h1>
                    <p className="text-muted-foreground">
                      This feature is coming soon.
                    </p>
                  </div>
                ),
              },
            ],
          },
        ],
      },
      {
        path: "auth",
        element: <AuthLayout />,
        children: [
          {
            element: <AuthRoute />,
            children: [
              {
                path: "login",
                element: <LoginPage />,
              },
              {
                path: "signup",
                element: <SignupPage />,
              },
              {
                path: "forgot-password",
                element: <ForgotPasswordPage />,
              },
              {
                path: "reset-password",
                element: <ResetPasswordPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="myspace-theme">
      <QueryProvider>
        <RouterProvider router={router} />
      </QueryProvider>
    </ThemeProvider>
  </StrictMode>
);
