import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatView } from "@/components/ChatView";
import { useState } from "react";

export function ChatPage() {
  const [selectedChatId, setSelectedChatId] = useState("1");

  return (
    <div className="flex h-[100dvh] bg-background">
      <ChatSidebar
        chats={[]}
        selectedChatId={selectedChatId}
        onSelectChat={setSelectedChatId}
      />
      <div className="flex-1 flex flex-col">
        <ChatView
          chat={{
            id: "1",
            name: "John Doe",
            avatar: "https://github.com/shadcn.png",
          }}
          messages={[]}
        />
      </div>
    </div>
  );
}

export default ChatPage;
