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

interface ChatSidebarProps {
  chats: Array<{
    id: string;
    name: string;
    lastMessage: string;
    avatar: string;
  }>;
  selectedChatId: string;
  onSelectChat: (id: string) => void;
}

export function ChatSidebar({
  chats,
  selectedChatId,
  onSelectChat,
}: ChatSidebarProps) {
  const { user, logout } = useAuthStore();

  return (
    <aside className="w-72 min-w-[220px] max-w-xs h-full border-r border-border bg-card flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-2 py-1"
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
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ThemeToggle />
      </div>
      <ScrollArea className="flex-1">
        <div className="py-2">
          {chats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              selected={chat.id === selectedChatId}
              onClick={() => onSelectChat(chat.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
