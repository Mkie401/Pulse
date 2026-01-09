import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Terminal, ChevronRight, Hash } from 'lucide-react';
import { Message, User } from '../types';
import { CURRENT_USER, INITIAL_MESSAGES } from '../constants';
import { generateChatReply } from '../services/geminiService';

const ChatCard: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: CURRENT_USER,
      content: inputText,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    const userMsg = inputText;
    setInputText('');
    setIsTyping(true);

    try {
        const history = messages.map(m => `${m.sender.name}: ${m.content}`);
        const reply = await generateChatReply(history, userMsg);
        
        const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            sender: { id: 'ai', name: 'SYS_OP', avatar: '', status: 'online' },
            content: reply,
            timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
            isAi: true
        };
        
        setMessages(prev => [...prev, aiMessage]);
    } catch (e) {
        console.error(e);
    } finally {
        setIsTyping(false);
    }
  };

  return (
    <div className="bg-cyber-dark/80 border border-cyber-slate h-full flex flex-col clip-corner-both backdrop-blur-sm relative">
      {/* Decorative Scanline */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.3)_50%)] bg-[size:100%_4px] opacity-20"></div>

      {/* Header */}
      <div className="flex justify-between items-center p-5 border-b border-cyber-slate bg-cyber-black/40">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-neon-blue/20 border border-neon-blue text-neon-blue">
            <Hash size={18} />
          </div>
          <div>
            <h3 className="font-mono font-bold text-white tracking-widest text-lg">戰術指揮頻道</h3>
            <p className="text-neon-blue text-xs font-mono">ENCRYPTED // CHANNEL_01</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
            <span className="text-xs font-mono text-neon-green">ONLINE</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-4 p-5 custom-scrollbar" ref={scrollRef}>
        {messages.map((msg) => {
          const isMe = msg.sender.id === CURRENT_USER.id;
          const isAi = msg.isAi;
          
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-2 mb-1">
                 <span className={`text-[10px] font-mono uppercase tracking-wider ${isAi ? 'text-neon-purple' : 'text-slate-400'}`}>
                    {isAi ? 'SYSTEM_AI' : msg.sender.name} 
                 </span>
                 <span className="text-[10px] text-cyber-dim font-mono">[{msg.timestamp}]</span>
              </div>
              
              <div className="flex gap-2 max-w-[85%]">
                {!isMe && !isAi && (
                   <div className="w-1 bg-cyber-slate self-stretch"></div>
                )}
                
                <div 
                  className={`
                    p-3 font-mono text-sm border clip-corner-br relative
                    ${isMe 
                      ? 'bg-neon-blue/10 border-neon-blue text-white' 
                      : isAi 
                        ? 'bg-neon-purple/10 border-neon-purple text-pink-100' 
                        : 'bg-cyber-slate/30 border-cyber-slate text-slate-300'
                    }
                  `}
                >
                  {isAi && <Terminal size={12} className="absolute -top-2 -left-2 bg-cyber-black text-neon-purple border border-neon-purple p-0.5" />}
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}
        {isTyping && (
             <div className="flex items-center gap-2 ml-2">
                 <span className="text-neon-purple text-xs font-mono animate-pulse">SYSTEM_ANALYZING...</span>
             </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-cyber-slate bg-cyber-black/60">
        <div className="relative flex items-center">
          <ChevronRight size={20} className="absolute left-3 text-neon-blue animate-pulse" />
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="輸入指令..."
            className="w-full bg-cyber-dark border border-cyber-slate py-3 pl-10 pr-12 focus:outline-none focus:border-neon-blue focus:shadow-neon-blue text-white font-mono placeholder-slate-600 transition-all clip-corner-br"
          />
          <button 
            onClick={handleSend}
            className="absolute right-2 p-1.5 text-cyber-dark bg-neon-blue hover:bg-white transition-colors clip-corner-br"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatCard;