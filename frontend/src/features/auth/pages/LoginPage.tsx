import { useEffect, useState, type JSX } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/app/store/hooks";
import { loginThunk } from "@/features/auth/store/authThunks";
import { clearAuthError } from "@/features/auth/store/authSlice";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/loginSchema";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { FormField } from "@/shared/components/ui/FormField";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface LocationState {
  from?: { pathname?: string };
}

export function LoginPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const state = location.state as LocationState | null;
  const redirectTo = state?.from?.pathname ?? "/dashboard";

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    const result = await dispatch(loginThunk(values));
    if (loginThunk.fulfilled.match(result)) {
      navigate(redirectTo, { replace: true });
    }
  });

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col justify-center px-4 py-10">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to continue to ImgGallery.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-6 flex flex-col gap-4"
          noValidate
        >
          <FormField
            id="email"
            label="Email"
            error={errors.email?.message}
            required
          >
            <Input
              id="email"
              type="email"
              autoComplete="email"
              hasError={Boolean(errors.email)}
              placeholder="you@example.com"
              {...register("email")}
            />
          </FormField>

          <FormField
            id="password"
            label="Password"
            error={errors.password?.message}
            required
          >
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                hasError={Boolean(errors.password)}
                placeholder="••••••••"
                className="pr-10"
                {...register("password")}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
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
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-primary hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
