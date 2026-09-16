import React, { useState, useEffect } from 'react';
import { Role } from '../types';
import {
  getIntimacyData,
  getIntimacyPercent,
  INTIMACY_LEVELS,
  hasGreetedToday,
  recordDailyGreeting,
  getDailyChatIntimacy,
} from '../utils/intimacy';
import { RoleAvatar } from './RoleAvatar';
import { X, Heart, Sparkles, Check, Lock, Gift, Clock } from 'lucide-react';

interface IntimacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
  points: number;
  onShowToast: (msg: string) => void;
  onAddBonus?: () => void;
}

export const IntimacyModal: React.FC<IntimacyModalProps> = ({
  isOpen,
  onClose,
  role,
  points,
  onShowToast,
  onAddBonus,
}) => {
  if (!isOpen || !role) return null;

  const currentData = getIntimacyData(points);
  const percent = getIntimacyPercent(points);
  const dailyChat = role ? getDailyChatIntimacy(role.id) : { gained: 0, max: 50, remaining: 50, isCapReached: false };

  const [isGreetedToday, setIsGreetedToday] = useState<boolean>(() =>
    role ? hasGreetedToday(role.id) : false
  );

  useEffect(() => {
    if (role) {
      setIsGreetedToday(hasGreetedToday(role.id));
    }
  }, [role?.id, isOpen]);

  const handleDailyGreetingClick = () => {
    if (isGreetedToday) {
      onShowToast(`今日专属问候已完成，请明天再来吧~ 🌙`);
      return;
    }

    recordDailyGreeting(role.id);
    setIsGreetedToday(true);
    if (onAddBonus) {
      onAddBonus();
    }
    onShowToast(`💖 今日与【${role.name}】的专属问候增加了 +10 亲密值！`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#10101a] border border-purple-500/30 rounded-3xl p-5 shadow-2xl relative max-h-[90vh] overflow-y-auto text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition"
        >
          <X size={16} />
        </button>

        {/* Header with Character */}
        <div className="text-center pt-2 pb-4 border-b border-white/10">
          <div className="relative inline-block mb-3">
            <RoleAvatar
              name={role.name}
              avatarUrl={role.avatarUrl}
              emoji={role.emoji}
              coverClass={role.cover}
              size="2xl"
            />
            <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-[10px] font-black shadow-md border border-white/20">
              Lv.{currentData.level}
            </span>
          </div>

          <h3 className="text-base font-bold text-white flex items-center justify-center gap-1.5">
            <span>与【{role.name}】的羁绊</span>
            <Heart size={15} className="fill-pink-500 text-pink-500" />
          </h3>
          <p className="text-xs text-purple-300/80 mt-0.5">
            当前关系：<span className="font-bold text-pink-300">{currentData.title}</span> ({currentData.icon})
          </p>

          {/* Intimacy Bar */}
          <div className="mt-3 px-3">
            <div className="flex justify-between text-[11px] text-white/50 mb-1">
              <span>当前亲密值 {currentData.points}</span>
              <span>{currentData.level >= 5 ? 'MAX' : `目标 ${currentData.nextReq}`}</span>
            </div>
            <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-400 transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="text-[10px] text-white/40 mt-1.5 text-center">
              {currentData.level >= 5
                ? '✨ 已达到最高羁绊等级，灵魂相伴无止境'
                : `再积攒 ${Math.max(0, currentData.nextReq - currentData.points)} 亲密值即可晋升为「${INTIMACY_LEVELS[currentData.level]?.title || '下一等级'}」`}
            </p>
          </div>
        </div>

        {/* Daily Chat Interaction Limit Card */}
        <div className="mt-4 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-300 flex items-center justify-center text-sm">
                💬
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>每日聊天互动亲密值</span>
                  <span className="text-[10px] text-pink-400/90 font-medium bg-pink-500/10 px-1.5 py-0.2 rounded">
                    每次 +5~10
                  </span>
                </div>
                <div className="text-[10px] text-white/50">
                  与角色发送消息互动自动提升羁绊
                </div>
              </div>
            </div>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                dailyChat.isCapReached
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-white/10 text-pink-300'
              }`}
            >
              {dailyChat.isCapReached ? '今日已封顶 50/50' : `${dailyChat.gained} / ${dailyChat.max}`}
            </span>
          </div>

          {/* Mini progress bar */}
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                dailyChat.isCapReached
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                  : 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-400'
              }`}
              style={{ width: `${Math.min(100, (dailyChat.gained / dailyChat.max) * 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-white/40 pt-0.5">
            <span>规则：单日最多提升 {dailyChat.max} 点 (次日零点重置)</span>
            <span className={dailyChat.isCapReached ? 'text-amber-400/80 font-medium' : 'text-pink-300/80'}>
              {dailyChat.isCapReached ? '明日继续升温' : `今日还可+${dailyChat.remaining}点`}
            </span>
          </div>
        </div>

        {/* Daily Bonus Interaction */}
        {onAddBonus && (
          <div
            className={`mt-4 p-3 rounded-2xl border flex items-center justify-between transition ${
              isGreetedToday
                ? 'bg-white/[0.03] border-white/10'
                : 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isGreetedToday ? 'bg-white/10 text-white/50' : 'bg-pink-500/20 text-pink-300'
                }`}
              >
                {isGreetedToday ? <Check size={16} /> : <Gift size={16} />}
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>专属问候互动</span>
                  {isGreetedToday && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-white/50 font-normal">
                      今日已完成
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-white/60">
                  {isGreetedToday
                    ? '今日心意已送达 · 请明天再来'
                    : '每日轻抚TA，增进亲密与好感'}
                </div>
              </div>
            </div>
            <button
              onClick={handleDailyGreetingClick}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1 ${
                isGreetedToday
                  ? 'bg-white/10 hover:bg-white/15 text-white/70 border border-white/10 active:scale-95'
                  : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90 active:scale-95'
              }`}
            >
              {isGreetedToday ? (
                <>
                  <Clock size={12} className="text-white/60" />
                  <span>请明天再来</span>
                </>
              ) : (
                <span>互动 +10</span>
              )}
            </button>
          </div>
        )}

        {/* Level Perks Ladder */}
        <div className="mt-4">
          <div className="text-xs font-bold text-white/70 mb-2 flex items-center gap-1.5">
            <Sparkles size={13} className="text-amber-400" />
            <span>羁绊等级与解锁特权</span>
          </div>

          <div className="space-y-2">
            {INTIMACY_LEVELS.map((tier) => {
              const isUnlocked = currentData.level >= tier.level;
              const isCurrent = currentData.level === tier.level;

              return (
                <div
                  key={tier.level}
                  className={`p-3 rounded-2xl border transition ${
                    isCurrent
                      ? 'bg-purple-900/25 border-purple-500/50 shadow-md shadow-purple-950/40'
                      : isUnlocked
                      ? 'bg-white/[0.03] border-white/10'
                      : 'bg-black/40 border-white/5 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{tier.icon}</span>
                      <span className="text-xs font-bold text-white">
                        Lv.{tier.level} {tier.title}
                      </span>
                      {isCurrent && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-pink-500/30 text-pink-300 font-bold border border-pink-500/40">
                          当前
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-mono">
                      {isUnlocked ? (
                        <span className="flex items-center gap-0.5 text-emerald-400 font-semibold">
                          <Check size={11} /> 已解锁
                        </span>
                      ) : (
                        <span className="flex items-center gap-0.5 text-white/40">
                          <Lock size={11} /> 需 {tier.min} 亲密值
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tier.privileges.map((p, i) => (
                      <span
                        key={i}
                        className={`text-[10px] px-2 py-0.5 rounded-lg border ${
                          isUnlocked
                            ? 'bg-white/5 border-white/10 text-white/80'
                            : 'bg-white/[0.02] border-white/5 text-white/30'
                        }`}
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
