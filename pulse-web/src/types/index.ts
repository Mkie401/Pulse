// src/types/index.ts
export interface Message {
    user_id: number;
    content: string;
    is_self: boolean;
}

export const ConnectionStatus = {
    Uninstantiated: '初始狀態',
    Connecting: '連線中...',
    Connected: '已連線',
    Disconnected: '斷線',
} as const;

// 這行是為了讓你也能把 ConnectionStatus 當作「型別」來用
export type ConnectionStatus = typeof ConnectionStatus[keyof typeof ConnectionStatus];