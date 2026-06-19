import { type JSX, type ReactNode } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "@/app/store/store";
import { AuthInitializer } from "./AuthInitializer";


interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps): JSX.Element {
  return (
    <Provider store={store}>
      <AuthInitializer>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </AuthInitializer>
    </Provider>
  );
}
