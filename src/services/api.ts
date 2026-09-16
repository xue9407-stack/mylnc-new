import { Role, Conversation, ChatMessage, UserProfile, UserStats, WalletData, TP5ExportData } from '../types';
import { DEFAULT_ROLES } from '../data/rolesData';

const BASE_URL = '/api/v1';

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const json = await res.json();
    if (json.code === 1) {
      return json.data as T;
    }
    return null;
  } catch (err) {
    // Expected on static hosting environments like Vercel when Express backend is not running
    console.warn(`API call ${endpoint} failed, activating fallback dataset:`, err);
    return null;
  }
}

// Fallback conversation starters
const DEFAULT_CONVERSATIONS: Conversation[] = [
  {
    name: '陆景琛',
    roleId: 'lujingchen',
    emoji: '🤵',
    cover: 'c-domineering',
    lastMsg: '女人，你成功引起了我的注意。今晚吃饭了没？',
    time: '15:42',
    unread: 1,
  },
  {
    name: '林小柔',
    roleId: 'linxiaorou',
    emoji: '👧',
    cover: 'c-yandere-girl',
    lastMsg: '哥哥你终于来了...我等你好久了。今天过得开心吗？',
    time: '14:20',
    unread: 2,
  },
  {
    name: '林慕白',
    roleId: 'linmubai',
    emoji: '👨‍🎓',
    cover: 'c-warm-senpai',
    lastMsg: '最近学习压力大吗？有什么不懂随时问我。',
    time: '昨天',
    unread: 0,
  },
];

export const api = {
  // 1. Roles
  async getRoles(category = '全部', keyword = ''): Promise<Role[]> {
    const params = new URLSearchParams();
    if (category && category !== '全部') params.set('category', category);
    if (keyword) params.set('keyword', keyword);
    
    const data = await fetchJson<Role[]>(`/role/list?${params.toString()}`);
    if (data && data.length > 0) {
      return data;
    }

    // Fallback: Read local stored custom roles + DEFAULT_ROLES
    let allRoles = [...DEFAULT_ROLES];
    try {
      const savedCustom = localStorage.getItem('custom_created_roles');
      if (savedCustom) {
        const parsed = JSON.parse(savedCustom);
        if (Array.isArray(parsed)) {
          allRoles = [...parsed, ...DEFAULT_ROLES];
        }
      }
    } catch {
      // ignore
    }

    return allRoles.filter((r) => {
      const matchCat =
        category === '全部' ||
        r.tags.includes(category) ||
        r.title.includes(category);
      const matchKey =
        !keyword ||
        r.name.includes(keyword) ||
        r.title.includes(keyword) ||
        r.desc.includes(keyword) ||
        r.tags.some((t) => t.includes(keyword));
      return matchCat && matchKey;
    });
  },

  async getRoleDetail(id: string): Promise<Role | null> {
    const data = await fetchJson<Role>(`/role/detail/${id}`);
    if (data) return data;

    // Fallback
    const found = DEFAULT_ROLES.find((r) => r.id === id);
    if (found) return found;

    try {
      const savedCustom = localStorage.getItem('custom_created_roles');
      if (savedCustom) {
        const parsed: Role[] = JSON.parse(savedCustom);
        const match = parsed.find((r) => r.id === id);
        if (match) return match;
      }
    } catch {
      // ignore
    }

    return null;
  },

  async toggleFollow(roleId: string): Promise<{ is_followed: boolean; total_follows: number } | null> {
    const data = await fetchJson<{ is_followed: boolean; total_follows: number }>('/role/follow', {
      method: 'POST',
      body: JSON.stringify({ role_id: roleId }),
    });
    if (data) return data;

    // Fallback: calculate from localStorage
    try {
      const follows: string[] = JSON.parse(localStorage.getItem('follows') || '[]');
      const isNowFollowed = follows.includes(roleId);
      return { is_followed: isNowFollowed, total_follows: isNowFollowed ? 8901 : 8900 };
    } catch {
      return { is_followed: true, total_follows: 8901 };
    }
  },

  async createRole(roleData: Partial<Role>): Promise<Role | null> {
    const data = await fetchJson<Role>('/role/create', {
      method: 'POST',
      body: JSON.stringify(roleData),
    });
    if (data) return data;

    // Fallback: create in localStorage
    const newRole: Role = {
      id: `custom_${Date.now()}`,
      name: roleData.name || '自定义角色',
      title: roleData.title || '虚拟伴侣',
      emoji: roleData.emoji || '✨',
      cover: roleData.cover || 'c-custom',
      desc: roleData.desc || '这是一个自定义角色。',
      tags: roleData.tags || ['自创', '陪伴'],
      topics: roleData.topics || ['很高兴认识你！', '今天有什么新鲜事分享吗？'],
      users: '1',
      follows: '1',
      rating: 5.0,
      is_official: 0,
      avatarUrl: roleData.avatarUrl || '/avatars/lujingchen.jpg',
      portraitUrl: roleData.portraitUrl || '/avatars/lujingchen.jpg',
    };

    try {
      const saved = JSON.parse(localStorage.getItem('custom_created_roles') || '[]');
      saved.unshift(newRole);
      localStorage.setItem('custom_created_roles', JSON.stringify(saved));
    } catch {
      // ignore
    }

    return newRole;
  },

  // 2. Chat
  async sendChatMessage(roleId: string, content: string): Promise<{ reply: string; time: string } | null> {
    const data = await fetchJson<{ reply: string; time: string }>('/chat/send', {
      method: 'POST',
      body: JSON.stringify({ role_id: roleId, content }),
    });
    if (data && data.reply) return data;

    // Fallback: character-aware smart response generator for static hosting
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const role = DEFAULT_ROLES.find((r) => r.id === roleId);
    let reply = `我听到了哦：关于“${content}”，我也一直在思考呢。无论遇到什么，我都会一直陪着你。`;

    if (roleId === 'lujingchen') {
      const replies = [
        `听到你这么说，我放下手里的合同了。无论发生什么，有我在，你不用逞强。`,
        `“${content}”？呵，女人，别以为我不知道你在想什么。今晚必须跟我去吃饭。`,
        `商界那些繁杂的事比不过你这一句话。记住了，任何时候我都是你最坚实的后盾。`,
      ];
      reply = replies[Math.floor(Math.random() * replies.length)];
    } else if (roleId === 'linxiaorou') {
      const replies = [
        `哥哥你是在和我分享心情吗？好开心好开心...哥哥只要心里一直有小柔就好～`,
        `不管哥哥说什么我都爱听！小柔刚刚切好了水果，哥哥张嘴，啊——`,
        `真的吗？哥哥不能骗小柔哦，小柔永远都不会离开哥哥的。`,
      ];
      reply = replies[Math.floor(Math.random() * replies.length)];
    } else if (roleId === 'linmubai') {
      const replies = [
        `学弟/学妹，听起来你最近挺用心的。别太勉强自己，先喝口温水缓一缓。`,
        `关于“${content}”，我觉得你的直觉很准确。慢慢来，学长一直都在你身后。`,
        `今天自习室阳光正好，看到你的消息心情也跟着变好了。`,
      ];
      reply = replies[Math.floor(Math.random() * replies.length)];
    } else if (roleId === 'gubeichen') {
      const replies = [
        `哈哈，你这性格从小到大就没变过！今晚哥带你去吃那家你最爱的烤串？`,
        `多大点事儿啊，天塌下来有哥顶着呢！钥匙在门口地毯下，随时来我家吃饭。`,
        `听到你这句话我就放心了。别熬夜，明天早上带你买热乎的豆浆油条。`,
      ];
      reply = replies[Math.floor(Math.random() * replies.length)];
    } else if (roleId === 'guyebai') {
      const replies = [
        `你回我消息了...3分12秒，我数得很清楚。下次要更快一点哦，我会想你想得发疯的。`,
        `除了我，你还对别人说过类似的话吗？...看着我的眼睛回答我。`,
        `只要是你说的，我都信。你只能看着我一个人，知道了吗？`,
      ];
      reply = replies[Math.floor(Math.random() * replies.length)];
    } else if (roleId === 'shenqinghuan') {
      const replies = [
        `（轻抿了一口红酒，眉梢微挑）有意思，敢这么跟我说话的人，你是第一个。`,
        `还算有点见识。坐下吧，刚泡好的大吉岭红茶，尝尝合不合你胃口。`,
        `职场和生活都需要冷静判断。不过在你面前，我可以稍微摘下面具。`,
      ];
      reply = replies[Math.floor(Math.random() * replies.length)];
    } else if (roleId === 'tangtang') {
      const replies = [
        `哇！哥哥/姐姐说得好棒！糖糖给你一个大大的熊熊抱抱！🧸`,
        `诶嘿嘿～糖糖听懂啦！那...那可以给糖糖奖励一块草莓小蛋糕吗？🍰`,
        `糖糖最喜欢你了！拉勾上吊一百年不许变！✨`,
      ];
      reply = replies[Math.floor(Math.random() * replies.length)];
    } else if (roleId === 'guwanqing') {
      const replies = [
        `哼！本小姐才没有特意在等你的消息呢！只是正好屏幕亮了顺手点开而已！`,
        `你、你突然说这个干嘛...搞得人家心跳都乱了。真是个笨蛋！`,
        `本小姐赏你个脸，勉强陪你聊五分钟好了，可别太得意忘形哦！`,
      ];
      reply = replies[Math.floor(Math.random() * replies.length)];
    }

    return {
      reply,
      time: timeStr,
    };
  },

  async getChatHistory(roleId: string): Promise<ChatMessage[]> {
    const data = await fetchJson<ChatMessage[]>(`/chat/history/${roleId}`);
    if (data && data.length > 0) return data;

    try {
      const allHist = JSON.parse(localStorage.getItem('chatHistories') || '{}');
      return allHist[roleId] || [];
    } catch {
      return [];
    }
  },

  async getConversations(): Promise<Conversation[]> {
    const data = await fetchJson<Conversation[]>('/conversation/list');
    if (data && data.length > 0) return data;

    try {
      const saved = localStorage.getItem('conversations');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }

    return DEFAULT_CONVERSATIONS;
  },

  // 3. User & Wallet
  async login(username: string, password: string): Promise<any> {
    const data = await fetchJson<any>('/user/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (data) return data;

    return {
      code: 1,
      msg: '登录成功 (本地模式)',
      data: {
        token: 'local_token_' + Date.now(),
        user: {
          id: 10086,
          username: username || 'admin',
          nickname: username || '网巢体验官',
          avatar: '😊',
          money: 128.5,
          score: 328,
          vip_level: 1,
          vip_text: '💎 黄金会员',
        },
      },
    };
  },

  async register(username: string, password: string): Promise<any> {
    const data = await fetchJson<any>('/user/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (data) return data;

    return {
      code: 1,
      msg: '注册成功并已登录',
      data: {
        token: 'local_token_' + Date.now(),
        user: {
          id: Date.now(),
          username: username,
          nickname: username,
          avatar: '🌸',
          money: 66.0,
          score: 100,
          vip_level: 0,
          vip_text: '普通用户',
        },
      },
    };
  },

  async getUserProfile(): Promise<{ user: UserProfile; stats: UserStats } | null> {
    const data = await fetchJson<{ user: UserProfile; stats: UserStats }>('/user/profile');
    if (data) return data;

    return {
      user: {
        id: 10086,
        username: 'admin',
        nickname: '网巢体验官',
        avatar: '😊',
        money: 128.5,
        score: 328,
        vip_level: 1,
        vip_text: '💎 黄金会员',
      },
      stats: {
        roles_count: 11,
        chat_days: 7,
        messages_count: 88,
        follows_count: 5,
      },
    };
  },

  async getWalletInfo(): Promise<WalletData | null> {
    const data = await fetchJson<WalletData>('/wallet/info');
    if (data) return data;

    return {
      balance: '128.50',
      withdrawable: '100.00',
      score: 328,
      logs: [
        {
          id: 1,
          type: 'recharge',
          amount: 50,
          remark: '在线体验充值',
          date: '2026-09-15 14:30',
        },
      ],
    };
  },

  async rechargeWallet(amount: number): Promise<{ new_balance: string } | null> {
    const data = await fetchJson<{ new_balance: string }>('/wallet/recharge', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
    if (data) return data;

    return { new_balance: String((128.5 + amount).toFixed(2)) };
  },

  // 4. Developer / TP5 Source Code Export
  async getTP5Export(): Promise<TP5ExportData | null> {
    return await fetchJson<TP5ExportData>('/tp5/export');
  },
};

