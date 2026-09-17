import React, { useState, useEffect, useRef } from 'react';
import { Role, ChatMessage } from '../types';
import {
  ChevronLeft,
  Send,
  Sparkles,
  Volume2,
  Trash2,
  Copy,
  RotateCcw,
  VolumeX,
  Heart,
  MoreVertical,
  ImageIcon,
  X,
  Zap,
  Lock,
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
  CreditCard
} from 'lucide-react';
import { RoleAvatar } from './RoleAvatar';
import {
  getIntimacyData,
  getIntimacyPercent,
  AddChatIntimacyResult,
} from '../utils/intimacy';
import { IntimacyModal } from './IntimacyModal';
import { ROLE_AI_TOOLS, isRoleUnlocked, unlockRoleToolkit, RoleToolInfo } from '../utils/roleUnlock';

interface ChatViewProps {
  role: Role;
  onBack: () => void;
  onSendMessage: (text: string) => Promise<void>;
  messages: ChatMessage[];
  isTyping: boolean;
  onShowToast: (msg: string) => void;
  onClearHistory: () => void;
  intimacyPoints?: number;
  onUpdateIntimacy?: (added: number) => void;
  onChatInteraction?: () => AddChatIntimacyResult;
  onDeleteMessage?: (msgId: number) => void;
  onRegenerateMessage?: (roleMsgId: number) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  role,
  onBack,
  onSendMessage,
  messages,
  isTyping,
  onShowToast,
  onClearHistory,
  intimacyPoints = 0,
  onUpdateIntimacy,
  onChatInteraction,
  onDeleteMessage,
  onRegenerateMessage,
}) => {
  const [inputText, setInputText] = useState('');
  const [showIntimacyModal, setShowIntimacyModal] = useState(false);
  const [showPortraitModal, setShowPortraitModal] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<number | null>(null);
  const [floatingBonus, setFloatingBonus] = useState<{
    added: number;
    gainedToday: number;
    capReached: boolean;
  } | null>(null);

  // Message Action Menu state
  const [activeMenuMsg, setActiveMenuMsg] = useState<{
    msg: ChatMessage;
    x: number;
    y: number;
  } | null>(null);

  // Role 10 AI Toolkit state
  const [showToolkitSheet, setShowToolkitSheet] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [selectedTool, setSelectedTool] = useState<RoleToolInfo | null>(null);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => isRoleUnlocked(role.id));

  useEffect(() => {
    setIsUnlocked(isRoleUnlocked(role.id));
  }, [role.id]);

  const handleUseTool = (tool: RoleToolInfo) => {
    if (!isUnlocked && !tool.isFree) {
      setSelectedTool(tool);
      setShowUnlockModal(true);
      return;
    }
    // Execute tool prompt
    const prompt = tool.promptTemplate(role.name);
    setInputText(prompt);
    setShowToolkitSheet(false);
    onShowToast(`已载入【${tool.title}】的专属秘籍指令，发送即可让${role.name}执行！`);
  };

  const handleUnlockToolkit = () => {
    unlockRoleToolkit(role.id);
    setIsUnlocked(true);
    setShowUnlockModal(false);
    onShowToast(`🎉 充值成功！已永久解锁【${role.name}】10 大专属 AI 智囊特权！`);
    if (selectedTool) {
      const prompt = selectedTool.promptTemplate(role.name);
      setInputText(prompt);
    }
  };

  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const intimacyInfo = getIntimacyData(intimacyPoints);
  const intimacyPercent = getIntimacyPercent(intimacyPoints);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const triggerIntimacyBonus = () => {
    if (onChatInteraction) {
      const res = onChatInteraction();
      setFloatingBonus({
        added: res.actualAdded,
        gainedToday: res.gainedToday,
        capReached: res.isCapReached,
      });
      setTimeout(() => {
        setFloatingBonus(null);
      }, 2500);
    } else if (onUpdateIntimacy) {
      const bonus = Math.floor(Math.random() * 6) + 5;
      onUpdateIntimacy(bonus);
    }
  };

  const handleSendText = (text: string) => {
    if (!text || isTyping) return;
    onSendMessage(text);
    triggerIntimacyBonus();
  };

  const handleSend = () => {
    const text = inputText.trim();
    if (!text || isTyping) return;
    setInputText('');
    handleSendText(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  // Text-To-Speech (TTS)
  const handleTTS = (msg: ChatMessage) => {
    if (!('speechSynthesis' in window)) {
      onShowToast('当前设备环境不支持原生语音朗读');
      return;
    }

    if (speakingMsgId === msg.id) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      onShowToast('已停止语音朗读');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(msg.text);
    utterance.lang = 'zh-CN';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setSpeakingMsgId(null);
    };
    utterance.onerror = () => {
      setSpeakingMsgId(null);
    };

    setSpeakingMsgId(msg.id);
    window.speechSynthesis.speak(utterance);
    onShowToast(`🔊 正在为【${msg.sender === 'user' ? '你' : role.name}】朗读语音...`);
  };

  // Copy Message Text
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      onShowToast('已复制内容到剪贴板');
    } catch {
      onShowToast('复制失败，请手动选中文本复制');
    }
    setActiveMenuMsg(null);
  };

  // Delete message
  const handleDelete = (id: number) => {
    if (onDeleteMessage) {
      onDeleteMessage(id);
    }
    onShowToast('已删除此条消息');
    setActiveMenuMsg(null);
  };

  // Regenerate role reply
  const handleRegenerate = (roleMsgId: number) => {
    if (onRegenerateMessage) {
      onRegenerateMessage(roleMsgId);
      onShowToast(`正在让【${role.name}】重新思考回答...`);
    } else {
      onShowToast('重新生成回答');
    }
    setActiveMenuMsg(null);
  };

  // Long press handlers for touch devices
  const handleTouchStart = (msg: ChatMessage, e: React.TouchEvent) => {
    const touch = e.touches[0];
    const x = touch.clientX;
    const y = touch.clientY;
    longPressTimerRef.current = setTimeout(() => {
      try {
        navigator.vibrate?.(35);
      } catch {}
      setActiveMenuMsg({ msg, x, y });
    }, 450);
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  return (
    <div id="chat-view-container" className="h-full flex flex-col bg-[#08080d] relative overflow-hidden select-none">
      {/* Top Header */}
      <div className="px-4 py-2.5 bg-[#0d0d14]/95 backdrop-blur-xl border-b border-white/5 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-2.5">
          <button
            id="btn-chat-back"
            onClick={onBack}
            className="w-8 h-8 rounded-full flex items-center justify-center text-purple-300 hover:bg-white/10 active:scale-95 transition"
            aria-label="返回"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Role Avatar with click to view portrait */}
          <div
            onClick={() => setShowPortraitModal(true)}
            className="cursor-pointer group relative"
            title="点击查看角色全身立绘"
          >
            <RoleAvatar
              name={role.name}
              avatarUrl={role.avatarUrl}
              emoji={role.emoji}
              coverClass={role.cover}
              size="md"
              showOnlineBadge
            />
            <span className="absolute -bottom-1 -right-1 px-1 rounded bg-black/80 text-[8px] text-purple-300 border border-white/10 flex items-center gap-0.5">
              <ImageIcon size={8} />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-white tracking-tight">{role.name}</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-purple-500/20 text-purple-300 font-medium">
                {role.title}
              </span>
            </div>

            {/* Intimacy pill in header */}
            <button
              onClick={() => setShowIntimacyModal(true)}
              className="flex items-center gap-1.5 mt-0.5 px-2 py-0.5 rounded-full bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 text-[10px] text-pink-300 transition active:scale-95"
            >
              <Heart size={10} className="fill-pink-500 text-pink-500" />
              <span>
                Lv.{intimacyInfo.level} {intimacyInfo.title}
              </span>
              <span className="text-white/40">·</span>
              <span className="font-mono text-pink-200">{intimacyInfo.points} pts</span>
            </button>
          </div>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-1 text-white/60">
          <button
            onClick={() => setShowPortraitModal(true)}
            className="p-2 rounded-full hover:bg-white/5 hover:text-purple-300 transition"
            title="查看角色大图立绘"
          >
            <ImageIcon size={17} />
          </button>
          <button
            onClick={() => setShowIntimacyModal(true)}
            className="p-2 rounded-full hover:bg-white/5 hover:text-pink-300 transition relative"
            title="羁绊好感度档案"
          >
            <Heart size={17} className="text-pink-400" />
            {floatingBonus && floatingBonus.added > 0 && (
              <span className="absolute -top-1 -right-2 text-[10px] font-black text-pink-400 animate-bounce bg-pink-500/20 px-1 rounded-full border border-pink-500/40">
                +{floatingBonus.added}
              </span>
            )}
          </button>
          <button
            onClick={onClearHistory}
            className="p-2 rounded-full hover:bg-white/5 hover:text-red-400 transition"
            title="清空聊天记录"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Intimacy Top Mini-Progress Bar */}
      <div
        onClick={() => setShowIntimacyModal(true)}
        className="h-1 w-full bg-white/5 cursor-pointer hover:h-2 transition-all relative overflow-hidden"
        title="点击查看羁绊等级"
      >
        <div
          className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-400 transition-all duration-300"
          style={{ width: `${intimacyPercent}%` }}
        />
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* If no message, show Persona Card & Topics */}
        {messages.length === 0 && (
          <div className="text-center py-6 px-3 bg-white/[0.02] border border-white/5 rounded-2xl my-2">
            <div
              onClick={() => setShowPortraitModal(true)}
              className="inline-block cursor-pointer transform hover:scale-105 transition mb-3"
              title="点击查看角色全身立绘"
            >
              <RoleAvatar
                name={role.name}
                avatarUrl={role.avatarUrl}
                emoji={role.emoji}
                coverClass={role.cover}
                size="2xl"
              />
            </div>
            <h3 className="text-base font-bold text-white">{role.name}</h3>
            <p className="text-xs text-white/50 max-w-xs mx-auto mt-1 leading-relaxed font-light">{role.desc}</p>

            <div className="mt-5 text-left">
              <div className="text-xs text-purple-300/80 font-medium flex items-center gap-1 mb-2">
                <Sparkles size={13} />
                <span>试试点击以下破冰开场白：</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {role.topics.map((t, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onSendMessage(t);
                    }}
                    className="text-left text-xs bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-200 px-3 py-1.5 rounded-xl transition active:scale-95"
                  >
                    “{t}”
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Message Stream with Long Press / Right Click */}
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isSpeaking = speakingMsgId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'} group relative animate-in fade-in slide-in-from-bottom-2 duration-200`}
            >
              {/* Avatar */}
              {isUser ? (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xs shrink-0 select-none shadow-sm">
                  😊
                </div>
              ) : (
                <div onClick={() => setShowPortraitModal(true)} className="cursor-pointer">
                  <RoleAvatar
                    name={role.name}
                    avatarUrl={role.avatarUrl}
                    emoji={role.emoji}
                    coverClass={role.cover}
                    size="sm"
                  />
                </div>
              )}

              {/* Message Bubble */}
              <div className={`max-w-[76%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  onTouchStart={(e) => handleTouchStart(msg, e)}
                  onTouchEnd={handleTouchEnd}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setActiveMenuMsg({ msg, x: e.clientX, y: e.clientY });
                  }}
                  className={`px-3.5 py-2.5 rounded-2xl text-[14px] leading-relaxed break-words shadow-sm relative transition active:scale-[0.99] cursor-pointer select-text ${
                    isUser
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-xs font-normal'
                      : 'bg-white/10 text-white/95 rounded-bl-xs border border-white/5'
                  } ${isSpeaking ? 'ring-2 ring-purple-400' : ''}`}
                >
                  {msg.text}

                  {/* Playing voice animation badge */}
                  {isSpeaking && (
                    <div className="inline-flex items-center gap-1 ml-2 text-purple-300 font-bold text-xs">
                      <Volume2 size={13} className="animate-pulse" />
                      <span className="text-[10px]">朗读中...</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-white/30 px-1 mt-1 font-mono">
                  <span>{msg.time}</span>
                  {/* Desktop action menu trigger */}
                  <button
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setActiveMenuMsg({ msg, x: rect.left, y: rect.top });
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:text-white transition p-0.5 rounded"
                    title="操作菜单"
                  >
                    <MoreVertical size={11} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-end gap-2.5 animate-fade-in">
            <RoleAvatar
              name={role.name}
              avatarUrl={role.avatarUrl}
              emoji={role.emoji}
              coverClass={role.cover}
              size="sm"
            />
            <div className="bg-white/10 border border-white/5 px-4 py-3 rounded-2xl rounded-bl-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-dot-1"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-dot-2"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-dot-3"></span>
              <span className="text-xs text-white/40 ml-1">正在思考回复...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating Intimacy Toast */}
      {floatingBonus && (
        <div className="absolute top-16 right-4 z-30 animate-bounce pointer-events-none">
          <div
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xl flex items-center gap-1.5 border backdrop-blur-md ${
              floatingBonus.added > 0
                ? 'bg-gradient-to-r from-pink-500/95 to-purple-600/95 text-white border-white/20 shadow-pink-500/30'
                : 'bg-[#141420]/95 text-amber-300 border-amber-500/40 shadow-amber-500/10'
            }`}
          >
            {floatingBonus.added > 0 ? (
              <>
                <Heart size={13} className="fill-pink-200 text-pink-200" />
                <span>羁绊 +{floatingBonus.added}</span>
                <span className="text-[10px] text-pink-200/80 font-normal">
                  (今日 {floatingBonus.gainedToday}/50)
                </span>
              </>
            ) : (
              <>
                <span className="text-amber-400 text-sm">🌙</span>
                <span>今日聊天亲密已达上限 (50/50)</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Quick Suggestion Chips */}
      {messages.length > 0 && (
        <div className="px-4 py-1 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => handleSendText('你现在在忙什么呢？')}
            className="shrink-0 px-2.5 py-1 rounded-full bg-white/5 text-[11px] text-white/60 hover:text-white hover:bg-white/10 border border-white/5 transition"
          >
            你现在在忙什么？
          </button>
          <button
            onClick={() => handleSendText('今天遇到开心的事了！')}
            className="shrink-0 px-2.5 py-1 rounded-full bg-white/5 text-[11px] text-white/60 hover:text-white hover:bg-white/10 border border-white/5 transition"
          >
            遇到开心的事了
          </button>
          <button
            onClick={() => handleSendText('可以为我唱首歌或者讲个故事吗？')}
            className="shrink-0 px-2.5 py-1 rounded-full bg-white/5 text-[11px] text-white/60 hover:text-white hover:bg-white/10 border border-white/5 transition"
          >
            讲个故事吧
          </button>
        </div>
      )}

      {/* Bottom Input Area */}
      <div className="p-3 pb-6 bg-[#0c0c14]/95 backdrop-blur-xl border-t border-white/5 flex items-center gap-2 z-20 shrink-0">
        <input
          id="chat-message-input"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`对 ${role.name} 说点什么...`}
          className="flex-1 bg-white/8 hover:bg-white/10 focus:bg-white/12 border border-white/10 focus:border-purple-500/60 rounded-full px-4 py-2.5 text-sm text-white placeholder-white/35 outline-none transition"
        />

        <button
          id="btn-chat-send"
          onClick={handleSend}
          disabled={!inputText.trim() || isTyping}
          className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-purple-500/30 active:scale-95 transition"
          aria-label="发送"
        >
          <Send size={16} className="-ml-0.5" />
        </button>
      </div>

      {/* Message Long-Press Context Menu Overlay */}
      {activeMenuMsg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setActiveMenuMsg(null)}
        >
          <div
            className="w-64 bg-[#141420] border border-white/15 rounded-2xl p-2 shadow-2xl text-white space-y-1 animate-in zoom-in-95 duration-150 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-3 py-1.5 border-b border-white/10 text-[11px] text-white/40 flex items-center justify-between">
              <span>消息操作 ({activeMenuMsg.msg.sender === 'user' ? '我的发言' : role.name})</span>
              <button
                onClick={() => setActiveMenuMsg(null)}
                className="text-white/40 hover:text-white"
              >
                <X size={12} />
              </button>
            </div>

            {/* 1. Copy Text */}
            <button
              onClick={() => handleCopy(activeMenuMsg.msg.text)}
              className="w-full px-3 py-2 rounded-xl text-xs font-medium text-left flex items-center gap-2.5 hover:bg-white/10 transition"
            >
              <Copy size={14} className="text-purple-300" />
              <span>复制文本内容</span>
            </button>

            {/* 2. TTS Voice Speak */}
            <button
              onClick={() => {
                handleTTS(activeMenuMsg.msg);
                setActiveMenuMsg(null);
              }}
              className="w-full px-3 py-2 rounded-xl text-xs font-medium text-left flex items-center gap-2.5 hover:bg-white/10 transition"
            >
              {speakingMsgId === activeMenuMsg.msg.id ? (
                <>
                  <VolumeX size={14} className="text-amber-400" />
                  <span className="text-amber-300">停止语音朗读</span>
                </>
              ) : (
                <>
                  <Volume2 size={14} className="text-emerald-400" />
                  <span>拟真语音朗读</span>
                </>
              )}
            </button>

            {/* 3. Regenerate (for AI/role messages) */}
            {activeMenuMsg.msg.sender === 'role' && (
              <button
                onClick={() => handleRegenerate(activeMenuMsg.msg.id)}
                className="w-full px-3 py-2 rounded-xl text-xs font-medium text-left flex items-center gap-2.5 hover:bg-white/10 transition text-purple-200"
              >
                <RotateCcw size={14} className="text-indigo-400" />
                <span>重新生成该条回答</span>
              </button>
            )}

            {/* 4. Delete message */}
            <button
              onClick={() => handleDelete(activeMenuMsg.msg.id)}
              className="w-full px-3 py-2 rounded-xl text-xs font-medium text-left flex items-center gap-2.5 hover:bg-red-500/20 text-red-400 transition"
            >
              <Trash2 size={14} />
              <span>删除该条消息</span>
            </button>
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

      {/* Full Portrait / 立绘 Preview Modal */}
      {showPortraitModal && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowPortraitModal(false)}
        >
          <div
            className="w-full max-w-sm max-h-[85vh] bg-[#12121c] rounded-3xl overflow-hidden border border-white/10 relative shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setShowPortraitModal(false)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 text-white/80 hover:text-white flex items-center justify-center"
            >
              <X size={16} />
            </button>

            {/* Image banner */}
            <div className="relative flex-1 min-h-[380px] bg-cover bg-top overflow-hidden">
              <img
                src={role.portraitUrl || role.avatarUrl}
                alt={role.name}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // fallback
                  (e.currentTarget as HTMLImageElement).src = '/avatars/lujingchen.jpg';
                }}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12121c] via-transparent to-black/20" />
            </div>

            {/* Bottom character detail */}
            <div className="p-4 bg-[#12121c] border-t border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>{role.name}</span>
                    <span className="text-xs text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-md font-medium">
                      {role.title}
                    </span>
                  </h3>
                  <p className="text-xs text-white/50 mt-1 line-clamp-2">{role.desc}</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-white/60">
                <span className="flex items-center gap-1 text-pink-400">
                  <Heart size={12} className="fill-pink-400" />
                  <span>当前羁绊: Lv.{intimacyInfo.level} {intimacyInfo.title}</span>
                </span>
                <button
                  onClick={() => {
                    setShowPortraitModal(false);
                    onShowToast(`已为【${role.name}】点赞并保存形象`);
                  }}
                  className="px-3 py-1 rounded-full bg-purple-600/30 text-purple-200 border border-purple-500/40 text-xs hover:bg-purple-600/50"
                >
                  设为专属壁纸
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role AI Toolkit Drawer Sheet */}
      {showToolkitSheet && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end animate-in fade-in duration-200"
          onClick={() => setShowToolkitSheet(false)}
        >
          <div
            className="w-full bg-[#121020] border-t border-purple-500/30 rounded-t-3xl p-5 max-h-[75vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-250"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm">
                  <Zap size={16} />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                    <span>【{role.name}】10 大专属 AI 智囊</span>
                  </h3>
                  <p className="text-[11px] text-white/50">角色人设口吻 · 点击指令即刻与角色协同</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isUnlocked ? (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 size={11} />
                    <span>已解锁</span>
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setShowToolkitSheet(false);
                      setShowUnlockModal(true);
                    }}
                    className="px-2.5 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[10px] font-extrabold flex items-center gap-1 shadow-md shadow-purple-500/30"
                  >
                    <Lock size={10} />
                    <span>充值解锁</span>
                  </button>
                )}
                <button
                  onClick={() => setShowToolkitSheet(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Tools List */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2 no-scrollbar">
              {ROLE_AI_TOOLS.map((tool) => {
                const isAccessible = isUnlocked || tool.isFree;
                return (
                  <button
                    key={tool.id}
                    onClick={() => handleUseTool(tool)}
                    className={`w-full p-3 rounded-2xl border text-left transition flex items-center justify-between gap-3 active:scale-[0.99] ${
                      isAccessible
                        ? 'bg-white/[0.04] hover:bg-white/10 border-white/10 text-white'
                        : 'bg-white/[0.02] hover:bg-white/5 border-white/5 text-white/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isAccessible ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-white/5 text-white/40'
                      }`}>
                        {tool.id === 'ppt' && <Presentation size={18} />}
                        {tool.id === 'analysis' && <BarChart3 size={18} />}
                        {tool.id === 'alarm' && <AlarmClock size={18} />}
                        {tool.id === 'image' && <ImageIconLucide size={18} />}
                        {tool.id === 'copywrite' && <BookOpen size={18} />}
                        {tool.id === 'story' && <Headphones size={18} />}
                        {tool.id === 'decision' && <Scale size={18} />}
                        {tool.id === 'milestone' && <Award size={18} />}
                        {tool.id === 'study' && <GraduationCap size={18} />}
                        {tool.id === 'stream' && <History size={18} />}
                      </div>

                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{tool.title}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-purple-200/80 font-normal">
                            {tool.shortName}
                          </span>
                          {tool.isFree && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                              免费
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-white/45 truncate mt-0.5">{tool.desc}</div>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isAccessible ? (
                        <span className="px-2.5 py-1 rounded-xl bg-purple-500/20 text-purple-200 text-xs font-semibold hover:bg-purple-500/30 border border-purple-500/30">
                          调用秘籍
                        </span>
                      ) : (
                        <div className="flex items-center gap-1 text-pink-400 text-xs font-semibold">
                          <Lock size={12} />
                          <span>未解锁</span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Unlock Confirmation Modal */}
      {showUnlockModal && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 select-none"
          onClick={() => setShowUnlockModal(false)}
        >
          <div
            className="w-full max-w-sm bg-[#121020] border border-pink-500/30 rounded-3xl p-5 shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowUnlockModal(false)}
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
                  <span>与【{role.name}】聊天时随时快速调用</span>
                </div>
              </div>

              <button
                onClick={handleUnlockToolkit}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:opacity-95 text-white text-sm font-extrabold shadow-lg shadow-purple-500/30 active:scale-95 transition flex items-center justify-center gap-2"
              >
                <Zap size={16} className="fill-white" />
                <span>⚡ 充值 ¥10 / 钻石一键解锁特权</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
