import React, { useState, useEffect } from 'react';
import { Role, StoryLineItem, MiniTheaterItem, UserProfile } from '../types';
import {
  X,
  Share2,
  MoreHorizontal,
  Heart,
  MessageCircle,
  Star,
  Sparkles,
  Maximize2,
  ShieldCheck,
  Lock,
  Zap,
  CheckCircle2,
  Presentation,
  BarChart3,
  AlarmClock,
  ImageIcon as ImageIconLucide,
  BookOpen,
  Headphones,
  Scale,
  Award,
  GraduationCap,
  History,
  CreditCard,
  PenTool,
  Clapperboard,
  Plus,
  Info,
  ChevronRight,
  User,
  Play,
  Volume2,
  Coins
} from 'lucide-react';
import { getIntimacyData, getIntimacyPercent } from '../utils/intimacy';
import { IntimacyModal } from './IntimacyModal';
import { ROLE_MEDIA_MAP } from '../data/rolePortraits';
import { ROLE_AI_TOOLS, isRoleUnlocked, unlockRoleToolkit, RoleToolInfo } from '../utils/roleUnlock';
import { getRoleStorylines, saveRoleStoryline, getRoleTheaters, saveRoleTheater } from '../data/storyTheaterPresetData';
import { StoryReaderModal } from './StoryReaderModal';
import { StoryCreateModal } from './StoryCreateModal';
import { TheaterPlayerModal } from './TheaterPlayerModal';
import { TheaterCreateModal } from './TheaterCreateModal';

interface DetailModalProps {
  role: Role | null;
  isOpen: boolean;
  isFollowed: boolean;
  userProfile?: UserProfile;
  onClose: () => void;
  onToggleFollow: () => void;
  onStartChat: (role: Role, prompt?: string) => void;
  onShowToast: (msg: string) => void;
  intimacyPoints?: number;
  onUpdateIntimacy?: (added: number) => void;
  onOpenRecharge?: () => void;
  onDeductMoney?: (amount: number) => boolean;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  role,
  isOpen,
  isFollowed,
  userProfile = {
    id: 0,
    username: 'guest',
    nickname: '未登录',
    avatar: '😊',
    money: 0,
    score: 0,
    vip_level: 0,
    vip_text: '普通用户'
  },
  onClose,
  onToggleFollow,
  onStartChat,
  onShowToast,
  intimacyPoints = 0,
  onUpdateIntimacy,
  onOpenRecharge,
  onDeductMoney,
}) => {
  const [activeTab, setActiveTab] = useState<'about' | 'story' | 'theater'>('about');
  const [showFullPortrait, setShowFullPortrait] = useState(false);
  const [showIntimacyModal, setShowIntimacyModal] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [showUnlockConfirm, setShowUnlockConfirm] = useState<boolean>(false);
  const [selectedTool, setSelectedTool] = useState<RoleToolInfo | null>(null);

  // Storylines & Theaters State
  const [storylines, setStorylines] = useState<StoryLineItem[]>([]);
  const [theaters, setTheaters] = useState<MiniTheaterItem[]>([]);

  // Modals for Reading / Playing & Creating
  const [activeStory, setActiveStory] = useState<StoryLineItem | null>(null);
  const [showStoryCreate, setShowStoryCreate] = useState(false);

  const [activeTheater, setActiveTheater] = useState<MiniTheaterItem | null>(null);
  const [showTheaterCreate, setShowTheaterCreate] = useState(false);

  useEffect(() => {
    setImgError(false);
    if (role) {
      setIsUnlocked(isRoleUnlocked(role.id));
      setStorylines(getRoleStorylines(role.id));
      setTheaters(getRoleTheaters(role.id));
    }
  }, [role?.id]);

  if (!isOpen || !role) return null;

  const intimacyInfo = getIntimacyData(intimacyPoints);
  const intimacyPercent = getIntimacyPercent(intimacyPoints);
  const portraitSrc = ROLE_MEDIA_MAP[role.id]?.portraitUrl || role.portraitUrl || role.avatarUrl;

  const handleUnlockClick = () => {
    unlockRoleToolkit(role.id);
    setIsUnlocked(true);
    setShowUnlockConfirm(false);
    onShowToast(`🎉 成功充值解锁【${role.name}】10 大专属 AI 智囊特权！`);
  };

  const handleToolClick = (tool: RoleToolInfo) => {
    if (!isUnlocked && !tool.isFree) {
      setSelectedTool(tool);
      setShowUnlockConfirm(true);
      return;
    }
    const prompt = tool.promptTemplate(role.name);
    onStartChat(role, prompt);
  };

  const handleStoryCreated = (newStory: StoryLineItem) => {
    const updated = saveRoleStoryline(role.id, newStory);
    setStorylines(updated);
    setActiveStory(newStory);
  };

  const handleTheaterCreated = (newTheater: MiniTheaterItem) => {
    const updated = saveRoleTheater(role.id, newTheater);
    setTheaters(updated);
    setActiveTheater(newTheater);
  };

  return (
    <div
      id="role-detail-modal"
      className="absolute inset-0 z-50 bg-[#0a0a0f] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200 select-none"
    >
      {/* Top Cover with Character Portrait / Illustration */}
      <div className={`relative h-72 w-full overflow-hidden flex items-center justify-center ${role.cover}`}>
        {portraitSrc && !imgError ? (
          <img
            src={portraitSrc}
            alt={role.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-top filter brightness-90 hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="text-8xl drop-shadow-2xl select-none transform hover:scale-105 transition duration-300">
            {role.emoji}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/20 to-black/40 pointer-events-none" />

        {/* Close button */}
        <button
          id="btn-close-detail"
          onClick={onClose}
          aria-label="关闭"
          className="absolute top-10 left-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white/90 hover:bg-black/70 transition active:scale-95 z-20 border border-white/10"
        >
          <X size={18} />
        </button>

        {/* Top Actions */}
        <div className="absolute top-10 right-4 flex items-center gap-2.5 z-20">
          <button
            id="btn-preview-portrait"
            onClick={() => setShowFullPortrait(true)}
            className="px-2.5 py-1.5 rounded-full bg-black/50 backdrop-blur-md flex items-center gap-1 text-[11px] text-purple-200 hover:bg-black/70 transition active:scale-95 border border-purple-400/30"
            title="查看完整高清立绘"
          >
            <Maximize2 size={12} />
            <span>全身立绘</span>
          </button>
          <button
            id="btn-share-role"
            onClick={() => onShowToast('分享链接已复制到剪贴板')}
            className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white/90 hover:bg-black/70 transition active:scale-95 border border-white/10"
            aria-label="分享"
          >
            <Share2 size={16} />
          </button>
          <button
            id="btn-more-role"
            onClick={() => onShowToast('已复制角色资料名片')}
            className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white/90 hover:bg-black/70 transition active:scale-95 border border-white/10"
            aria-label="更多"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Main Content Sheet */}
      <div className="flex-1 bg-[#0a0a0f] rounded-t-[28px] -mt-6 px-5 pt-4 pb-28 overflow-y-auto relative z-10 border-t border-white/10 shadow-2xl flex flex-col">
        {/* Character Title & Rating */}
        <div className="flex items-center justify-between pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white tracking-wide">{role.name}</h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                {role.title}
              </span>
            </div>
            <p className="text-[11px] text-white/50 font-medium mt-0.5 flex items-center gap-1">
              <ShieldCheck size={11} className="text-emerald-400" />
              <span>{role.is_official ? '网巢官方认证角色' : '创作者精选角色'}</span>
            </p>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 text-xs font-semibold">
            <Star size={12} className="fill-yellow-400" />
            <span>{role.rating || 4.9}</span>
          </div>
        </div>

        {/* Tab Navigation Header (Image 2 style) */}
        <div className="flex items-center justify-center gap-8 border-b border-white/10 pb-2 mb-4">
          <button
            onClick={() => setActiveTab('about')}
            className={`relative py-1 text-sm font-bold transition ${
              activeTab === 'about' ? 'text-white' : 'text-white/50 hover:text-white/80'
            }`}
          >
            关于Ta
            {activeTab === 'about' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-1 bg-[#6c52ee] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('story')}
            className={`relative py-1 text-sm font-bold transition ${
              activeTab === 'story' ? 'text-white' : 'text-white/50 hover:text-white/80'
            }`}
          >
            故事线
            {activeTab === 'story' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-1 bg-[#6c52ee] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('theater')}
            className={`relative py-1 text-sm font-bold transition ${
              activeTab === 'theater' ? 'text-white' : 'text-white/50 hover:text-white/80'
            }`}
          >
            小剧场
            {activeTab === 'theater' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-1 bg-[#6c52ee] rounded-full" />
            )}
          </button>
        </div>

        {/* TAB 1: 关于Ta (简单流畅背景人设) */}
        {activeTab === 'about' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Simple Background Bio Description */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
              <h3 className="text-xs font-extrabold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                <User size={13} />
                <span>背景描述与人设</span>
              </h3>
              <p className="text-sm text-white/85 leading-relaxed font-light">
                {role.desc}
              </p>
            </div>

            {/* Intimacy / Affection Card */}
            <div
              onClick={() => setShowIntimacyModal(true)}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/25 via-pink-950/20 to-purple-900/20 border border-purple-500/30 cursor-pointer hover:border-purple-500/50 transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-pink-500/20 text-pink-300 flex items-center justify-center text-sm shadow-sm">
                    <Heart size={15} className="fill-pink-500 text-pink-500" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      <span>当前羁绊：Lv.{intimacyInfo.level} {intimacyInfo.title}</span>
                      <span className="text-xs">{intimacyInfo.icon}</span>
                    </span>
                    <span className="text-[10px] text-purple-300/70 block">
                      已累积 {intimacyInfo.points} 亲密值 · 点击查看特权档案
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-pink-300 group-hover:translate-x-0.5 transition">
                  羁绊特权 ›
                </span>
              </div>

              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${intimacyPercent}%` }}
                />
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 divide-x divide-white/10 bg-white/[0.03] border border-white/5 rounded-2xl py-3.5">
              <div className="text-center">
                <div className="text-lg font-bold text-white">{role.users}</div>
                <div className="text-[11px] text-white/40 mt-0.5">聊过的人</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">{role.follows}</div>
                <div className="text-[11px] text-white/40 mt-0.5">已关注</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-emerald-400">99.8%</div>
                <div className="text-[11px] text-white/40 mt-0.5">好评率</div>
              </div>
            </div>

            {/* Personality Tags */}
            <div>
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">性格标签</h3>
              <div className="flex flex-wrap gap-2">
                {role.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-white/8 text-white/85 text-xs font-medium border border-white/5 hover:border-purple-500/40 transition"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Starter Prompts */}
            <div>
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Sparkles size={13} className="text-purple-400" />
                <span>专属开场话题</span>
              </h3>
              <div className="space-y-2">
                {role.topics.map((topic, i) => (
                  <div
                    key={i}
                    onClick={() => onStartChat(role, `你好，我想聊聊“${topic}”`)}
                    className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-purple-200 text-xs leading-normal hover:bg-purple-900/30 transition cursor-pointer flex items-center justify-between group active:scale-[0.99]"
                  >
                    <span>“{topic}”</span>
                    <span className="text-purple-400 text-xs group-hover:translate-x-0.5 transition">聊这个 ›</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 10 AI Toolkit Section */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#131022] via-[#0d0b17] to-[#0a0a0f] border border-purple-500/30 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm">
                    <Zap size={15} />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>【{role.name}】10 大专属 AI 智囊技能</span>
                    </h3>
                    <p className="text-[10px] text-white/50">角色拟真口吻 · 全能生产力与专属伴侣服务</p>
                  </div>
                </div>

                {isUnlocked ? (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 size={11} />
                    <span>已解锁</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-bold border border-pink-500/30 flex items-center gap-1">
                    <Lock size={10} />
                    <span>充值解锁</span>
                  </span>
                )}
              </div>

              <div className="mt-3.5 grid grid-cols-2 gap-2">
                {ROLE_AI_TOOLS.map((tool) => {
                  const isAccessible = isUnlocked || tool.isFree;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => handleToolClick(tool)}
                      className={`p-2.5 rounded-xl border text-left transition flex items-start gap-2 relative group overflow-hidden active:scale-95 ${
                        isAccessible
                          ? 'bg-white/[0.04] hover:bg-white/10 border-white/10 text-white hover:border-purple-500/40'
                          : 'bg-white/[0.02] border-white/5 text-white/60 hover:bg-white/5'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                        isAccessible ? 'bg-purple-500/20 text-purple-300' : 'bg-white/5 text-white/40'
                      }`}>
                        {tool.id === 'ppt' && <Presentation size={14} />}
                        {tool.id === 'analysis' && <BarChart3 size={14} />}
                        {tool.id === 'alarm' && <AlarmClock size={14} />}
                        {tool.id === 'image' && <ImageIconLucide size={14} />}
                        {tool.id === 'copywrite' && <BookOpen size={14} />}
                        {tool.id === 'story' && <Headphones size={14} />}
                        {tool.id === 'decision' && <Scale size={14} />}
                        {tool.id === 'milestone' && <Award size={14} />}
                        {tool.id === 'study' && <GraduationCap size={14} />}
                        {tool.id === 'stream' && <History size={14} />}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white flex items-center justify-between">
                          <span className="truncate">{tool.shortName}</span>
                          {tool.isFree ? (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 shrink-0 ml-1">
                              免费
                            </span>
                          ) : !isUnlocked ? (
                            <Lock size={10} className="text-pink-400 shrink-0 ml-1" />
                          ) : null}
                        </div>
                        <div className="text-[10px] text-white/40 truncate mt-0.5">{tool.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 故事线 (纯文字互动小说 + 按字数AI收费创作) */}
        {activeTab === 'story' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Action Bar: Create Storyline */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/30 via-[#19152b] to-purple-900/30 border border-purple-500/30 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <BookOpen size={14} className="text-purple-400" />
                  <span>【{role.name}】故事线列表</span>
                </h4>
                <p className="text-[10px] text-purple-300/70">纯文字小说演绎 · 选择肢互动影响结局</p>
              </div>

              <button
                onClick={() => setShowStoryCreate(true)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white text-xs font-bold shadow-md shadow-purple-500/30 flex items-center gap-1 transition active:scale-95"
              >
                <Plus size={14} />
                <span>创建故事线</span>
              </button>
            </div>

            {/* List of Storylines */}
            <div className="space-y-3">
              {storylines.map((st) => (
                <div
                  key={st.id}
                  className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/40 transition space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-white group-hover:text-purple-300 transition">
                        {st.title}
                      </span>
                      {st.isCustom && (
                        <span className="text-[9px] px-2 py-0.2 rounded-full bg-pink-500/20 text-pink-300 font-bold border border-pink-500/30">
                          AI 专属定制
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-purple-300 font-mono font-bold">
                      {st.wordCount} 字
                    </span>
                  </div>

                  <p className="text-xs text-white/60 leading-relaxed font-light line-clamp-2">
                    {st.summary}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[11px] text-white/40">
                    <span>作者：{st.author}</span>
                    <button
                      onClick={() => setActiveStory(st)}
                      className="px-3 py-1 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/30 text-xs font-bold transition flex items-center gap-1"
                    >
                      <span>进入故事线</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: 小剧场 (互动影响+动态图+背景图+配音+按字数收费创作) */}
        {activeTab === 'theater' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Action Bar: Create Mini-Theater */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-900/30 via-[#19152b] to-purple-900/30 border border-pink-500/30 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Clapperboard size={14} className="text-pink-400" />
                  <span>【{role.name}】小剧场空间</span>
                </h4>
                <p className="text-[10px] text-pink-300/70">文字互动影响剧情 + 动态 GIF + 背景图 + 原声配音</p>
              </div>

              <button
                onClick={() => setShowTheaterCreate(true)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 text-white text-xs font-bold shadow-md shadow-pink-500/30 flex items-center gap-1 transition active:scale-95"
              >
                <Plus size={14} />
                <span>创建小剧场</span>
              </button>
            </div>

            {/* List of Mini-Theaters */}
            <div className="space-y-3">
              {theaters.map((th) => (
                <div
                  key={th.id}
                  onClick={() => setActiveTheater(th)}
                  className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-pink-500/40 transition flex gap-3 cursor-pointer group relative overflow-hidden"
                >
                  <div className="w-24 h-20 rounded-xl overflow-hidden shrink-0 relative bg-black/40 border border-white/10">
                    <img
                      src={th.bgImage}
                      alt={th.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="w-7 h-7 rounded-full bg-purple-600/80 text-white flex items-center justify-center shadow-lg">
                        <Play size={14} className="ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-extrabold text-white truncate group-hover:text-pink-300 transition">
                          {th.title}
                        </h4>
                        {th.isCustom && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 shrink-0">
                            定制
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-white/50 line-clamp-2 mt-1 font-light">
                        {th.desc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-purple-300/80 mt-1">
                      <span className="flex items-center gap-1">
                        <Volume2 size={11} className="text-pink-400" />
                        <span>含有声配音与 GIF 演练</span>
                      </span>
                      <span className="font-bold font-mono">进入剧场 ›</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/10 flex gap-3 z-20">
        {activeTab === 'story' ? (
          <button
            onClick={() => setShowStoryCreate(true)}
            className="flex-1 py-3.5 px-4 rounded-[20px] text-sm font-bold bg-[#221c38] hover:bg-[#2e264d] text-[#c4b5fd] border border-[#a78bfa]/20 flex items-center justify-center gap-2 transition active:scale-95 shadow-sm"
          >
            <PenTool size={16} className="text-[#a78bfa]" />
            <span>创建故事线</span>
          </button>
        ) : activeTab === 'theater' ? (
          <button
            onClick={() => setShowTheaterCreate(true)}
            className="flex-1 py-3.5 px-4 rounded-[20px] text-sm font-bold bg-[#221c38] hover:bg-[#2e264d] text-[#c4b5fd] border border-[#a78bfa]/20 flex items-center justify-center gap-2 transition active:scale-95 shadow-sm"
          >
            <Clapperboard size={16} className="text-[#a78bfa]" />
            <span>创建小剧场</span>
          </button>
        ) : (
          <button
            id="btn-toggle-follow"
            onClick={onToggleFollow}
            className={`flex-1 py-3.5 px-4 rounded-[20px] text-sm font-bold flex items-center justify-center gap-2 transition active:scale-95 ${
              isFollowed
                ? 'bg-[#221c38] text-[#c4b5fd] border border-[#a78bfa]/30'
                : 'bg-[#221c38] hover:bg-[#2e264d] text-[#c4b5fd] border border-[#a78bfa]/20'
            }`}
          >
            <Heart size={16} className={isFollowed ? 'fill-pink-500 text-pink-500' : 'text-[#a78bfa]'} />
            <span>{isFollowed ? '已关注' : '+ 关注'}</span>
          </button>
        )}

        <button
          id="btn-start-chat-modal"
          onClick={() => onStartChat(role)}
          className="flex-1 py-3.5 px-5 rounded-[20px] text-sm font-bold bg-[#6c52ee] hover:bg-[#5b41e2] text-white flex items-center justify-center gap-2 shadow-lg shadow-[#6c52ee]/30 active:scale-95 transition"
        >
          <MessageCircle size={16} />
          <span>和Ta聊天</span>
        </button>
      </div>

      {/* Full Portrait Modal */}
      {showFullPortrait && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowFullPortrait(false)}
        >
          <div
            className="w-full max-w-sm max-h-[90vh] bg-[#12121c] rounded-3xl overflow-hidden border border-white/10 relative shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowFullPortrait(false)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center"
            >
              <X size={18} />
            </button>

            <div className="relative flex-1 min-h-[420px] bg-cover bg-top overflow-hidden">
              <img
                src={portraitSrc}
                alt={role.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12121c] via-transparent to-black/20" />
            </div>

            <div className="p-4 bg-[#12121c] border-t border-white/10 text-center">
              <h3 className="text-lg font-bold text-white">【{role.name}】原画立绘档案</h3>
              <p className="text-xs text-purple-300/70 mt-0.5">{role.title} · 高清写实插画渲染</p>
              <button
                onClick={() => {
                  setShowFullPortrait(false);
                  onShowToast(`已将【${role.name}】设为当前偏好壁纸！`);
                }}
                className="mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold"
              >
                保存为聊天背景
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Intimacy Modal */}
      <IntimacyModal
        isOpen={showIntimacyModal}
        onClose={() => setShowIntimacyModal(false)}
        role={role}
        points={intimacyPoints}
        onShowToast={onShowToast}
        onAddBonus={() => {
          if (onUpdateIntimacy) onUpdateIntimacy(10);
        }}
      />

      {/* Unlock Toolkit Modal */}
      {showUnlockConfirm && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 select-none"
          onClick={() => setShowUnlockConfirm(false)}
        >
          <div
            className="w-full max-w-sm bg-[#121020] border border-pink-500/30 rounded-3xl p-5 shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowUnlockConfirm(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition"
            >
              <X size={16} />
            </button>

            <div className="text-center pt-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-pink-500/30 border border-white/20">
                <Zap size={28} className="fill-white" />
              </div>

              <h3 className="text-base font-extrabold text-white">
                解锁【{role.name}】10 大专属 AI 智囊
              </h3>
              <p className="text-xs text-purple-200/80 mt-1.5 leading-relaxed px-2">
                {selectedTool ? `您选中的【${selectedTool.title}】功能需要充值解锁！` : '该角色的 10 大智囊能力需充值解锁！'}
                解锁后【{role.name}】将全天候以专属人设，为你处理 PPT 提炼、数据分析、睡前故事、事件提醒等全能服务。
              </p>

              <div className="my-4 p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-left space-y-1.5 text-xs text-white/70">
                <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                  <CheckCircle2 size={13} />
                  <span>一次充值，该角色永久免费使用</span>
                </div>
                <div className="flex items-center gap-2 text-purple-300 font-semibold">
                  <CheckCircle2 size={13} />
                  <span>包含 PPT/报表/闹钟/故事等 10 大秘籍</span>
                </div>
                <div className="flex items-center gap-2 text-pink-300 font-semibold">
                  <CheckCircle2 size={13} />
                  <span>与【{role.name}】聊天时可随时调用</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleUnlockClick}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:opacity-95 text-white text-sm font-extrabold shadow-lg shadow-purple-500/30 active:scale-95 transition flex items-center justify-center gap-2"
                >
                  <Zap size={16} className="fill-white" />
                  <span>⚡ 充值 ¥10 / 钻石一键解锁特权</span>
                </button>

                {onOpenRecharge && (
                  <button
                    onClick={() => {
                      setShowUnlockConfirm(false);
                      onOpenRecharge();
                    }}
                    className="w-full py-2.5 text-xs font-semibold text-white/50 hover:text-white flex items-center justify-center gap-1.5 transition"
                  >
                    <CreditCard size={13} />
                    <span>前往网巢充值中心选购其它档位 ›</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Story Reader Modal */}
      <StoryReaderModal
        isOpen={Boolean(activeStory)}
        role={role}
        story={activeStory}
        onClose={() => setActiveStory(null)}
        onShowToast={onShowToast}
        onStartChat={onStartChat}
      />

      {/* Story Create Modal */}
      <StoryCreateModal
        isOpen={showStoryCreate}
        role={role}
        userProfile={userProfile}
        onClose={() => setShowStoryCreate(false)}
        onCreated={handleStoryCreated}
        onShowToast={onShowToast}
        onDeductMoney={onDeductMoney}
      />

      {/* Theater Player Modal */}
      <TheaterPlayerModal
        isOpen={Boolean(activeTheater)}
        role={role}
        theater={activeTheater}
        onClose={() => setActiveTheater(null)}
        onShowToast={onShowToast}
        onStartChat={onStartChat}
      />

      {/* Theater Create Modal */}
      <TheaterCreateModal
        isOpen={showTheaterCreate}
        role={role}
        userProfile={userProfile}
        onClose={() => setShowTheaterCreate(false)}
        onCreated={handleTheaterCreated}
        onShowToast={onShowToast}
        onDeductMoney={onDeductMoney}
      />
    </div>
  );
};
