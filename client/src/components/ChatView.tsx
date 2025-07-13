import { ChatMessage } from "@/components/ChatMessage";
import { MessageInput } from "@/components/MessageInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface ChatViewProps {
  chat: { id: string; name: string; avatar: string };
  messages: Array<{
    id: string;
    sender: string;
    text: string;
    timestamp: string;
  }>;
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
}

export function ChatView({
  chat,
  messages,
  sidebarOpen,
  setSidebarOpen,
}: ChatViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-background" aria-label="Chat view">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card/80 sticky top-0 z-10 shadow-sm">
        <img
          src={chat.avatar}
          alt={chat.name}
          className="h-12 w-12 rounded-full object-cover border-2 border-primary shadow"
        />
        <div>
          <div className="font-semibold text-lg text-foreground leading-tight">
            {chat.name}
          </div>
          {/* Optional: online status */}
          {/* <span className="text-xs text-green-500">Online</span> */}
        </div>
        {/* Hamburger for mobile only, right side - always rendered for layout consistency */}
        <Button
          variant="outline"
          size="icon"
          aria-label="Open chat sidebar"
          className={`md:hidden ml-auto ${
            sidebarOpen ? "opacity-0 pointer-events-none" : ""
          }`}
          onClick={() => setSidebarOpen && setSidebarOpen(true)}
          tabIndex={sidebarOpen ? -1 : 0}
        >
          <Menu className="w-6 h-6" />
        </Button>
      </div>
      {/* Messages */}
      <ScrollArea
        className="flex-1 px-4 py-4 space-y-2 bg-background overflow-y-auto"
        aria-label="Messages list"
      >
        <div className="flex flex-col gap-2">
          {messages.length === 0 ? (
            <div className="text-muted-foreground text-center py-8 text-sm">
              No messages yet. Say hi!
            </div>
          ) : (
            messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                isMe={msg.sender === "me"}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      {/* Input */}
      <div className="p-4 border-t border-border bg-card/80 sticky bottom-0 z-10">
        <MessageInput />
      </div>
    </div>
  );
}
