import React, { useState } from 'react';
import {
  ArrowLeft,
  Crown,
  CheckCircle2,
  Zap,
  Sparkles,
  Heart,
  MessageSquare,
  Brain,
  Rocket,
  ShieldCheck,
  ChevronRight,
  Gift,
  HelpCircle,
  Star,
  Clock,
  Bell,
  RotateCcw,
  ImageIcon,
  Clapperboard,
  BookOpen,
  FileText,
  Volume2,
  GraduationCap,
  Share2,
  Plus,
  Coins,
  Flame
} from 'lucide-react';
import { UserProfile } from '../types';

interface VipViewProps {
  userProfile: UserProfile;
  onBack: () => void;
  onShowToast: (msg: string) => void;
  onRechargeModal: () => void;
  initialTier?: 'silver' | 'platinum';
  onUpgradeVipTier?: (tier: 'silver' | 'platinum') => void;
}

export const VipView: React.FC<VipViewProps> = ({
  userProfile,
  onBack,
  onShowToast,
  onRechargeModal,
  initialTier = 'silver',
  onUpgradeVipTier,
}) => {
  // VIP Level: 'silver' | 'platinum'
  const [activeTier, setActiveTier] = useState<'silver' | 'platinum'>(initialTier);
  
  // Duration: 'monthly' | 'quarterly' | 'yearly'
  const [selectedDuration, setSelectedDuration] = useState<'monthly' | 'quarterly' | 'yearly'>('quarterly');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Pricing configuration
  const SILVER_PLANS = [
    {
      id: 'monthly',
      name: '月卡',
      originalPrice: 30,
      discountPrice: 20.4,
      discountText: '新用户 6.8折',
      dailyChat: '每天 400 次',
      imageLimit: '10次 / 月',
      theaterLimit: '1次 / 月',
      storyLimit: '1次 / 月',
      desc: '入门精选 · 更多消息漫游',
    },
    {
      id: 'quarterly',
      name: '季卡',
      originalPrice: 90,
      discountPrice: 61.2,
      discountText: '新用户 6.8折 · 爆款推荐',
      dailyChat: '每天 600 次',
      imageLimit: '15次 / 月',
      theaterLimit: '3次 / 月',
      storyLimit: '3次 / 月',
      popular: true,
      desc: '性价比之王 · 极速生成',
    },
    {
      id: 'yearly',
      name: '年卡',
      originalPrice: 360,
      discountPrice: 244.8,
      discountText: '新用户 6.8折 · 超值首选',
      dailyChat: '每天 800 次',
      imageLimit: '20次 / 月',
      theaterLimit: '5次 / 季',
      storyLimit: '5次 / 季',
      desc: '全年畅享 · 最高权益额度',
    },
  ];

  const PLATINUM_PLANS = [
    {
      id: 'monthly',
      name: '月卡',
      originalPrice: 20,
      discountPrice: 12.0,
      discountText: '新用户 6折特惠',
      pptLimit: '10次 / 月',
      imgMakerLimit: '20次 / 月',
      bedtimeVoiceLimit: '3次 / 月',
      studyLimit: '每天 1 课',
      desc: '全能智囊 · PPT制作',
    },
    {
      id: 'quarterly',
      name: '季卡',
      originalPrice: 60,
      discountPrice: 36.0,
      discountText: '新用户 6折 · 极力推荐',
      pptLimit: '13次 / 月',
      imgMakerLimit: '25次 / 月',
      bedtimeVoiceLimit: '5次 / 月',
      studyLimit: '每天 2 课',
      popular: true,
      desc: '专属伴侣 · 微信绑定',
    },
    {
      id: 'yearly',
      name: '年卡',
      originalPrice: 240,
      discountPrice: 144.0,
      discountText: '新用户 6折 · 全能至尊',
      pptLimit: '15次 / 月',
      imgMakerLimit: '30次 / 月',
      bedtimeVoiceLimit: '8次 / 月',
      studyLimit: '每天 3 课',
      desc: '终极全套 · 决策流记录',
    },
  ];

  const currentPlans = activeTier === 'silver' ? SILVER_PLANS : PLATINUM_PLANS;
  const currentSelectedPlan = currentPlans.find((p) => p.id === selectedDuration) || currentPlans[1];

  const handleSubscribe = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const tierName = activeTier === 'silver' ? '订阅会员' : '技能会员';
      onUpgradeVipTier?.(activeTier);
      onShowToast(`🎉 成功开通【${tierName} - ${currentSelectedPlan.name}】！消息漫游与特权已同步！`);
    }, 600);
  };

  const handleBuyAddon = (name: string, price: number, desc: string) => {
    if (userProfile.money < price) {
      onShowToast(`余额不足（需 ¥${price}，当前余额 ¥${userProfile.money.toFixed(2)}），即将跳转钱包充值！`);
      setTimeout(() => {
        onRechargeModal();
      }, 500);
      return;
    }
    onShowToast(`⚡ 成功购买【${name}】(${desc})，已为您实时增加使用次数！`);
  };

  return (
    <div id="vip-center-view" className="h-full overflow-y-auto p-4 pb-32 bg-[#080711] space-y-5 select-none">
      {/* 1. Header Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/80 transition"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-black text-white">会员中心</h1>
            <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Crown size={11} className="fill-black" />
              <span>VIP</span>
            </span>
          </div>
        </div>

        <button
          onClick={onRechargeModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition"
        >
          <Coins size={14} />
          <span>钱包充值</span>
        </button>
      </div>

      {/* 2. Top User Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-500/20 via-[#1d162b] to-[#120f24] border border-amber-500/40 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        
        {/* User Info Header */}
        <div className="flex items-center justify-between gap-3 relative z-10 mb-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400/30 to-yellow-500/20 border border-amber-400/40 flex items-center justify-center text-2xl shadow-inner shrink-0">
              {userProfile.avatar || '😊'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-white whitespace-nowrap">{userProfile.nickname}</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-extrabold whitespace-nowrap">
                  创想尊享 VIP
                </span>
              </div>
              <p className="text-[11px] text-amber-200/80 mt-1 flex items-center gap-1 whitespace-nowrap">
                <ShieldCheck size={12} className="text-amber-400 shrink-0" />
                <span>会员有效期至 2026-12-31</span>
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-extrabold shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>生效中</span>
          </div>
        </div>

        {/* Activated Member Identity Badges */}
        <div className="flex items-center gap-2 pt-2.5 border-t border-white/10 relative z-10">
          <span className="text-[11px] text-white/50 font-medium whitespace-nowrap">当前权益：</span>
          <button
            type="button"
            onClick={() => setActiveTier('silver')}
            className={`px-3 py-1 rounded-full text-[11px] font-black shadow-sm flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition active:scale-95 ${
              activeTier === 'silver'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 ring-2 ring-amber-300/60 shadow-amber-500/20'
                : 'bg-white/10 text-amber-300 hover:bg-amber-400/20'
            }`}
          >
            <Crown size={12} className={`shrink-0 ${activeTier === 'silver' ? 'fill-slate-950' : 'fill-amber-300'}`} />
            <span>订阅会员</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTier('platinum')}
            className={`px-3 py-1 rounded-full text-[11px] font-black shadow-sm flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition active:scale-95 ${
              activeTier === 'platinum'
                ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white ring-2 ring-pink-300/60 shadow-pink-500/20'
                : 'bg-white/10 text-pink-300 hover:bg-pink-400/20'
            }`}
          >
            <Sparkles size={12} className={`shrink-0 ${activeTier === 'platinum' ? 'fill-white' : 'fill-pink-300'}`} />
            <span>技能会员</span>
          </button>
        </div>

        {/* Benefits summary footer */}
        <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-amber-200/80">
          <span className="truncate text-white/70">无限畅聊 · 全角色解锁 · 专属原声</span>
          <span className="text-amber-400 font-bold whitespace-nowrap shrink-0 ml-2">已享 12 项尊享权益 ›</span>
        </div>
      </div>

      {/* 3. VIP Level Selector Switcher Tabs */}
      <div className="flex rounded-2xl bg-white/5 p-1 border border-white/10">
        <button
          onClick={() => setActiveTier('silver')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
            activeTier === 'silver'
              ? 'bg-gradient-to-r from-slate-200 via-gray-100 to-slate-300 text-slate-900 shadow-md'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Crown size={15} className={activeTier === 'silver' ? 'text-slate-800' : 'text-slate-400'} />
          <span>订阅会员 (新用户6.8折)</span>
        </button>

        <button
          onClick={() => setActiveTier('platinum')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
            activeTier === 'platinum'
              ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white shadow-md'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Flame size={15} className={activeTier === 'platinum' ? 'text-pink-300' : 'text-purple-400'} />
          <span>技能会员 (新用户6折)</span>
        </button>
      </div>

      {/* 4. Subscription Plan Option Cards */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-white flex items-center gap-1.5">
            <Crown size={14} className="text-amber-400" />
            <span>选择【{activeTier === 'silver' ? '订阅会员' : '技能会员'}】续费档位</span>
          </h3>
          <span className="text-[10px] text-white/40">随时取消 · 自动顺延</span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {currentPlans.map((plan) => {
            const isSelected = selectedDuration === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedDuration(plan.id as any)}
                className={`p-3 rounded-2xl border cursor-pointer transition relative flex flex-col justify-between active:scale-[0.98] ${
                  isSelected
                    ? activeTier === 'silver'
                      ? 'bg-slate-800/80 border-slate-300 text-white shadow-lg shadow-slate-500/20'
                      : 'bg-purple-900/40 border-pink-400 text-white shadow-lg shadow-pink-500/20'
                    : 'bg-white/[0.03] border-white/10 text-white/70 hover:bg-white/5'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[9px] font-black shadow-md whitespace-nowrap">
                    {plan.discountText}
                  </div>
                )}

                <div>
                  <div className="text-xs font-black text-white text-center mt-1">
                    {plan.name}
                  </div>

                  <div className="text-center my-2">
                    <div className="text-lg font-black text-amber-300 font-mono">
                      ¥ {plan.discountPrice.toFixed(1)}
                    </div>
                    <div className="text-[10px] text-white/40 line-through">
                      原价 ¥{plan.originalPrice}
                    </div>
                  </div>
                </div>

                <div className="text-[9px] text-center text-white/50 border-t border-white/10 pt-1.5 mt-1 line-clamp-1">
                  {plan.desc}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleSubscribe}
          disabled={isSubmitting}
          className={`w-full py-3.5 rounded-2xl text-xs font-black shadow-lg transition flex items-center justify-center gap-2 active:scale-98 ${
            activeTier === 'silver'
              ? 'bg-gradient-to-r from-slate-200 via-gray-100 to-slate-300 text-slate-950 shadow-slate-500/30'
              : 'bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white shadow-purple-500/30'
          }`}
        >
          {isSubmitting ? (
            <span>正在开通会员权益中……</span>
          ) : (
            <>
              <Zap size={16} />
              <span>
                立即开通【{activeTier === 'silver' ? '订阅' : '技能'} - {currentSelectedPlan.name}】¥{currentSelectedPlan.discountPrice.toFixed(1)}
              </span>
            </>
          )}
        </button>
      </div>

      {/* 5. Detailed Quota & Privilege Comparison */}
      <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/10 space-y-3">
        <h3 className="text-xs font-extrabold text-white flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-amber-400" />
            <span>【{activeTier === 'silver' ? '订阅会员' : '技能会员'}】尊享特权与额度清单</span>
          </span>
          <span className="text-[10px] text-amber-300 font-normal">
            对应{currentSelectedPlan.name}额度
          </span>
        </h3>

        {activeTier === 'silver' ? (
          <div className="space-y-2 text-xs">
            {/* Daily Chat & Roaming */}
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare size={15} className="text-purple-400" />
                <span className="text-white font-semibold">消息漫游与每日对话条数</span>
              </div>
              <span className="font-bold text-amber-300 font-mono">
                {(currentSelectedPlan as any).dailyChat}
              </span>
            </div>

            {/* Image Assistant */}
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon size={15} className="text-pink-400" />
                <span className="text-white font-semibold">图片助手工具次数</span>
              </div>
              <span className="font-bold text-amber-300 font-mono">
                {(currentSelectedPlan as any).imageLimit}
              </span>
            </div>

            {/* AI Theater Script */}
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clapperboard size={15} className="text-indigo-400" />
                <span className="text-white font-semibold">AI 剧场脚本生成次数</span>
              </div>
              <span className="font-bold text-amber-300 font-mono">
                {(currentSelectedPlan as any).theaterLimit}
              </span>
            </div>

            {/* Story Line Generator */}
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen size={15} className="text-emerald-400" />
                <span className="text-white font-semibold">故事剧情小说生成次数</span>
              </div>
              <span className="font-bold text-amber-300 font-mono">
                {(currentSelectedPlan as any).storyLimit}
              </span>
            </div>

            {/* Silver Core Feature Grid */}
            <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] text-white/70">
              <div className="p-2 rounded-lg bg-white/[0.02] flex items-center gap-1.5">
                <Bell size={12} className="text-amber-400" />
                <span>事件闹钟提醒</span>
              </div>
              <div className="p-2 rounded-lg bg-white/[0.02] flex items-center gap-1.5">
                <Brain size={12} className="text-purple-400" />
                <span>角色记忆增强</span>
              </div>
              <div className="p-2 rounded-lg bg-white/[0.02] flex items-center gap-1.5">
                <Zap size={12} className="text-pink-400" />
                <span>思考模型优先响应</span>
              </div>
              <div className="p-2 rounded-lg bg-white/[0.02] flex items-center gap-1.5">
                <Rocket size={12} className="text-indigo-400" />
                <span>角色回复速度提升</span>
              </div>
              <div className="p-2 rounded-lg bg-white/[0.02] flex items-center gap-1.5">
                <HelpCircle size={12} className="text-emerald-400" />
                <span>生活决策事项建议</span>
              </div>
              <div className="p-2 rounded-lg bg-white/[0.02] flex items-center gap-1.5">
                <Heart size={12} className="text-red-400" />
                <span>纪念日专属提醒</span>
              </div>
              <div className="p-2 rounded-lg bg-white/[0.02] flex items-center gap-1.5 col-span-2">
                <RotateCcw size={12} className="text-cyan-400" />
                <span>对话撤回与无缝修改</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-xs">
            {/* PPT Creation */}
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={15} className="text-amber-400" />
                <span className="text-white font-semibold">PPT 一键制作生成</span>
              </div>
              <span className="font-bold text-amber-300 font-mono">
                {(currentSelectedPlan as any).pptLimit}
              </span>
            </div>

            {/* Picture Generation */}
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon size={15} className="text-pink-400" />
                <span className="text-white font-semibold">图片与生图助手制作</span>
              </div>
              <span className="font-bold text-amber-300 font-mono">
                {(currentSelectedPlan as any).imgMakerLimit}
              </span>
            </div>

            {/* Bedtime Story Voice */}
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 size={15} className="text-purple-400" />
                <span className="text-white font-semibold">睡前故事角色原声配音</span>
              </div>
              <span className="font-bold text-amber-300 font-mono">
                {(currentSelectedPlan as any).bedtimeVoiceLimit}
              </span>
            </div>

            {/* Learning Supervision */}
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap size={15} className="text-emerald-400" />
                <span className="text-white font-semibold">全能学习监督规划</span>
              </div>
              <span className="font-bold text-amber-300 font-mono">
                {(currentSelectedPlan as any).studyLimit}
              </span>
            </div>

            {/* Platinum Extras */}
            <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] text-white/70">
              <div className="p-2 rounded-lg bg-white/[0.02] flex items-center gap-1.5">
                <Brain size={12} className="text-pink-400" />
                <span>决策记录流智能整理</span>
              </div>
              <div className="p-2 rounded-lg bg-white/[0.02] flex items-center gap-1.5">
                <Share2 size={12} className="text-emerald-400" />
                <span>绑定微信聊天生态</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 6. 超出加量包 / 补充站 (Add-on Extra Quota Purchases) */}
      <div className="p-4 rounded-3xl bg-gradient-to-b from-[#131124] to-[#0a0a0f] border border-purple-500/30 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-white flex items-center gap-1.5">
            <Plus size={15} className="text-pink-400" />
            <span>用量超出扩展加量包 (单独购买)</span>
          </h3>
          <span className="text-[10px] text-pink-300">额度用完随时加补充</span>
        </div>

        <div className="space-y-2">
          {/* Chat Quota Add-on */}
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>聊天次数超出补给包</span>
              </div>
              <div className="text-[10px] text-white/50 mt-0.5">增加 200 次高速 AI 对话额度</div>
            </div>
            <button
              onClick={() => handleBuyAddon('聊天次数包', 10, '200次聊天')}
              className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/40 text-xs font-bold font-mono transition"
            >
              ¥ 10 / 200次
            </button>
          </div>

          {/* Image Quota Add-on */}
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>图片制作超出包</span>
              </div>
              <div className="text-[10px] text-white/50 mt-0.5">增加 15 张生图助手配图额度</div>
            </div>
            <button
              onClick={() => handleBuyAddon('图片做图包', 5, '15张图')}
              className="px-3 py-1.5 rounded-xl bg-pink-600/30 hover:bg-pink-600 text-pink-200 hover:text-white border border-pink-500/40 text-xs font-bold font-mono transition"
            >
              ¥ 5 / 15张
            </button>
          </div>

          {/* AI Theater Script Add-on */}
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">AI 剧场脚本生成超出包</span>
              <span className="text-[10px] text-indigo-300">按剧本字数阶梯收费</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleBuyAddon('剧场脚本包(5000字)', 5, '5000字内')}
                className="py-1.5 px-2 rounded-xl bg-white/5 hover:bg-purple-600/30 border border-white/10 text-[11px] font-bold text-white font-mono text-center transition"
              >
                ¥5 / 5000字内
              </button>
              <button
                onClick={() => handleBuyAddon('剧场脚本包(10000字)', 10, '10000字内')}
                className="py-1.5 px-2 rounded-xl bg-white/5 hover:bg-purple-600/30 border border-white/10 text-[11px] font-bold text-white font-mono text-center transition"
              >
                ¥10 / 10000字内
              </button>
            </div>
          </div>

          {/* Story Generation Add-on */}
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">故事剧情小说生成超出包</span>
              <span className="text-[10px] text-emerald-300">按小说篇幅阶梯计费</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleBuyAddon('故事剧情包(5000字)', 3, '5000字内')}
                className="py-1.5 px-2 rounded-xl bg-white/5 hover:bg-emerald-600/30 border border-white/10 text-[11px] font-bold text-white font-mono text-center transition"
              >
                ¥3 / 5000字内
              </button>
              <button
                onClick={() => handleBuyAddon('故事剧情包(10000字)', 5, '10000字内')}
                className="py-1.5 px-2 rounded-xl bg-white/5 hover:bg-emerald-600/30 border border-white/10 text-[11px] font-bold text-white font-mono text-center transition"
              >
                ¥5 / 10000字内
              </button>
              <button
                onClick={() => handleBuyAddon('故事剧情包(20000字)', 10, '20000字内')}
                className="py-1.5 px-2 rounded-xl bg-white/5 hover:bg-emerald-600/30 border border-white/10 text-[11px] font-bold text-white font-mono text-center transition"
              >
                ¥10 / 20000字内
              </button>
              <button
                onClick={() => handleBuyAddon('故事剧情包(25000字)', 15, '25000字内')}
                className="py-1.5 px-2 rounded-xl bg-white/5 hover:bg-emerald-600/30 border border-white/10 text-[11px] font-bold text-white font-mono text-center transition"
              >
                ¥15 / 25000字内
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
