import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: { id: string; sender: string; text: string; timestamp: string };
  isMe: boolean;
}

export function ChatMessage({ message, isMe }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex flex-col max-w-[75%] mb-1",
        isMe ? "ml-auto items-end" : "items-start"
      )}
      aria-label={isMe ? "Your message" : "Received message"}
    >
      <div
        className={cn(
          "rounded-2xl px-4 py-2 text-sm shadow-sm relative",
          isMe
            ? "bg-primary text-primary-foreground rounded-br-md border border-primary/70"
            : "bg-muted text-foreground rounded-bl-md border border-border"
        )}
        tabIndex={0}
        aria-live="polite"
      >
        {message.text}
      </div>
      <span
        className={cn(
          "text-xs mt-1 select-none",
          isMe ? "text-primary/70 pr-1" : "text-muted-foreground pl-1"
        )}
        aria-label="Message timestamp"
      >
        {message.timestamp}
      </span>
    </div>
  );
}
