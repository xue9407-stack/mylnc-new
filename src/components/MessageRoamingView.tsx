import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, Check, Sparkles } from 'lucide-react';

interface MessageRoamingViewProps {
  roamingDays: number; // 60, 120, 180
  vipTier: 'default' | 'silver' | 'platinum';
  onBack: () => void;
  onUpgradeVip: (tier: 'silver' | 'platinum') => void;
  onShowToast: (msg: string) => void;
}

export const MessageRoamingView: React.FC<MessageRoamingViewProps> = ({
  roamingDays,
  vipTier,
  onBack,
  onUpgradeVip,
  onShowToast,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleManualSync = () => {
    setIsSyncing(true);
    onShowToast(`✨ 正在与云端消息服务器通信，拉取近 ${roamingDays} 天历史聊天记录...`);
    setTimeout(() => {
      setIsSyncing(false);
      onShowToast(`🎉 成功同步近 ${roamingDays} 天云端消息记录！对话进度已完全修复。`);
    }, 1200);
  };

  return (
    <div className="h-full flex flex-col bg-[#0b0b12] text-white select-none">
      {/* Top Header */}
      <div className="px-4 py-3.5 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#0d0d16]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition active:scale-95 cursor-pointer"
            aria-label="返回"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-base font-bold text-white">消息漫游</h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-28">
        {/* Card 1: 默认 漫游时长 (60天) */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 relative overflow-hidden space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white/70">默认 漫游时长</span>
            {roamingDays === 60 ? (
              <span className="text-amber-400 text-xs font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                生效中
              </span>
            ) : (
              <span className="text-white/40 text-xs font-medium">包含基础权益</span>
            )}
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-white tracking-tight">60</span>
            <span className="text-sm font-semibold text-white/60">天</span>
          </div>
        </div>

        {/* Card 2: 星月卡 漫游时长 (120天) */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-900/30 via-[#181329] to-[#120e20] border border-purple-500/30 relative overflow-hidden space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-200">星月卡 漫游时长</span>
            {roamingDays === 120 ? (
              <span className="text-emerald-400 text-xs font-bold bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <Check size={12} />
                <span>生效中</span>
              </span>
            ) : (
              <button
                onClick={() => onUpgradeVip('silver')}
                className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-300 to-purple-200 hover:from-purple-200 hover:to-white text-slate-950 font-bold text-xs shadow-md shadow-purple-500/20 active:scale-95 transition cursor-pointer"
              >
                立即开通
              </button>
            )}
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-white tracking-tight">120</span>
            <span className="text-sm font-semibold text-purple-200/70">天</span>
          </div>
        </div>

        {/* Card 3: 星辰卡 漫游时长 (180天) */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-900/30 via-[#211225] to-[#160d1c] border border-pink-500/30 relative overflow-hidden space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-pink-200">星辰卡 漫游时长</span>
            {roamingDays === 180 ? (
              <span className="text-emerald-400 text-xs font-bold bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <Check size={12} />
                <span>生效中</span>
              </span>
            ) : (
              <button
                onClick={() => onUpgradeVip('platinum')}
                className="px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-300 to-pink-200 hover:from-pink-200 hover:to-white text-slate-950 font-bold text-xs shadow-md shadow-pink-500/20 active:scale-95 transition cursor-pointer"
              >
                立即开通
              </button>
            )}
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-white tracking-tight">180</span>
            <span className="text-sm font-semibold text-pink-200/70">天</span>
          </div>
        </div>

        {/* Description Paragraph */}
        <div className="pt-2 px-1">
          <p className="text-xs text-white/45 leading-relaxed tracking-wide text-justify">
            消息漫游是指用户可手动回溯过去一段时间内的聊天记录，当用户不小心删除app或使用其他设备登录时，也能够通过消息漫游的方式同步历史聊天记录。开通会员后，从当日开始记录更多聊天记录，当会员状态失效后，仅保留默认状态可记录的天数。
          </p>
        </div>
      </div>

      {/* Bottom Manual Sync Action */}
      <div className="p-4 border-t border-white/5 bg-[#0d0d16] shrink-0">
        <button
          onClick={handleManualSync}
          disabled={isSyncing}
          className="w-full py-3 text-xs font-medium text-white/70 hover:text-white flex items-center justify-center gap-2 cursor-pointer transition active:scale-98"
        >
          <RefreshCw size={14} className={isSyncing ? 'animate-spin text-purple-400' : ''} />
          <span>{isSyncing ? '正在回溯同步中...' : '手动同步所有记录'}</span>
        </button>
      </div>
    </div>
  );
};
