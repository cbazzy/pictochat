"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/MainLayout";
import { TopScreen } from "@/components/TopScreen";
import { BottomScreen } from "@/components/BottomScreen";
import { LoginScreen } from "@/components/LoginScreen";
import { Message } from "@/lib/types";

export default function Home() {
  const [hasJoined, setHasJoined] = useState(false);
  const [username, setUsername] = useState("");
  const [userColor, setUserColor] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  // Polling logic
  useEffect(() => {
    if (!hasJoined) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch('/api/messages');
        if (res.ok) {
          const data = await res.json();
          // Rudimentary diffing: just set it. React handles DOM key diffing efficiently enough for 50 items.
          setMessages(data);
        }
      } catch (error) {
        console.error("Polling error", error);
      }
    };

    fetchMessages(); // Initial fetch
    const interval = setInterval(fetchMessages, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [hasJoined]);


  const handleJoin = (name: string, color: string) => {
    setUsername(name);
    setUserColor(color);
    setHasJoined(true);
  };

  const handleSend = async (data: { text?: string, drawing?: string }) => {
    // Optimistic update
    const tempId = Date.now().toString();
    const newMessage: Message = {
      id: tempId,
      type: 'user',
      author: username,
      timestamp: Date.now(),
      text: data.text,
      drawing: data.drawing,
      color: userColor
    };

    setMessages(prev => [...prev, newMessage]);

    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMessage)
    });
  };

  if (!hasJoined) {
    return <LoginScreen onJoin={handleJoin} />;
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-ds-bg p-4 font-pixel">
      <MainLayout
        topScreen={<TopScreen messages={messages} />}
        bottomScreen={<BottomScreen onSend={handleSend} />}
      />
    </main>
  );
}
