import React, { useState } from 'react';
import { Plus, MoreHorizontal, Target, Crosshair, CheckSquare } from 'lucide-react';
import { Task, TaskStatus } from '../types';
import { INITIAL_TASKS } from '../constants';

const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  return (
    <div className="bg-cyber-dark/80 border border-cyber-slate h-full flex flex-col clip-corner-both backdrop-blur-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="text-neon-green animate-spin-slow">
            <Target size={24} />
          </div>
          <div>
            <h3 className="font-mono font-bold text-white text-xl tracking-widest uppercase">任務中心</h3>
            <div className="flex gap-2 text-[10px] font-mono text-neon-green">
               <span>ACTIVE: {tasks.length}</span>
               <span className="text-cyber-dim">|</span>
               <span>SYNCED</span>
            </div>
          </div>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-cyber-slate/50 border border-cyber-slate text-slate-400 font-mono text-xs uppercase tracking-wider clip-corner-br">
            <MoreHorizontal size={14} />
            <span>選項</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {/* Table Header */}
        <div className="grid grid-cols-12 text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2 px-4">
            <div className="col-span-1">ID</div>
            <div className="col-span-5">Objective</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-3 text-right">Progress</div>
        </div>

        {tasks.map((task, idx) => (
            <TaskItem key={task.id} task={task} index={idx} />
        ))}
        
        <button className="w-full py-3 mt-4 border border-dashed border-cyber-slate text-slate-500 font-mono hover:text-neon-blue hover:border-neon-blue hover:bg-neon-blue/5 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
            <Plus size={14} />
            Initialize New Protocol
        </button>
      </div>
    </div>
  );
};

const TaskItem: React.FC<{ task: Task; index: number }> = ({ task, index }) => {
    const getStatusColor = (status: TaskStatus) => {
        switch (status) {
            case TaskStatus.DONE: return 'text-neon-green border-neon-green';
            case TaskStatus.IN_PROGRESS: return 'text-neon-blue border-neon-blue';
            default: return 'text-slate-400 border-slate-500';
        }
    };

    return (
        <div className="group relative bg-cyber-black border border-cyber-slate p-3 hover:border-neon-blue transition-colors clip-corner-br cursor-pointer">
            {/* Hover Glow */}
            <div className="absolute inset-0 bg-neon-blue/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

            <div className="grid grid-cols-12 items-center gap-2">
                {/* ID */}
                <div className="col-span-1 text-xs font-mono text-cyber-dim">
                    0{index + 1}
                </div>
                
                {/* Title & Tag */}
                <div className="col-span-5">
                    <div className="text-sm font-bold text-white group-hover:text-neon-blue transition-colors truncate">
                        {task.title}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 uppercase mt-0.5">
                        [{task.tag}]
                    </div>
                </div>

                {/* Status */}
                <div className="col-span-3">
                    <div className={`text-[10px] font-mono border px-1 py-0.5 inline-block ${getStatusColor(task.status)}`}>
                        {task.status}
                    </div>
                </div>

                {/* Progress */}
                <div className="col-span-3 flex flex-col items-end justify-center gap-1">
                    <div className="text-xs font-mono text-white">{task.progress}%</div>
                    <div className="w-full h-1 bg-cyber-slate">
                        <div 
                            className={`h-full ${task.status === TaskStatus.DONE ? 'bg-neon-green shadow-neon-green' : 'bg-neon-blue shadow-neon-blue'}`} 
                            style={{ width: `${task.progress}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskBoard;