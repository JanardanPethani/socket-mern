import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuthStore } from "@/store/useAuthStore";
import { authApi } from "@/api/authApi";
import { cn } from "@/lib/utils";

export function DashboardLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all duration-100 lg:hidden",
          isMobileSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-full max-w-xs transition-transform duration-200 ease-in-out",
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <Sidebar />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar isCollapsed={isSidebarCollapsed} />
      </div>

      {/* Main content */}
      <div
        className={cn(
          "flex flex-col min-h-screen transition-all duration-200 ease-in-out",
          isSidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1">
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-foreground"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="h-4 w-4" />
              <span>
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </span>
            </Button>
            <div className="flex items-center gap-2">
              {user?.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user.username}
                  className="h-8 w-8 rounded-full object-cover border border-border"
                />
              ) : (
                <div className="h-8 w-8 bg-primary/20 text-primary rounded-full flex items-center justify-center font-medium">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-sm font-medium hidden md:inline">
                {user?.username}
              </span>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t py-4 px-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} MySpace. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">Built with ❤️</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
