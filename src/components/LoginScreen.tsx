"use client";

import { useState } from "react";
import { Screen } from "./Screen";

interface LoginScreenProps {
    onJoin: (username: string, color: string) => void;
}

const COLORS = [
    { name: 'Red', value: '#e60012' },
    { name: 'Blue', value: '#2358C2' },
    { name: 'Green', value: '#00af41' },
    { name: 'Yellow', value: '#fecf00' },
    { name: 'Black', value: '#000000' },
];

export function LoginScreen({ onJoin }: LoginScreenProps) {
    const [name, setName] = useState("");
    const [selectedColor, setSelectedColor] = useState(COLORS[1].value);

    return (
        <div className="w-full h-full bg-ds-bg flex flex-col items-center justify-center p-4">
            <Screen className="h-auto aspect-auto p-8 flex flex-col gap-4 bg-white rounded-md border-4 border-ds-border">
                <h1 className="text-2xl font-bold text-center font-pixel">PictoChat Login</h1>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-bold">Username</label>
                    <input
                        className="border-2 border-gray-300 p-2 font-pixel text-lg"
                        value={name}
                        onChange={(e) => setName(e.target.value.slice(0, 10))}
                        placeholder="Enter name..."
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-bold">Color</label>
                    <div className="flex gap-2">
                        {COLORS.map(c => (
                            <button
                                key={c.name}
                                className={`w-8 h-8 rounded-full border-2 ${selectedColor === c.value ? 'border-black scale-110' : 'border-transparent'}`}
                                style={{ backgroundColor: c.value }}
                                onClick={() => setSelectedColor(c.value)}
                            />
                        ))}
                    </div>
                </div>

                <button
                    disabled={!name}
                    onClick={() => onJoin(name, selectedColor)}
                    className="mt-4 bg-ds-blue text-white p-2 font-bold disabled:opacity-50 border-2 border-white shadow active:translate-y-1"
                >
                    ENTER ROOM A
                </button>
            </Screen>
        </div>
    );
}
