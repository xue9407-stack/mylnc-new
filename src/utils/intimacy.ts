import { IntimacyData } from '../types';

export const INTIMACY_LEVELS = [
  {
    level: 1,
    title: '初识',
    icon: '🌱',
    min: 0,
    max: 100,
    privileges: ['日常闲聊互动', '查看基础档案', '角色初见印象'],
    color: 'from-blue-500 to-cyan-400',
  },
  {
    level: 2,
    title: '熟稔',
    icon: '🌸',
    min: 100,
    max: 300,
    privileges: ['深夜温情问候', '开启心事倾诉', '专属情绪共鸣'],
    color: 'from-emerald-500 to-teal-400',
  },
  {
    level: 3,
    title: '知己',
    icon: '💫',
    min: 300,
    max: 600,
    privileges: ['角色私密独白', '定制破冰话题', '心跳微表情解锁'],
    color: 'from-purple-500 to-indigo-400',
  },
  {
    level: 4,
    title: '依恋',
    icon: '💖',
    min: 600,
    max: 1000,
    privileges: ['甜蜜羁绊语音', '专属亲密爱称', '解锁专属节日彩蛋'],
    color: 'from-pink-500 to-rose-400',
  },
  {
    level: 5,
    title: '灵魂伴侣',
    icon: '👑',
    min: 1000,
    max: 1000,
    privileges: ['灵魂共鸣全身立绘', '永久专属至尊徽章', '无限心跳剧情'],
    color: 'from-amber-400 to-yellow-500',
  },
];

export function getIntimacyData(points: number): IntimacyData {
  const safePoints = Math.max(0, points || 0);

  let currentConfig = INTIMACY_LEVELS[0];
  for (let i = INTIMACY_LEVELS.length - 1; i >= 0; i--) {
    if (safePoints >= INTIMACY_LEVELS[i].min) {
      currentConfig = INTIMACY_LEVELS[i];
      break;
    }
  }

  const allUnlockedPrivileges = INTIMACY_LEVELS.filter(
    (lvl) => lvl.level <= currentConfig.level
  ).flatMap((lvl) => lvl.privileges);

  return {
    points: safePoints,
    level: currentConfig.level,
    title: currentConfig.title,
    icon: currentConfig.icon,
    nextReq: currentConfig.max,
    currentLevelBase: currentConfig.min,
    unlockedPrivileges: allUnlockedPrivileges,
  };
}

export function getIntimacyPercent(points: number): number {
  const data = getIntimacyData(points);
  if (data.level >= 5) return 100;
  const range = data.nextReq - data.currentLevelBase;
  const current = data.points - data.currentLevelBase;
  return Math.min(100, Math.max(0, Math.round((current / range) * 100)));
}

const STORAGE_KEY = 'role_intimacies_v1';

export function loadAllIntimacies(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Provide lively initial values for default characters
      return {
        lujingchen: 145, // Lv.2
        linxiaorou: 320, // Lv.3
        linmubai: 80,    // Lv.1
        gubeichen: 50,   // Lv.1
        guyebai: 110,    // Lv.2
        guyanchuan: 30,  // Lv.1
        linxiaoman: 95,  // Lv.1
        shenqinghuan: 210, // Lv.2
        tangtang: 160,   // Lv.2
        linzhixia: 280,  // Lv.2
        guwanqing: 190,  // Lv.2
      };
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load intimacies:', e);
    return {};
  }
}

export function saveIntimacy(roleId: string, addedPoints: number): { newPoints: number; isLevelUp: boolean; newLevel: number } {
  const all = loadAllIntimacies();
  const prevPoints = all[roleId] || 0;
  const prevData = getIntimacyData(prevPoints);

  const newPoints = prevPoints + addedPoints;
  all[roleId] = newPoints;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    console.error('Failed to save intimacy:', e);
  }

  const newData = getIntimacyData(newPoints);
  const isLevelUp = newData.level > prevData.level;

  return {
    newPoints,
    isLevelUp,
    newLevel: newData.level,
  };
}

// Daily Chat Intimacy Cap: 50 points per role per calendar day
export const DAILY_CHAT_INTIMACY_CAP = 50;
const DAILY_CHAT_INTIMACY_KEY = 'role_daily_chat_intimacy_v1';

export interface DailyChatIntimacyInfo {
  gained: number;
  max: number;
  remaining: number;
  isCapReached: boolean;
}

export interface AddChatIntimacyResult {
  actualAdded: number;
  newTotalPoints: number;
  isLevelUp: boolean;
  newLevel: number;
  gainedToday: number;
  isCapReached: boolean;
}

export function getDailyChatIntimacy(roleId: string): DailyChatIntimacyInfo {
  const today = getTodayDateString();
  try {
    const raw = localStorage.getItem(DAILY_CHAT_INTIMACY_KEY);
    if (!raw) {
      return { gained: 0, max: DAILY_CHAT_INTIMACY_CAP, remaining: DAILY_CHAT_INTIMACY_CAP, isCapReached: false };
    }
    const map = JSON.parse(raw);
    const entry = map[roleId];
    if (!entry || entry.date !== today) {
      return { gained: 0, max: DAILY_CHAT_INTIMACY_CAP, remaining: DAILY_CHAT_INTIMACY_CAP, isCapReached: false };
    }
    const gained = Math.min(DAILY_CHAT_INTIMACY_CAP, Math.max(0, entry.gained || 0));
    const remaining = Math.max(0, DAILY_CHAT_INTIMACY_CAP - gained);
    return {
      gained,
      max: DAILY_CHAT_INTIMACY_CAP,
      remaining,
      isCapReached: remaining <= 0,
    };
  } catch (e) {
    console.error('Failed to get daily chat intimacy:', e);
    return { gained: 0, max: DAILY_CHAT_INTIMACY_CAP, remaining: DAILY_CHAT_INTIMACY_CAP, isCapReached: false };
  }
}

export function addDailyChatIntimacy(roleId: string, requestedPoints?: number): AddChatIntimacyResult {
  // 5 to 10 points per interaction
  const points = requestedPoints ?? (Math.floor(Math.random() * 6) + 5);
  const daily = getDailyChatIntimacy(roleId);
  const actualAdded = Math.min(points, daily.remaining);

  const today = getTodayDateString();
  let newDailyGained = daily.gained;
  if (actualAdded > 0) {
    try {
      const raw = localStorage.getItem(DAILY_CHAT_INTIMACY_KEY);
      const map = raw ? JSON.parse(raw) : {};
      const currentGained = (map[roleId]?.date === today) ? (map[roleId].gained || 0) : 0;
      newDailyGained = Math.min(DAILY_CHAT_INTIMACY_CAP, currentGained + actualAdded);
      map[roleId] = { date: today, gained: newDailyGained };
      localStorage.setItem(DAILY_CHAT_INTIMACY_KEY, JSON.stringify(map));
    } catch (e) {
      console.error('Failed to update daily chat intimacy:', e);
    }
  }

  const result = saveIntimacy(roleId, actualAdded);

  return {
    actualAdded,
    newTotalPoints: result.newPoints,
    isLevelUp: result.isLevelUp,
    newLevel: result.newLevel,
    gainedToday: newDailyGained,
    isCapReached: newDailyGained >= DAILY_CHAT_INTIMACY_CAP,
  };
}

const DAILY_GREETING_KEY = 'role_daily_greetings_v1';

function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function hasGreetedToday(roleId: string): boolean {
  try {
    const raw = localStorage.getItem(DAILY_GREETING_KEY);
    if (!raw) return false;
    const map = JSON.parse(raw);
    return map[roleId] === getTodayDateString();
  } catch (e) {
    console.error('Failed to check daily greeting:', e);
    return false;
  }
}

export function recordDailyGreeting(roleId: string): void {
  try {
    const raw = localStorage.getItem(DAILY_GREETING_KEY);
    const map = raw ? JSON.parse(raw) : {};
    map[roleId] = getTodayDateString();
    localStorage.setItem(DAILY_GREETING_KEY, JSON.stringify(map));
  } catch (e) {
    console.error('Failed to record daily greeting:', e);
  }
}
