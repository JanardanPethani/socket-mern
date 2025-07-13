import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ChatListItemProps {
  chat: { id: string; name: string; lastMessage: string; avatar: string };
  selected: boolean;
  onClick: () => void;
}

export function ChatListItem({ chat, selected, onClick }: ChatListItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors rounded-lg outline-none",
        selected
          ? "bg-muted/70 dark:bg-primary/10 ring-2 ring-primary"
          : "hover:bg-muted/40 dark:hover:bg-primary/5 focus-visible:bg-muted/40 focus-visible:dark:bg-primary/5"
      )}
      onClick={onClick}
      tabIndex={0}
      aria-label={`Chat with ${chat.name}`}
      role="button"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
    >
      <Avatar>
        <AvatarImage src={chat.avatar} />
        <AvatarFallback>{chat.name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate text-foreground dark:text-white">
          {chat.name}
        </div>
        <div className="text-xs text-muted-foreground dark:text-gray-400 truncate">
          {chat.lastMessage}
        </div>
      </div>
    </div>
  );
}
