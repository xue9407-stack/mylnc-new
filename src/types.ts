export interface Role {
  id: string;
  name: string;
  title: string;
  emoji: string;
  cover: string;
  desc: string;
  tags: string[];
  topics: string[];
  users: string;
  follows: string;
  rating: number;
  is_official?: number;
  is_followed?: boolean;
  avatarUrl?: string;
  portraitUrl?: string;
}

export interface IntimacyData {
  points: number;
  level: number;
  title: string;
  icon: string;
  nextReq: number;
  currentLevelBase: number;
  unlockedPrivileges: string[];
}

export interface Conversation {
  name: string;
  roleId: string;
  emoji: string;
  cover: string;
  lastMsg: string;
  time: string;
  unread: number;
  updatedAt?: number;
}

export interface ChatMessage {
  id: number;
  roleId: string;
  sender: 'user' | 'role';
  text: string;
  time: string;
  timestamp: number;
}

export interface UserProfile {
  id: number;
  username: string;
  nickname: string;
  avatar: string;
  money: number;
  score: number;
  vip_level: number;
  vip_text: string;
}

export interface UserStats {
  roles_count: number;
  chat_days: number;
  messages_count: string | number;
  follows_count: number;
}

export interface WalletData {
  balance: string;
  withdrawable: string;
  score: number;
  logs: Array<{
    id: number;
    type: string;
    amount: number;
    remark: string;
    date: string;
  }>;
}

export interface TP5ExportData {
  sql: string;
  dbConfig: string;
  routes: string;
  chatController: string;
  deployGuide: string;
}

export interface MomentComment {
  id: string;
  userName: string;
  userAvatar?: string;
  text: string;
  time: string;
  likes: number;
  isLiked?: boolean;
}

export interface MomentPost {
  id: string;
  roleId: string;
  roleName: string;
  roleTitle: string;
  roleAvatar: string;
  roleCover?: string;
  time: string;
  content: string;
  images?: string[];
  audioVoice?: {
    duration: string;
    transcript: string;
  };
  location?: string;
  likes: number;
  isLiked?: boolean;
  comments: MomentComment[];
  shares: number;
  tag?: string;
}

export type AppPage =
  | 'login'
  | 'home'
  | 'explore'
  | 'messages'
  | 'moments'
  | 'profile'
  | 'chat'
  | 'follows'
  | 'vip'
  | 'wallet'
  | 'creator'
  | 'settings'
  | 'help';
