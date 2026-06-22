import type { JSX } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import { TopBar } from "@/shared/components/layout/TopBar";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { DashboardPage } from "@/features/auth/pages/DashboardPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { AlbumDetailsPage } from "@/features/images/pages/AlbumDetailsPage";
import { ImagesPage } from "@/features/images/pages/ImagesPage";
import { ResetPasswordPage } from "@/features/auth/pages/ResetPasswordPage";

export function AppRouter(): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <TopBar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
                <ResetPasswordPage />
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/images"
            element={
              <ProtectedRoute>
                <ImagesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/images/:batchId"
            element={
              <ProtectedRoute>
                <AlbumDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}
