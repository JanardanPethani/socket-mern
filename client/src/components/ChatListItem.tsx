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
        "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors",
        selected ? "bg-muted/70" : "hover:bg-muted/40"
      )}
      onClick={onClick}
    >
      <Avatar>
        <AvatarImage src={chat.avatar} />
        <AvatarFallback>{chat.name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{chat.name}</div>
        <div className="text-xs text-muted-foreground truncate">
          {chat.lastMessage}
        </div>
      </div>
    </div>
  );
}
