import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import {
  BarChart3,
  Home,
  Settings,
  User,
  MessageSquare,
  Users,
  Bell,
  FileText,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthStore } from "@/store/useAuthStore";
import { authApi } from "@/api/authApi";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed?: boolean;
}

export function Sidebar({ className, isCollapsed = false }: SidebarProps) {
  const { user, logout } = useAuthStore();
  const location = useLocation();
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

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <div
      className={cn(
        "flex flex-col h-screen border-r bg-background",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div
        className={cn(
          "flex h-16 items-center border-b px-4",
          isCollapsed ? "justify-center" : "justify-between"
        )}
      >
        {!isCollapsed ? (
          <Link to="/" className="text-xl font-bold text-primary">
            MySpace
          </Link>
        ) : (
          <Link to="/" className="flex items-center justify-center">
            <div className="h-8 w-8 bg-primary/20 text-primary rounded-full flex items-center justify-center font-medium">
              M
            </div>
          </Link>
        )}
      </div>
      <ScrollArea className="flex-1">
        <div className="px-2 py-4">
          <div className="space-y-1">
            <NavItem
              icon={Home}
              label="Dashboard"
              href="/"
              isActive={isActive("/")}
              isCollapsed={isCollapsed}
            />
            <NavItem
              icon={User}
              label="Profile"
              href="/profile"
              isActive={isActive("/profile")}
              isCollapsed={isCollapsed}
            />
            <NavItem
              icon={MessageSquare}
              label="Messages"
              href="/messages"
              isActive={isActive("/messages")}
              isCollapsed={isCollapsed}
            />
            <NavItem
              icon={Users}
              label="Friends"
              href="/friends"
              isActive={isActive("/friends")}
              isCollapsed={isCollapsed}
            />
            <NavItem
              icon={Bell}
              label="Notifications"
              href="/notifications"
              isActive={isActive("/notifications")}
              isCollapsed={isCollapsed}
            />
            <NavItem
              icon={FileText}
              label="Posts"
              href="/posts"
              isActive={isActive("/posts")}
              isCollapsed={isCollapsed}
            />
            <NavItem
              icon={BarChart3}
              label="Analytics"
              href="/analytics"
              isActive={isActive("/analytics")}
              isCollapsed={isCollapsed}
            />
            <NavItem
              icon={Settings}
              label="Settings"
              href="/settings"
              isActive={isActive("/settings")}
              isCollapsed={isCollapsed}
            />
            <NavItem
              icon={HelpCircle}
              label="Help"
              href="/help"
              isActive={isActive("/help")}
              isCollapsed={isCollapsed}
            />
          </div>
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <div
          className={cn(
            "flex flex-col gap-3",
            isCollapsed ? "items-center" : ""
          )}
        >
          <div
            className={cn(
              "flex items-center",
              isCollapsed ? "justify-center" : "gap-3"
            )}
          >
            {user?.profilePic ? (
              <img
                src={user.profilePic}
                alt={user.username}
                className={cn(
                  "rounded-full object-cover border border-border",
                  isCollapsed ? "h-8 w-8" : "h-10 w-10"
                )}
              />
            ) : (
              <div
                className={cn(
                  "bg-primary/20 text-primary rounded-full flex items-center justify-center font-medium",
                  isCollapsed ? "h-8 w-8" : "h-10 w-10"
                )}
              >
                {user?.username?.charAt(0).toUpperCase()}
              </div>
            )}
            {!isCollapsed && (
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.username}
                </p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size={isCollapsed ? "icon" : "sm"}
            onClick={handleLogout}
            className={cn(
              "text-muted-foreground hover:text-foreground",
              isCollapsed ? "h-8 w-8" : "w-full justify-start"
            )}
            disabled={logoutMutation.isPending}
          >
            <LogOut className={cn("h-4 w-4", isCollapsed ? "" : "mr-2")} />
            {!isCollapsed && (
              <span>
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive?: boolean;
  isCollapsed?: boolean;
}

function NavItem({
  icon: Icon,
  label,
  href,
  isActive,
  isCollapsed,
}: NavItemProps) {
  return (
    <Button
      asChild
      variant={isActive ? "secondary" : "ghost"}
      size={isCollapsed ? "icon" : "default"}
      className={cn("w-full justify-start", isCollapsed ? "h-10 w-10" : "px-2")}
    >
      <Link to={href}>
        <Icon className={cn("h-5 w-5", isCollapsed ? "" : "mr-2")} />
        {!isCollapsed && <span>{label}</span>}
      </Link>
    </Button>
  );
}
