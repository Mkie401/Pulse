import { User, Task, TaskStatus, Message } from './types';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Cmdr. Zero',
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Zero',
  status: 'online',
  role: '戰術指揮官'
};

export const MOCK_USERS: User[] = [
  { id: 'u2', name: 'Viper_7', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Viper', status: 'online', role: '狙擊手' },
  { id: 'u3', name: 'Tank_99', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Tank', status: 'busy', role: '前鋒' },
  { id: 'u4', name: 'Neo_X', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Neo', status: 'online', role: '駭客' },
  { id: 'u5', name: 'Ghost', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Ghost', status: 'offline', role: '偵查' },
];

export const INITIAL_TASKS: Task[] = [
  { id: 't1', title: '排位賽爬分 - 白金階級', status: TaskStatus.IN_PROGRESS, assignee: MOCK_USERS[0], tag: '競技', progress: 65 },
  { id: 't2', title: '副本 Raid: 虛空領主', status: TaskStatus.TODO, assignee: MOCK_USERS[1], tag: 'PVE', progress: 0 },
  { id: 't3', title: '系統裝備最佳化', status: TaskStatus.DONE, assignee: MOCK_USERS[2], tag: '維護', progress: 100 },
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm1',
    sender: MOCK_USERS[0],
    content: '偵測到敵方小隊接近 B 點，請求支援。',
    timestamp: '22:30'
  },
  {
    id: 'm2',
    sender: MOCK_USERS[1],
    content: '收到，正在前往截擊。準備 EMP。',
    timestamp: '22:31'
  },
  {
    id: 'm3',
    sender: CURRENT_USER,
    content: '保持通訊靜默，執行代號 Delta。',
    timestamp: '22:32'
  }
];