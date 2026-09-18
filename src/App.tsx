import React, { useState, useEffect, useMemo } from 'react';
import { Role, Conversation, ChatMessage, GroupChat, GroupMessage, UserProfile, AppPage } from './types';
import { api } from './services/api';
import { PhoneFrame } from './components/PhoneFrame';
import { DetailModal } from './components/DetailModal';
import { ChatView } from './components/ChatView';
import { CreateGroupModal } from './components/CreateGroupModal';
import { GroupChatView } from './components/GroupChatView';
import { RechargeModal } from './components/RechargeModal';
import { Toast } from './components/Toast';
import { RoleAvatar } from './components/RoleAvatar';
import { HelpFeedbackView } from './components/HelpFeedbackView';
import { SettingsView } from './components/SettingsView';
import { MessageRoamingView } from './components/MessageRoamingView';
import { RealNameAuthModal } from './components/RealNameAuthModal';
import { CategoryChips } from './components/CategoryChips';
import { CreatorView } from './components/CreatorView';
import { HomeRecommendView } from './components/HomeRecommendView';
import { VipView } from './components/VipView';
import { EditProfileModal } from './components/EditProfileModal';
import { loadAllIntimacies, saveIntimacy, getIntimacyData, addDailyChatIntimacy, AddChatIntimacyResult } from './utils/intimacy';
import { ROLE_MEDIA_MAP } from './data/rolePortraits';
import { DEFAULT_ROLES } from './data/rolesData';
import { DEFAULT_STORYLINES, DEFAULT_THEATERS } from './data/storyTheaterPresetData';
import {
  Home,
  MessageSquare,
  User,
  Zap,
  Search,
  ChevronRight,
  Heart,
  Crown,
  Wallet,
  Star,
  PenTool,
  Settings,
  HelpCircle,
  LogOut,
  ArrowLeft,
  CheckCircle2,
  Bell,
  Trash2,
  Server,
  X,
  CheckCheck,
  Copy,
  Plus,
  Sparkles,
  Radio,
  Globe,
  Compass,
  Camera,
  Edit2,
  ShieldCheck,
  Users,
  Gem,
  Calendar,
  Briefcase,
  ShoppingBag,
  ClipboardList,
  Award,
  Trophy,
  Play,
  Pause,
} from 'lucide-react';

const CATEGORIES = ['全部', '霸总', '温柔', '邻家', '病娇', '御姐', '学长', '治愈', '高冷', '阳光'];

export default function App() {
  // Page Navigation State
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    return localStorage.getItem('currentUser') || null;
  });
  const [currentPage, setCurrentPage] = useState<AppPage>(() => {
    return localStorage.getItem('currentUser') ? 'recommend' : 'login';
  });
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const [detailRole, setDetailRole] = useState<Role | null>(null);

  // Authentication State
  const [loginMode, setLoginMode] = useState<'login' | 'register'>('login');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPwdInput, setConfirmPwdInput] = useState('');
  const [loginTip, setLoginTip] = useState('');

  // Data States
  const [roles, setRoles] = useState<Role[]>(() => {
    try {
      const savedCustom = localStorage.getItem('custom_created_roles');
      if (savedCustom) {
        const parsed = JSON.parse(savedCustom);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return [...parsed, ...DEFAULT_ROLES];
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_ROLES;
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [homeSearchKeyword, setHomeSearchKeyword] = useState<string>('');
  const [exploreKeyword, setExploreKeyword] = useState<string>('');
  const [vipInitialTier, setVipInitialTier] = useState<'silver' | 'platinum'>('silver');
  const [vipTier, setVipTier] = useState<'default' | 'silver' | 'platinum'>(() => {
    return (localStorage.getItem('user_vip_tier') as any) || 'default';
  });
  const [roamingDays, setRoamingDays] = useState<number>(() => {
    const saved = localStorage.getItem('user_roaming_days');
    if (saved) return parseInt(saved, 10);
    const tier = localStorage.getItem('user_vip_tier');
    if (tier === 'platinum') return 180;
    if (tier === 'silver') return 120;
    return 60;
  });

  // Real-name Verification State
  const [isRealNameVerified, setIsRealNameVerified] = useState<boolean>(() => {
    return localStorage.getItem('user_realname_verified') === 'true';
  });
  const [realName, setRealName] = useState<string>(() => {
    return localStorage.getItem('user_realname') || '';
  });
  const [realIdCard, setRealIdCard] = useState<string>(() => {
    return localStorage.getItem('user_real_idcard') || '';
  });
  const [showRealNameAuthModal, setShowRealNameAuthModal] = useState(false);
  const [homeTopTab, setHomeTopTab] = useState<'recommend' | 'theater' | 'original' | 'game'>('recommend');
  const [hasUnreadMoments, setHasUnreadMoments] = useState<boolean>(() => {
    return localStorage.getItem('hasUnreadMoments') !== 'false';
  });
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const savedConvs = localStorage.getItem('conversations');
      if (savedConvs) {
        const parsed = JSON.parse(savedConvs);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return [
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
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Group Chat States & Logic
  const [messagesSubTab, setMessagesSubTab] = useState<'private' | 'group'>('private');
  const [showCreateGroupModal, setShowCreateGroupModal] = useState<boolean>(false);
  const [activeGroupChatId, setActiveGroupChatId] = useState<string | null>(null);

  const [groupChats, setGroupChats] = useState<GroupChat[]>(() => {
    try {
      const saved = localStorage.getItem('groupChats');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      {
        id: 'group_1',
        name: '👑 豪门吃醋修罗场',
        topic: '极具嫉妒心的豪门角色聚在一起，争风吃醋的修罗场',
        memberRoleIds: ['1', '2', '8'],
        lastMsg: '女人，在我面前少跟林修远眉来眼去。',
        lastSenderName: '陆景琛',
        time: '16:45',
        unread: 2,
        updatedAt: Date.now(),
      },
      {
        id: 'group_2',
        name: '🎮 顶尖电竞开黑车队',
        topic: '全员大神聚集，商讨总决赛战术与日常打卡',
        memberRoleIds: ['6', '5', '1'],
        lastMsg: '今晚八点准时五排，迟到的扣月薪。',
        lastSenderName: '沈凉',
        time: '昨天',
        unread: 0,
        updatedAt: Date.now() - 3600000,
      },
    ];
  });

  const [groupMessages, setGroupMessages] = useState<Record<string, GroupMessage[]>>(() => {
    try {
      const saved = localStorage.getItem('groupMessages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch {}
    return {
      group_1: [
        {
          id: 1,
          groupId: 'group_1',
          sender: 'role',
          roleId: '1',
          roleName: '陆景琛',
          text: '听说今晚某人不仅答应了我，还私底下约了林修远？',
          time: '16:40',
          timestamp: Date.now() - 300000,
        },
        {
          id: 2,
          groupId: 'group_1',
          sender: 'role',
          roleId: '2',
          roleName: '林修远',
          text: '陆总说话何必这么刺耳？学妹只是想向我请教建筑设计而已。',
          time: '16:42',
          timestamp: Date.now() - 180000,
        },
        {
          id: 3,
          groupId: 'group_1',
          sender: 'role',
          roleId: '8',
          roleName: '许逸',
          text: '两位哥哥别吵啦，姐姐最喜欢的明明是我好不好~',
          time: '16:44',
          timestamp: Date.now() - 120000,
        },
        {
          id: 4,
          groupId: 'group_1',
          sender: 'role',
          roleId: '1',
          roleName: '陆景琛',
          text: '女人，在我面前少跟林修远眉来眼去。',
          time: '16:45',
          timestamp: Date.now() - 60000,
        },
      ],
      group_2: [
        {
          id: 10,
          groupId: 'group_2',
          sender: 'role',
          roleId: '6',
          roleName: '沈凉',
          text: '今晚八点准时五排，迟到的扣月薪。',
          time: '昨天',
          timestamp: Date.now() - 3600000,
        },
      ],
    };
  });

  const handleCreateGroup = (name: string, topic: string, roleIds: string[]) => {
    const newGroupId = `group_${Date.now()}`;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newGroup: GroupChat = {
      id: newGroupId,
      name,
      topic,
      memberRoleIds: roleIds,
      lastMsg: '已成功发起 AI 派对群聊，大家快来热聊吧！',
      lastSenderName: '系统通知',
      time: timeStr,
      unread: 0,
      updatedAt: Date.now(),
    };

    setGroupChats((prev) => {
      const updated = [newGroup, ...prev];
      localStorage.setItem('groupChats', JSON.stringify(updated));
      return updated;
    });

    const firstRoleId = roleIds[0];
    const firstRole = roles.find((r) => r.id === firstRoleId);
    const welcomeMsg: GroupMessage = {
      id: Date.now(),
      groupId: newGroupId,
      sender: 'role',
      roleId: firstRoleId,
      roleName: firstRole?.name || 'AI 成员',
      avatarUrl: ROLE_MEDIA_MAP[firstRoleId]?.avatarUrl || firstRole?.avatarUrl,
      text: `欢迎大家加入【${name}】！我随时在这里与你和其他人互动哦~`,
      time: timeStr,
      timestamp: Date.now(),
    };

    setGroupMessages((prev) => {
      const updated = { ...prev, [newGroupId]: [welcomeMsg] };
      localStorage.setItem('groupMessages', JSON.stringify(updated));
      return updated;
    });

    setShowCreateGroupModal(false);
    setActiveGroupChatId(newGroupId);
    showToast(`🎉 成功开启群聊【${name}】！`);
  };

  const handleSendGroupMessage = async (groupId: string, text: string, targetRoleId?: string) => {
    const targetGroup = groupChats.find((g) => g.id === groupId);
    if (!targetGroup) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const userMsg: GroupMessage = {
      id: Date.now(),
      groupId,
      sender: 'user',
      text,
      time: timeStr,
      timestamp: Date.now(),
    };

    setGroupMessages((prev) => {
      const currentMsgs = prev[groupId] || [];
      const updated = { ...prev, [groupId]: [...currentMsgs, userMsg] };
      localStorage.setItem('groupMessages', JSON.stringify(updated));
      return updated;
    });

    let responderRoleId = targetRoleId;
    if (!responderRoleId) {
      const validMemberIds = targetGroup.memberRoleIds;
      responderRoleId = validMemberIds[Math.floor(Math.random() * validMemberIds.length)];
    }
    const responderRole = roles.find((r) => r.id === responderRoleId);

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        let replyText = '';
        if (responderRole?.name.includes('陆景琛')) {
          replyText = `关于你说的“${text}”，我认为你需要单独和我解释一下，其他人少插嘴。`;
        } else if (responderRole?.name.includes('林修远')) {
          replyText = `别听陆总胡说。关于“${text}”，我觉得你处理得很棒，有任何不懂随时跟我说。`;
        } else if (responderRole?.name.includes('许逸')) {
          replyText = `姐姐只理我一个人好不好？在群里提到他们，我会吃醋的...`;
        } else if (responderRole?.name.includes('林小柔')) {
          replyText = `哥哥你在群里发言好帅气呀！大家都要对哥哥温柔一点哦。`;
        } else if (responderRole?.name.includes('沈凉')) {
          replyText = `有这工夫聊天，不如现在上线跟我走一局上分。`;
        } else if (responderRole?.name.includes('艾尔利斯')) {
          replyText = `星象轨迹在“${text}”这一刻产生了共鸣，很有见地的言论。`;
        } else if (responderRole?.name.includes('妙妙')) {
          replyText = `喵！我也觉得是这样喵！快抱抱妙妙犒劳一下！`;
        } else {
          replyText = `我是【${responderRole?.name || 'AI角色'}】，关于“${text}”，我很赞同，大家在群里聊天真热闹！`;
        }

        const roleMsg: GroupMessage = {
          id: Date.now() + 1,
          groupId,
          sender: 'role',
          roleId: responderRoleId,
          roleName: responderRole?.name || 'AI 成员',
          avatarUrl: ROLE_MEDIA_MAP[responderRoleId!]?.avatarUrl || responderRole?.avatarUrl,
          text: replyText,
          time: timeStr,
          timestamp: Date.now() + 1,
        };

        setGroupMessages((prev) => {
          const currentMsgs = prev[groupId] || [];
          const updated = { ...prev, [groupId]: [...currentMsgs, roleMsg] };
          localStorage.setItem('groupMessages', JSON.stringify(updated));
          return updated;
        });

        setGroupChats((prev) => {
          const updated = prev.map((g) => {
            if (g.id === groupId) {
              return {
                ...g,
                lastMsg: replyText,
                lastSenderName: responderRole?.name || 'AI',
                time: timeStr,
                updatedAt: Date.now(),
              };
            }
            return g;
          });
          localStorage.setItem('groupChats', JSON.stringify(updated));
          return updated;
        });

        resolve();
      }, 1000);
    });
  };

  const handleTriggerAiCollision = async (groupId: string) => {
    const targetGroup = groupChats.find((g) => g.id === groupId);
    if (!targetGroup || targetGroup.memberRoleIds.length === 0) return;

    const randomRoleId = targetGroup.memberRoleIds[Math.floor(Math.random() * targetGroup.memberRoleIds.length)];
    const role = roles.find((r) => r.id === randomRoleId);

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const collisions = [
          `（看向群里的其他人）你们聊得倒是挺欢，不知道当事人怎么想？`,
          `既然大家都在，不如我们各自说一个关于她的秘密？`,
          `刚才的话我都看到了。希望大家在群里能保持克制，特别是对她说话的时候。`,
          `好热闹呀！大家玩得开心，我也要一直陪在她身边才行！`,
        ];

        const text = collisions[Math.floor(Math.random() * collisions.length)];

        const roleMsg: GroupMessage = {
          id: Date.now(),
          groupId,
          sender: 'role',
          roleId: randomRoleId,
          roleName: role?.name || 'AI 成员',
          avatarUrl: ROLE_MEDIA_MAP[randomRoleId]?.avatarUrl || role?.avatarUrl,
          text,
          time: timeStr,
          timestamp: Date.now(),
        };

        setGroupMessages((prev) => {
          const currentMsgs = prev[groupId] || [];
          const updated = { ...prev, [groupId]: [...currentMsgs, roleMsg] };
          localStorage.setItem('groupMessages', JSON.stringify(updated));
          return updated;
        });

        setGroupChats((prev) => {
          const updated = prev.map((g) => {
            if (g.id === groupId) {
              return {
                ...g,
                lastMsg: text,
                lastSenderName: role?.name || 'AI',
                time: timeStr,
                updatedAt: Date.now(),
              };
            }
            return g;
          });
          localStorage.setItem('groupChats', JSON.stringify(updated));
          return updated;
        });

        resolve();
      }, 900);
    });
  };

  const handleClearGroupHistory = (groupId: string) => {
    setGroupMessages((prev) => {
      const copy = { ...prev };
      delete copy[groupId];
      localStorage.setItem('groupMessages', JSON.stringify(copy));
      return copy;
    });
  };
  const [intimacies, setIntimacies] = useState<Record<string, number>>(() => loadAllIntimacies());
  const [follows, setFollows] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('follows') || '["lujingchen", "linxiaorou"]');
    } catch {
      return ['lujingchen', 'linxiaorou'];
    }
  });

  // Filter valid followed roles matching existing roles
  const followedRoles = useMemo(() => {
    return roles.filter((role) => follows.includes(role.id));
  }, [roles, follows]);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const stored = localStorage.getItem(`profile_${savedUser}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.vip_text && (parsed.vip_text.includes('黄金') || parsed.vip_text.includes('双会员') || parsed.vip_level > 0 || parsed.vip_status === 1)) {
            parsed.vip_text = '💎 订阅&技能双会员';
            parsed.vip_status = 1;
            parsed.vip_level = 1;
          }
          return parsed;
        } catch {}
      }
      if (savedUser === 'admin' || savedUser === '网巢体验官') {
        return {
          id: 10086,
          username: 'admin',
          nickname: '网巢体验官',
          avatar: '😊',
          money: 128.5,
          score: 328,
          vip_level: 1,
          vip_text: '💎 订阅&技能双会员',
          vip_status: 1,
        };
      }
      return {
        id: Date.now(),
        username: savedUser,
        nickname: savedUser,
        avatar: '😊',
        money: 0.00,
        score: 0,
        vip_level: 1,
        vip_text: '💎 订阅&技能双会员',
        vip_status: 1,
      };
    }
    return {
      id: 10086,
      username: 'admin',
      nickname: '网巢体验官',
      avatar: '😊',
      money: 128.5,
      score: 328,
      vip_level: 1,
      vip_text: '💎 订阅&技能双会员',
      vip_status: 1,
    };
  });

  // New States for Profile Bottom Panel Dashboard (Gamelike experience with Diamonds, Attic, Tasks, and Showcase)
  const [diamonds, setDiamonds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('profile_diamonds');
      if (saved !== null) return parseInt(saved, 10);
    } catch {}
    return 1; // Default to 1 as shown in the mockup image
  });

  const [dailyCheckedIn, setDailyCheckedIn] = useState<boolean>(() => {
    return localStorage.getItem('daily_checked_in') === 'true';
  });

  const [profileActiveTab, setProfileActiveTab] = useState<'attic' | 'matters' | 'showcase'>('attic');
  const [atticActiveSubTab, setAtticActiveSubTab] = useState<'roles' | 'stories' | 'theaters' | 'groupChats' | 'decorations'>('roles');

  const [isAdLoading, setIsAdLoading] = useState<boolean>(false);
  const [unlockedDecorations, setUnlockedDecorations] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('unlocked_decorations');
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['dec_ljc_suit']; // First decoration unlocked by default
  });

  const [unlockedShowcase, setUnlockedShowcase] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('unlocked_showcase');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [claimedTasks, setClaimedTasks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('claimed_tasks');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const updateDiamonds = (newCount: number) => {
    setDiamonds(newCount);
    localStorage.setItem('profile_diamonds', String(newCount));
  };

  const handleUnlockDecoration = (decId: string, cost: number) => {
    if (diamonds < cost) {
      showToast('💎 您的钻石不足，请通过“每日福利”或“看视频”免费领钻吧！');
      return;
    }
    updateDiamonds(diamonds - cost);
    setUnlockedDecorations((prev) => {
      const updated = [...prev, decId];
      localStorage.setItem('unlocked_decorations', JSON.stringify(updated));
      return updated;
    });
    showToast('✨ 成功解锁该角色服装装饰！可在详情里穿戴。');
  };

  const handleUnlockShowcase = (itemId: string, cost: number) => {
    if (diamonds < cost) {
      showToast('💎 您的钻石不足，请通过“每日福利”或“看视频”免费领钻吧！');
      return;
    }
    updateDiamonds(diamonds - cost);
    setUnlockedShowcase((prev) => {
      const updated = [...prev, itemId];
      localStorage.setItem('unlocked_showcase', JSON.stringify(updated));
      return updated;
    });
    showToast('✨ 成功购买并解锁该橱窗商品！已添加至您的收藏。');
  };

  const handleClaimTask = (taskId: string, reward: number) => {
    if (claimedTasks.includes(taskId)) return;
    updateDiamonds(diamonds + reward);
    setClaimedTasks((prev) => {
      const updated = [...prev, taskId];
      localStorage.setItem('claimed_tasks', JSON.stringify(updated));
      return updated;
    });
    showToast(`🎉 成功领到任务奖励！钻石 💎 +${reward}！`);
  };

  const totalStoryCount = useMemo(() => {
    let customCount = 0;
    try {
      const saved = localStorage.getItem('user_custom_storylines');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) customCount = parsed.length;
      }
    } catch {}
    const defaultCount = Object.values(DEFAULT_STORYLINES).reduce((acc, curr) => acc + curr.length, 0);
    return defaultCount + customCount;
  }, []);

  const totalTheaterCount = useMemo(() => {
    let customCount = 0;
    try {
      const saved = localStorage.getItem('user_custom_theaters');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) customCount = parsed.length;
      }
    } catch {}
    const defaultCount = Object.values(DEFAULT_THEATERS).reduce((acc, curr) => acc + curr.length, 0);
    return defaultCount + customCount;
  }, []);

  // Modals & Tools
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showRechargeModal, setShowRechargeModal] = useState<boolean>(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState<boolean>(false);

  // Wallet page states
  const [walletSelectedAmount, setWalletSelectedAmount] = useState<number>(30);
  const [isCustomWalletAmount, setIsCustomWalletAmount] = useState<boolean>(false);
  const [customWalletInput, setCustomWalletInput] = useState<string>('50');
  const [walletPayMethod, setWalletPayMethod] = useState<'wechat' | 'alipay' | 'sim'>('wechat');
  const [isWalletCharging, setIsWalletCharging] = useState<boolean>(false);
  const [walletTransactions, setWalletTransactions] = useState<Array<{ date: string; name: string; amount: string; positive: boolean }>>([
    { date: '10-01', name: '会员充值返现', amount: '+¥30.00', positive: true },
    { date: '09-28', name: '打赏角色咖啡', amount: '-¥6.00', positive: false },
    { date: '09-25', name: '微信快捷充值', amount: '+¥68.00', positive: true },
  ]);

  const effectiveWalletAmount = isCustomWalletAmount
    ? Math.max(1, parseFloat(customWalletInput) || 0)
    : walletSelectedAmount;

  const handleInlineWalletRecharge = () => {
    const chargeVal = effectiveWalletAmount;
    if (chargeVal <= 0) {
      showToast('请输入有效的充值金额！');
      return;
    }
    setIsWalletCharging(true);
    setTimeout(() => {
      setIsWalletCharging(false);

      setUserProfile((prev) => ({
        ...prev,
        money: prev.money + chargeVal,
      }));

      const now = new Date();
      const monthStr = (now.getMonth() + 1).toString().padStart(2, '0');
      const dayStr = now.getDate().toString().padStart(2, '0');
      const payName = walletPayMethod === 'wechat' ? '微信充值' : walletPayMethod === 'alipay' ? '支付宝充值' : '快捷卡充值';

      setWalletTransactions((prev) => [
        {
          date: `${monthStr}-${dayStr}`,
          name: payName,
          amount: `+¥${chargeVal.toFixed(2)}`,
          positive: true,
        },
        ...prev,
      ]);

      showToast(`🎉 充值 ¥${chargeVal.toFixed(2)} 成功！已实时到账`);
    }, 600);
  };

  // Helper: Toast Message
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2200);
  };

  // Initial Load from API
  useEffect(() => {
    async function loadData() {
      const fetchedRoles = await api.getRoles();
      if (fetchedRoles && fetchedRoles.length > 0) {
        const enriched = fetchedRoles.map((r) => ({
          ...r,
          avatarUrl: ROLE_MEDIA_MAP[r.id]?.avatarUrl || r.avatarUrl,
          portraitUrl: ROLE_MEDIA_MAP[r.id]?.portraitUrl || r.portraitUrl,
        }));
        setRoles(enriched);
      }
      const convs = await api.getConversations();
      if (convs && convs.length > 0) {
        setConversations(convs);
      } else {
        const savedConvs = localStorage.getItem('conversations');
        if (savedConvs) {
          try {
            setConversations(JSON.parse(savedConvs));
          } catch (e) {
            console.error(e);
          }
        }
      }
      const profile = await api.getUserProfile();
      if (profile && profile.user) {
        setUserProfile(profile.user);
      }
    }
    loadData();
  }, []);

  // Sync follows to LocalStorage and clean invalid IDs
  useEffect(() => {
    if (roles.length > 0) {
      const validFollows = follows.filter((id) => roles.some((r) => r.id === id));
      if (validFollows.length !== follows.length) {
        setFollows(validFollows);
        localStorage.setItem('follows', JSON.stringify(validFollows));
        return;
      }
    }
    localStorage.setItem('follows', JSON.stringify(follows));
  }, [follows, roles]);

  // Clear unread moments badge when entering moments page
  useEffect(() => {
    if (currentPage === 'moments') {
      setHasUnreadMoments(false);
      localStorage.setItem('hasUnreadMoments', 'false');
    }
  }, [currentPage]);

  // Sync conversations to LocalStorage
  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations));
  }, [conversations]);

  const handleRoleCreateSuccess = (newRole: Role) => {
    setRoles((prev) => [newRole, ...prev]);
    setFollows((prev) => [newRole.id, ...prev]);
    try {
      const existing = JSON.parse(localStorage.getItem('custom_created_roles') || '[]');
      localStorage.setItem('custom_created_roles', JSON.stringify([newRole, ...existing]));
    } catch {
      localStorage.setItem('custom_created_roles', JSON.stringify([newRole]));
    }
  };

  const handleDeleteCustomRole = (roleId: string) => {
    setRoles((prev) => prev.filter((r) => r.id !== roleId));
    try {
      const remaining = roles.filter((r) => r.id.startsWith('custom_') && r.id !== roleId);
      localStorage.setItem('custom_created_roles', JSON.stringify(remaining));
    } catch {
      // ignore
    }
  };

  // Load chat messages when entering chat with a role
  useEffect(() => {
    if (activeRole) {
      async function loadChat() {
        if (!activeRole) return;
        const history = await api.getChatHistory(activeRole.id);
        if (history && history.length > 0) {
          setChatMessages(history);
        } else {
          // fallback to localStorage
          const localAll = JSON.parse(localStorage.getItem('chatHistories') || '{}');
          const localHistory = localAll[activeRole.id] || [];
          setChatMessages(localHistory);
        }
      }
      loadChat();
    }
  }, [activeRole]);

  // Auth Handler
  const handleAuth = async () => {
    const user = usernameInput.trim();
    const pwd = passwordInput.trim();

    if (!user || !pwd) {
      setLoginTip('请输入用户名和密码');
      return;
    }

    if (loginMode === 'register') {
      if (passwordInput !== confirmPwdInput) {
        setLoginTip('两次输入的密码不一致');
        return;
      }
      const res = await api.register(user, pwd);
      if (res.success) {
        showToast('注册成功！请使用新账号登录');
        setLoginMode('login');
        setLoginTip('');
        setConfirmPwdInput('');
      } else {
        setLoginTip(res.msg || '注册失败，该用户名已被使用');
      }
      return;
    }

    // Login
    const res = await api.login(user, pwd);
    if (res.success && res.user) {
      const userNick = res.user.nickname || res.user.username || user;
      const targetUserKey = res.user.username || user;
      setCurrentUser(userNick);
      localStorage.setItem('currentUser', targetUserKey);
      setUserProfile(res.user);
      localStorage.setItem(`profile_${targetUserKey}`, JSON.stringify(res.user));

      showToast(`登录成功，欢迎回来 ${userNick}！`);
      setCurrentPage('home');
      setUsernameInput('');
      setPasswordInput('');
      setLoginTip('');
    } else {
      setLoginTip(res.msg || '用户名或密码错误，请核对后再试');
    }
  };

  const handleLogout = () => {
    showToast('已安全退出登录');
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setUserProfile({
      id: 0,
      username: '',
      nickname: '未登录',
      avatar: '😊',
      money: 0,
      score: 0,
      vip_level: 0,
      vip_text: '普通用户',
      vip_status: 0,
    });
    setCurrentPage('login');
  };

  // Chat Sending Handler
  const handleSendMessage = async (text: string) => {
    if (!activeRole) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const userMsg: ChatMessage = {
      id: Date.now(),
      roleId: activeRole.id,
      sender: 'user',
      text,
      time: timeStr,
      timestamp: Date.now(),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Call API (Express / ThinkPHP 5 + Gemini or Persona Fallback)
    const result = await api.sendChatMessage(activeRole.id, text);

    let roleReply = '';
    if (result && result.reply) {
      roleReply = result.reply;
    } else {
      // Fallback
      roleReply = `我一直都在认真听你说话呢。关于“${text}”，我觉得你说的很有意思。`;
    }

    setTimeout(() => {
      setIsTyping(false);
      const roleMsg: ChatMessage = {
        id: Date.now() + 1,
        roleId: activeRole.id,
        sender: 'role',
        text: roleReply,
        time: timeStr,
        timestamp: Date.now() + 1,
      };
      setChatMessages((prev) => {
        const updated = [...prev, roleMsg];
        // Save to local cache
        const allHist = JSON.parse(localStorage.getItem('chatHistories') || '{}');
        allHist[activeRole.id] = updated;
        localStorage.setItem('chatHistories', JSON.stringify(allHist));
        return updated;
      });

      // Update conversations
      setConversations((prev) => {
        const existingIdx = prev.findIndex((c) => c.roleId === activeRole.id);
        const newConv: Conversation = {
          name: activeRole.name,
          roleId: activeRole.id,
          emoji: activeRole.emoji,
          cover: activeRole.cover,
          lastMsg: roleReply,
          time: timeStr,
          unread: 0,
          updatedAt: Date.now(),
        };
        if (existingIdx >= 0) {
          const copy = [...prev];
          copy.splice(existingIdx, 1);
          return [newConv, ...copy];
        } else {
          return [newConv, ...prev];
        }
      });
    }, 900);
  };

  // Update Intimacy (Direct / Bonus)
  const handleUpdateIntimacy = (roleId: string, added: number) => {
    const result = saveIntimacy(roleId, added);
    setIntimacies((prev) => ({
      ...prev,
      [roleId]: result.newPoints,
    }));
    if (result.isLevelUp) {
      const targetRole = roles.find((r) => r.id === roleId);
      showToast(`🎉 恭喜！你与【${targetRole?.name || 'TA'}】的羁绊升级到 Lv.${result.newLevel}！`);
    }
  };

  // Update Chat Intimacy (Subject to 50 pts/day limit)
  const handleChatIntimacy = (roleId: string): AddChatIntimacyResult => {
    const result = addDailyChatIntimacy(roleId);
    setIntimacies((prev) => ({
      ...prev,
      [roleId]: result.newTotalPoints,
    }));
    if (result.isLevelUp) {
      const targetRole = roles.find((r) => r.id === roleId);
      showToast(`🎉 恭喜！你与【${targetRole?.name || 'TA'}】的羁绊升级到 Lv.${result.newLevel}！`);
    }
    return result;
  };

  // Delete specific message
  const handleDeleteMessage = (msgId: number) => {
    if (!activeRole) return;
    setChatMessages((prev) => {
      const updated = prev.filter((m) => m.id !== msgId);
      const allHist = JSON.parse(localStorage.getItem('chatHistories') || '{}');
      allHist[activeRole.id] = updated;
      localStorage.setItem('chatHistories', JSON.stringify(allHist));
      return updated;
    });
  };

  // Regenerate role reply
  const handleRegenerateMessage = async (roleMsgId: number) => {
    if (!activeRole) return;
    const msgIndex = chatMessages.findIndex((m) => m.id === roleMsgId);
    if (msgIndex === -1) return;

    // Find preceding user message
    let precedingUserText = '你好呀';
    for (let i = msgIndex - 1; i >= 0; i--) {
      if (chatMessages[i].sender === 'user') {
        precedingUserText = chatMessages[i].text;
        break;
      }
    }

    // Keep messages before this role message
    const trimmedMessages = chatMessages.slice(0, msgIndex);
    setChatMessages(trimmedMessages);
    setIsTyping(true);

    const result = await api.sendChatMessage(activeRole.id, precedingUserText);
    const roleReply =
      result?.reply || `我重新梳理了一下想法：关于“${precedingUserText}”，我是这样看待的...`;

    setTimeout(() => {
      setIsTyping(false);
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const newRoleMsg: ChatMessage = {
        id: Date.now(),
        roleId: activeRole.id,
        sender: 'role',
        text: roleReply,
        time: timeStr,
        timestamp: Date.now(),
      };
      setChatMessages((prev) => {
        const updated = [...prev, newRoleMsg];
        const allHist = JSON.parse(localStorage.getItem('chatHistories') || '{}');
        allHist[activeRole.id] = updated;
        localStorage.setItem('chatHistories', JSON.stringify(allHist));
        return updated;
      });
    }, 850);
  };

  // Follow / Unfollow Toggle
  const handleToggleFollow = async (roleId: string) => {
    await api.toggleFollow(roleId);
    setFollows((prev) => {
      const isAlready = prev.includes(roleId);
      if (isAlready) {
        showToast('已取消关注');
        return prev.filter((id) => id !== roleId);
      } else {
        showToast('关注成功！');
        return [...prev, roleId];
      }
    });
  };

  // Mark specific conversation as read
  const markConversationAsRead = (roleId: string) => {
    setConversations((prev) => {
      const updated = prev.map((c) => (c.roleId === roleId ? { ...c, unread: 0 } : c));
      localStorage.setItem('conversations', JSON.stringify(updated));
      return updated;
    });
    api.markAsRead(roleId);
  };

  // Mark all conversations as read
  const markAllConversationsAsRead = () => {
    setConversations((prev) => {
      const updated = prev.map((c) => ({ ...c, unread: 0 }));
      localStorage.setItem('conversations', JSON.stringify(updated));
      return updated;
    });
    api.markAllAsRead();
    showToast('单聊已全部标为已读 ✨');
  };

  // Mark all group chats as read
  const markAllGroupChatsAsRead = () => {
    setGroupChats((prev) => {
      const updated = prev.map((g) => ({ ...g, unread: 0 }));
      localStorage.setItem('groupChats', JSON.stringify(updated));
      return updated;
    });
    showToast('群聊已全部标为已读 ✨');
  };

  // Start chat with a role
  const startChatWithRole = (role: Role, initialPrompt?: string) => {
    const roleWithVirtualMedia: Role = {
      ...role,
      avatarUrl: ROLE_MEDIA_MAP[role.id]?.avatarUrl || role.avatarUrl,
      portraitUrl: ROLE_MEDIA_MAP[role.id]?.portraitUrl || role.portraitUrl,
    };
    setActiveRole(roleWithVirtualMedia);
    setDetailRole(null);
    setCurrentPage('chat');
    markConversationAsRead(role.id);

    if (initialPrompt) {
      setTimeout(() => {
        handleSendMessage(initialPrompt);
      }, 350);
    }
  };

  // Filtered Roles for Home
  const filteredHomeRoles = roles.filter((r) => {
    const matchCategory =
      selectedCategory === '全部' ||
      r.tags.includes(selectedCategory) ||
      r.title.includes(selectedCategory);
    const matchSearch =
      !homeSearchKeyword ||
      r.name.includes(homeSearchKeyword) ||
      r.title.includes(homeSearchKeyword) ||
      r.desc.includes(homeSearchKeyword);
    return matchCategory && matchSearch;
  });

  // Filtered Roles for Explore Plaza
  const filteredExploreRoles = roles.filter((r) => {
    const matchCategory =
      selectedCategory === '全部' ||
      r.tags.includes(selectedCategory) ||
      r.title.includes(selectedCategory);
    const matchSearch =
      !exploreKeyword ||
      r.name.includes(exploreKeyword) ||
      r.title.includes(exploreKeyword) ||
      r.tags.some((t) => t.includes(exploreKeyword));
    return matchCategory && matchSearch;
  });

  const totalPrivateUnread = useMemo(
    () => conversations.reduce((acc, curr) => acc + (curr.unread || 0), 0),
    [conversations]
  );

  const totalGroupUnread = useMemo(
    () => groupChats.reduce((acc, curr) => acc + (curr.unread || 0), 0),
    [groupChats]
  );

  const totalUnread = useMemo(
    () => totalPrivateUnread + totalGroupUnread,
    [totalPrivateUnread, totalGroupUnread]
  );

  return (
    <PhoneFrame>
      <Toast message={toastMessage} />

      {/* 1. LOGIN / REGISTER PAGE */}
      {currentPage === 'login' && (
        <div id="page-login" className="h-full flex flex-col justify-between px-6 pt-10 pb-8 bg-gradient-to-b from-[#24133b] via-[#150a24] to-[#0a0a0f]">
          <div className="text-center pt-8">
            <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-3xl bg-purple-600/30 border border-purple-500/40 shadow-xl mb-4">
              💜
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-wide">网巢</h1>
            <p className="text-xs text-purple-300/60 mt-1">遇见你的心动AI伴侣 · 智能拟真社交</p>
          </div>

          <div className="w-full my-auto space-y-4">
            <div className="space-y-3">
              <div className="flex items-center border-b border-white/20 pb-2.5 px-1">
                <span className="text-base mr-3 opacity-60">👤</span>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="用户名 / 手机号"
                  className="w-full bg-transparent text-sm text-white placeholder-white/40 outline-none"
                />
              </div>

              <div className="flex items-center border-b border-white/20 pb-2.5 px-1">
                <span className="text-base mr-3 opacity-60">🔒</span>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="请输入密码"
                  className="w-full bg-transparent text-sm text-white placeholder-white/40 outline-none"
                />
              </div>

              {loginMode === 'register' && (
                <div className="flex items-center border-b border-white/20 pb-2.5 px-1 animate-fade-in">
                  <span className="text-base mr-3 opacity-60">🔑</span>
                  <input
                    type="password"
                    value={confirmPwdInput}
                    onChange={(e) => setConfirmPwdInput(e.target.value)}
                    placeholder="请再次确认密码"
                    className="w-full bg-transparent text-sm text-white placeholder-white/40 outline-none"
                  />
                </div>
              )}
            </div>

            {loginTip && <div className="text-xs text-red-400 text-center">{loginTip}</div>}

            <button
              id="btn-login-submit"
              onClick={handleAuth}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-sm shadow-lg shadow-purple-500/30 active:scale-95 transition"
            >
              {loginMode === 'login' ? '登 录' : '注 册 账 号'}
            </button>

            <div className="text-center pt-2 space-y-2">
              <button
                onClick={() => {
                  setLoginMode(loginMode === 'login' ? 'register' : 'login');
                  setLoginTip('');
                }}
                className="text-xs text-purple-300 hover:text-purple-200 underline underline-offset-4 transition"
              >
                {loginMode === 'login' ? '还没有账号？点击此处免费注册' : '已有网巢账号？点击直接登录'}
              </button>
              {loginMode === 'login' && (
                <div>
                  <div className="text-[11px] text-white/40 bg-white/5 py-1 px-3 rounded-full inline-block">
                    💡 默认测试账号: <span className="text-purple-300 font-mono">admin</span> / 密码: <span className="text-purple-300 font-mono">123</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-center pt-4">
            <div className="text-[11px] text-white/30 mb-3">其他第三方快捷体验</div>
            <div className="flex justify-center items-center gap-6">
              <button
                onClick={() => showToast('已模拟微信快捷一键登录')}
                className="w-10 h-10 rounded-full bg-[#07C160]/90 text-white flex items-center justify-center text-lg active:scale-90 transition shadow-sm"
              >
                💬
              </button>
              <button
                onClick={() => showToast('已模拟QQ快捷一键登录')}
                className="w-10 h-10 rounded-full bg-[#12B7F5]/90 text-white flex items-center justify-center text-lg active:scale-90 transition shadow-sm"
              >
                🐧
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1.5 RECOMMEND / HOME IMMERSIVE FEED PAGE */}
      {currentPage === 'recommend' && (
        <HomeRecommendView
          roles={roles}
          follows={follows}
          onToggleFollow={handleToggleFollow}
          onStartChat={startChatWithRole}
          onOpenDetail={setDetailRole}
          onShowToast={showToast}
          onOpenSearch={() => setCurrentPage('home')}
        />
      )}

      {/* 2. HOME (DISCOVERY) PAGE */}
      {currentPage === 'home' && (
        <div id="page-home" className="h-full flex flex-col bg-gradient-to-b from-[#180e33] via-[#0b0a13] to-[#0a0a0f] overflow-hidden relative">
          {/* Top Search Bar */}
          <div className="px-5 pt-3 pb-2 shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center bg-white/10 hover:bg-white/15 focus-within:bg-white/20 border border-white/10 focus-within:border-purple-500/50 rounded-full px-4 py-2 backdrop-blur-md transition shadow-sm">
                <Search size={15} className="text-white/40 mr-2 shrink-0" />
                <input
                  type="text"
                  value={homeSearchKeyword}
                  onChange={(e) => setHomeSearchKeyword(e.target.value)}
                  placeholder="搜索梦中人..."
                  className="w-full bg-transparent text-xs text-white placeholder-white/40 outline-none"
                />
                {homeSearchKeyword && (
                  <button
                    onClick={() => setHomeSearchKeyword('')}
                    className="p-1 rounded-full hover:bg-white/15 text-white/40 hover:text-white transition active:scale-90 shrink-0"
                    title="清除搜索"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              <button
                onClick={() => showToast('✨ 正在为您推荐匹配度最高的梦中人...')}
                className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-purple-300 hover:text-white transition active:scale-90 shrink-0"
              >
                <Sparkles size={16} />
              </button>
            </div>
          </div>

          {/* Scrollable Main Content */}
          <div className="flex-1 overflow-y-auto px-5 py-3 space-y-4 pb-28 no-scrollbar">

            {/* Category Chips & Filters Header */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black text-white tracking-wide flex items-center gap-1.5">
                  <span>精选 AI 伙伴</span>
                  <span className="text-[10px] text-purple-300 bg-purple-500/20 px-2 py-0.2 rounded-full font-bold border border-purple-500/30">
                    {filteredHomeRoles.length} 位在线
                  </span>
                </h2>
                <span className="text-[11px] text-white/40">随时随地开启心动聊天</span>
              </div>

              <CategoryChips
                categories={['全部', '霸主', '温柔', '病娇', '清冷', '玄幻', '电竞', '治愈']}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>

            {/* Role List Cards */}
            <div className="space-y-3 pt-1">
              {filteredHomeRoles.length === 0 ? (
                <div className="text-center py-12 text-white/40 text-xs space-y-2">
                  <p>没有找到符合搜索的角色</p>
                  <button
                    onClick={() => {
                      setSelectedCategory('全部');
                      setHomeSearchKeyword('');
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs"
                  >
                    重置筛选
                  </button>
                </div>
              ) : (
                filteredHomeRoles.map((role) => {
                  const intimacyData = getIntimacyData(intimacies[role.id] || 0);
                  return (
                    <div
                      key={role.id}
                      onClick={() => setDetailRole(role)}
                      className="p-3.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-2xl flex items-center gap-3.5 cursor-pointer active:scale-[0.98] transition group relative overflow-hidden"
                    >
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-white/15 relative">
                        <img
                          src={ROLE_MEDIA_MAP[role.id]?.avatarUrl || role.avatarUrl || '/avatars/lujingchen.jpg'}
                          alt={role.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-top group-hover:scale-110 transition duration-300"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition">
                              {role.name}
                            </h3>
                            <span className="px-1.5 py-0.2 rounded-md bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[9px] font-extrabold">
                              热门
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 mt-1">
                          {role.tags.slice(0, 2).map((tag, tIdx) => (
                            <span key={tIdx} className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-200 text-[9px]">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <p className="text-xs text-white/60 truncate mt-1.5 font-light">
                          “{role.desc}”
                        </p>

                        <div className="flex items-center gap-3 text-[10px] text-white/40 mt-2 font-mono">
                          <span>入梦 {role.users}</span>
                          <span>梦境 {role.follows}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. EXPLORE / ROLE SQUARE PAGE */}
      {currentPage === 'explore' && (
        <div id="page-explore" className="h-full flex flex-col bg-[#0a0a0f] overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 flex items-center gap-3 border-b border-white/5 shrink-0">
            <button
              onClick={() => setCurrentPage('home')}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white"
            >
              <ArrowLeft size={18} />
            </button>
            <h2 className="text-base font-bold text-white">角色广场</h2>
          </div>

          {/* Search */}
          <div className="px-4 pt-3 pb-2 shrink-0">
            <div className="flex items-center bg-white/8 hover:bg-white/10 focus-within:bg-white/12 rounded-2xl px-3.5 py-2 border border-white/10 focus-within:border-purple-500/40 transition">
              <Search size={14} className="text-white/40 mr-2 shrink-0" />
              <input
                type="text"
                value={exploreKeyword}
                onChange={(e) => setExploreKeyword(e.target.value)}
                placeholder="搜索角色名或性格标签..."
                className="w-full bg-transparent text-xs text-white placeholder-white/40 outline-none"
              />
              {exploreKeyword && (
                <button
                  onClick={() => setExploreKeyword('')}
                  className="p-1 rounded-full hover:bg-white/15 text-white/40 hover:text-white transition active:scale-90 shrink-0"
                  title="清除搜索"
                  aria-label="清除搜索"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Category Chips */}
          <CategoryChips
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            className="pb-2 shrink-0"
          />

          {/* Dual Column Grid */}
          <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3 pb-24">
            {filteredExploreRoles.map((role) => {
              const roleIntimacy = getIntimacyData(intimacies[role.id] || 0);
              const media =
                ROLE_MEDIA_MAP[role.id]?.portraitUrl ||
                ROLE_MEDIA_MAP[role.id]?.avatarUrl ||
                role.portraitUrl ||
                role.avatarUrl;
              return (
                <div
                  key={role.id}
                  onClick={() => setDetailRole(role)}
                  className="h-64 rounded-2xl overflow-hidden relative cursor-pointer group active:scale-95 transition border border-white/10 shadow-md flex flex-col justify-end bg-[#12121c]"
                >
                  {/* High-res Portrait Art or Cover */}
                  {media ? (
                    <img
                      src={media}
                      alt={role.name}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div
                      className={`absolute inset-0 flex items-center justify-center text-7xl select-none ${role.cover}`}
                    >
                      {role.emoji}
                    </div>
                  )}

                  {/* Gradient shadow overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/20" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                    <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] text-white/90 border border-white/10">
                      {role.title}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-pink-950/70 backdrop-blur-md text-[10px] text-pink-300 border border-pink-500/30 flex items-center gap-1 font-bold shadow-sm">
                      <span>❤️</span>
                      <span>Lv.{roleIntimacy.level}</span>
                    </span>
                  </div>

                  {/* Bottom Overlay Info */}
                  <div className="relative z-10 p-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition">
                        {role.name}
                      </h4>
                      <span className="text-[10px] text-pink-300 font-medium">{roleIntimacy.title}</span>
                    </div>
                    <div className="text-[10px] text-white/70 line-clamp-1 mt-0.5">
                      {role.tags.join(' · ')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. MESSAGES / CONVERSATIONS & GROUP CHATS PAGE */}
      {currentPage === 'messages' && activeGroupChatId && (
        (() => {
          const activeGroup = groupChats.find((g) => g.id === activeGroupChatId);
          if (!activeGroup) return null;
          const msgs = groupMessages[activeGroupChatId] || [];
          return (
            <GroupChatView
              group={activeGroup}
              roles={roles}
              messages={msgs}
              onBack={() => setActiveGroupChatId(null)}
              onSendMessage={handleSendGroupMessage}
              onTriggerAiCollision={handleTriggerAiCollision}
              onClearHistory={handleClearGroupHistory}
              onShowToast={showToast}
            />
          );
        })()
      )}

      {currentPage === 'messages' && !activeGroupChatId && (
        <div id="page-messages" className="h-full flex flex-col bg-[#0a0a0f] overflow-hidden">
          {/* Header */}
          <div className="px-5 pt-3 pb-2 shrink-0 space-y-3 border-b border-white/5 bg-[#0d0b17]/80 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-white tracking-wide">消息</h1>
                <p className="text-xs text-white/40 mt-0.5">随时与心动角色私聊或多角群聊碰撞</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCreateGroupModal(true)}
                  className="flex items-center gap-1.5 text-xs text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-3 py-1.5 rounded-full font-extrabold shadow-md shadow-purple-500/20 transition active:scale-95 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>发起群聊</span>
                </button>

                <button
                  onClick={messagesSubTab === 'private' ? markAllConversationsAsRead : markAllGroupChatsAsRead}
                  disabled={messagesSubTab === 'private' ? totalPrivateUnread === 0 : totalGroupUnread === 0}
                  className={`flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-full border transition active:scale-95 cursor-pointer ${
                    (messagesSubTab === 'private' ? totalPrivateUnread > 0 : totalGroupUnread > 0)
                      ? 'text-purple-300 bg-purple-500/15 hover:bg-purple-500/25 border-purple-500/30'
                      : 'text-white/30 bg-white/[0.02] border-white/5 opacity-40 cursor-not-allowed pointer-events-none'
                  }`}
                >
                  <CheckCheck size={13} />
                  <span>已读</span>
                </button>
              </div>
            </div>

            {/* Sub Tabs: Private Chat vs Group Chat */}
            <div className="flex items-center p-1 rounded-2xl bg-white/[0.04] border border-white/10">
              <button
                type="button"
                onClick={() => setMessagesSubTab('private')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  messagesSubTab === 'private'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <MessageSquare size={13} />
                <span>单聊私信{totalPrivateUnread > 0 ? ` (${totalPrivateUnread})` : ''}</span>
              </button>

              <button
                type="button"
                onClick={() => setMessagesSubTab('group')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  messagesSubTab === 'group'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <Users size={13} />
                <span>AI 派对群聊{totalGroupUnread > 0 ? ` (${totalGroupUnread})` : ''}</span>
                {totalGroupUnread > 0 && (
                  <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                )}
              </button>
            </div>
          </div>

          {/* Conversations or Group List */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/5 pb-24">
            {messagesSubTab === 'private' ? (
              conversations.length === 0 ? (
                <div className="text-center py-20 text-white/40">
                  <div className="text-4xl mb-3">💬</div>
                  <div className="text-sm font-medium">暂无私聊会话</div>
                  <button
                    onClick={() => setCurrentPage('home')}
                    className="mt-3 px-4 py-1.5 rounded-full bg-purple-600/30 text-purple-300 text-xs border border-purple-500/40 hover:bg-purple-600/50 transition cursor-pointer"
                  >
                    去首页挑选角色聊聊
                  </button>
                </div>
              ) : (
                conversations.map((conv) => {
                  const foundRole = roles.find((r) => r.id === conv.roleId);
                  const intimacyData = getIntimacyData(intimacies[conv.roleId] || 0);
                  return (
                    <div
                      key={conv.roleId}
                      onClick={() => {
                        if (foundRole) startChatWithRole(foundRole);
                      }}
                      className="flex items-center px-5 py-3.5 hover:bg-white/5 active:bg-white/8 cursor-pointer transition"
                    >
                      <div className="relative mr-3.5 shrink-0">
                        <RoleAvatar
                          name={conv.name}
                          avatarUrl={ROLE_MEDIA_MAP[conv.roleId]?.avatarUrl || foundRole?.avatarUrl}
                          emoji={conv.emoji}
                          coverClass={conv.cover}
                          size="lg"
                          showOnlineBadge
                        />
                        <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-black/80 text-[8px] text-pink-300 font-bold border border-pink-500/30">
                          Lv.{intimacyData.level}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="text-sm font-bold text-white truncate">{conv.name}</span>
                            <span className="text-[10px] text-pink-300/80 bg-pink-500/10 px-1.5 py-0.2 rounded">
                              {intimacyData.title}
                            </span>
                          </div>
                          <span className="text-[11px] text-white/40 font-mono">{conv.time}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-white/55 truncate pr-2">{conv.lastMsg}</p>
                          {conv.unread > 0 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markConversationAsRead(conv.roleId);
                              }}
                              className="px-1.5 py-0.5 rounded-full bg-red-500 hover:bg-red-600 active:scale-90 transition text-white text-[10px] font-bold shadow-sm cursor-pointer"
                              title="点击标记为已读"
                            >
                              {conv.unread}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )
            ) : (
              /* GROUP CHATS LIST */
              groupChats.length === 0 ? (
                <div className="text-center py-20 text-white/40 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-300">
                    <Users size={32} />
                  </div>
                  <div className="text-sm font-bold text-white/80">暂无 AI 群聊派对</div>
                  <p className="text-xs text-white/40 max-w-xs mx-auto">
                    点击右上角“发起群聊”，挑选多位喜欢的 AI 角色开启修罗场或热聊派对吧！
                  </p>
                  <button
                    onClick={() => setShowCreateGroupModal(true)}
                    className="mt-2 px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs shadow-lg shadow-purple-500/25 hover:scale-105 active:scale-95 transition cursor-pointer"
                  >
                    + 立即发起第一个 AI 群聊
                  </button>
                </div>
              ) : (
                groupChats.map((g) => {
                  const memberRoles = roles.filter((r) => g.memberRoleIds.includes(r.id));
                  return (
                    <div
                      key={g.id}
                      onClick={() => setActiveGroupChatId(g.id)}
                      className="flex items-center px-5 py-3.5 hover:bg-white/5 active:bg-white/8 cursor-pointer transition border-b border-white/5"
                    >
                      {/* Stacked Avatars / Group Avatar Badge */}
                      <div className="relative mr-3.5 shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-900/60 to-pink-900/60 border border-purple-500/30 flex items-center justify-center overflow-hidden shadow-md">
                        <div className="flex -space-x-2">
                          {memberRoles.slice(0, 3).map((m) => (
                            <div key={m.id} className="inline-block ring-2 ring-[#0a0a0f] rounded-full">
                              <RoleAvatar
                                name={m.name}
                                avatarUrl={ROLE_MEDIA_MAP[m.id]?.avatarUrl || m.avatarUrl}
                                emoji={m.emoji}
                                coverClass={m.cover}
                                size="xs"
                              />
                            </div>
                          ))}
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 px-1 py-0.2 rounded bg-purple-600 text-[8px] text-white font-extrabold">
                          {memberRoles.length}人
                        </span>
                      </div>

                      {/* Group Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="text-sm font-extrabold text-white truncate">{g.name}</span>
                            <span className="text-[9px] text-purple-300 bg-purple-500/20 px-1.5 py-0.2 rounded border border-purple-500/30">
                              派对
                            </span>
                          </div>
                          <span className="text-[11px] text-white/40 font-mono">{g.time}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-xs text-white/60 truncate pr-2">
                            {g.lastSenderName ? (
                              <span className="text-purple-300 font-bold mr-1">{g.lastSenderName}:</span>
                            ) : null}
                            {g.lastMsg}
                          </p>
                          {g.unread > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full bg-pink-500 text-white text-[10px] font-bold shadow-sm">
                              {g.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )
            )}
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateGroupModal && (
        <CreateGroupModal
          roles={roles}
          onClose={() => setShowCreateGroupModal(false)}
          onCreateGroup={handleCreateGroup}
          onShowToast={showToast}
        />
      )}

      {/* 4. CREATOR PAGE */}
      {currentPage === 'creator' && (
        <CreatorView
          roles={roles}
          onCreateRoleSuccess={(newRole) => {
            handleRoleCreateSuccess(newRole);
          }}
          onStartChat={startChatWithRole}
          onShowToast={showToast}
          onDeleteCustomRole={handleDeleteCustomRole}
        />
      )}

      {/* 5. PROFILE PAGE */}
      {currentPage === 'profile' && (
        <div id="page-profile" className="h-full overflow-y-auto pb-28 bg-[#0a0a0f] space-y-3.5">
          {/* Top Profile Card (Matching image layout with avatar on left, nickname + VIP badges, UID, bio, and dotted pills) */}
          <div className="pt-6 pb-5 px-5 bg-gradient-to-b from-[#1b152b] via-[#120e1e] to-[#0a0a0f] border-b border-white/5 space-y-3">
            {/* Header Main Row: Avatar + Info */}
            <div className="flex items-start gap-3.5">
              {/* Left Avatar */}
              <div
                onClick={() => setShowEditProfileModal(true)}
                className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500/30 via-pink-500/30 to-amber-500/20 border border-white/15 shadow-lg overflow-hidden shrink-0 cursor-pointer group hover:scale-105 transition flex items-center justify-center"
              >
                {userProfile.avatar && (userProfile.avatar.startsWith('http') || userProfile.avatar.startsWith('data:')) ? (
                  <img src={userProfile.avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl">{userProfile.avatar || '😊'}</span>
                )}
                <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-pink-600 text-white flex items-center justify-center shadow-md border border-black/40 group-hover:scale-110 transition">
                  <Camera size={10} />
                </div>
              </div>

              {/* Right User Meta */}
              <div className="flex-1 min-w-0 space-y-1.5 pt-0.5">
                <h2
                  onClick={() => setShowEditProfileModal(true)}
                  className="text-base font-bold text-white truncate cursor-pointer hover:text-purple-300 transition"
                >
                  {userProfile.nickname || '小星星oAJICM08'}
                </h2>

                {/* VIP Membership Badges */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setVipInitialTier('silver');
                      setCurrentPage('vip');
                    }}
                    className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-bold flex items-center gap-1 hover:bg-amber-500/30 active:scale-95 transition cursor-pointer"
                  >
                    <Crown size={10} className="text-amber-400 fill-amber-400 shrink-0" />
                    <span>订阅会员</span>
                    <span className="text-[8px] opacity-70">▶</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setVipInitialTier('platinum');
                      setCurrentPage('vip');
                    }}
                    className="px-2 py-0.5 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 text-[10px] font-bold flex items-center gap-1 hover:bg-pink-500/30 active:scale-95 transition cursor-pointer"
                  >
                    <Sparkles size={10} className="text-pink-400 fill-pink-400 shrink-0" />
                    <span>技能会员</span>
                    <span className="text-[8px] opacity-70">▶</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bio Row */}
            <div
              onClick={() => setShowEditProfileModal(true)}
              className="text-xs text-white/60 hover:text-white transition cursor-pointer pt-1"
            >
              {userProfile.bio || '点击填写你的简介吧'}
            </div>

            {/* Dotted Buttons Row */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowEditProfileModal(true)}
                className="px-2.5 py-1 rounded-full border border-dashed border-white/20 hover:border-white/40 text-[11px] text-white/60 hover:text-white transition cursor-pointer flex items-center gap-1"
              >
                <span>+ 补充个人资料</span>
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mx-4 bg-white/5 border border-white/10 rounded-2xl p-3 flex divide-x divide-white/10 backdrop-blur-md">
            <div className="flex-1 text-center">
              <div className="text-base font-bold text-purple-300">{roles.length}</div>
              <div className="text-[11px] text-white/40 mt-0.5">我的角色</div>
            </div>
            <div className="flex-1 text-center">
              <div className="text-base font-bold text-pink-300">36</div>
              <div className="text-[11px] text-white/40 mt-0.5">对话天数</div>
            </div>
            <div className="flex-1 text-center">
              <div className="text-base font-bold text-emerald-300">1.2w</div>
              <div className="text-[11px] text-white/40 mt-0.5">消息数</div>
            </div>
          </div>

          {/* Consolidated Menu Section */}
          <div className="mx-4 bg-white/[0.02] border border-white/5 rounded-2xl divide-y divide-white/5 overflow-hidden shadow-lg">
            {/* 我的关注 */}
            <div
              onClick={() => setCurrentPage('follows')}
              className="flex items-center justify-between p-4 hover:bg-white/[0.02] cursor-pointer transition"
            >
              <div className="flex items-center gap-3">
                <Heart size={16} className="text-pink-400 fill-pink-400/10" />
                <span className="text-xs font-semibold text-white/90">我的关注</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/40 text-xs">
                <span className="px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-300 text-[10px] font-bold">
                  {followedRoles.length}
                </span>
                <ChevronRight size={14} className="text-white/25" />
              </div>
            </div>

            {/* 会员中心 */}
            <div
              onClick={() => setCurrentPage('vip')}
              className="flex items-center justify-between p-4 hover:bg-white/[0.02] cursor-pointer transition"
            >
              <div className="flex items-center gap-3">
                <Crown size={16} className="text-amber-400 fill-amber-400/10" />
                <span className="text-xs font-semibold text-white/90">会员中心</span>
              </div>
              <div className="flex items-center gap-1 text-white/40 text-xs">
                <span className="text-[10px] text-amber-400/90 font-bold bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">尊享特权</span>
                <ChevronRight size={14} className="text-white/25" />
              </div>
            </div>

            {/* 我的钱包 */}
            <div
              onClick={() => setCurrentPage('wallet')}
              className="flex items-center justify-between p-4 hover:bg-white/[0.02] cursor-pointer transition"
            >
              <div className="flex items-center gap-3">
                <Wallet size={16} className="text-emerald-400 fill-emerald-400/10" />
                <span className="text-xs font-semibold text-white/90">我的钱包</span>
              </div>
              <div className="flex items-center gap-1 text-white/40 text-xs">
                <span className="text-[10px] text-emerald-400 font-bold font-mono bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                  ¥ {userProfile.money.toFixed(2)}
                </span>
                <ChevronRight size={14} className="text-white/25" />
              </div>
            </div>

            {/* 设置 */}
            <div
              onClick={() => setCurrentPage('settings')}
              className="flex items-center justify-between p-4 hover:bg-white/[0.02] cursor-pointer transition"
            >
              <div className="flex items-center gap-3">
                <Settings size={16} className="text-gray-400" />
                <span className="text-xs font-semibold text-white/90">设置</span>
              </div>
              <ChevronRight size={14} className="text-white/25" />
            </div>

            {/* 帮助与反馈 */}
            <div
              onClick={() => setCurrentPage('help')}
              className="flex items-center justify-between p-4 hover:bg-white/[0.02] cursor-pointer transition"
            >
              <div className="flex items-center gap-3">
                <HelpCircle size={16} className="text-blue-400" />
                <span className="text-xs font-semibold text-white/90">帮助与反馈</span>
              </div>
              <ChevronRight size={14} className="text-white/25" />
            </div>

            {/* 退出登录 */}
            <div
              onClick={handleLogout}
              className="flex items-center justify-between p-4 hover:bg-red-500/5 cursor-pointer transition text-red-400/90"
            >
              <div className="flex items-center gap-3">
                <LogOut size={16} className="text-red-400" />
                <span className="text-xs font-semibold">退出登录</span>
              </div>
              <ChevronRight size={14} className="text-red-400/30" />
            </div>
          </div>

        </div>
      )}

      {/* 6. SUB-PAGE: FOLLOWS */}
      {currentPage === 'follows' && (
        <div className="h-full flex flex-col bg-[#0a0a0f]">
          <div className="px-4 py-3 flex items-center gap-3 border-b border-white/5 shrink-0">
            <button
              onClick={() => setCurrentPage('profile')}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white"
            >
              <ArrowLeft size={18} />
            </button>
            <h2 className="text-base font-bold text-white">我的关注</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5 pb-28">
            {followedRoles.length === 0 ? (
              <div className="text-center py-20 text-white/40 text-xs">
                还没有关注任何角色，快去首页发现心动角色吧
              </div>
            ) : (
              followedRoles.map((role) => {
                const intimacyData = getIntimacyData(intimacies[role.id] || 0);
                return (
                  <div
                    key={role.id}
                    onClick={() => startChatWithRole(role)}
                    className="flex items-center p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition cursor-pointer"
                  >
                    <RoleAvatar
                      name={role.name}
                      avatarUrl={role.avatarUrl}
                      emoji={role.emoji}
                      coverClass={role.cover}
                      size="lg"
                      className="mr-3 shrink-0"
                      showOnlineBadge
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-white">{role.name}</h4>
                        <span className="text-[10px] text-pink-300 bg-pink-500/10 px-1.5 py-0.2 rounded font-medium">
                          Lv.{intimacyData.level} {intimacyData.title}
                        </span>
                      </div>
                      <p className="text-xs text-white/50">{role.title}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFollow(role.id);
                      }}
                      className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs hover:bg-red-500/20 hover:text-red-300 transition"
                    >
                      已关注
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 7. SUB-PAGE: VIP CENTER */}
      {currentPage === 'vip' && (
        <VipView
          userProfile={userProfile}
          initialTier={vipInitialTier}
          onBack={() => setCurrentPage('profile')}
          onShowToast={showToast}
          onRechargeModal={() => setCurrentPage('wallet')}
          onUpgradeVipTier={(tier) => {
            setVipTier(tier);
            localStorage.setItem('user_vip_tier', tier);
            const days = tier === 'platinum' ? 180 : 120;
            setRoamingDays(days);
            localStorage.setItem('user_roaming_days', String(days));
          }}
        />
      )}

      {/* 8. SUB-PAGE: WALLET */}
      {currentPage === 'wallet' && (
        <div className="h-full overflow-y-auto p-4 pb-28 bg-[#0a0a0f] space-y-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage('profile')}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:bg-white/10 transition"
            >
              <ArrowLeft size={18} />
            </button>
            <h2 className="text-base font-bold text-white">我的钱包</h2>
          </div>

          {/* Balance Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs text-white/80 font-medium">可用余额（元）</div>
                <div className="text-3xl font-extrabold my-2 font-mono tracking-tight">
                  ¥ {userProfile.money.toFixed(2)}
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1">
                <ShieldCheck size={12} />
                <span>实时到账 · 安全加密</span>
              </span>
            </div>
            <div className="text-[11px] text-white/70 mt-1">
              账户余额可用于解锁高级对话、专属语音及功能特权
            </div>
          </div>

          {/* Integrated Wallet Recharge Panel */}
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 space-y-4 shadow-xl">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span>选择充值金额</span>
              <span className="text-[10px] text-purple-400 font-normal">支持自定义金额 · 实时到账</span>
            </div>

            {/* Preset Amount Grid + Custom Option */}
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { value: 10 },
                { value: 30 },
                { value: 68 },
                { value: 128 },
              ].map((item) => {
                const isSelected = !isCustomWalletAmount && walletSelectedAmount === item.value;
                return (
                  <button
                    key={item.value}
                    onClick={() => {
                      setIsCustomWalletAmount(false);
                      setWalletSelectedAmount(item.value);
                    }}
                    className={`p-3 rounded-xl border text-left relative transition-all ${
                      isSelected
                        ? 'bg-purple-600/25 border-purple-400 text-purple-200 shadow-lg shadow-purple-500/10 ring-1 ring-purple-400/40'
                        : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.08] text-white/80'
                    }`}
                  >
                    <div className="text-base font-black font-mono text-white">¥ {item.value}.00</div>
                    <div className="text-[10px] text-white/50 mt-1">
                      到账 ¥{item.value}.00
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Amount Section */}
            <div className="pt-1">
              <button
                onClick={() => setIsCustomWalletAmount(true)}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition ${
                  isCustomWalletAmount
                    ? 'bg-purple-600/25 border-purple-400 ring-1 ring-purple-400/40'
                    : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.08]'
                }`}
              >
                <span className="text-xs font-bold text-white">自选/自定义充值金额</span>
                <span className="text-[10px] text-purple-300">任意金额 · 实时全额到账</span>
              </button>

              {isCustomWalletAmount && (
                <div className="mt-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3 animate-fadeIn">
                  <span className="text-sm font-bold text-purple-400 font-mono">¥</span>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={customWalletInput}
                    onChange={(e) => setCustomWalletInput(e.target.value)}
                    placeholder="请输入充值金额"
                    className="w-full bg-transparent text-white font-mono font-bold text-base outline-none placeholder:text-white/30"
                  />
                  <span className="text-xs text-emerald-400 font-medium whitespace-nowrap font-mono">
                    到账 ¥{effectiveWalletAmount.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {/* Pay Channel Selection */}
            <div className="pt-1">
              <div className="text-[11px] font-medium text-white/40 mb-1.5">选择支付方式</div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'wechat', icon: '💬', name: '微信支付' },
                  { id: 'alipay', icon: '🔹', name: '支付宝' },
                  { id: 'sim', icon: '💳', name: '快捷卡' },
                ].map((ch) => {
                  const isSelected = walletPayMethod === ch.id;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => setWalletPayMethod(ch.id as any)}
                      className={`p-2 rounded-xl border flex items-center justify-center gap-1 transition ${
                        isSelected
                          ? 'bg-white/10 border-white/30 text-white font-bold'
                          : 'bg-white/[0.02] border-white/5 text-white/50 hover:text-white'
                      }`}
                    >
                      <span className="text-xs">{ch.icon}</span>
                      <span className="text-[11px]">{ch.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Topup */}
            <button
              onClick={handleInlineWalletRecharge}
              disabled={isWalletCharging || effectiveWalletAmount <= 0}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 text-slate-950 text-xs font-extrabold shadow-lg active:scale-95 transition disabled:opacity-50"
            >
              {isWalletCharging ? '充值处理中...' : `确认充值 ¥${effectiveWalletAmount.toFixed(2)}`}
            </button>
          </div>

          {/* Transactions List */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <h4 className="text-xs font-bold text-white/70 mb-3">最近交易明细</h4>
            <div className="space-y-2.5 text-xs">
              {walletTransactions.map((tx, idx) => (
                <div key={idx} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-white/40 font-mono">{tx.date}</span>
                    <span className="text-white/80 font-medium">{tx.name}</span>
                  </div>
                  <span className={`font-mono font-bold ${tx.positive ? 'text-emerald-400' : 'text-pink-400'}`}>
                    {tx.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 11. SUB-PAGE: SETTINGS */}
      {currentPage === 'settings' && (
        <SettingsView
          roamingDays={roamingDays}
          vipTier={vipTier}
          isRealNameVerified={isRealNameVerified}
          realName={realName}
          realIdCard={realIdCard}
          onBack={() => setCurrentPage('profile')}
          onShowToast={showToast}
          onOpenMessageRoaming={() => setCurrentPage('message_roaming')}
          onOpenRealNameAuth={() => setShowRealNameAuthModal(true)}
        />
      )}

      {/* 11b. SUB-PAGE: MESSAGE ROAMING */}
      {currentPage === 'message_roaming' && (
        <MessageRoamingView
          roamingDays={roamingDays}
          vipTier={vipTier}
          onBack={() => setCurrentPage('settings')}
          onShowToast={showToast}
          onUpgradeVip={() => {
            setVipInitialTier('silver');
            setCurrentPage('vip');
          }}
        />
      )}

      {/* 12. SUB-PAGE: HELP & FEEDBACK */}
      {currentPage === 'help' && (
        <HelpFeedbackView
          onBack={() => setCurrentPage('profile')}
          onShowToast={showToast}
        />
      )}

      {/* 13. CHAT VIEW */}
      {currentPage === 'chat' && activeRole && (
        <ChatView
          role={{
            ...activeRole,
            avatarUrl: ROLE_MEDIA_MAP[activeRole.id]?.avatarUrl || activeRole.avatarUrl,
            portraitUrl: ROLE_MEDIA_MAP[activeRole.id]?.portraitUrl || activeRole.portraitUrl,
          }}
          onBack={() => {
            setActiveRole(null);
            setCurrentPage('home');
          }}
          onSendMessage={handleSendMessage}
          messages={chatMessages}
          isTyping={isTyping}
          onShowToast={showToast}
          onClearHistory={() => {
            setChatMessages([]);
            const allHist = JSON.parse(localStorage.getItem('chatHistories') || '{}');
            delete allHist[activeRole.id];
            localStorage.setItem('chatHistories', JSON.stringify(allHist));
            showToast('已清空聊天记录');
          }}
          intimacyPoints={intimacies[activeRole.id] || 0}
          onUpdateIntimacy={(added) => handleUpdateIntimacy(activeRole.id, added)}
          onChatInteraction={() => handleChatIntimacy(activeRole.id)}
          onDeleteMessage={handleDeleteMessage}
          onRegenerateMessage={handleRegenerateMessage}
        />
      )}

      {/* BOTTOM TAB BAR (Hidden in Chat and Login) */}
      {currentPage !== 'chat' && currentPage !== 'login' && (
        <nav
          id="app-bottom-tab-bar"
          className="absolute bottom-0 left-0 right-0 h-16 bg-[#0a0a0f]/95 backdrop-blur-2xl border-t border-white/10 flex items-center justify-around px-4 z-40"
        >
          <button
            id="tab-recommend"
            onClick={() => setCurrentPage('recommend')}
            className={`flex flex-col items-center justify-center transition ${
              currentPage === 'recommend' ? 'text-pink-400 scale-105' : 'text-white/40 hover:text-white/70'
            }`}
          >
            <Sparkles size={20} className={currentPage === 'recommend' ? 'text-pink-400 fill-pink-400/20' : ''} />
            <span className="text-[10px] mt-1 font-medium">首页</span>
          </button>

          <button
            id="tab-home"
            onClick={() => setCurrentPage('home')}
            className={`flex flex-col items-center justify-center transition ${
              currentPage === 'home' ? 'text-purple-400 scale-105' : 'text-white/40 hover:text-white/70'
            }`}
          >
            <Compass size={20} />
            <span className="text-[10px] mt-1 font-medium">发现</span>
          </button>

          {/* Creator Tab - Positioned between Discovery and Chat */}
          <button
            id="tab-creator"
            onClick={() => setCurrentPage('creator')}
            className={`flex flex-col items-center justify-center transition relative ${
              currentPage === 'creator' ? 'text-purple-400 scale-105' : 'text-white/40 hover:text-white/70'
            }`}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center transition ${
              currentPage === 'creator'
                ? 'bg-gradient-to-tr from-purple-500 via-pink-500 to-purple-500 text-white shadow-md shadow-purple-500/40'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}>
              <Plus size={16} />
            </div>
            <span className="text-[10px] mt-0.5 font-medium">创作</span>
          </button>

          <button
            id="tab-messages"
            onClick={() => setCurrentPage('messages')}
            className={`flex flex-col items-center justify-center transition relative ${
              currentPage === 'messages' ? 'text-purple-400 scale-105' : 'text-white/40 hover:text-white/70'
            }`}
          >
            <MessageSquare size={20} />
            <span className="text-[10px] mt-1 font-medium">聊天</span>
            {totalUnread > 0 && (
              <span className="absolute -top-1 right-2 px-1 rounded-full bg-pink-500 text-white text-[9px] font-bold">
                {totalUnread}
              </span>
            )}
          </button>

          <button
            id="tab-profile"
            onClick={() => setCurrentPage('profile')}
            className={`flex flex-col items-center justify-center transition ${
              currentPage === 'profile' ? 'text-purple-400 scale-105' : 'text-white/40 hover:text-white/70'
            }`}
          >
            <User size={20} />
            <span className="text-[10px] mt-1 font-medium">我的</span>
          </button>
        </nav>
      )}

      {/* OVERLAY MODALS */}
      <DetailModal
        role={
          detailRole
            ? {
                ...detailRole,
                avatarUrl: ROLE_MEDIA_MAP[detailRole.id]?.avatarUrl || detailRole.avatarUrl,
                portraitUrl: ROLE_MEDIA_MAP[detailRole.id]?.portraitUrl || detailRole.portraitUrl,
              }
            : null
        }
        isOpen={Boolean(detailRole)}
        isFollowed={detailRole ? follows.includes(detailRole.id) : false}
        userProfile={userProfile}
        onClose={() => setDetailRole(null)}
        onToggleFollow={() => {
          if (detailRole) handleToggleFollow(detailRole.id);
        }}
        onStartChat={startChatWithRole}
        onShowToast={showToast}
        intimacyPoints={detailRole ? (intimacies[detailRole.id] || 0) : 0}
        onUpdateIntimacy={(added) => {
          if (detailRole) handleUpdateIntimacy(detailRole.id, added);
        }}
        onOpenRecharge={() => {
          setDetailRole(null);
          setCurrentPage('vip');
        }}
        onDeductMoney={(amount) => {
          if (userProfile.money < amount) return false;
          setUserProfile((prev) => ({
            ...prev,
            money: Math.max(0, prev.money - amount),
          }));
          return true;
        }}
      />

      <RechargeModal
        isOpen={showRechargeModal}
        onClose={() => setShowRechargeModal(false)}
        onRechargeSuccess={(amt, mode, vipTitle) => {
          if (mode === 'balance') {
            setUserProfile((prev) => ({
              ...prev,
              money: prev.money + amt,
            }));
          } else if (vipTitle) {
            setUserProfile((prev) => ({
              ...prev,
              vip_text: vipTitle,
              vip_status: 1,
            }));
          }
        }}
        onShowToast={showToast}
      />

      <EditProfileModal
        isOpen={showEditProfileModal}
        userProfile={userProfile}
        onClose={() => setShowEditProfileModal(false)}
        onSave={(updated) => {
          setUserProfile((prev) => ({
            ...prev,
            ...updated,
          }));
        }}
        onShowToast={showToast}
      />

      {showRealNameAuthModal && (
        <RealNameAuthModal
          isVerified={isRealNameVerified}
          verifiedName={realName}
          verifiedIdCard={realIdCard}
          onClose={() => setShowRealNameAuthModal(false)}
          onVerifySuccess={(name, idCard) => {
            setIsRealNameVerified(true);
            setRealName(name);
            setRealIdCard(idCard);
            localStorage.setItem('user_realname_verified', 'true');
            localStorage.setItem('user_realname', name);
            localStorage.setItem('user_real_idcard', idCard);
          }}
          onShowToast={showToast}
        />
      )}
    </PhoneFrame>
  );
}
