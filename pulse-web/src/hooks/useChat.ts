// src/hooks/useChat.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { ConnectionStatus } from '../types';
import type { Message } from '../types';

export const useChat = (url: string) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.Uninstantiated);
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        setStatus(ConnectionStatus.Connecting);
        const socket = new WebSocket(url);
        socketRef.current = socket;

        socket.onopen = () => {
            console.log('WebSocket 連線成功！');
            setStatus(ConnectionStatus.Connected);
        };

        socket.onmessage = (event) => {
            const rawText = event.data as string;
            console.log("收到訊息:", rawText);

            // 暫時處理邏輯：
            // 因為目前後端回傳的是純文字 "有人說: ...", 我們暫時把它都當作「對方」發的
            // 等之後後端改成 JSON 格式，這裡就能判斷 is_self 了
            const newMessage: Message = {
                user_id: 0,
                content: rawText,
                is_self: false, // 目前全部顯示在左邊 (灰色)
            };

            setMessages((prev) => [...prev, newMessage]);
        };

        socket.onclose = () => {
            setStatus(ConnectionStatus.Disconnected);
        };

        return () => {
            socket.close();
        };
    }, [url]);

    const sendMessage = useCallback((content: string) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(content);
        }
    }, []);

    return { messages, status, sendMessage };
};