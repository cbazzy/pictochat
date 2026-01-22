"use client";

import { useRef, useState } from "react";
import { DrawingCanvas, DrawingCanvasRef } from "./DrawingCanvas";

interface BottomScreenProps {
    onSend: (data: { text?: string, drawing?: string }) => void;
}

export function BottomScreen({ onSend }: BottomScreenProps) {
    const canvasRef = useRef<DrawingCanvasRef>(null);
    const [text, setText] = useState("");

    const handleSend = () => {
        const drawing = canvasRef.current?.getDataURL();
        const isEmpty = canvasRef.current?.isEmpty();

        if (!text && (isEmpty || !drawing)) return;

        onSend({
            text: text || undefined,
            drawing: (!isEmpty && drawing) ? drawing : undefined
        });

        setText("");
        canvasRef.current?.clear();
    };

    return (
        <div className="w-full h-full flex flex-col bg-ds-bg relative p-1">
            {/* Keyboard/Input Placeholder - simple text for now */}
            <div className="flex gap-2 mb-1">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="flex-1 bg-white border border-gray-400 font-pixel px-2 py-1 text-lg outline-none focus:border-ds-blue"
                    placeholder="Type here..."
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSend();
                    }}
                />
                <button
                    onClick={handleSend}
                    className="px-4 bg-ds-blue text-white font-bold border-2 border-white shadow hover:bg-blue-700 active:translate-y-1"
                >
                    SEND
                </button>
            </div>

            {/* Drawing Area */}
            <div className="flex-1 relative border-2 border-gray-400 bg-white">
                <DrawingCanvas ref={canvasRef} className="w-full h-full" />
            </div>
        </div>
    );
}
