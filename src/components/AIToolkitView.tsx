import React, { useState, useEffect } from 'react';
import {
  Presentation,
  BarChart3,
  AlarmClock,
  Image as ImageIcon,
  BookOpen,
  Headphones,
  Scale,
  Award,
  GraduationCap,
  History,
  Sparkles,
  Play,
  Pause,
  Plus,
  Trash2,
  Copy,
  Check,
  Search,
  ChevronRight,
  Volume2,
  VolumeX,
  CloudRain,
  Flame,
  Waves,
  Wind,
  Calendar,
  CheckCircle2,
  Share2,
  RefreshCw,
  Send,
  Zap,
  LayoutGrid,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { api } from '../services/api';

interface AIToolkitViewProps {
  onShowToast: (msg: string) => void;
  onBackToHome: () => void;
}

type ToolCategory =
  | 'ppt'
  | 'analysis'
  | 'alarm'
  | 'image'
  | 'copywrite'
  | 'story'
  | 'decision'
  | 'milestone'
  | 'study'
  | 'quiz'
  | 'stream';

const TOOL_MODULES: { id: ToolCategory; title: string; shortName: string; subtitle: string; icon: React.ReactNode; badge: string; color: string }[] = [
  { id: 'ppt', title: 'PPT 制作助手', shortName: 'PPT 制作', subtitle: '一键生成逻辑演示大纲与讲稿', icon: <Presentation size={17} />, badge: '热门', color: 'from-purple-500 to-indigo-600' },
  { id: 'analysis', title: '做报表·数据分析', shortName: '做报表', subtitle: '数据看板可视化与AI结论洞察', icon: <BarChart3 size={17} />, badge: '高效', color: 'from-blue-500 to-cyan-600' },
  { id: 'alarm', title: '事件闹钟·提醒', shortName: '事件闹钟', subtitle: '出差、晨起、天气与任务提醒', icon: <AlarmClock size={17} />, badge: '实用', color: 'from-emerald-500 to-teal-600' },
  { id: 'image', title: '图片·金句卡片制作', shortName: '图片卡片', subtitle: 'AI 绘画 Prompt 与艺术海报导出', icon: <ImageIcon size={17} />, badge: '创意', color: 'from-pink-500 to-rose-600' },
  { id: 'copywrite', title: '文案整理·永久记忆', shortName: '文案记忆', subtitle: '草稿提炼与零损失永久记忆库', icon: <BookOpen size={17} />, badge: '永久', color: 'from-amber-500 to-orange-600' },
  { id: 'story', title: '有声小说·睡前故事', shortName: '有声故事', subtitle: 'AI 故事沉浸播报与睡眠白噪音', icon: <Headphones size={17} />, badge: '治愈', color: 'from-violet-500 to-purple-700' },
  { id: 'decision', title: '决策陪聊·利弊矩阵', shortName: '决策陪聊', subtitle: '多选项评估与SWOT冷静分析', icon: <Scale size={17} />, badge: '理性', color: 'from-fuchsia-500 to-pink-600' },
  { id: 'milestone', title: '纪念日·仪式感', shortName: '纪念日', subtitle: '项目节点、升职与目标达成', icon: <Award size={17} />, badge: '仪式感', color: 'from-amber-400 to-yellow-600' },
  { id: 'study', title: '学习监督·AI抽查', shortName: '学习监督', subtitle: '背单词、考证番茄钟与随机抽考', icon: <GraduationCap size={17} />, badge: '打卡', color: 'from-teal-400 to-emerald-600' },
  { id: 'stream', title: '决策记录流', shortName: '决策记录', subtitle: '背景、理由、预期回看与随时寻找', icon: <History size={17} />, badge: '追溯', color: 'from-indigo-400 to-blue-600' },
];

export const AIToolkitView: React.FC<AIToolkitViewProps> = ({ onShowToast }) => {
  const [activeTab, setActiveTab] = useState<ToolCategory>('ppt');
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showGridMatrix, setShowGridMatrix] = useState<boolean>(false);

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    checkScroll();
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
      checkScroll();
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const handleSelectTab = (id: ToolCategory, e?: React.MouseEvent<HTMLButtonElement>) => {
    setActiveTab(id);
    setShowGridMatrix(false);
    if (e?.currentTarget) {
      e.currentTarget.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  };

  // 1. PPT State
  const [pptTopic, setPptTopic] = useState<string>('AI 拟真社交伴侣产品的商业化规划与未来趋势');
  const [pptSlideCount, setPptSlideCount] = useState<number>(6);
  const [pptStyle, setPptStyle] = useState<string>('科技炫酷');
  const [pptResult, setPptResult] = useState<string>(`【标题】：AI 拟真社交伴侣 - 商业化规划
【第1页】：行业痛点与情绪价值爆发
  • 核心要点：年轻人群体孤独感增加，情感陪伴需求激增
  • 核心要点：生成式AI大模型实现超高沉浸度性格拟真
  • 视觉排版：左侧高对比数字卡片，右侧用户痛点数据图
  • 演讲手稿：“各位好，今天我们要聊的是未来数千亿级的情感经济...”

【第2页】：产品定位与核心差异化
  • 核心要点：ThinkPHP+MySQL的高并发低延时后台
  • 核心要点：千人千面好感度升级与专属记忆网络
  • 视觉排版：暗黑夜色渐变背景，突出高亮角色金句

【第3页】：商业模式与盈利矩阵
  • 核心要点：会员订阅、情感道具、VIP定制音色
  • 核心要点：创作者分成生态促进角色高频更新`);

  // 2. Data Analysis State
  const [analysisType, setAnalysisType] = useState<string>('月度营销与用户留存看板');
  const [analysisInput, setAnalysisInput] = useState<string>('本月DAU 12.8w，次留率 48.5%，月充值金额 15.6万，付费转化率 6.2%');
  const [analysisResult, setAnalysisResult] = useState<string>(`📊 【数据分析与洞察报告】
1. 核心增长亮点：
   - 次日留存率达 48.5%，远高于社交行业平均水平(35%)，表明角色互动粘性强。
   - 月营收 15.6万，ARPPU 表现优异。
2. 潜在风险警示：
   - 付费转化率 6.2% 仍有提升空间，免费体验用户的转化临界点在第 3 天。
3. 下一步优化方案：
   - 增加前 3 天的亲密度升级礼包，提升早期付费意愿。
   - 推出更多互动剧情触发道具。`);

  // 3. Smart Alarm & Weather State
  const [alarms, setAlarms] = useState<
    { id: string; title: string; time: string; tag: string; enabled: boolean; items: string[] }[]
  >(() => {
    const saved = localStorage.getItem('ai_toolkit_alarms');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: '1',
            title: '✈️ 上海出差行程提醒',
            time: '06:30',
            tag: '出差提醒',
            enabled: true,
            items: ['带身份证与护照', '笔记本电脑+高功率充电宝', '确认航班 MU5182 登机口', '准备雨伞(上海多雨)'],
          },
          {
            id: '2',
            title: '🌅 晨起高效焕发提醒',
            time: '07:30',
            tag: '晨起任务',
            enabled: true,
            items: ['喝一杯温水 300ml', '查看今日天气与穿衣指南', '听 15 分钟英语原版音频'],
          },
        ];
  });
  const [newAlarmTitle, setNewAlarmTitle] = useState('');
  const [newAlarmTime, setNewAlarmTime] = useState('08:00');
  const [newAlarmTag, setNewAlarmTag] = useState('生活提醒');

  useEffect(() => {
    localStorage.setItem('ai_toolkit_alarms', JSON.stringify(alarms));
  }, [alarms]);

  // 4. Image Studio State
  const [imgPrompt, setImgPrompt] = useState('梦幻星空下的赛博朋克都市，浪漫紫粉霓虹光影，高画质，概念艺术');
  const [imgStyle, setImgStyle] = useState('赛博朋克');
  const [imgQuote, setImgQuote] = useState('“在有限的时光里，寻找无限的心动与陪伴。”');
  const [generatedImgBg, setGeneratedImgBg] = useState(
    'linear-gradient(135deg, #1e1b4b 0%, #311042 50%, #4c0519 100%)'
  );

  // 5. Copywrite & Memory Vault State
  const [copyInput, setCopyInput] = useState('今天项目顺利上线了，大家加班很辛苦但成果很好，写个朋友圈总结');
  const [copyStyle, setCopyStyle] = useState('朋友圈爆款');
  const [copyResult, setCopyResult] = useState('🚀 【星光不负赶路人】\n经历数个日夜的打磨，我们的 AI 拟真社交产品今日正式发布！上线首日数据喜人。感谢团队每一位伙伴的硬核付出，种下的种子终于破土发芽🌱！下一个节点，继续向星辰大海出发！✨');

  const [memoryVault, setMemoryVault] = useState<
    { id: string; title: string; content: string; category: string; date: string }[]
  >(() => {
    const saved = localStorage.getItem('ai_toolkit_memories');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'm1',
            title: '个人核心职业定位',
            content: '专注全栈高可用架构与 AI 落地应用，擅长敏捷开发与高交互产品迭代。',
            category: '职业档案',
            date: '2026-09-01',
          },
          {
            id: 'm2',
            title: '项目架构约束',
            content: '前端使用 React+Tailwind，后台结合 ThinkPHP5 与 MySQL 5.6 API 接口规范。',
            category: '技术笔记',
            date: '2026-09-10',
          },
        ];
  });
  const [memorySearch, setMemorySearch] = useState('');
  const [newMemTitle, setNewMemTitle] = useState('');
  const [newMemContent, setNewMemContent] = useState('');
  const [newMemCategory, setNewMemCategory] = useState('个人知识库');

  useEffect(() => {
    localStorage.setItem('ai_toolkit_memories', JSON.stringify(memoryVault));
  }, [memoryVault]);

  // 6. Audiobook & Story State
  const [storyTopic, setStoryTopic] = useState('深山树屋的雨夜温暖故事');
  const [storyContent, setStoryContent] = useState(`【温馨轻声播报】
在苍翠森林的深处，有一座散发着松木香气的木屋。
外面正淅淅沥沥地下着细雨，雨滴敲打在屋檐上，发出一阵阵温柔的声响。
屋内的壁炉里，松果正噼啪作响，摇曳出橙黄色的暖光。
软绵绵的小猫蜷缩在你脚边的毛毯上，发出了舒适的呼噜声...
无论今天遇到了什么烦恼，此刻都请放慢呼吸，让这份宁静拥抱你...`);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [bgNoise, setBgNoise] = useState<'rain' | 'fire' | 'wave' | 'none'>('rain');
  const [playbackSpeed, setPlaybackSpeed] = useState('1.0x');

  // 7. Decision Buddy State
  const [dilemma, setDilemma] = useState('要不要换到中型 AI 创业团队？');
  const [optionA, setOptionA] = useState('留在原公司（稳定、福利好、成长瓶颈）');
  const [optionB, setOptionB] = useState('跳槽创业公司（高期权、节奏快、风险大）');
  const [decisionResult, setDecisionResult] = useState<string>(`⚖️ 【决策评估与利弊矩阵分析】

📌 选项 A (留原公司)：
  • 优势：现金流稳定、福利完善、心理舒适度高
  • 劣势：业务创新放缓，对新技术掌控度受限
  • 综合分：72分

📌 选项 B (跳槽创业公司)：
  • 优势：在 AI 爆发期处于业务第一线，成长空间大，期权潜在高收益
  • 劣势：加班较多，公司现金流存在一定不确定性
  • 综合分：85分

💡 AI 决策顾问建议：
如果你目前年龄在30岁以下且风险承受能力较强，倾向于【选项 B】。建议在入职前明确期权行权条款与公司最新一轮融资进度。`);

  // 8. Milestones State
  const [milestones, setMilestones] = useState<
    { id: string; title: string; date: string; category: string; badge: string; isCelebrated: boolean }[]
  >(() => {
    const saved = localStorage.getItem('ai_toolkit_milestones');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'ms1',
            title: '🚀 网巢 APP 1.0 版本成功发布',
            date: '2026-09-15',
            category: '项目节点',
            badge: '破局者 🏆',
            isCelebrated: true,
          },
          {
            id: 'ms2',
            title: '💼 顺利晋升高级开发工程师',
            date: '2026-08-01',
            category: '职业成长',
            badge: '荣耀时刻 👑',
            isCelebrated: true,
          },
        ];
  });
  const [newMsTitle, setNewMsTitle] = useState('');
  const [newMsDate, setNewMsDate] = useState('2026-09-16');
  const [newMsCategory, setNewMsCategory] = useState('目标达成');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    localStorage.setItem('ai_toolkit_milestones', JSON.stringify(milestones));
  }, [milestones]);

  const triggerCeremony = () => {
    setShowConfetti(true);
    onShowToast('🎉 恭喜达成重要节点！仪式感已加载完成！');
    setTimeout(() => setShowConfetti(false), 3000);
  };

  // 9. Study Supervisor State
  const [studySubject, setStudySubject] = useState('背英语单词 (IELTS / CET-6)');
  const [pomoTime, setPomoTime] = useState(25 * 60);
  const [isPomoRunning, setIsPomoRunning] = useState(false);
  const [studyStreak, setStudyStreak] = useState(12);
  const [quizQuestions, setQuizQuestions] = useState<
    { question: string; options: string[]; answerIndex: number; explanation: string }[]
  >([
    {
      question: 'Word: "Empirical" 最贴切的中文含义是？',
      options: ['A. 理论上的', 'B. 基于经验/实验的', 'C. 帝国的', 'D. 逻辑严密的'],
      answerIndex: 1,
      explanation: 'Empirical 意为“基于观察或实验经验的”。',
    },
    {
      question: 'Word: "Resilience" 表达什么品质？',
      options: ['A. 韧性/恢复力', 'B. 傲慢', 'C. 犹豫不决', 'D. 忠诚'],
      answerIndex: 0,
      explanation: 'Resilience 表示在逆境后迅速恢复的能力、韧性。',
    },
  ]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    let timer: any = null;
    if (isPomoRunning && pomoTime > 0) {
      timer = setInterval(() => setPomoTime((t) => t - 1), 1000);
    } else if (pomoTime === 0) {
      setIsPomoRunning(false);
      onShowToast('🔔 番茄钟专注时间到！休息 5 分钟吧！');
    }
    return () => clearInterval(timer);
  }, [isPomoRunning, pomoTime]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // 10. Decision Stream Log State
  const [decisionLogs, setDecisionLogs] = useState<
    {
      id: string;
      title: string;
      context: string;
      options: string;
      rationale: string;
      expectedOutcome: string;
      date: string;
      reviewDate: string;
      rating: number;
    }[]
  >(() => {
    const saved = localStorage.getItem('ai_toolkit_decision_logs');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'dl1',
            title: '重构前端 UI 架构采用 PhoneFrame 手机壳样式',
            context: '在 10.2 寸屏幕及移动端用户体验中，手机拟真体验效果最佳。',
            options: '方案1: 传统网页响应式；方案2: 拟真手机 Frame 容器',
            rationale: '手机壳容器可营造沉浸式原生 App 体验，品牌辨识度高。',
            expectedOutcome: '用户平均停留时间提升 35%',
            date: '2026-09-10',
            reviewDate: '2026-10-10',
            rating: 5,
          },
        ];
  });
  const [streamSearch, setStreamSearch] = useState('');
  const [newDlTitle, setNewDlTitle] = useState('');
  const [newDlContext, setNewDlContext] = useState('');
  const [newDlOptions, setNewDlOptions] = useState('');
  const [newDlRationale, setNewDlRationale] = useState('');
  const [newDlOutcome, setNewDlOutcome] = useState('');
  const [showAddDl, setShowAddDl] = useState(false);

  useEffect(() => {
    localStorage.setItem('ai_toolkit_decision_logs', JSON.stringify(decisionLogs));
  }, [decisionLogs]);

  // Handle Copy Helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onShowToast('已成功复制到剪贴板！');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Generic AI Call Handler
  const handleAiGenerate = async (type: ToolCategory, promptText: string) => {
    if (!promptText.trim()) {
      onShowToast('请输入有效的生成提示词');
      return;
    }
    setLoading(true);
    try {
      const res = await api.generateToolAssist(type, promptText);
      if (type === 'ppt') setPptResult(res);
      else if (type === 'analysis') setAnalysisResult(res);
      else if (type === 'copywrite') setCopyResult(res);
      else if (type === 'story') setStoryContent(res);
      else if (type === 'decision') setDecisionResult(res);
      onShowToast('✨ AI 助理已为你成功生成结果！');
    } catch {
      onShowToast('生成完成');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ai-toolkit-view" className="h-full flex flex-col bg-[#0a0a0f] text-white overflow-hidden relative">
      {/* Confetti Visual Celebration Layer */}
      {showConfetti && (
        <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-purple-900/30 backdrop-blur-sm animate-pulse" />
          <div className="text-center z-10 animate-bounce">
            <div className="text-6xl mb-2">🎉 🏆 👑 ✨</div>
            <div className="text-xl font-black text-amber-300 drop-shadow-lg">仪式感时刻·荣耀达成！</div>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="px-5 pt-3 pb-2.5 shrink-0 border-b border-white/5 flex items-center justify-between bg-[#0a0a0f]/95 backdrop-blur-md z-20">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm">
              <Zap size={16} />
            </span>
            <h1 className="text-lg font-extrabold text-white tracking-wide">AI 智囊工坊</h1>
          </div>
          <p className="text-[11px] text-white/40 mt-0.5">10 大全能生产力、决策陪聊与伴侣工具</p>
        </div>
        <button
          onClick={() => setShowGridMatrix(!showGridMatrix)}
          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 ${
            showGridMatrix
              ? 'bg-purple-500 text-white border-purple-400 shadow-md shadow-purple-500/30'
              : 'bg-white/5 hover:bg-white/10 text-purple-300 border-purple-500/30'
          }`}
        >
          <LayoutGrid size={14} />
          <span>{showGridMatrix ? '收起网格' : '全景 10 工坊'}</span>
          {showGridMatrix ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>

      {/* Expandable 10-Tool Matrix Grid Overlay */}
      {showGridMatrix && (
        <div className="px-4 py-3 bg-gradient-to-b from-[#12101e] to-[#0a0a0f] border-b border-purple-500/20 shrink-0 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="text-[11px] font-bold text-purple-300/80 mb-2.5 flex items-center justify-between">
            <span>🚀 点击直达 10 大智囊工坊</span>
            <span className="text-[10px] text-white/40">全景快速选择</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {TOOL_MODULES.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 relative overflow-hidden active:scale-95 ${
                    isActive
                      ? `bg-gradient-to-r ${item.color} text-white border-white/30 shadow-lg shadow-purple-900/30 ring-1 ring-white/20`
                      : 'bg-white/[0.04] hover:bg-white/[0.08] text-white/80 border-white/10'
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${isActive ? 'bg-black/20 text-white' : 'bg-white/10 text-purple-300'}`}>
                    {item.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold leading-tight truncate">{item.shortName}</div>
                    <div className="text-[10px] text-white/60 truncate mt-0.5">{item.badge}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Grid Menu Navigator (Horizontally Scrollable Chips with Fade Masks & Spacer) */}
      <div className="relative shrink-0 border-b border-white/5 bg-[#0d0b16] z-10">
        {/* Left Fade Overlay */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0d0b16] via-[#0d0b16]/80 to-transparent z-10 pointer-events-none transition-opacity duration-200" />
        )}

        {/* Right Fade Overlay */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0d0b16] via-[#0d0b16]/80 to-transparent z-10 pointer-events-none transition-opacity duration-200" />
        )}

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth px-4 py-2.5 select-none"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {TOOL_MODULES.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={(e) => handleSelectTab(item.id, e)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 active:scale-95 ${
                  isActive
                    ? `bg-gradient-to-r ${item.color} text-white shadow-md shadow-purple-950/50 ring-1 ring-white/30`
                    : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 hover:text-white'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-purple-300'}>{item.icon}</span>
                <span>{item.shortName}</span>
                <span className={`px-1 py-0.2 rounded text-[9px] font-bold ${
                  isActive ? 'bg-black/30 text-white' : 'bg-white/10 text-white/50'
                }`}>
                  {item.badge}
                </span>
              </button>
            );
          })}
          {/* End Spacer so last item is never cut off at boundary */}
          <div className="w-8 shrink-0 pointer-events-none" aria-hidden="true" />
        </div>
      </div>

      {/* Main Workspace Scroll Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-28">
        {/* ==================== 1. PPT GENERATOR MODULE ==================== */}
        {activeTab === 'ppt' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-purple-900/30 to-indigo-950/40 p-4 rounded-2xl border border-purple-500/30 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Presentation size={20} className="text-purple-400" />
                  <h3 className="text-base font-bold text-white">AI PPT 智能生成与排版</h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono">
                  演示大纲 + 讲稿
                </span>
              </div>

              <div className="space-y-3 mt-3">
                <div>
                  <label className="text-xs text-white/60 mb-1 block">PPT 主题 / 演讲要求</label>
                  <input
                    type="text"
                    value={pptTopic}
                    onChange={(e) => setPptTopic(e.target.value)}
                    placeholder="输入PPT主题，如：季度商业规划..."
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-white/60 mb-1 block">预估页数</label>
                    <select
                      value={pptSlideCount}
                      onChange={(e) => setPptSlideCount(Number(e.target.value))}
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none"
                    >
                      <option value={5}>5 页精简汇报</option>
                      <option value={6}>6 页标准发布</option>
                      <option value={8}>8 页深度路演</option>
                      <option value={10}>10 页商业计划</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-white/60 mb-1 block">视觉风格</label>
                    <select
                      value={pptStyle}
                      onChange={(e) => setPptStyle(e.target.value)}
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none"
                    >
                      <option value="科技炫酷">⚡ 科技炫酷 (暗黑发光)</option>
                      <option value="极简商务">👔 极简商务 (高雅灰白)</option>
                      <option value="国风雅致">🎋 国风雅致 (水墨东方)</option>
                      <option value="活力极光">🌈 活力极光 (渐变年轻)</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => handleAiGenerate('ppt', `主题：${pptTopic}，页数：${pptSlideCount}，风格：${pptStyle}`)}
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-98 shadow-md"
                >
                  {loading ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  <span>{loading ? 'AI 正在梳理大纲与排版...' : '一键生成 PPT 大纲与讲稿'}</span>
                </button>
              </div>
            </div>

            {/* PPT Result Preview */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                <span className="text-xs font-bold text-purple-300">📄 PPT 结构大纲预览</span>
                <button
                  onClick={() => handleCopy(pptResult, 'ppt-copy')}
                  className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-[11px] text-white/80 flex items-center gap-1 transition"
                >
                  {copiedId === 'ppt-copy' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copiedId === 'ppt-copy' ? '已复制' : '复制大纲'}</span>
                </button>
              </div>
              <pre className="text-xs text-white/80 font-mono whitespace-pre-wrap leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5 overflow-x-auto">
                {pptResult}
              </pre>
            </div>
          </div>
        )}

        {/* ==================== 2. DATA REPORTS & ANALYSIS ==================== */}
        {activeTab === 'analysis' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-900/30 to-cyan-950/40 p-4 rounded-2xl border border-blue-500/30 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <BarChart3 size={20} className="text-cyan-400" />
                  <h3 className="text-base font-bold text-white">报表生成与 AI 数据分析</h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                  智能洞察
                </span>
              </div>

              <div className="space-y-3 mt-3">
                <div>
                  <label className="text-xs text-white/60 mb-1 block">报表类型</label>
                  <select
                    value={analysisType}
                    onChange={(e) => setAnalysisType(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="月度营销与用户留存看板">📈 月度营销与用户留存看板</option>
                    <option value="核心业务营收与成本分析">💰 核心业务营收与成本分析</option>
                    <option value="AI角色互动与粘性报表">🤖 AI角色互动与粘性报表</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-white/60 mb-1 block">数据指标输入 (文本或关键数值)</label>
                  <textarea
                    rows={3}
                    value={analysisInput}
                    onChange={(e) => setAnalysisInput(e.target.value)}
                    placeholder="如：DAU 12.8w，次留率 48.5%，月充值 15.6万..."
                    className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-xs text-white focus:border-cyan-500 outline-none"
                  />
                </div>

                <button
                  onClick={() => handleAiGenerate('analysis', `分析类型：${analysisType}，原始数据：${analysisInput}`)}
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-98 shadow-md"
                >
                  {loading ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  <span>{loading ? 'AI 正在计算与分析中...' : '生成智能分析结论报告'}</span>
                </button>
              </div>
            </div>

            {/* Visual KPI Mini Widgets */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-center">
                <div className="text-xs text-white/50">月活跃用户 (DAU)</div>
                <div className="text-lg font-black text-cyan-300 mt-1">12.8w <span className="text-[10px] text-emerald-400 font-normal">↑14%</span></div>
              </div>
              <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-center">
                <div className="text-xs text-white/50">次日留存率</div>
                <div className="text-lg font-black text-emerald-400 mt-1">48.5% <span className="text-[10px] text-emerald-400 font-normal">↑5.2%</span></div>
              </div>
            </div>

            {/* Analysis Result */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2 border-b border-white/10 pb-2">
                <span className="text-xs font-bold text-cyan-300">📌 AI 结论与改进方案</span>
                <button
                  onClick={() => handleCopy(analysisResult, 'ana-copy')}
                  className="px-2 py-1 rounded-md bg-white/10 text-[11px] text-white/80"
                >
                  {copiedId === 'ana-copy' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copiedId === 'ana-copy' ? '已复制' : '复制结论'}</span>
                </button>
              </div>
              <pre className="text-xs text-white/80 font-mono whitespace-pre-wrap leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5">
                {analysisResult}
              </pre>
            </div>
          </div>
        )}

        {/* ==================== 3. SMART ALARM & WEATHER ==================== */}
        {activeTab === 'alarm' && (
          <div className="space-y-4">
            {/* Weather Card Widget */}
            <div className="bg-gradient-to-r from-teal-900/40 via-emerald-950/40 to-cyan-900/30 p-4 rounded-2xl border border-emerald-500/30 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-bold">
                  <span>📍 北京 · 今日天气</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-[10px]">适宜出行</span>
                </div>
                <div className="text-2xl font-black text-white mt-1">24°C <span className="text-xs text-white/60 font-normal">晴朗微风</span></div>
                <div className="text-[11px] text-white/50 mt-1">空气质量: 35 (优) | 紫外线: 中等 | 湿度: 45%</div>
              </div>
              <div className="text-4xl text-emerald-300 animate-pulse">🌤️</div>
            </div>

            {/* Alarm List */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <AlarmClock size={16} className="text-emerald-400" />
                  <span>事件提醒与清单闹钟</span>
                </h3>
              </div>

              {alarms.map((alarm) => (
                <div key={alarm.id} className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white">{alarm.title}</span>
                      <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                        {alarm.tag}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black font-mono text-emerald-400">{alarm.time}</span>
                      <input
                        type="checkbox"
                        checked={alarm.enabled}
                        onChange={() =>
                          setAlarms((prev) =>
                            prev.map((a) => (a.id === alarm.id ? { ...a, enabled: !a.enabled } : a))
                          )
                        }
                        className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="bg-black/30 p-2 rounded-xl text-xs space-y-1">
                    {alarm.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-white/70">
                        <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Add Alarm */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-3 space-y-2">
              <div className="text-xs font-bold text-white/80">添加新提醒</div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="提醒标题(如:明天早起出差)"
                  value={newAlarmTitle}
                  onChange={(e) => setNewAlarmTitle(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                />
                <input
                  type="time"
                  value={newAlarmTime}
                  onChange={(e) => setNewAlarmTime(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                />
              </div>
              <button
                onClick={() => {
                  if (!newAlarmTitle.trim()) return;
                  setAlarms((prev) => [
                    ...prev,
                    {
                      id: String(Date.now()),
                      title: newAlarmTitle,
                      time: newAlarmTime,
                      tag: newAlarmTag,
                      enabled: true,
                      items: ['确认完成备忘与任务清单'],
                    },
                  ]);
                  setNewAlarmTitle('');
                  onShowToast('提醒设置成功！');
                }}
                className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
              >
                创建闹钟提醒
              </button>
            </div>
          </div>
        )}

        {/* ==================== 4. IMAGE & ARTWORK STUDIO ==================== */}
        {activeTab === 'image' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-pink-900/30 to-rose-950/40 p-4 rounded-2xl border border-pink-500/30 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ImageIcon size={20} className="text-pink-400" />
                  <h3 className="text-base font-bold text-white">AI 图片与艺术卡片工坊</h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300">
                  海报生成
                </span>
              </div>

              <div className="space-y-3 mt-3">
                <div>
                  <label className="text-xs text-white/60 mb-1 block">提示词 (Prompt)</label>
                  <input
                    type="text"
                    value={imgPrompt}
                    onChange={(e) => setImgPrompt(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/60 mb-1 block">卡片金句 / 文字</label>
                  <input
                    type="text"
                    value={imgQuote}
                    onChange={(e) => setImgQuote(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setGeneratedImgBg('linear-gradient(135deg, #1e1b4b 0%, #311042 50%, #4c0519 100%)')}
                    className="flex-1 py-1.5 rounded-lg bg-indigo-950 border border-indigo-500/40 text-[11px] text-indigo-300"
                  >
                    🌌 梦幻星空
                  </button>
                  <button
                    onClick={() => setGeneratedImgBg('linear-gradient(135deg, #831843 0%, #701a75 50%, #312e81 100%)')}
                    className="flex-1 py-1.5 rounded-lg bg-pink-950 border border-pink-500/40 text-[11px] text-pink-300"
                  >
                    🌆 霓虹都市
                  </button>
                  <button
                    onClick={() => setGeneratedImgBg('linear-gradient(135deg, #064e3b 0%, #022c22 50%, #065f46 100%)')}
                    className="flex-1 py-1.5 rounded-lg bg-emerald-950 border border-emerald-500/40 text-[11px] text-emerald-300"
                  >
                    🎋 极简竹林
                  </button>
                </div>
              </div>
            </div>

            {/* Live Generated Card Canvas */}
            <div className="border border-white/10 rounded-2xl p-6 text-center space-y-4 shadow-2xl relative overflow-hidden" style={{ background: generatedImgBg }}>
              <div className="text-[10px] text-white/40 uppercase tracking-widest font-mono">NETNEST AI STUDIO · CARD</div>
              <div className="text-lg font-serif italic font-bold text-pink-200 px-4 leading-relaxed drop-shadow">
                {imgQuote}
              </div>
              <div className="text-[11px] text-white/60 font-mono">Prompt: {imgPrompt}</div>
              <div className="pt-2 flex justify-center gap-2">
                <button
                  onClick={() => handleCopy(imgQuote, 'img-quote')}
                  className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-medium flex items-center gap-1 backdrop-blur-md"
                >
                  <Share2 size={13} />
                  <span>保存卡片金句</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 5. COPYWRITING & PERMANENT MEMORY ==================== */}
        {activeTab === 'copywrite' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-amber-900/30 to-orange-950/40 p-4 rounded-2xl border border-amber-500/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <BookOpen size={20} className="text-amber-400" />
                  <h3 className="text-base font-bold text-white">文案整理与润色</h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                  一键精修
                </span>
              </div>

              <textarea
                rows={3}
                value={copyInput}
                onChange={(e) => setCopyInput(e.target.value)}
                placeholder="输入想法或杂乱笔记..."
                className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-xs text-white focus:border-amber-500 outline-none mt-2"
              />

              <button
                onClick={() => handleAiGenerate('copywrite', `风格：${copyStyle}，原文：${copyInput}`)}
                disabled={loading}
                className="w-full mt-2 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                {loading ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                <span>AI 精美润色</span>
              </button>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
              <div className="text-xs font-bold text-amber-300 mb-1">✍️ 精修文案结果：</div>
              <p className="text-xs text-white/80 whitespace-pre-wrap bg-black/30 p-3 rounded-xl">{copyResult}</p>
            </div>

            {/* Permanent Memory Vault Section */}
            <div className="border-t border-white/10 pt-3 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
                  <Zap size={15} />
                  <span>永久记忆断层库 (零丢损)</span>
                </h4>
                <span className="text-[10px] text-white/40">已存 {memoryVault.length} 条长期记忆</span>
              </div>

              {/* Memory Search */}
              <div className="flex items-center bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
                <Search size={13} className="text-white/40 mr-2" />
                <input
                  type="text"
                  placeholder="搜索永久记忆要点..."
                  value={memorySearch}
                  onChange={(e) => setMemorySearch(e.target.value)}
                  className="bg-transparent text-xs text-white outline-none w-full"
                />
              </div>

              {/* Memory List */}
              <div className="space-y-2">
                {memoryVault
                  .filter((m) => m.title.includes(memorySearch) || m.content.includes(memorySearch))
                  .map((mem) => (
                    <div key={mem.id} className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{mem.title}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                          {mem.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/70 leading-relaxed">{mem.content}</p>
                      <div className="text-[9px] text-white/30 font-mono text-right">{mem.date}</div>
                    </div>
                  ))}
              </div>

              {/* Add New Memory Entry */}
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3 space-y-2">
                <div className="text-xs font-bold text-white/80">添加一条永久记忆</div>
                <input
                  type="text"
                  placeholder="记忆标题 (如: 个人喜好/合作条款)"
                  value={newMemTitle}
                  onChange={(e) => setNewMemTitle(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                />
                <textarea
                  rows={2}
                  placeholder="详细描述要点..."
                  value={newMemContent}
                  onChange={(e) => setNewMemContent(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-xs text-white outline-none"
                />
                <button
                  onClick={() => {
                    if (!newMemTitle.trim() || !newMemContent.trim()) return;
                    setMemoryVault((prev) => [
                      {
                        id: String(Date.now()),
                        title: newMemTitle,
                        content: newMemContent,
                        category: newMemCategory,
                        date: new Date().toISOString().split('T')[0],
                      },
                      ...prev,
                    ]);
                    setNewMemTitle('');
                    setNewMemContent('');
                    onShowToast('存入永久记忆库！');
                  }}
                  className="w-full py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold"
                >
                  存入永久记忆
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 6. AUDIOBOOK & BEDTIME STORY ==================== */}
        {activeTab === 'story' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-violet-900/30 to-purple-950/40 p-4 rounded-2xl border border-purple-500/30 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Headphones size={20} className="text-purple-400" />
                  <h3 className="text-base font-bold text-white">有声故事与睡前故事</h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                  治愈故事
                </span>
              </div>

              <div className="space-y-2.5 mt-2">
                <input
                  type="text"
                  value={storyTopic}
                  onChange={(e) => setStoryTopic(e.target.value)}
                  placeholder="如: 睡前猫咪温馨童话..."
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />

                <button
                  onClick={() => handleAiGenerate('story', `故事主题：${storyTopic}`)}
                  disabled={loading}
                  className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  {loading ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  <span>生成睡前小故事</span>
                </button>
              </div>
            </div>

            {/* Audio Player Component */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="text-xs font-bold text-purple-300">🎧 正在播放有声讲故事</div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white/40">倍速:</span>
                  <button
                    onClick={() =>
                      setPlaybackSpeed((s) => (s === '1.0x' ? '1.25x' : s === '1.25x' ? '1.5x' : '1.0x'))
                    }
                    className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-purple-300 font-mono"
                  >
                    {playbackSpeed}
                  </button>
                </div>
              </div>

              <p className="text-xs text-white/80 font-serif leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5 max-h-48 overflow-y-auto">
                {storyContent}
              </p>

              {/* Ambient Noise Selector */}
              <div className="flex items-center justify-around py-1 bg-black/40 rounded-xl border border-white/5 text-xs text-white/70">
                <button
                  onClick={() => setBgNoise('rain')}
                  className={`flex items-center gap-1 ${bgNoise === 'rain' ? 'text-purple-400 font-bold' : ''}`}
                >
                  <CloudRain size={13} /> 雨声
                </button>
                <button
                  onClick={() => setBgNoise('fire')}
                  className={`flex items-center gap-1 ${bgNoise === 'fire' ? 'text-amber-400 font-bold' : ''}`}
                >
                  <Flame size={13} /> 篝火
                </button>
                <button
                  onClick={() => setBgNoise('wave')}
                  className={`flex items-center gap-1 ${bgNoise === 'wave' ? 'text-cyan-400 font-bold' : ''}`}
                >
                  <Waves size={13} /> 海浪
                </button>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center justify-center gap-4 pt-1">
                <button
                  onClick={() => {
                    setIsPlayingAudio(!isPlayingAudio);
                    onShowToast(isPlayingAudio ? '已暂停有声故事' : '🔊 开始有声故事播报 (结合雨声白噪音)...');
                  }}
                  className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg transition active:scale-90"
                >
                  {isPlayingAudio ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 7. DECISION BUDDY & PRO-CON ==================== */}
        {activeTab === 'decision' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-fuchsia-900/30 to-pink-950/40 p-4 rounded-2xl border border-pink-500/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Scale size={20} className="text-pink-400" />
                  <h3 className="text-base font-bold text-white">决策陪聊·利弊矩阵</h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300">
                  理性评估
                </span>
              </div>

              <div className="space-y-2 mt-2">
                <input
                  type="text"
                  value={dilemma}
                  onChange={(e) => setDilemma(e.target.value)}
                  placeholder="面临的选择难题，如：要不要跳槽？"
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={optionA}
                    onChange={(e) => setOptionA(e.target.value)}
                    placeholder="选项 A"
                    className="bg-black/40 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                  />
                  <input
                    type="text"
                    value={optionB}
                    onChange={(e) => setOptionB(e.target.value)}
                    placeholder="选项 B"
                    className="bg-black/40 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                  />
                </div>

                <button
                  onClick={() =>
                    handleAiGenerate('decision', `决策难题：${dilemma}，选项A：${optionA}，选项B：${optionB}`)
                  }
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  {loading ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  <span>理性拆解利弊与计算推荐分</span>
                </button>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <pre className="text-xs text-white/80 font-mono whitespace-pre-wrap leading-relaxed bg-black/30 p-3 rounded-xl">
                {decisionResult}
              </pre>
            </div>
          </div>
        )}

        {/* ==================== 8. MILESTONES & CEREMONY ==================== */}
        {activeTab === 'milestone' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Award size={18} className="text-amber-400" />
                <span>纪念日与荣耀节点 (仪式感)</span>
              </h3>
              <button
                onClick={triggerCeremony}
                className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold text-xs shadow-md active:scale-95 transition"
              >
                🎉 开启庆祝仪式
              </button>
            </div>

            {/* Milestones Cards */}
            <div className="space-y-2.5">
              {milestones.map((ms) => (
                <div key={ms.id} className="bg-white/5 border border-amber-500/30 rounded-2xl p-3.5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">{ms.title}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-amber-300 font-mono">{ms.date}</span>
                      <span className="text-[9px] px-2 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                        {ms.badge}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={triggerCeremony}
                    className="p-2 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition"
                  >
                    ✨
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Milestone */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-3 space-y-2">
              <div className="text-xs font-bold text-white/80">添加新的纪念节点</div>
              <input
                type="text"
                placeholder="节点名称 (如: 顺利通过软考高级)"
                value={newMsTitle}
                onChange={(e) => setNewMsTitle(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
              />
              <button
                onClick={() => {
                  if (!newMsTitle.trim()) return;
                  setMilestones((prev) => [
                    ...prev,
                    {
                      id: String(Date.now()),
                      title: newMsTitle,
                      date: newMsDate,
                      category: newMsCategory,
                      badge: '里程碑 🏆',
                      isCelebrated: true,
                    },
                  ]);
                  setNewMsTitle('');
                  triggerCeremony();
                }}
                className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs"
              >
                记录并触发仪式
              </button>
            </div>
          </div>
        )}

        {/* ==================== 9. STUDY SUPERVISOR & QUIZ ==================== */}
        {activeTab === 'study' && (
          <div className="space-y-4">
            {/* Pomodoro Timer */}
            <div className="bg-gradient-to-br from-teal-900/30 to-emerald-950/40 p-4 rounded-2xl border border-teal-500/30 text-center space-y-2">
              <div className="text-xs text-teal-300 font-bold">📚 专注番茄钟 & 学习监督</div>
              <div className="text-4xl font-black font-mono text-white tracking-widest">{formatTimer(pomoTime)}</div>
              <div className="text-[11px] text-white/50">已连续坚持学习 {studyStreak} 天 ⚡</div>

              <div className="flex justify-center gap-2 pt-1">
                <button
                  onClick={() => setIsPomoRunning(!isPomoRunning)}
                  className="px-4 py-1.5 rounded-full bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition"
                >
                  {isPomoRunning ? '暂停专注' : '开始 25min 专注'}
                </button>
                <button
                  onClick={() => {
                    setIsPomoRunning(false);
                    setPomoTime(25 * 60);
                  }}
                  className="px-3 py-1.5 rounded-full bg-white/10 text-white/70 text-xs"
                >
                  重置
                </button>
              </div>
            </div>

            {/* AI Pop Quiz Section */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-bold text-teal-300">📝 AI 定时抽查测试题</span>
                <button
                  onClick={() => handleAiGenerate('quiz', `主题：${studySubject}`)}
                  disabled={loading}
                  className="px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-bold"
                >
                  刷新抽查题
                </button>
              </div>

              {quizQuestions.map((q, qIdx) => (
                <div key={qIdx} className="bg-black/30 p-3 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-white">{qIdx + 1}. {q.question}</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {q.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))}
                        className={`text-left text-[11px] px-2.5 py-1.5 rounded-lg border transition ${
                          selectedAnswers[qIdx] === optIdx
                            ? 'bg-teal-600 text-white border-teal-400'
                            : 'bg-white/5 text-white/70 border-white/5 hover:bg-white/10'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {quizSubmitted && (
                    <div className="text-[10px] text-emerald-300 mt-1 bg-emerald-500/10 p-2 rounded-lg">
                      解析: {q.explanation} (正确答案: {q.options[q.answerIndex]})
                    </div>
                  )}
                </div>
              ))}

              <button
                onClick={() => {
                  setQuizSubmitted(true);
                  onShowToast('交卷完成！知识点已打卡记录！');
                }}
                className="w-full py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs"
              >
                提交抽查答案
              </button>
            </div>
          </div>
        )}

        {/* ==================== 10. DECISION STREAM LOG ==================== */}
        {activeTab === 'stream' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <History size={18} className="text-indigo-400" />
                  <span>决策记录流 (随时追回与校准)</span>
                </h3>
                <p className="text-[10px] text-white/40">记录重要决策背景、选项与预判，随时搜寻复盘</p>
              </div>
              <button
                onClick={() => setShowAddDl(!showAddDl)}
                className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold"
              >
                + 新增记录
              </button>
            </div>

            {/* Search Stream */}
            <div className="flex items-center bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
              <Search size={13} className="text-white/40 mr-2" />
              <input
                type="text"
                placeholder="搜寻历史重大决策记录..."
                value={streamSearch}
                onChange={(e) => setStreamSearch(e.target.value)}
                className="bg-transparent text-xs text-white outline-none w-full"
              />
            </div>

            {/* Add New Decision Log Modal */}
            {showAddDl && (
              <div className="bg-white/5 border border-indigo-500/30 rounded-2xl p-3.5 space-y-2">
                <div className="text-xs font-bold text-indigo-300">记录一项新决策</div>
                <input
                  type="text"
                  placeholder="决策主题 (如: 选用 React 代替 Vue)"
                  value={newDlTitle}
                  onChange={(e) => setNewDlTitle(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                />
                <textarea
                  rows={2}
                  placeholder="决策背景与当时思考..."
                  value={newDlContext}
                  onChange={(e) => setNewDlContext(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-xs text-white outline-none"
                />
                <input
                  type="text"
                  placeholder="选择的理由与预期成果..."
                  value={newDlRationale}
                  onChange={(e) => setNewDlRationale(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                />
                <button
                  onClick={() => {
                    if (!newDlTitle.trim()) return;
                    setDecisionLogs((prev) => [
                      {
                        id: String(Date.now()),
                        title: newDlTitle,
                        context: newDlContext,
                        options: '综合评估选项',
                        rationale: newDlRationale,
                        expectedOutcome: '预期指标达成',
                        date: new Date().toISOString().split('T')[0],
                        reviewDate: '2026-12-01',
                        rating: 5,
                      },
                      ...prev,
                    ]);
                    setNewDlTitle('');
                    setNewDlContext('');
                    setNewDlRationale('');
                    setShowAddDl(false);
                    onShowToast('决策记录流存储成功！');
                  }}
                  className="w-full py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                >
                  保存至记录流
                </button>
              </div>
            )}

            {/* Log Stream Timeline */}
            <div className="space-y-3">
              {decisionLogs
                .filter((dl) => dl.title.includes(streamSearch) || dl.context.includes(streamSearch))
                .map((dl) => (
                  <div key={dl.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{dl.title}</span>
                      <span className="text-[10px] text-indigo-300 font-mono">{dl.date}</span>
                    </div>

                    <div className="text-[11px] text-white/70 space-y-1 bg-black/30 p-3 rounded-xl border border-white/5">
                      <div><strong className="text-white/90">📌 背景：</strong>{dl.context}</div>
                      <div><strong className="text-white/90">⚖️ 理由：</strong>{dl.rationale}</div>
                      <div><strong className="text-white/90">🔮 预期：</strong>{dl.expectedOutcome}</div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-white/40">📅 建议校准复盘日: {dl.reviewDate}</span>
                      <div className="flex items-center gap-1 text-[11px]">
                        <span className="text-white/40">复盘评分:</span>
                        <span className="text-amber-400">{'★'.repeat(dl.rating)}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
