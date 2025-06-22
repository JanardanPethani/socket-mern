import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Menu, X } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { authApi } from "@/api/authApi";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout();
      navigate("/auth/login");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <header className="bg-card border-b border-border shadow-sm py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className={cn(
            "text-2xl font-heading font-bold",
            isActive("/")
              ? "text-primary"
              : "text-primary/80 hover:text-primary"
          )}
        >
          MySpace
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex gap-4 items-center">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <Link
                to="/"
                className={cn(
                  "transition-colors",
                  isActive("/")
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                Home
              </Link>
              <Link
                to="/profile"
                className={cn(
                  "transition-colors",
                  isActive("/profile")
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                Profile
              </Link>
              <Link
                to="/settings"
                className={cn(
                  "transition-colors",
                  isActive("/settings")
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                Settings
              </Link>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </Button>
              <div className="flex items-center gap-2 ml-2">
                {user?.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt={user.username}
                    className="h-10 w-10 rounded-full object-cover border-2 border-border"
                  />
                ) : (
                  <div className="h-10 w-10 bg-primary/20 text-primary rounded-full flex items-center justify-center font-medium">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-foreground font-medium">
                  {user?.username}
                </span>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/auth/login"
                className={cn(
                  "transition-colors",
                  isActive("/auth/login")
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                Login
              </Link>
              <Button asChild variant="default" size="sm">
                <Link to="/auth/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </nav>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
          <div className="container mx-auto py-4">
            <div className="flex justify-between items-center mb-8">
              <Link
                to="/"
                className="text-2xl font-heading font-bold text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                MySpace
              </Link>
              <button
                className="p-2 text-foreground"
                onClick={toggleMenu}
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex flex-col gap-6 items-center">
              <ThemeToggle />

              {isAuthenticated ? (
                <>
                  <div className="flex flex-col items-center gap-2 mb-4">
                    {user?.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt={user.username}
                        className="h-20 w-20 rounded-full object-cover border-2 border-border"
                      />
                    ) : (
                      <div className="h-20 w-20 bg-primary/20 text-primary rounded-full flex items-center justify-center text-2xl font-medium">
                        {user?.username?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-foreground font-medium text-lg">
                      {user?.username}
                    </span>
                  </div>

                  <Link
                    to="/"
                    className={cn(
                      "text-lg transition-colors",
                      isActive("/")
                        ? "text-primary font-medium"
                        : "text-foreground hover:text-primary"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    to="/profile"
                    className={cn(
                      "text-lg transition-colors",
                      isActive("/profile")
                        ? "text-primary font-medium"
                        : "text-foreground hover:text-primary"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className={cn(
                      "text-lg transition-colors",
                      isActive("/settings")
                        ? "text-primary font-medium"
                        : "text-foreground hover:text-primary"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <Button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    variant="ghost"
                    size="lg"
                    className="text-muted-foreground hover:text-foreground w-full"
                    disabled={logoutMutation.isPending}
                  >
                    {logoutMutation.isPending ? "Logging out..." : "Logout"}
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth/login"
                    className={cn(
                      "text-lg transition-colors",
                      isActive("/auth/login")
                        ? "text-primary font-medium"
                        : "text-foreground hover:text-primary"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Button
                    asChild
                    variant="default"
                    size="lg"
                    className="w-full"
                  >
                    <Link
                      to="/auth/signup"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
