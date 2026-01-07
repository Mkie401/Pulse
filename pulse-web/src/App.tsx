// src/App.tsx
import { useState, useEffect, useRef } from 'react';
import { useChat } from './hooks/useChat';
import { ConnectionStatus } from './types';

// 設定你的測試網址 (記得 user_id=1001)
// 注意：因為你的網域有 SSL，所以要用 wss://
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const host = window.location.host; // 這會自動抓到 api.ecooikos.com 或 localhost:5173

// 組合起來：wss://api.ecooikos.com/ws?user_id=...
// 注意：因為我們在 vite.config.ts 設定了 proxy，所以連到這裡會被轉去 3000
const randomId = Math.floor(Math.random() * 100000);
const WS_URL = `${protocol}//${host}/ws?user_id=${randomId}`;

function App() {
    const { messages, status, sendMessage } = useChat(WS_URL);
    const [inputValue, setInputValue] = useState('');

    // 自動捲動到底部的 ref
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim()) return;
        sendMessage(inputValue);
        setInputValue('');
    };

    return (
        // 外層容器：深色背景，全螢幕高度
        <div className="flex flex-col h-screen bg-gray-900 text-white font-sans overflow-hidden">

            {/* 頂部導覽列 */}
            <div className="p-4 bg-gray-800 shadow-lg border-b border-gray-700 flex justify-between items-center z-10">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                    Pulse Chat
                </h1>
                <div className="flex items-center gap-2">
                    {/* 狀態燈號 */}
                    <span className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        status === ConnectionStatus.Connected ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500'
                    }`}></span>
                    <span className="text-sm text-gray-300">{status}</span>
                </div>
            </div>

            {/* 中間：訊息顯示區 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-60">
                        <p className="text-lg">尚無訊息</p>
                        <p className="text-sm">試著說點什麼吧！</p>
                    </div>
                )}

                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.is_self ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                        <div className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-md break-words text-sm md:text-base ${
                            msg.is_self
                                ? 'bg-blue-600 text-white rounded-tr-none'
                                : 'bg-gray-700 text-gray-100 rounded-tl-none'
                        }`}>
                            <p>{msg.content}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* 底部：輸入框 */}
            <div className="p-4 bg-gray-800 border-t border-gray-700">
                <div className="max-w-4xl mx-auto flex gap-3">
                    <input
                        type="text"
                        className="flex-1 bg-gray-700 text-white rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-400"
                        placeholder="輸入訊息..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        disabled={status !== ConnectionStatus.Connected}
                    />
                    <button
                        onClick={handleSend}
                        disabled={status !== ConnectionStatus.Connected}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-full font-medium transition-all shadow-lg active:scale-95 whitespace-nowrap"
                    >
                        送出
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;