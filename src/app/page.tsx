"use client";

import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { MainLayout } from "@/components/MainLayout";
import { TopScreen } from "@/components/TopScreen";
import { BottomScreen } from "@/components/BottomScreen";
import { LoginScreen } from "@/components/LoginScreen";
import { Message } from "@/lib/types";

let socket: Socket;

export default function Home() {
  const [hasJoined, setHasJoined] = useState(false);
  const [username, setUsername] = useState("");
  const [userColor, setUserColor] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Connect once mounted
    socket = io("http://localhost:4000");

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("init", (history: Message[]) => {
      setMessages(history);
    });

    socket.on("message", (msg: Message) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleJoin = (name: string, color: string) => {
    setUsername(name);
    setUserColor(color);
    setHasJoined(true);
  };

  const handleSend = (data: { text?: string, drawing?: string }) => {
    const newMessage = {
      id: Date.now().toString(), // Server can replace ID
      type: 'user',
      author: username,
      // timestamp handled by server basically
      text: data.text,
      drawing: data.drawing,
      color: userColor
    };
    // Optimistic updat? Or wait for server echo? 
    // PictoChat is local wifi so fast. Let's wait for server echo for simplicity 
    // to avoid dupes if we also listen to broadcast.
    socket.emit("message", newMessage);
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
