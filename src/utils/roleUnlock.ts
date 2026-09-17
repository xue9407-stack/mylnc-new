// Role AI Toolkit Unlock & Management Utility

const UNLOCKED_ROLES_KEY = 'aistudio_unlocked_role_toolkits';

export interface RoleToolInfo {
  id: string;
  title: string;
  shortName: string;
  desc: string;
  iconName: string;
  color: string;
  badge: string;
  promptTemplate: (roleName: string) => string;
}

export const ROLE_AI_TOOLS: RoleToolInfo[] = [
  {
    id: 'ppt',
    title: 'PPT 制作助手',
    shortName: 'PPT 制作',
    desc: '生成结构化演示大纲与角色口吻演讲稿',
    iconName: 'Presentation',
    color: 'from-purple-500 to-indigo-600',
    badge: '热门',
    promptTemplate: (name) => `【${name} 专属 PPT 制作】请以你的身份和口气，为我生成一份关于《Q3 业务规划与增长策略》的高质量 PPT 大纲。包含 5 页 Slide，每页写明标题、核心要点、视觉建议与你的演示讲稿。`,
  },
  {
    id: 'analysis',
    title: '做报表·数据分析',
    shortName: '数据报表',
    desc: '经营看板数据可视化与核心洞察解读',
    iconName: 'BarChart3',
    color: 'from-blue-500 to-cyan-600',
    badge: '高效',
    promptTemplate: (name) => `【${name} 专属数据分析】我是你的项目负责人，这里是我们的最新运营数据：MAU 25万，次留 42%，月流水 ¥120万。请以你的商业眼光帮我梳理三条核心优势与两条风险避坑指南。`,
  },
  {
    id: 'alarm',
    title: '事件闹钟·提醒',
    shortName: '事件闹钟',
    desc: '出差备忘、晨起任务、天气预报与温馨提醒',
    iconName: 'AlarmClock',
    color: 'from-emerald-500 to-teal-600',
    badge: '实用',
    promptTemplate: (name) => `【${name} 专属行程闹钟】我明天要去北京出差 3 天，请为我制定一份出差必备物品清单（含身份证、充电宝等），并预告当地天气，同时设定一个明早 6:30 的霸气/温柔提醒闹钟。`,
  },
  {
    id: 'image',
    title: '图片·写真制作',
    shortName: '图片写真',
    desc: '生成角色专属 AI 绘图 Prompt 与艺术海报',
    iconName: 'ImageIcon',
    color: 'from-pink-500 to-rose-600',
    badge: '创意',
    promptTemplate: (name) => `【${name} 专属图片制作】我想为你做一张精美的角色写真海报。请告诉我你最想尝试的视觉风格（如：星空夜景/赛博朋克/暖阳咖啡馆），并生成一段极具艺术感的高清绘画提示词。`,
  },
  {
    id: 'copywrite',
    title: '文案整理·永久记忆',
    shortName: '文案记忆',
    desc: '精修零散草稿，构建零损失永久记忆库',
    iconName: 'BookOpen',
    color: 'from-amber-500 to-orange-600',
    badge: '永久',
    promptTemplate: (name) => `【${name} 专属永久记忆】请把我这句话整理成一段优雅高质感的文字，并永久存入你对我的记忆库中：“我打算在今年年底完成产品上线，并去大理看一次洱海。”`,
  },
  {
    id: 'story',
    title: '有声小说·睡前故事',
    shortName: '睡前故事',
    desc: '温柔专属声线讲睡前故事，抚平夜间焦虑',
    iconName: 'Headphones',
    color: 'from-violet-500 to-purple-700',
    badge: '治愈',
    promptTemplate: (name) => `【${name} 专属睡前故事】今晚我有点失眠，请用你专属的温柔语气，给我讲一段发生在安静森林或星空下的疗愈小故事，字数约 300 字，让我放松入睡。`,
  },
  {
    id: 'decision',
    title: '决策陪聊·利弊矩阵',
    shortName: '决策陪聊',
    desc: '多选项 SWOT 对比，理智建议与情感陪伴',
    iconName: 'Scale',
    color: 'from-fuchsia-500 to-pink-600',
    badge: '理性',
    promptTemplate: (name) => `【${name} 决策利弊分析】我现在面临一个难题：选项 A 留在现有大厂稳定但涨薪慢，选项 B 跳槽初创公司薪资高 30% 但压力大。请帮你以你的经历为我分析两者的利与弊。`,
  },
  {
    id: 'milestone',
    title: '纪念日·仪式感',
    shortName: '纪念日',
    desc: '记录项目节点与目标突破，制造满满仪式感',
    iconName: 'Award',
    color: 'from-amber-400 to-yellow-600',
    badge: '仪式感',
    promptTemplate: (name) => `【${name} 专属仪式感】告诉你一个好消息，我今天终于完成了我的季度目标，升职成功了！请陪我一起庆祝这个重要的里程碑纪念日吧！`,
  },
  {
    id: 'study',
    title: '学习监督·AI抽查',
    shortName: '学习监督',
    desc: '陪背单词读书考证，定时设定随机抽查考考你',
    iconName: 'GraduationCap',
    color: 'from-teal-400 to-emerald-600',
    badge: '打卡',
    promptTemplate: (name) => `【${name} 学习定时抽查】我正在准备英语/专业考证。请现在随机出 2 道常考选择题考考我，并在我回答后给予详细解析和鼓励！`,
  },
  {
    id: 'stream',
    title: '决策记录流·随时追回',
    shortName: '决策记录流',
    desc: '完整追溯决策背景与预期，快速搜寻还原',
    iconName: 'History',
    color: 'from-indigo-400 to-blue-600',
    badge: '追溯',
    promptTemplate: (name) => `【${name} 决策记录归档】我想记录一项重要决策——项目：“重构服务端架构”。背景：性能遇到瓶颈；理由：提升并发；预期：响应时间缩短 50%。请帮我保存此决策流，方便我日后回看。`,
  },
];

export const getUnlockedRoleIds = (): string[] => {
  try {
    const raw = localStorage.getItem(UNLOCKED_ROLES_KEY);
    if (!raw) return ['lujingchen']; // default unlock for featured character
    return JSON.parse(raw);
  } catch {
    return ['lujingchen'];
  }
};

export const isRoleUnlocked = (roleId: string): boolean => {
  const list = getUnlockedRoleIds();
  return list.includes(roleId);
};

export const unlockRoleToolkit = (roleId: string): string[] => {
  const current = getUnlockedRoleIds();
  if (!current.includes(roleId)) {
    const next = [...current, roleId];
    localStorage.setItem(UNLOCKED_ROLES_KEY, JSON.stringify(next));
    return next;
  }
  return current;
};
