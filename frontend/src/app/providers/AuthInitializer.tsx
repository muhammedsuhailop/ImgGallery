import { useEffect, type JSX, type ReactNode } from "react";
import { useAppDispatch } from "@/app/store/hooks";
import { initializeAuthThunk } from "@/features/auth/store/authThunks";

interface AuthInitializerProps {
  children: ReactNode;
}

export function AuthInitializer({
  children,
}: AuthInitializerProps): JSX.Element {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(initializeAuthThunk());
  }, [dispatch]);

  return <>{children}</>;
}
