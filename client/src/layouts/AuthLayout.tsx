import { Outlet } from "react-router-dom";
import SplitText from "@/components/animated/SplitText";
import { ThemeToggle } from "@/components/ThemeToggle";

export function AuthLayout() {
  return (
    <div className="fixed inset-0 grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:flex items-center justify-center bg-muted">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-6">
            <SplitText text="Welcome to MySpace" />
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Connect with friends, share moments, and discover new experiences in
            your personal space.
          </p>
        </div>
      </div>

      <div className="relative flex flex-col bg-background">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-md w-full px-6 max-h-screen overflow-y-auto py-8">
            <div className="md:hidden mb-8 text-center">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome to MySpace
              </h1>
              <p className="text-muted-foreground text-sm">
                Connect with friends and share your moments
              </p>
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
