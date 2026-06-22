import type { JSX } from "react";
import { Spinner } from "./Spinner";

export function PageLoader(): JSX.Element {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
      <Spinner size="lg" />
    </div>
  );
}
