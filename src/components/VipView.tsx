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
} from 'lucide-react';
import { UserProfile } from '../types';

interface VipViewProps {
  userProfile: UserProfile;
  onBack: () => void;
  onShowToast: (msg: string) => void;
  onRechargeModal: () => void;
}

interface PlanOption {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  unit: string;
  tag?: string;
  popular?: boolean;
  desc: string;
}

export const VipView: React.FC<VipViewProps> = ({
  userProfile,
  onBack,
  onShowToast,
  onRechargeModal,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('lifetime');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const plans: PlanOption[] = [
    {
      id: 'monthly',
      name: '连续包月',
      price: 18,
      originalPrice: 30,
      unit: '/月',
      desc: '灵活体验，支持随时取消',
    },
    {
      id: 'quarterly',
      name: '连续包季',
      price: 48,
      originalPrice: 90,
      unit: '/季',
      popular: true,
      tag: '爆款 · 折合 ¥16/月',
      desc: '赠双倍好感度加速',
    },
    {
      id: 'yearly',
      name: '连续包年',
      price: 98,
      originalPrice: 216,
      unit: '/年',
      tag: '立省 ¥118 · 低至 ¥8/月',
      desc: '尊享整年无限畅聊特权',
    },
    {
      id: 'lifetime',
      name: '终身尊享卡',
      price: 168,
      originalPrice: 368,
      unit: '/终身',
      tag: '一次付费 · 永久终身有效',
      desc: '永久解锁全场角色与全部特权',
    },
  ];

  const currentPlan = plans.find((p) => p.id === selectedPlanId) || plans[2];

  const handleSubscribe = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onShowToast(`恭喜！成功续费【${currentPlan.name}】，会员特权已实时生效！`);
    }, 600);
  };

  const privileges = [
    {
      icon: <Zap className="text-amber-400" size={20} />,
      title: '无限次深度 AI 对话',
      desc: '无对话条数限制，零延迟极速生成',
    },
    {
      icon: <Sparkles className="text-amber-400" size={20} />,
      title: '全场 11+ 精选 AI 角色',
      desc: '解锁霸总、病娇、治愈与傲娇全系人设',
    },
    {
      icon: <Heart className="text-amber-400" size={20} />,
      title: '亲密度羁绊加速提升',
      desc: '聊天与每日问候获得额外好感度加成',
    },
    {
      icon: <Rocket className="text-amber-400" size={20} />,
      title: '原创角色创作与发布',
      desc: '自定义人设立绘，支持发布至广场互动',
    },
    {
      icon: <Brain className="text-amber-400" size={20} />,
      title: '多轮上下文对话记忆',
      desc: '智能化记住长篇对话背景与性格设定',
    },
    {
      icon: <MessageSquare className="text-amber-400" size={20} />,
      title: '角色动态朋友圈互动',
      desc: '第一视角点赞评论角色日常生活更新',
    },
  ];

  const faqs = [
    {
      q: '开通会员后支持多端同步吗？',
      a: '支持！只需登录同一账号，移动端、Web 端均可实时共享所有会员特权、角色解锁状态与情感记忆库。',
    },
    {
      q: '多次续费会员，有效期如何计算？',
      a: '多次购买会员，有效期会自动叠加顺延；若购买【终身尊享卡】，账户将直接升级为永久黄金会员，无需再次续费。',
    },
    {
      q: '遇到对话延迟或会员权益未生效怎么办？',
      a: '可随时在「帮助与反馈」提交工单或联系客服。黄金会员尊享 7x24 小时专线优先响应处理。',
    },
  ];

  return (
    <div id="vip-center-view" className="h-full overflow-y-auto p-4 pb-32 bg-[#0a0a0f] space-y-5">
      {/* 1. Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 flex items-center justify-center text-white/80 transition"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              会员中心
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                VIP
              </span>
            </h2>
          </div>
        </div>
        <button
          onClick={onRechargeModal}
          className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-medium"
        >
          <Gift size={14} />
          钱包充值
        </button>
      </div>

      {/* 2. Premium VIP Card */}
      <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-[#f5d061] via-[#e5a93b] to-[#c88219] text-black shadow-2xl border border-amber-300/40">
        {/* Decorative background glow */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/20 blur-xl pointer-events-none" />
        <div className="absolute right-4 top-4 text-black/10 pointer-events-none">
          <Crown size={96} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-black/10 border border-black/20 overflow-hidden flex items-center justify-center font-bold text-black text-lg shrink-0">
                {userProfile.avatar && (userProfile.avatar.startsWith('http') || userProfile.avatar.startsWith('data:')) ? (
                  <img src={userProfile.avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  userProfile.avatar || '😊'
                )}
              </div>
              <div>
                <div className="text-sm font-black flex items-center gap-1.5 text-black">
                  {userProfile.nickname}
                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-black text-amber-300 font-bold">
                    尊贵黄金会员
                  </span>
                </div>
                <div className="text-[10px] text-black/70 font-medium mt-0.5">
                  网巢 AI 创想伙伴
                </div>
              </div>
            </div>

            <span className="text-[10px] px-2.5 py-1 rounded-full bg-black/80 text-amber-300 font-bold tracking-wide shadow-sm">
              生效中
            </span>
          </div>

          <div className="mt-5 pt-3 border-t border-black/10 flex items-end justify-between">
            <div>
              <div className="text-[11px] text-black/70 font-medium">会员到期时间</div>
              <div className="text-lg font-black font-mono tracking-tight text-black mt-0.5">
                2026-12-31 <span className="text-xs font-normal text-black/70">(永久畅聊)</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-black/80 bg-black/10 px-2.5 py-1 rounded-lg font-medium">
                无限畅聊 · 全角色解锁 · 专属原声
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Package Selector (订阅特惠方案) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white/90 uppercase tracking-wider flex items-center gap-1.5">
            <Star size={14} className="text-amber-400 fill-amber-400" />
            黄金会员续费 / 升级特惠
          </h3>
          <span className="text-[11px] text-white/40">随时取消 · 自动顺延</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {plans.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`relative p-3 rounded-xl border transition cursor-pointer flex flex-col justify-between text-center ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/10'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-[9px] font-bold text-white whitespace-nowrap shadow-sm">
                    热门推荐
                  </div>
                )}
                <div>
                  <div className="text-xs font-bold text-white mt-1">{plan.name}</div>
                  <div className="my-2">
                    <span className="text-xs font-bold text-amber-400">¥</span>
                    <span className="text-2xl font-black text-amber-400 font-mono ml-0.5">
                      {plan.price}
                    </span>
                    <span className="text-[10px] text-white/40">{plan.unit}</span>
                  </div>
                  <div className="text-[10px] text-white/40 line-through font-mono">
                    ¥{plan.originalPrice}
                  </div>
                </div>
                <div className="mt-2 text-[9px] text-amber-300/80 bg-amber-400/10 py-1 rounded-md leading-tight">
                  {plan.tag || plan.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Core Privileges List (尊享权益矩阵) */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
        <h3 className="text-xs font-bold text-white/90 uppercase tracking-wider flex items-center justify-between">
          <span>尊享 6 大黄金特权矩阵</span>
          <span className="text-[11px] text-amber-400 font-normal">已获得全套特权</span>
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {privileges.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-amber-500/30 transition group"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                {item.icon}
              </div>
              <div className="text-xs font-bold text-white mb-0.5">{item.title}</div>
              <div className="text-[10px] text-white/50 leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Rights Comparison Table (普通用户 VS 黄金会员) */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
        <h3 className="text-xs font-bold text-white/90 uppercase tracking-wider">
          普通用户 vs 黄金会员 权益对比
        </h3>

        <div className="overflow-hidden rounded-xl border border-white/10 text-xs">
          <div className="grid grid-cols-3 bg-white/10 p-2.5 text-[11px] font-bold text-white/80 text-center">
            <div className="text-left pl-2">权益项目</div>
            <div>普通用户</div>
            <div className="text-amber-400">黄金终身会员</div>
          </div>

          <div className="divide-y divide-white/5 bg-black/20 text-[11px] text-white/70">
            <div className="grid grid-cols-3 p-2.5 items-center text-center">
              <div className="text-left pl-2 font-medium text-white/90">每日对话次数</div>
              <div className="text-white/40">20次 / 天</div>
              <div className="text-amber-300 font-bold">无限次畅聊</div>
            </div>
            <div className="grid grid-cols-3 p-2.5 items-center text-center">
              <div className="text-left pl-2 font-medium text-white/90">官方精选角色</div>
              <div className="text-white/40">限时试用 3 个</div>
              <div className="text-amber-300 font-bold">11+ 全场解锁</div>
            </div>
            <div className="grid grid-cols-3 p-2.5 items-center text-center">
              <div className="text-left pl-2 font-medium text-white/90">亲密度提升速度</div>
              <div className="text-white/40">标准速度</div>
              <div className="text-amber-300 font-bold">双倍加速 + 专属问候</div>
            </div>
            <div className="grid grid-cols-3 p-2.5 items-center text-center">
              <div className="text-left pl-2 font-medium text-white/90">角色创作与入驻</div>
              <div className="text-white/40">受限模式</div>
              <div className="text-amber-300 font-bold">无限制自由创作</div>
            </div>
            <div className="grid grid-cols-3 p-2.5 items-center text-center">
              <div className="text-left pl-2 font-medium text-white/90">AI 响应通道</div>
              <div className="text-white/40">标准通道</div>
              <div className="text-amber-300 font-bold">VIP 极速通道</div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. FAQ Section */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
        <h3 className="text-xs font-bold text-white/90 uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle size={14} className="text-amber-400" />
          会员常见问题
        </h3>

        <div className="space-y-2 text-xs">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-white/5 border border-white/5 overflow-hidden transition"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-3 text-left font-medium text-white/90 flex items-center justify-between hover:bg-white/5 transition"
              >
                <span>{faq.q}</span>
                <ChevronRight
                  size={14}
                  className={`text-white/40 transition-transform ${
                    activeFaq === idx ? 'rotate-90' : ''
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-3 pb-3 pt-1 text-[11px] text-white/60 leading-relaxed border-t border-white/5">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 7. Bottom Fixed Purchase Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-[#0a0a0f]/95 backdrop-blur-md border-t border-white/10 max-w-md mx-auto flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] text-white/40">选购套餐: {currentPlan.name}</div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-amber-400 font-bold">¥</span>
            <span className="text-xl font-black text-amber-400 font-mono">
              {currentPlan.price}.00
            </span>
            <span className="text-[10px] text-white/50 line-through font-mono">
              ¥{currentPlan.originalPrice}
            </span>
          </div>
        </div>

        <button
          onClick={handleSubscribe}
          disabled={isSubmitting}
          className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:brightness-110 active:scale-98 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-1.5"
        >
          <Crown size={15} className="fill-black" />
          {isSubmitting ? '处理中...' : `立即续费【${currentPlan.name}】`}
        </button>
      </div>
    </div>
  );
};
