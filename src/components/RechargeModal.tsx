import React, { useState } from 'react';
import { X, Crown, Wallet, ShieldCheck, Check, Sparkles, Flame, Zap } from 'lucide-react';

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRechargeSuccess: (amount: number, mode: 'vip' | 'balance', vipTitle?: string) => void;
  onShowToast: (msg: string) => void;
}

export const RechargeModal: React.FC<RechargeModalProps> = ({
  isOpen,
  onClose,
  onRechargeSuccess,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'vip' | 'balance'>('vip');
  const [vipCategory, setVipCategory] = useState<'subscription' | 'skill'>('subscription');
  const [selectedVipId, setSelectedVipId] = useState<string>('quarterly');
  const [selectedBalanceVal, setSelectedBalanceVal] = useState<number>(30);
  const [payChannel, setPayChannel] = useState<'wechat' | 'alipay' | 'sim'>('wechat');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Subscription VIP Plans (订阅会员)
  const subscriptionPlans = [
    { id: 'monthly', name: '月度订阅', price: 18.0, orig: 30, desc: '30天消息漫游 · 基础模型畅聊' },
    { id: 'quarterly', name: '季度订阅', price: 48.0, orig: 90, desc: '90天畅聊 · 折合 ¥16/月', popular: true, tag: '爆款推荐' },
    { id: 'yearly', name: '年度订阅', price: 98.0, orig: 216, desc: '365天畅聊 · 折合 ¥8.1/月', tag: '省心推荐' },
    { id: 'lifetime', name: '终身订阅', price: 168.0, orig: 368, desc: '永久无限畅聊 · 账号多端同步' },
  ];

  // Skill VIP Plans (技能会员 - 解锁 10 大智囊)
  const skillPlans = [
    { id: 'monthly_skill', name: '月度技能', price: 28.0, orig: 48, desc: '解锁 10 大智囊 · 月配额加倍' },
    { id: 'quarterly_skill', name: '季度技能', price: 61.2, orig: 90, desc: '季度专属 · 折合 ¥20.4/月', popular: true, tag: '6.8折爆款' },
    { id: 'yearly_skill', name: '年度技能', price: 244.8, orig: 360, desc: '365天全能技能 · PPT+生图特权', tag: '省 ¥115.2' },
    { id: 'lifetime_skill', name: '终身技能', price: 398.0, orig: 888, desc: '永久解锁所有 10 大 AI 智囊特权' },
  ];

  const balanceOptions = [
    { value: 10, desc: '到账 ¥10.00 钱包余额', bonus: '' },
    { value: 30, desc: '到账 ¥30.00 钱包余额', popular: true, bonus: '' },
    { value: 68, desc: '到账 ¥68.00 钱包余额', bonus: '' },
    { value: 128, desc: '到账 ¥128.00 钱包余额', bonus: '' },
  ];

  const currentPlans = vipCategory === 'subscription' ? subscriptionPlans : skillPlans;
  const currentVip = currentPlans.find((p) => p.id === selectedVipId) || currentPlans[1];

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (activeTab === 'vip') {
        const catName = vipCategory === 'subscription' ? '订阅会员' : '技能会员';
        onRechargeSuccess(currentVip.price, 'vip', `💎 ${catName}-${currentVip.name}`);
        onShowToast(`恭喜！成功开通【${catName} · ${currentVip.name}】！`);
      } else {
        onRechargeSuccess(selectedBalanceVal, 'balance');
        onShowToast(`充值 ¥${selectedBalanceVal}.00 成功，余额已实时到账！`);
      }
      onClose();
    }, 600);
  };

  return (
    <div
      id="recharge-center-modal"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 animate-fadeIn"
    >
      <div className="w-full max-w-md bg-[#0f0f18] border border-white/10 rounded-3xl p-5 shadow-2xl space-y-4 text-white relative overflow-hidden">
        {/* Subtle glowing ambient backdrop */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header with main toggle tabs */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 relative z-10">
          <div className="flex p-1 rounded-2xl bg-white/5 border border-white/10 gap-1">
            <button
              onClick={() => {
                setActiveTab('vip');
                setSelectedVipId(vipCategory === 'subscription' ? 'quarterly' : 'quarterly_skill');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'vip'
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Crown size={14} className={activeTab === 'vip' ? 'fill-slate-950' : ''} />
              开通 VIP 会员
            </button>
            <button
              onClick={() => setActiveTab('balance')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'balance'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/20'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Wallet size={14} />
              充值钱包余额
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition border border-white/5 active:scale-95"
          >
            <X size={16} />
          </button>
        </div>

        {/* VIP Tab View */}
        {activeTab === 'vip' && (
          <div className="space-y-3.5 relative z-10">
            {/* VIP Category Switcher: 订阅会员 VS 技能会员 */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-white/[0.03] border border-white/10">
              <button
                onClick={() => {
                  setVipCategory('subscription');
                  setSelectedVipId('quarterly');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition ${
                  vipCategory === 'subscription'
                    ? 'bg-gradient-to-r from-amber-500/20 to-amber-400/10 border border-amber-400/40 text-amber-300 shadow-sm'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <Crown size={13} className={vipCategory === 'subscription' ? 'text-amber-400' : ''} />
                <span>订阅会员</span>
              </button>

              <button
                onClick={() => {
                  setVipCategory('skill');
                  setSelectedVipId('quarterly_skill');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition ${
                  vipCategory === 'skill'
                    ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/10 border border-pink-400/40 text-pink-300 shadow-sm'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <Sparkles size={13} className={vipCategory === 'skill' ? 'text-pink-400' : ''} />
                <span>技能会员</span>
              </button>
            </div>

            {/* Sub-header description */}
            <div className="text-[11px] text-white/50 flex items-center justify-between px-1">
              <span>
                {vipCategory === 'subscription'
                  ? '订阅会员：无限畅聊 + 基础创作扩展'
                  : '技能会员：解锁 10 大 AI 智囊 + 专属特权'}
              </span>
              <span className="text-amber-400 font-medium">权益即时开通</span>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {currentPlans.map((plan) => {
                const isSelected = selectedVipId === plan.id;
                return (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedVipId(plan.id)}
                    className={`p-3 rounded-2xl border text-left relative transition-all flex flex-col justify-between ${
                      isSelected
                        ? vipCategory === 'subscription'
                          ? 'bg-amber-500/15 border-amber-400 text-amber-200 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/30'
                          : 'bg-pink-500/15 border-pink-400 text-pink-200 shadow-lg shadow-pink-500/10 ring-1 ring-pink-400/30'
                        : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08] text-white/80'
                    }`}
                  >
                    {plan.tag && (
                      <span className="absolute -top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-black bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md">
                        {plan.tag}
                      </span>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white">{plan.name}</span>
                        {isSelected && (
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center text-slate-950 ${
                            vipCategory === 'subscription' ? 'bg-amber-400' : 'bg-pink-400'
                          }`}>
                            <Check size={10} strokeWidth={3} />
                          </div>
                        )}
                      </div>

                      <div className="flex items-baseline gap-1.5 my-1">
                        <span className={`text-lg font-black font-mono ${
                          vipCategory === 'subscription' ? 'text-amber-300' : 'text-pink-300'
                        }`}>
                          ¥{plan.price}
                        </span>
                        <span className="text-[10px] text-white/40 line-through font-mono">
                          ¥{plan.orig}
                        </span>
                      </div>
                    </div>

                    <div className="text-[9.5px] text-white/50 mt-1.5 leading-tight font-normal">
                      {plan.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Balance Tab View */}
        {activeTab === 'balance' && (
          <div className="space-y-3.5 relative z-10">
            <div className="text-[11px] font-medium text-white/50 flex justify-between px-1">
              <span>选择充值面额（可直接用于消费或打赏）</span>
              <span className="text-purple-400">实时到账</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {balanceOptions.map((item) => {
                const isSelected = selectedBalanceVal === item.value;
                return (
                  <button
                    key={item.value}
                    onClick={() => setSelectedBalanceVal(item.value)}
                    className={`p-3.5 rounded-2xl border text-left relative transition-all ${
                      isSelected
                        ? 'bg-purple-600/20 border-purple-400 text-purple-200 shadow-lg shadow-purple-500/10 ring-1 ring-purple-400/30'
                        : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08] text-white/80'
                    }`}
                  >
                    {item.bonus && (
                      <span className="absolute -top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-black bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 shadow">
                        {item.bonus}
                      </span>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-black font-mono text-white">¥ {item.value}.00</div>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-purple-400 flex items-center justify-center text-slate-950">
                          <Check size={10} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <div className="text-[10px] text-purple-200/70 mt-1.5">{item.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Payment Channels Selection */}
        <div className="pt-1 relative z-10">
          <div className="text-[11px] font-medium text-white/40 mb-2 flex items-center justify-between">
            <span>支付方式</span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <ShieldCheck size={12} />
              <span>256 位安全加密</span>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'wechat', icon: '💬', name: '微信支付', label: '快捷' },
              { id: 'alipay', icon: '🔹', name: '支付宝', label: '秒杀' },
              { id: 'sim', icon: '💳', name: '模拟收银台', label: '测试' },
            ].map((ch) => {
              const isSelected = payChannel === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => setPayChannel(ch.id as any)}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center transition ${
                    isSelected
                      ? 'bg-white/10 border-white/30 text-white shadow-sm'
                      : 'bg-white/[0.03] border-white/5 text-white/50 hover:text-white/80'
                  }`}
                >
                  <span className="text-base mb-0.5">{ch.icon}</span>
                  <span className="text-[11px] font-bold">{ch.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex gap-3 relative z-10">
          <button
            onClick={onClose}
            className="w-1/3 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white/70 text-xs font-semibold transition active:scale-95"
          >
            取消
          </button>
          <button
            onClick={handlePay}
            disabled={loading}
            className={`w-2/3 py-3 rounded-2xl text-slate-950 text-xs font-extrabold shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5 ${
              activeTab === 'vip'
                ? vipCategory === 'subscription'
                  ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 shadow-amber-500/20'
                  : 'bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-300 text-white shadow-pink-500/20'
                : 'bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 text-slate-950 shadow-purple-500/20'
            }`}
          >
            {loading ? (
              <span>处理中...</span>
            ) : activeTab === 'vip' ? (
              <>
                <Zap size={14} className="fill-current" />
                <span>
                  开通【{vipCategory === 'subscription' ? '订阅' : '技能'} · {currentVip.name}】¥{currentVip.price}
                </span>
              </>
            ) : (
              <span>确认充值 ¥{selectedBalanceVal}.00</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
