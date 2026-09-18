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

export interface GroupMessage {
  id: number;
  groupId: string;
  sender: 'user' | 'role';
  roleId?: string;
  roleName?: string;
  avatarUrl?: string;
  text: string;
  time: string;
  timestamp: number;
}

export interface GroupChat {
  id: string;
  name: string;
  topic?: string;
  memberRoleIds: string[];
  lastMsg: string;
  lastSenderName?: string;
  time: string;
  unread: number;
  updatedAt: number;
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
  vip_status?: number;
  gender?: string;
  school?: string;
  bio?: string;
  emergencyContact?: string;
  uid?: string;
  diamonds?: number;
  backgroundImage?: string;
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

export interface StoryLineItem {
  id: string;
  roleId: string;
  title: string;
  summary: string;
  wordCount: number;
  author: string;
  isCustom?: boolean;
  paragraphs: string[];
  choices?: Array<{ id: string; text: string; response: string }>;
  createdAt?: string;
}

export interface TheaterScene {
  id: string;
  speaker: string;
  avatar?: string;
  dialogue: string;
  hasVoice?: boolean;
  bgImage?: string;
  dynamicGif?: string;
  choices?: string[];
}

export interface MiniTheaterItem {
  id: string;
  roleId: string;
  title: string;
  desc: string;
  wordCount: number;
  bgImage: string;
  dynamicGif: string;
  scenes: TheaterScene[];
  isCustom?: boolean;
  createdAt?: string;
}

export type AppPage =
  | 'login'
  | 'recommend'
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
  | 'help'
  | 'message_roaming';
