import { createBrowserRouter } from "react-router-dom";

import { MainLayout } from "@/app/layouts/MainLayout";
import { AuthLayout } from "@/app/layouts/AuthLayout";

import { FeedPage } from "@/features/posts/pages/FeedPage";
import { PostDetailPage } from "@/features/posts/pages/PostDetailPage";

import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { VerifyEmailPage } from "@/features/auth/pages/VerifyEmailPage";
import { VerifyEmailRequiredPage } from "@/features/auth/pages/VerifyEmailRequiredPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";
import ChangePasswordPage from "@/features/auth/pages/ChangePasswordPage";

import MyProfilePage from "@/features/profile/pages/MyProfilePage";
import UserProfilePage from "@/features/profile/pages/UserProfilePage";

import ProtectedRoute from "./protected-route";
import PublicRoute from "./public-route";
import { ExplorePage } from "@/features/explore/pages/ExplorePage";
import ChatsPage from "@/features/chat/pages/ChatPage";

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: "/login", element: <LoginPage /> },
          { path: "/register", element: <RegisterPage /> },
          { path: "/verify-email", element: <VerifyEmailPage /> },
          { path: "/verify-email/:token", element: <VerifyEmailPage /> },
          { path: "/verify-required", element: <VerifyEmailRequiredPage /> },
          { path: "/forgot-password", element: <ForgotPasswordPage /> },
          { path: "/reset-password", element: <ResetPasswordPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "/", element: <FeedPage /> },
          { path: "/p/:postId", element: <PostDetailPage /> },

          { path: "/profile", element: <MyProfilePage /> },
          { path: "/users/:userId", element: <UserProfilePage /> },
          { path: "/explore", element: <ExplorePage /> },
          { path: "/chats", element: <ChatsPage /> },
          { path: "/change-password", element: <ChangePasswordPage /> },
        ],
      },
    ],
  },
]);
