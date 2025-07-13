import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function MessageInput() {
  const [value, setValue] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    // TODO: send message logic
    setValue("");
  };

  return (
    <form className="flex gap-2" onSubmit={handleSend}>
      <Input
        className="flex-1"
        placeholder="Type a message..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoComplete="off"
      />
      <Button type="submit" disabled={!value.trim()}>
        Send
      </Button>
    </form>
  );
}
