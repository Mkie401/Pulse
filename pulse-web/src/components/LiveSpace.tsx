import React, { useEffect, useState } from 'react';
import { Mic, Headphones, Settings, Radio, Activity } from 'lucide-react';
import { MOCK_USERS } from '../constants';

const LiveSpace: React.FC = () => {
  const [activeSpeakers, setActiveSpeakers] = useState<number[]>([1, 3]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSpeakers([
        Math.floor(Math.random() * 4),
        Math.floor(Math.random() * 4)
      ]);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-cyber-dark/80 border border-cyber-slate relative h-[28rem] flex flex-col clip-corner-both backdrop-blur-sm group overflow-hidden">
      {/* Ambient Grid Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      
      {/* Decorative Corner Lines */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-neon-blue"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-neon-blue"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-neon-blue"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-neon-blue"></div>

      {/* Header */}
      <div className="flex justify-between items-start z-10 p-6 border-b border-cyber-slate/50 bg-cyber-black/30">
        <div>
          <h2 className="text-xl font-mono font-bold flex items-center gap-3 text-white tracking-widest uppercase">
            <Radio size={18} className="text-neon-blue animate-pulse" />
            語音大廳 <span className="text-neon-blue text-xs border border-neon-blue px-1 ml-2">LIVE</span>
          </h2>
          <p className="text-slate-400 font-mono text-xs mt-1 tracking-wider">FREQ: 104.5 // 4 UNITS ACTIVE</p>
        </div>
        <button className="p-2 text-slate-400 hover:text-neon-blue hover:bg-neon-blue/10 transition-colors">
          <Settings size={20} />
        </button>
      </div>

      {/* Main Visualizer Area */}
      <div className="flex-1 relative flex items-center justify-center z-10 my-4">
        
        {/* Central HUD Ring */}
        <div className="absolute w-64 h-64 border border-cyber-slate rounded-full flex items-center justify-center opacity-30 animate-spin-slow border-dashed"></div>
        <div className="absolute w-48 h-48 border border-neon-blue/30 rounded-full flex items-center justify-center"></div>

        {/* Digital Waveform Bars (Simulated) */}
        <div className="flex items-end justify-center gap-1 h-20">
            {[...Array(12)].map((_, i) => (
                <div 
                    key={i} 
                    className="w-2 bg-neon-blue shadow-neon-blue transition-all duration-150 ease-out"
                    style={{ 
                        height: `${Math.random() * 100}%`,
                        opacity: Math.random() > 0.5 ? 0.8 : 0.3 
                    }}
                ></div>
            ))}
        </div>

        {/* Floating Avatars in Hex Layout */}
        {MOCK_USERS.map((user, index) => {
          const angle = (index / MOCK_USERS.length) * 2 * Math.PI - (Math.PI / 4); // Offset
          const radius = 140;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          const isSpeaking = activeSpeakers.includes(index);

          return (
            <div 
              key={user.id}
              className="absolute transition-all duration-500"
              style={{ transform: `translate(${x}px, ${y}px)` }}
            >
              <div className="flex flex-col items-center gap-2">
                {/* Avatar Frame */}
                <div className={`
                    relative p-1 transition-all duration-200 clip-corner-tl
                    ${isSpeaking ? 'bg-neon-blue shadow-neon-blue scale-110' : 'bg-cyber-slate'}
                `}>
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-12 h-12 bg-black object-cover clip-corner-tl opacity-90"
                    />
                    {isSpeaking && <div className="absolute -top-1 -right-1 w-2 h-2 bg-neon-green shadow-neon-green"></div>}
                </div>
                
                {/* Nameplate */}
                <div className="bg-cyber-black/80 border border-cyber-slate px-2 py-0.5 text-[10px] font-mono text-neon-blue tracking-wider uppercase">
                  {user.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Controls */}
      <div className="flex justify-center gap-4 z-10 p-6 bg-cyber-black/50 border-t border-cyber-slate/50">
        <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-neon-blue/10 border border-neon-blue text-neon-blue font-bold tracking-widest hover:bg-neon-blue hover:text-black transition-all clip-corner-br group">
          <span className="group-hover:animate-pulse">連結通訊</span>
        </button>
        <button className="p-3 bg-cyber-slate/20 border border-cyber-slate text-slate-400 hover:text-white hover:border-white transition-all clip-corner-br">
          <Headphones size={20} />
        </button>
        <button className="p-3 bg-cyber-slate/20 border border-cyber-slate text-slate-400 hover:text-neon-red hover:border-neon-red hover:shadow-neon-red transition-all clip-corner-br">
          <Mic size={20} />
        </button>
      </div>
    </div>
  );
};

export default LiveSpace;