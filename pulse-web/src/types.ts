export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  role?: string;
}

export interface Message {
  id: string;
  sender: User;
  content: string;
  timestamp: string;
  isAi?: boolean;
}

export enum TaskStatus {
  TODO = '等待部署', // Pending Deployment
  IN_PROGRESS = '作戰中', // In Operation
  DONE = '任務完成' // Mission Complete
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  assignee?: User;
  tag: string;
  progress: number; // For progress bar
}

export interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice';
  activeUsers: User[];
}