import type { JSX } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function DashboardPage(): JSX.Element {
  const { user } = useAuth();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <header className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Welcome to ImgGallery
        </h1>
        <p className="mt-2 text-muted-foreground">Arrage you photos here.</p>

        {user ? (
          <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-background p-4">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Name
              </dt>
              <dd className="mt-1 text-sm font-medium text-foreground">
                {user.name}
              </dd>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Email
              </dt>
              <dd className="mt-1 text-sm font-medium text-foreground">
                {user.email}
              </dd>
            </div>
          </dl>
        ) : null}
      </header>

      <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {["Images", "Uploads", "Batches", "Albums", "Search", "Admin"].map(
          (title) => (
            <div
              key={title}
              className="rounded-xl border border-dashed border-border bg-card/50 p-6"
            >
              <h2 className="text-lg font-medium text-foreground">{title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">Coming soon.</p>
            </div>
          ),
        )}
      </section>
    </div>
  );
}
