import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatView } from "@/components/ChatView";
import { useState } from "react";

export function ChatPage() {
  const [selectedChatId, setSelectedChatId] = useState("1");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-[100dvh] bg-background md:flex-row flex-col">
      {/* Sidebar overlays on mobile, static on desktop */}
      <ChatSidebar
        chats={[]}
        selectedChatId={selectedChatId}
        onSelectChat={setSelectedChatId}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />
      <div
        className={
          "flex-1 flex flex-col min-h-0 " +
          (sidebarOpen
            ? " pointer-events-none select-none md:pointer-events-auto md:select-auto"
            : "")
        }
      >
        <ChatView
          chat={{
            id: "1",
            name: "John Doe",
            avatar: "https://github.com/shadcn.png",
          }}
          messages={[]}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </div>
    </div>
  );
}

export default ChatPage;
