import { ChatMessage } from "@/components/ChatMessage";
import { MessageInput } from "@/components/MessageInput";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatViewProps {
  chat: { id: string; name: string; avatar: string };
  messages: Array<{
    id: string;
    sender: string;
    text: string;
    timestamp: string;
  }>;
}

export function ChatView({ chat, messages }: ChatViewProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card/80">
        <img
          src={chat.avatar}
          alt={chat.name}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div>
          <div className="font-semibold text-base">{chat.name}</div>
        </div>
      </div>
      <ScrollArea className="flex-1 px-4 py-2 space-y-2 bg-background">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} isMe={msg.sender === "me"} />
        ))}
      </ScrollArea>
      <div className="p-4 border-t border-border bg-card/80">
        <MessageInput />
      </div>
    </div>
  );
}
