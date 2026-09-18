import React, { useState, useRef, useEffect } from 'react';
import { GroupChat, GroupMessage, Role } from '../types';
import {
  ChevronLeft,
  Send,
  Sparkles,
  Users,
  Trash2,
  AtSign,
  Zap,
  MoreVertical,
  X,
  Plus,
} from 'lucide-react';
import { RoleAvatar } from './RoleAvatar';
import { ROLE_MEDIA_MAP } from '../data/rolePortraits';

interface GroupChatViewProps {
  group: GroupChat;
  roles: Role[];
  messages: GroupMessage[];
  onBack: () => void;
  onSendMessage: (groupId: string, text: string, targetRoleId?: string) => Promise<void>;
  onTriggerAiCollision: (groupId: string) => Promise<void>;
  onClearHistory: (groupId: string) => void;
  onShowToast: (msg: string) => void;
  onAddMember?: (groupId: string, roleId: string) => void;
}

export const GroupChatView: React.FC<GroupChatViewProps> = ({
  group,
  roles,
  messages,
  onBack,
  onSendMessage,
  onTriggerAiCollision,
  onClearHistory,
  onShowToast,
}) => {
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [typingRoleName, setTypingRoleName] = useState<string | null>(null);
  const [showGroupMenu, setShowGroupMenu] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Group members list
  const memberRoles = roles.filter((r) => group.memberRoleIds.includes(r.id));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingRoleName]);

  const handleSend = async () => {
    if (!inputText.trim() || isSending) return;
    const textToSend = inputText.trim();
    setInputText('');
    setIsSending(true);

    // check if user tagged a specific role
    let targetRoleId: string | undefined;
    for (const member of memberRoles) {
      if (textToSend.includes(`@${member.name}`)) {
        targetRoleId = member.id;
        break;
      }
    }

    setTypingRoleName(
      targetRoleId
        ? memberRoles.find((m) => m.id === targetRoleId)?.name || memberRoles[0]?.name
        : memberRoles[0]?.name || '角色'
    );

    try {
      await onSendMessage(group.id, textToSend, targetRoleId);
    } catch {
      // ignore
    } finally {
      setIsSending(false);
      setTypingRoleName(null);
    }
  };

  const handleAiCollision = async () => {
    if (isSending) return;
    setIsSending(true);
    const randomMember = memberRoles[Math.floor(Math.random() * memberRoles.length)];
    setTypingRoleName(randomMember?.name || '角色');

    try {
      await onTriggerAiCollision(group.id);
    } catch {
      // ignore
    } finally {
      setIsSending(false);
      setTypingRoleName(null);
    }
  };

  const insertAtTag = (roleName: string) => {
    setInputText((prev) => (prev.includes(`@${roleName}`) ? prev : `@${roleName} ${prev}`));
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] relative overflow-hidden">
      {/* Top Header */}
      <div className="px-4 py-3 bg-[#13111e]/90 backdrop-blur-md border-b border-white/10 shrink-0 flex items-center justify-between z-20">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <button
            type="button"
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/80 hover:text-white transition cursor-pointer shrink-0"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Group Info & Stacked Avatars */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-extrabold text-white truncate">{group.name}</h1>
              <span className="px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30 shrink-0">
                {memberRoles.length}人派对
              </span>
            </div>
            {group.topic ? (
              <p className="text-[10px] text-purple-200/60 truncate mt-0.5">{group.topic}</p>
            ) : (
              <p className="text-[10px] text-white/40 truncate mt-0.5">
                成员：{memberRoles.map((r) => r.name).join('、')}
              </p>
            )}
          </div>
        </div>

        {/* Member Avatar Stack */}
        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          <div className="flex -space-x-2 overflow-hidden py-0.5">
            {memberRoles.slice(0, 4).map((m) => (
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

          <button
            type="button"
            onClick={() => setShowGroupMenu(!showGroupMenu)}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition cursor-pointer"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      {/* Group Menu Dropdown */}
      {showGroupMenu && (
        <div className="absolute top-14 right-4 z-40 w-56 bg-[#171526] border border-purple-500/30 rounded-2xl p-3 shadow-2xl space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs font-bold text-white">
            <span>群成员 ({memberRoles.length})</span>
            <button
              onClick={() => setShowGroupMenu(false)}
              className="text-white/40 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {memberRoles.map((m) => (
              <div key={m.id} className="flex items-center justify-between text-xs text-white/80 py-1">
                <div className="flex items-center gap-2 truncate">
                  <RoleAvatar
                    name={m.name}
                    avatarUrl={ROLE_MEDIA_MAP[m.id]?.avatarUrl || m.avatarUrl}
                    emoji={m.emoji}
                    coverClass={m.cover}
                    size="xs"
                  />
                  <span className="font-medium text-white truncate">{m.name}</span>
                </div>
                <span className="text-[10px] text-purple-300/60 truncate">{m.title}</span>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-white/10 space-y-1.5">
            <button
              type="button"
              onClick={() => {
                setShowGroupMenu(false);
                onClearHistory(group.id);
                onShowToast('群聊记录已清空');
              }}
              className="w-full py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Trash2 size={13} />
              <span>清空群聊记录</span>
            </button>
          </div>
        </div>
      )}

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
        {messages.length === 0 ? (
          <div className="text-center py-12 space-y-3 text-white/40">
            <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-300">
              <Users size={32} />
            </div>
            <div className="text-sm font-bold text-white/80">欢迎来到【{group.name}】</div>
            <p className="text-xs text-white/50 max-w-xs mx-auto">
              群内聚集了 {memberRoles.map((m) => m.name).join('、')}。在下方输入框发言或点击“触发多角互动”，看看他们会擦出怎样的火花吧！
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const role = roles.find((r) => r.id === msg.roleId);

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {!isUser && (
                  <div className="shrink-0 mt-0.5">
                    <RoleAvatar
                      name={msg.roleName || role?.name || 'AI'}
                      avatarUrl={
                        msg.avatarUrl ||
                        (msg.roleId ? ROLE_MEDIA_MAP[msg.roleId]?.avatarUrl || role?.avatarUrl : undefined)
                      }
                      emoji={role?.emoji || '✨'}
                      coverClass={role?.cover || 'from-purple-500 to-pink-500'}
                      size="md"
                    />
                  </div>
                )}

                <div className={`max-w-[80%] space-y-1 ${isUser ? 'text-right' : 'text-left'}`}>
                  {!isUser && (
                    <div className="flex items-center gap-1.5 text-[11px] text-white/60">
                      <span className="font-bold text-purple-300">{msg.roleName || role?.name || 'AI'}</span>
                      {role?.title && (
                        <span className="text-[9px] text-pink-300/80 bg-pink-500/10 px-1 py-0.2 rounded">
                          {role.title}
                        </span>
                      )}
                      <span className="text-[10px] text-white/30 font-mono ml-auto">{msg.time}</span>
                    </div>
                  )}

                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed break-words shadow-md ${
                      isUser
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-tr-xs'
                        : 'bg-[#181528] border border-purple-500/20 text-white/90 rounded-tl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {isUser && (
                    <div className="text-[10px] text-white/30 font-mono text-right">{msg.time}</div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Typing Indicator */}
        {typingRoleName && (
          <div className="flex items-center gap-2 text-xs text-purple-300/80 bg-purple-950/40 border border-purple-500/30 px-3 py-1.5 rounded-full w-fit animate-pulse">
            <Sparkles size={13} className="animate-spin text-pink-400" />
            <span>【{typingRoleName}】正在群里回复中...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Dock & Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#12101f]/95 backdrop-blur-md border-t border-white/10 p-3 space-y-2.5 z-20">
        {/* Quick @Role & Collision Actions */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            type="button"
            onClick={handleAiCollision}
            disabled={isSending}
            className="px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-500/25 to-pink-500/25 border border-purple-500/40 text-purple-300 text-[11px] font-extrabold flex items-center gap-1 shrink-0 hover:scale-105 active:scale-95 transition cursor-pointer disabled:opacity-50"
          >
            <Zap size={12} className="text-pink-400 fill-pink-400" />
            <span>⚡ 触发 AI 碰撞聊</span>
          </button>

          <span className="text-white/20 text-[10px] shrink-0">|</span>

          {memberRoles.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => insertAtTag(r.name)}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-400/40 text-white/70 hover:text-purple-200 text-[11px] font-bold flex items-center gap-1 shrink-0 transition active:scale-95 cursor-pointer"
            >
              <AtSign size={11} className="text-purple-400" />
              <span>{r.name}</span>
            </button>
          ))}
        </div>

        {/* Input Text Box */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={`发消息给群里 ${memberRoles.length} 位角色...`}
            className="flex-1 bg-black/60 border border-purple-500/30 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-white/35 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/40 transition"
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={!inputText.trim() || isSending}
            className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/25 disabled:opacity-40 hover:scale-105 active:scale-95 transition cursor-pointer shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
