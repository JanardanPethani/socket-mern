import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: { id: string; sender: string; text: string; timestamp: string };
  isMe: boolean;
}

export function ChatMessage({ message, isMe }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex flex-col max-w-[70%] mb-2",
        isMe ? "ml-auto items-end" : "items-start"
      )}
    >
      <div
        className={cn(
          "rounded-lg px-4 py-2 text-sm shadow-sm",
          isMe
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-muted text-foreground rounded-bl-none"
        )}
      >
        {message.text}
      </div>
      <span className="text-xs text-muted-foreground mt-1">
        {message.timestamp}
      </span>
    </div>
  );
}
