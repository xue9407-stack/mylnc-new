import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Check, Play, Sparkles, Volume2 } from 'lucide-react';
import { Role } from '../types';

interface HomeRecommendViewProps {
  roles: Role[];
  follows: string[];
  onToggleFollow: (roleId: string) => void;
  onStartChat: (role: Role) => void;
  onOpenDetail: (role: Role) => void;
  onShowToast: (msg: string) => void;
  onOpenSearch: () => void;
}

export const HomeRecommendView: React.FC<HomeRecommendViewProps> = ({
  roles,
  follows,
  onToggleFollow,
  onStartChat,
  onOpenDetail,
  onShowToast,
  onOpenSearch,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [isExpandedDesc, setIsExpandedDesc] = useState(false);

  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);
  const lastScrollTime = useRef<number>(0);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentIndex]);

  if (!roles || roles.length === 0) return null;

  const currentRole = roles[currentIndex % roles.length];
  const isFollowed = follows.includes(currentRole.id);

  const handleNextRole = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingVoice(false);
    setIsExpandedDesc(false);
    setCurrentIndex((prev) => (prev + 1) % roles.length);
  };

  const handlePrevRole = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingVoice(false);
    setIsExpandedDesc(false);
    setCurrentIndex((prev) => (prev - 1 + roles.length) % roles.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchEndY.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (touchStartY.current === null || touchEndY.current === null) return;
    const diffY = touchStartY.current - touchEndY.current;
    const minSwipeDistance = 40;

    if (diffY > minSwipeDistance) {
      // Swiped UP -> Next role
      handleNextRole();
    } else if (diffY < -minSwipeDistance) {
      // Swiped DOWN -> Previous role
      handlePrevRole();
    }

    touchStartY.current = null;
    touchEndY.current = null;
  };

  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastScrollTime.current < 400) return;
    if (Math.abs(e.deltaY) > 20) {
      lastScrollTime.current = now;
      if (e.deltaY > 0) {
        handleNextRole();
      } else {
        handlePrevRole();
      }
    }
  };

  const playToneEffect = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // Ignore audio errors
    }
  };

  const toggleVoice = () => {
    if (!('speechSynthesis' in window)) {
      onShowToast('当前浏览器不支持原生语音播放');
      return;
    }

    if (isPlayingVoice) {
      window.speechSynthesis.cancel();
      setIsPlayingVoice(false);
      onShowToast('已停止语音播放');
      return;
    }

    playToneEffect();

    const rawQuote = currentRole.topics && currentRole.topics[0]
      ? currentRole.topics[0]
      : '(看你向这边走来，微微一笑)... 同学，想知道时间？';

    // Filter out bracketed non-verbal actions for clean reading
    const cleanSpeechText = rawQuote.replace(/\([^)]*\)|（[^）]*）/g, '').trim() || rawQuote;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
    utterance.lang = 'zh-CN';

    // Tailor pitch based on character personality tags
    const tagsStr = (currentRole.tags || []).join(' ') + ' ' + (currentRole.title || '');
    const isMale = /霸总|男神|豪门|高冷|偏执|学长|大将军|剑客|总裁|学弟/.test(tagsStr);
    const isFemale = /猫娘|少女|学姐|甜妹|师姐|娇妻|傲娇|千金/.test(tagsStr);

    if (isFemale) {
      utterance.pitch = 1.25;
      utterance.rate = 1.0;
    } else if (isMale) {
      utterance.pitch = 0.82;
      utterance.rate = 0.92;
    } else {
      utterance.pitch = 1.0;
      utterance.rate = 1.0;
    }

    utterance.onstart = () => {
      setIsPlayingVoice(true);
    };

    utterance.onend = () => {
      setIsPlayingVoice(false);
    };

    utterance.onerror = () => {
      setIsPlayingVoice(false);
    };

    setIsPlayingVoice(true);
    window.speechSynthesis.speak(utterance);
    onShowToast(`🔊 正在原声朗读【${currentRole.name}】开场台词...`);
  };

  // Extract avatar / portrait
  const portraitImg = currentRole.portraitUrl || currentRole.avatarUrl;
  const avatarImg = currentRole.avatarUrl || currentRole.portraitUrl;

  return (
    <div
      id="page-recommend-home"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      className="relative h-full w-full overflow-hidden bg-[#07060b] select-none touch-pan-y"
    >
      {/* 1. FULLSCREEN IMMERSIVE PORTRAIT BACKGROUND */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={portraitImg}
          alt={currentRole.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 filter brightness-90 transition-all duration-500"
        />
        {/* Gradient dark overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0911] via-black/40 to-transparent" />
      </div>

      {/* 2. TOP FLOATING HEADER BAR */}
      <div className="relative z-20 pt-4 px-4 flex items-center justify-between">
        {/* Role Quick Profile Chip */}
        <div className="flex items-center gap-2.5 bg-black/50 backdrop-blur-md border border-white/15 rounded-full py-1.5 pl-1.5 pr-3 shadow-lg">
          <div
            onClick={() => onOpenDetail(currentRole)}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 active:scale-95 transition"
            title={`查看 ${currentRole.name} 角色主页`}
          >
            <img
              src={avatarImg}
              alt={currentRole.name}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover border border-purple-400/50"
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white leading-tight flex items-center gap-1">
                {currentRole.name}
              </span>
              <span className="text-[9px] text-white/60">
                已经有 {currentRole.users || '151'} 人收藏
              </span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFollow(currentRole.id);
              onShowToast(isFollowed ? `已取消关注 ${currentRole.name}` : `已关注 ${currentRole.name}，关系升级！`);
            }}
            className={`w-6 h-6 rounded-full flex items-center justify-center transition ml-1 ${
              isFollowed
                ? 'bg-white/20 text-emerald-300'
                : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md shadow-pink-500/30'
            }`}
          >
            {isFollowed ? <Check size={12} /> : <Plus size={14} />}
          </button>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSearch}
            className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition"
          >
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* 3. LEFT FLOATING VERTICAL TAG */}
      <div className="absolute left-2 top-28 z-20 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-1.5 py-3 text-[9px] text-white/40 tracking-widest writing-mode-vertical uppercase">
        内容由 AI 生成
      </div>

      {/* 5. MAIN CONTENT AREA (FLOATING CARDS) */}
      <div className="absolute bottom-20 left-0 right-0 z-20 px-4 space-y-3 max-h-[70vh] flex flex-col justify-end">
        {/* Role Profile Card ("角色档案") */}
        <div className="bg-black/60 backdrop-blur-xl border border-white/15 rounded-3xl p-3.5 space-y-2 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-3.5 bg-gradient-to-b from-purple-400 to-pink-500 rounded-full" />
              <span className="text-xs font-bold text-white tracking-wide">角色档案</span>
            </div>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-white/60 border border-white/10">
              {currentRole.tags.length || 5} 个标签
            </span>
          </div>

          <p className={`text-xs text-white/80 leading-relaxed font-normal ${isExpandedDesc ? '' : 'line-clamp-2'}`}>
            <span className="text-purple-300 font-semibold">简介：</span>
            {currentRole.desc}
          </p>

          {/* Tags list */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {currentRole.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.8 rounded-full bg-purple-500/20 border border-purple-500/30 text-[10px] font-medium text-purple-200 shrink-0"
                >
                  {tag}
                </span>
              ))}
            </div>

            <button
              onClick={() => onOpenDetail(currentRole)}
              className="text-[10px] text-white/60 hover:text-white shrink-0 ml-2 font-medium flex items-center gap-0.5"
            >
              <span>展开</span>
              <span className="text-[9px]">⌜</span>
            </button>
          </div>
        </div>

        {/* Opening Quote & Voice Card */}
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-4 space-y-2.5 shadow-2xl relative overflow-hidden">
          {/* Voice Preview Button */}
          <button
            onClick={toggleVoice}
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition active:scale-95 ${
              isPlayingVoice
                ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/40 animate-bounce'
                : 'bg-black/40 text-white/90 hover:bg-black/60 border border-white/20'
            }`}
          >
            {isPlayingVoice ? <Volume2 size={13} className="animate-spin" /> : <Play size={12} className="fill-white" />}
            <span>6"</span>
          </button>

          {/* Opening Dialogue Quote */}
          <p className="text-xs text-white/95 leading-relaxed font-serif italic">
            "{currentRole.topics && currentRole.topics[0] ? currentRole.topics[0] : `(看你向这边走来，微微一笑)... 同学，想知道时间？`}"
          </p>
        </div>

        {/* 6. BOTTOM ACTION DOCK (ENTER CHAT FULL WIDTH) */}
        <div className="pt-1">
          <button
            onClick={() => onStartChat(currentRole)}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600/90 via-pink-600/90 to-purple-700/90 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-sm shadow-xl shadow-purple-900/50 border border-purple-400/40 backdrop-blur-lg flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <Sparkles size={18} className="text-pink-300" />
            <span>进入聊天</span>
          </button>
        </div>
      </div>
    </div>
  );
};
