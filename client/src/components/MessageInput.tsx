import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function MessageInput() {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    // TODO: send message logic
    setValue("");
  };

  return (
    <form
      className="flex gap-2 items-center w-full"
      onSubmit={handleSend}
      aria-label="Send message form"
      autoComplete="off"
    >
      <Input
        ref={inputRef}
        className="flex-1 rounded-full px-4 py-2 text-base bg-background border focus:ring-2 focus:ring-primary focus:border-primary transition-all"
        placeholder="Type a message..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Type your message"
        autoComplete="off"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            handleSend(e as unknown as React.FormEvent<HTMLFormElement>);
          }
        }}
      />
      <Button
        type="submit"
        disabled={!value.trim()}
        className="rounded-full px-6 py-2 font-semibold text-base shadow bg-primary hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
        aria-label="Send message"
      >
        Send
      </Button>
    </form>
  );
}
