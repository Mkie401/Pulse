import React from 'react';
import { 
  LayoutDashboard, 
  Swords, 
  Radio, 
  Users, 
  Settings, 
  Power,
  Cpu
} from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <div className="w-20 h-screen bg-cyber-dark/90 border-r border-cyber-slate flex flex-col items-center py-8 fixed left-0 top-0 z-50 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.5)]">
      <div className="mb-12 relative group">
        <div className="absolute -inset-1 bg-neon-blue rounded-sm blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
        <div className="w-12 h-12 bg-cyber-black border border-neon-blue relative flex items-center justify-center text-neon-blue font-mono font-bold text-2xl clip-corner-tl">
          P
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-8 w-full items-center">
        <SidebarIcon icon={<LayoutDashboard size={24} />} label="總覽" active />
        <SidebarIcon icon={<Swords size={24} />} label="任務" />
        <SidebarIcon icon={<Radio size={24} />} label="通訊" />
        <SidebarIcon icon={<Users size={24} />} label="戰隊" />
      </nav>

      <div className="flex flex-col gap-8 w-full items-center mb-6">
        <SidebarIcon icon={<Cpu size={24} />} label="系統" />
        <SidebarIcon icon={<Power size={24} />} label="終止" color="text-neon-red hover:text-red-400" glow="hover:shadow-neon-red" />
      </div>
    </div>
  );
};

interface SidebarIconProps {
  icon: React.ReactNode;
  active?: boolean;
  color?: string;
  glow?: string;
  label?: string;
}

const SidebarIcon: React.FC<SidebarIconProps> = ({ icon, active, color, glow, label }) => {
  return (
    <div className="relative group w-full flex justify-center">
      {active && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-neon-blue shadow-neon-blue"></div>
      )}
      <button 
        className={`
          p-3 transition-all duration-200 relative
          ${active ? 'text-neon-blue' : 'text-slate-500 hover:text-white'}
          ${color ? color : ''}
          hover:scale-110
        `}
      >
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${glow ? glow : 'shadow-neon-blue'} blur-md`}></div>
        <div className="relative z-10">{icon}</div>
      </button>
      
      {/* Tech Tooltip */}
      <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-cyber-black border border-cyber-slate text-neon-blue text-xs font-mono tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none uppercase clip-corner-br shadow-lg">
        {label}
        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-cyber-black border-l border-b border-cyber-slate transform rotate-45"></div>
      </div>
    </div>
  );
};

export default Sidebar;