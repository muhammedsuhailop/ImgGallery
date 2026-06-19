import { useEffect, useState, type JSX } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/app/store/hooks";
import { registerThunk } from "@/features/auth/store/authThunks";
import { clearAuthError } from "@/features/auth/store/authSlice";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/schemas/registerSchema";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { FormField } from "@/shared/components/ui/FormField";
import { FiEye, FiEyeOff } from "react-icons/fi";

export function RegisterPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAuth();
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const { confirmPassword, ...payload } = values;

    const result = await dispatch(registerThunk(payload));

    if (registerThunk.fulfilled.match(result)) {
      setSuccess("Registration successful. You can now sign in.");
      setTimeout(() => navigate("/login", { replace: true }), 1200);
    }
  });

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col justify-center px-4 py-10">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Start organizing your image library in minutes.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-6 flex flex-col gap-4"
          noValidate
        >
          <FormField
            id="name"
            label="Full name"
            error={errors.name?.message}
            required
          >
            <Input
              id="name"
              type="text"
              autoComplete="name"
              hasError={Boolean(errors.name)}
              placeholder="Jane Doe"
              {...register("name")}
            />
          </FormField>

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
            id="phoneNumber"
            label="Phone number"
            error={errors.phoneNumber?.message}
            required
          >
            <Input
              id="phoneNumber"
              type="tel"
              autoComplete="tel"
              hasError={Boolean(errors.phoneNumber)}
              placeholder="+919876543210"
              {...register("phoneNumber")}
            />
          </FormField>

          <FormField
            id="password"
            label="Password"
            error={errors.password?.message}
            helperText="At least 8 characters with uppercase, lowercase and a number."
            required
          >
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
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

          <FormField
            id="confirmPassword"
            label="Confirm password"
            error={errors.confirmPassword?.message}
            required
          >
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                hasError={Boolean(errors.confirmPassword)}
                placeholder="••••••••"
                className="pr-10"
                {...register("confirmPassword")}
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

          {success ? (
            <div className="rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-foreground">
              {success}
            </div>
          ) : null}

          <Button
            type="submit"
            isLoading={isLoading || isSubmitting}
            fullWidth
            size="lg"
          >
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
