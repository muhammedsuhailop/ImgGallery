import { useEffect, useState, type JSX } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/app/store/hooks";
import { resetPasswordThunk } from "@/features/auth/store/authThunks";
import { clearAuthError } from "@/features/auth/store/authSlice";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/features/auth/schemas/resetPasswordSchema";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { FormField } from "@/shared/components/ui/FormField";
import { FiEye, FiEyeOff } from "react-icons/fi";

export function ResetPasswordPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAuth();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const result = await dispatch(
      resetPasswordThunk({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }),
    );

    if (resetPasswordThunk.fulfilled.match(result)) {
      setIsSuccess(true);
    }
  });

  if (isSuccess) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col justify-center px-4 py-10">
        <div className="rounded-xl border border-border bg-card p-6 text-center shadow-sm sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Password Updated
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Password reset successful. Please login again with your new
            credentials.
          </p>
          <Button
            className="mt-6"
            fullWidth
            onClick={() => navigate("/login", { replace: true })}
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col justify-center px-4 py-10">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Reset Password
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ensure security updates by changing your login passwords periodically.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-6 flex flex-col gap-4"
          noValidate
        >
          {/* Current Password Field */}
          <FormField
            id="currentPassword"
            label="Current Password"
            error={errors.currentPassword?.message}
            required
          >
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                autoComplete="current-password"
                hasError={Boolean(errors.currentPassword)}
                placeholder="••••••••"
                className="pr-10"
                {...register("currentPassword")}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                aria-label={
                  showCurrentPassword ? "Hide password" : "Show password"
                }
              >
                {showCurrentPassword ? (
                  <FiEyeOff size={18} />
                ) : (
                  <FiEye size={18} />
                )}
              </button>
            </div>
          </FormField>

          {/* New Password Field */}
          <FormField
            id="newPassword"
            label="New Password"
            error={errors.newPassword?.message}
            required
          >
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                autoComplete="new-password"
                hasError={Boolean(errors.newPassword)}
                placeholder="••••••••"
                className="pr-10"
                {...register("newPassword")}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </FormField>

          {/* Confirm New Password Field */}
          <FormField
            id="confirmNewPassword"
            label="Confirm New Password"
            error={errors.confirmNewPassword?.message}
            required
          >
            <div className="relative">
              <Input
                id="confirmNewPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                hasError={Boolean(errors.confirmNewPassword)}
                placeholder="••••••••"
                className="pr-10"
                {...register("confirmNewPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <FiEyeOff size={18} />
                ) : (
                  <FiEye size={18} />
                )}
              </button>
            </div>
          </FormField>

          {error ? (
            <div
              role="alert"
              className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </div>
          ) : null}

          <Button
            type="submit"
            isLoading={isLoading || isSubmitting}
            fullWidth
            size="lg"
          >
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
}
