import React from 'react';
import Sidebar from './components/Sidebar';
import LiveSpace from './components/LiveSpace';
import ChatCard from './components/ChatCard';
import TaskBoard from './components/TaskBoard';
import { Search, Bell, Shield, Zap } from 'lucide-react';
import { CURRENT_USER } from './constants';

function App() {
  return (
    <div className="min-h-screen font-sans text-white overflow-hidden relative selection:bg-neon-blue selection:text-black">
        <Sidebar />
      
      <main className="pl-20 min-h-screen relative z-10">
        <div className="max-w-[1800px] mx-auto p-6 lg:p-10 h-screen flex flex-col">
          
          {/* Top Bar */}
          <header className="flex justify-between items-center mb-6 bg-cyber-dark/80 border-b border-neon-blue/30 p-4 clip-corner-br backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="w-1 h-8 bg-neon-blue shadow-neon-blue"></div>
              <div>
                <h1 className="text-3xl font-mono font-bold text-white tracking-[0.2em] flex items-center gap-2 uppercase">
                  Pulse <span className="text-neon-blue text-sm align-top">SYS.VER.2.0</span>
                </h1>
                <p className="text-slate-400 font-mono text-xs tracking-wider">WELCOME BACK, COMMANDER {CURRENT_USER.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 pr-4">
              <div className="relative hidden md:block group">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neon-blue" />
                <input 
                  type="text" 
                  placeholder="SEARCH DATABASE..." 
                  className="pl-10 pr-4 py-2 bg-cyber-black border border-cyber-slate rounded-none text-xs w-64 focus:outline-none focus:border-neon-blue focus:shadow-neon-blue transition-all font-mono placeholder-slate-600 text-white uppercase clip-corner-br"
                />
              </div>
              
              <div className="flex gap-4">
                  <button className="p-2 border border-cyber-slate text-slate-400 hover:text-neon-blue hover:border-neon-blue hover:shadow-neon-blue transition-all relative">
                    <Bell size={20} />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-neon-red shadow-neon-red"></span>
                  </button>
                  <button className="p-2 border border-cyber-slate text-slate-400 hover:text-neon-green hover:border-neon-green hover:shadow-neon-green transition-all">
                    <Shield size={20} />
                  </button>
              </div>

              <div className="flex items-center gap-3 border-l border-cyber-slate pl-6">
                <div className="text-right hidden sm:block">
                    <div className="text-xs font-bold text-white uppercase">{CURRENT_USER.name}</div>
                    <div className="text-[10px] text-neon-green font-mono">STATUS: ONLINE</div>
                </div>
                <div className="relative p-0.5 border border-neon-blue clip-corner-tl">
                     <img 
                        src={CURRENT_USER.avatar} 
                        alt="Profile" 
                        className="w-10 h-10 bg-black object-cover"
                    />
                </div>
              </div>
            </div>
          </header>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 pb-2">
            
            {/* Left Column: Voice & Tasks (Width 7/12) */}
            <div className="lg:col-span-7 flex flex-col gap-6 h-full min-h-0">
              {/* Voice Widget */}
              <div className="shrink-0">
                <LiveSpace />
              </div>
              
              {/* Task Board */}
              <div className="flex-1 min-h-0">
                <TaskBoard />
              </div>
            </div>

            {/* Right Column: Chat (Width 5/12) */}
            <div className="lg:col-span-5 h-full min-h-0">
              <ChatCard />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default App;