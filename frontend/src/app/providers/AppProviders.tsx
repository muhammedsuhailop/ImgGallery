import { useEffect, type JSX, type ReactNode } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "@/app/store/store";
import { useAppDispatch } from "@/app/store/hooks";
import { initializeAuthThunk } from "@/features/auth/store/authThunks";

function AuthBootstrapper({ children }: { children: ReactNode }): JSX.Element {
  const dispatch = useAppDispatch();
  useEffect(() => {
    void dispatch(initializeAuthThunk());
  }, [dispatch]);
  return <>{children}</>;
}

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps): JSX.Element {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthBootstrapper>{children}</AuthBootstrapper>
      </BrowserRouter>
    </Provider>
  );
}
