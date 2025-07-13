import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ChatListItem } from "@/components/ChatListItem";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ChatSidebarProps {
  chats: Array<{
    id: string;
    name: string;
    lastMessage: string;
    avatar: string;
    unreadCount?: number;
  }>;
  selectedChatId: string;
  onSelectChat: (id: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function ChatSidebar({
  chats,
  selectedChatId,
  onSelectChat,
  open,
  setOpen,
}: ChatSidebarProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // Mobile drawer toggle
  const handleDrawer = () => setOpen(!open);

  return (
    <>
      {/* Mobile Hamburger */}
      {/* (Removed, now handled in ChatPage) */}
      {/* Overlay for mobile drawer */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-50 md:hidden"
            onClick={handleDrawer}
            aria-label="Close chat sidebar overlay"
          />
        </>
      )}
      {!open &&
        typeof window !== "undefined" &&
        (document.body.style.overflow = "")}
      {/* Sidebar */}
      <aside
        className={`
          fixed md:static top-0 left-0 ${
            open ? "z-50" : "z-40"
          } h-full w-72 min-w-[220px] max-w-xs border-r border-border bg-card flex flex-col transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
        aria-label="Chat sidebar"
      >
        <div className="flex items-center justify-between px-6 py-4 min-h-[5rem] border-b border-border gap-2">
          {/* User info button */}
          <Button
            variant="ghost"
            className="flex items-center gap-2 px-2 py-1"
            aria-label="Go to profile settings"
            onClick={() => navigate("/settings")}
          >
            <Avatar>
              <AvatarImage src={user?.profilePic || ""} />
              <AvatarFallback>
                {user?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-sm truncate max-w-[100px]">
              {user?.username || "User"}
            </span>
          </Button>
          {/* Dropdown menu button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open user menu"
                className="ml-1"
              >
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
              <DropdownMenuItem asChild>
                <ThemeToggle menuMode />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <ScrollArea className="flex-1">
          <div className="py-2 space-y-1">
            {chats.length === 0 ? (
              <div className="text-muted-foreground text-center py-8 text-sm">
                No chats yet.
              </div>
            ) : (
              chats.map((chat) => (
                <div className="relative" key={chat.id}>
                  <ChatListItem
                    chat={chat}
                    selected={chat.id === selectedChatId}
                    onClick={() => {
                      onSelectChat(chat.id);
                      setOpen(false); // close drawer on mobile
                    }}
                  />
                  {/* Unread badge */}
                  {chat.unreadCount && chat.unreadCount > 0 && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs font-semibold shadow">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </aside>
    </>
  );
}
