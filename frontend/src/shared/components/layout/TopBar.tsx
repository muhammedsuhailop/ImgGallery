import { useState, type JSX } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAppDispatch } from "@/app/store/hooks";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { logoutThunk } from "@/features/auth/store/authThunks";
import { Button } from "@/shared/components/ui/Button";
import { ThemeToggle } from "@/shared/components/ui/ThemeToggle";

export function TopBar(): JSX.Element {
  const { isAuthenticated, user } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async (): Promise<void> => {
    await dispatch(logoutThunk());
    setMenuOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          to={isAuthenticated ? "/dashboard" : "/login"}
          className="text-lg font-semibold tracking-tight text-foreground"
        >
          ImgGallery
        </Link>

        {/* Desktop View Menu */}
        <nav className="hidden items-center gap-4 sm:flex">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground">
                {user?.name}
              </span>
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-foreground hover:text-primary"
              >
                Login
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
          <div className="border-l border-border pl-2">
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile View Header Layout triggers */}
        <div className="flex items-center gap-2 sm:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border"
          >
            {menuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Options Drawer */}
      {menuOpen ? (
        <div className="border-t border-border bg-background sm:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3">
            {isAuthenticated ? (
              <>
                <span className="truncate text-sm text-muted-foreground">
                  {user?.email}
                </span>
                <Button variant="secondary" onClick={handleLogout} fullWidth>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
