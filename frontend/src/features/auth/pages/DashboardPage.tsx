import type { JSX } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Link } from "react-router-dom";

export function DashboardPage(): JSX.Element {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <header className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Welcome to ImgGallery
          </h1>
          <p className="mt-2 text-muted-foreground">
            Arrange your photos here.
          </p>

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

        <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {["Images", "Albums"].map((title) => (
            <Link
              key={title}
              to="/images"
              className="group block rounded-xl border border-dashed border-border bg-card/50 p-6 transition hover:border-primary/50 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <h2 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                {title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                View and manage your {title.toLowerCase()}.
              </p>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
