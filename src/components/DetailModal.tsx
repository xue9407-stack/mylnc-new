import React, { useState, useEffect } from 'react';
import { Role } from '../types';
import { X, Share2, MoreHorizontal, Heart, MessageCircle, Star, Sparkles, Maximize2, ShieldCheck } from 'lucide-react';
import { getIntimacyData, getIntimacyPercent } from '../utils/intimacy';
import { IntimacyModal } from './IntimacyModal';
import { ROLE_MEDIA_MAP } from '../data/rolePortraits';

interface DetailModalProps {
  role: Role | null;
  isOpen: boolean;
  isFollowed: boolean;
  onClose: () => void;
  onToggleFollow: () => void;
  onStartChat: (role: Role) => void;
  onShowToast: (msg: string) => void;
  intimacyPoints?: number;
  onUpdateIntimacy?: (added: number) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  role,
  isOpen,
  isFollowed,
  onClose,
  onToggleFollow,
  onStartChat,
  onShowToast,
  intimacyPoints = 0,
  onUpdateIntimacy,
}) => {
  const [showFullPortrait, setShowFullPortrait] = useState(false);
  const [showIntimacyModal, setShowIntimacyModal] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [role?.id]);

  if (!isOpen || !role) return null;

  const intimacyInfo = getIntimacyData(intimacyPoints);
  const intimacyPercent = getIntimacyPercent(intimacyPoints);
  const portraitSrc = ROLE_MEDIA_MAP[role.id]?.portraitUrl || role.portraitUrl || role.avatarUrl;

  return (
    <div
      id="role-detail-modal"
      className="absolute inset-0 z-50 bg-[#0a0a0f] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200 select-none"
    >
      {/* Top Cover with Character Portrait / Illustration */}
      <div className={`relative h-80 w-full overflow-hidden flex items-center justify-center ${role.cover}`}>
        {/* Full Image Artwork */}
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

        {/* Gradient shadow overlay */}
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

      {/* Main Content Body */}
      <div className="flex-1 bg-[#0a0a0f] rounded-t-3xl -mt-6 px-6 pt-5 pb-28 overflow-y-auto relative z-10 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white tracking-wide">{role.name}</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                {role.title}
              </span>
            </div>
            <p className="text-xs text-white/50 font-medium mt-1 flex items-center gap-1">
              <ShieldCheck size={12} className="text-emerald-400" />
              <span>{role.is_official ? '网巢官方定制角色' : '创作者认证角色'}</span>
            </p>
          </div>

          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 text-xs font-semibold">
            <Star size={13} className="fill-yellow-400" />
            <span>{role.rating || 4.9}</span>
          </div>
        </div>

        {/* Intimacy / Affection Relationship Card */}
        <div
          onClick={() => setShowIntimacyModal(true)}
          className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/25 via-pink-950/20 to-purple-900/20 border border-purple-500/30 cursor-pointer hover:border-purple-500/50 transition group"
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
        <div className="grid grid-cols-3 divide-x divide-white/10 bg-white/[0.03] border border-white/5 rounded-2xl py-3.5 my-4">
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

        {/* Description Bio */}
        <div className="my-3">
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">角色人设自白</h3>
          <p className="text-sm text-white/80 leading-relaxed bg-white/[0.03] p-3.5 rounded-2xl border border-white/5 font-light">
            {role.desc}
          </p>
        </div>

        {/* Tags */}
        <div className="my-3">
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

        {/* Opening Starter Prompts */}
        <div className="my-4">
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Sparkles size={13} className="text-purple-400" />
            <span>专属开场话题</span>
          </h3>
          <div className="space-y-2">
            {role.topics.map((topic, i) => (
              <div
                key={i}
                onClick={() => onStartChat(role)}
                className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-purple-200 text-xs leading-normal hover:bg-purple-900/30 transition cursor-pointer flex items-center justify-between group active:scale-[0.99]"
              >
                <span>“{topic}”</span>
                <span className="text-purple-400 text-xs group-hover:translate-x-0.5 transition">聊这个 ›</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/10 flex gap-3 z-20">
        <button
          id="btn-toggle-follow"
          onClick={onToggleFollow}
          className={`flex-1 py-3.5 px-4 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 border transition active:scale-95 ${
            isFollowed
              ? 'bg-white/15 border-white/20 text-white'
              : 'bg-white/5 border-white/10 text-white/90 hover:bg-white/10'
          }`}
        >
          <Heart size={16} className={isFollowed ? 'fill-pink-500 text-pink-500' : ''} />
          <span>{isFollowed ? '已关注' : '+ 关注'}</span>
        </button>

        <button
          id="btn-start-chat-modal"
          onClick={() => onStartChat(role)}
          className="flex-[2] py-3.5 px-5 rounded-2xl text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 active:scale-95 hover:opacity-95 transition"
        >
          <MessageCircle size={16} />
          <span>开始聊天</span>
        </button>
      </div>

      {/* Full Portrait / 全身立绘 Modal */}
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
    </div>
  );
};
