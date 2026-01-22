"use client";

import { useEffect, useRef } from "react";
import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TopScreenProps {
    messages: Message[];
}

export function TopScreen({ messages }: TopScreenProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="w-full h-full p-2 overflow-y-auto flex flex-col gap-2 bg-white relative">
            <div className="grid grid-cols-[1fr] gap-2 pb-4">
                {messages.length === 0 ? (
                    <div className="text-gray-400 text-center mt-10">No messages yet...</div>
                ) : (
                    messages.map((msg, index) => (
                        <div key={msg.id} className={cn(
                            "border-2 rounded p-2",
                            index % 2 === 0 ? "bg-white border-blue-200" : "bg-gray-50 border-gray-200"
                        )}>
                            {/* Simplified rendering for now */}
                            {msg.type === 'system' ? (
                                <span className="text-gray-500 italic text-sm text-center block">{msg.content}</span>
                            ) : (
                                <div className="flex flex-col gap-1">
                                    <span className="font-bold text-ds-blue text-sm border-b border-dashed border-gray-300 pb-1">{msg.author}</span>
                                    {msg.text && <span className="text-lg leading-tight break-words">{msg.text}</span>}
                                    {msg.drawing && (
                                        <img src={msg.drawing} alt="drawing" className="max-w-full border border-gray-100 self-start" />
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
                <div ref={bottomRef} />
            </div>
        </div>
    );
}
