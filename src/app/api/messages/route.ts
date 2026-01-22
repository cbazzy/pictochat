import { NextResponse } from 'next/server';
import { Message } from '@/lib/types';

// NOTE: Global variables in Lambda are preserved between invocations 
// but are not guaranteed to persist indefinitely or across scale-out instances.
// For a demo/hackathon, this is perfectly fine. For production, use DB (Redis/Postgres).
let messages: Message[] = [];

export async function GET() {
    return NextResponse.json(messages);
}

export async function POST(request: Request) {
    const body = await request.json();

    // Basic Validation
    if (!body.type || !body.author) {
        return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }

    const newMessage: Message = {
        id: Date.now().toString() + Math.random().toString().slice(2, 5),
        timestamp: Date.now(),
        ...body
    };

    messages.push(newMessage);

    // Keep history manageable
    if (messages.length > 50) {
        messages = messages.slice(-50);
    }

    return NextResponse.json(newMessage);
}
