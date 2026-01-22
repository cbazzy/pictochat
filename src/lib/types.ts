export interface SystemMessage {
    id: string;
    type: 'system';
    content: string;
    timestamp: number;
}

export interface UserMessage {
    id: string;
    type: 'user';
    author: string;
    text?: string;
    drawing?: string; // base64 data url
    timestamp: number;
    color?: string; // Author's color (e.g. ds-blue)
}

export type Message = SystemMessage | UserMessage;
