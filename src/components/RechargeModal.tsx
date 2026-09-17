import React, { useState } from 'react';
import { X, Crown, Wallet, ShieldCheck, Check } from 'lucide-react';

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
  const [selectedVipId, setSelectedVipId] = useState<string>('quarterly');
  const [selectedBalanceVal, setSelectedBalanceVal] = useState<number>(30);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const vipPlans = [
    { id: 'monthly', name: '月度会员', price: 18, orig: 30, desc: '30 天全场 AI 角色畅聊' },
    { id: 'quarterly', name: '季度会员', price: 48, orig: 90, desc: '90 天畅聊 · 折合 ¥16/月', popular: true },
    { id: 'yearly', name: '年度会员', price: 98, orig: 216, desc: '365 天畅聊 · 折合 ¥8/月' },
    { id: 'lifetime', name: '终身会员', price: 168, orig: 368, desc: '永久终身无限畅聊 · 尊享特权' },
  ];

  const balanceOptions = [
    { value: 10, desc: '到账 ¥10.00 纯余额' },
    { value: 30, desc: '到账 ¥30.00 纯余额', popular: true },
    { value: 68, desc: '到账 ¥68.00 纯余额' },
    { value: 128, desc: '到账 ¥128.00 纯余额' },
  ];

  const currentVip = vipPlans.find((p) => p.id === selectedVipId) || vipPlans[1];

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (activeTab === 'vip') {
        onRechargeSuccess(currentVip.price, 'vip', `💎 黄金${currentVip.name}`);
        onShowToast(`恭喜！支付 ¥${currentVip.price} 成功，已为您开通【黄金${currentVip.name}】！`);
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
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
    >
      <div className="w-full max-w-sm bg-[#10101a] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
        {/* Header with Tabs */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex gap-2 p-1 rounded-xl bg-white/5 border border-white/5">
            <button
              onClick={() => setActiveTab('vip')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'vip'
                  ? 'bg-amber-500 text-black shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Crown size={14} />
              开通 VIP 会员
            </button>
            <button
              onClick={() => setActiveTab('balance')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'balance'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Wallet size={14} />
              充值钱包余额
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition"
          >
            <X size={15} />
          </button>
        </div>

        {/* Tab Content 1: VIP Membership */}
        {activeTab === 'vip' && (
          <div className="space-y-3">
            <div className="text-[11px] font-medium text-white/50 flex justify-between">
              <span>选择 VIP 订阅套餐</span>
              <span className="text-amber-400">权益即时开通</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {vipPlans.map((plan) => {
                const isSelected = selectedVipId === plan.id;
                return (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedVipId(plan.id)}
                    className={`p-3 rounded-xl border text-left relative transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-md shadow-amber-500/10'
                        : 'bg-white/5 border-white/5 hover:bg-white/10 text-white/80'
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded text-[9px] font-bold bg-pink-500 text-white shadow">
                        HOT
                      </span>
                    )}
                    <div>
                      <div className="text-xs font-bold text-white mb-1">{plan.name}</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-black font-mono text-amber-400">¥{plan.price}</span>
                        <span className="text-[10px] text-white/40 line-through font-mono">¥{plan.orig}</span>
                      </div>
                    </div>
                    <div className="text-[9px] text-amber-300/70 mt-2 font-medium">
                      {plan.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab Content 2: Wallet Balance */}
        {activeTab === 'balance' && (
          <div className="space-y-3">
            <div className="text-[11px] font-medium text-white/50 flex justify-between">
              <span>选择充值金额档位</span>
              <span className="text-purple-400">用于钱包资金储存</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {balanceOptions.map((item) => {
                const isSelected = selectedBalanceVal === item.value;
                return (
                  <button
                    key={item.value}
                    onClick={() => setSelectedBalanceVal(item.value)}
                    className={`p-3 rounded-xl border text-left relative transition ${
                      isSelected
                        ? 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-md shadow-purple-500/10'
                        : 'bg-white/5 border-white/5 hover:bg-white/10 text-white/80'
                    }`}
                  >
                    {item.popular && (
                      <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded text-[9px] font-bold bg-pink-500 text-white shadow">
                        HOT
                      </span>
                    )}
                    <div className="text-lg font-black font-mono text-white">¥ {item.value}.00</div>
                    <div className="text-[10px] text-purple-300/80 mt-1">{item.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Payment Channels */}
        <div className="pt-1">
          <div className="text-[11px] font-medium text-white/40 mb-1.5">支付方式</div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">💳</span>
              <div>
                <div className="text-xs font-semibold text-white">收银台模拟收单</div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <ShieldCheck size={11} />
                  <span>256 位加密模拟通道</span>
                </div>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-2 flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-xs font-medium transition"
          >
            取消
          </button>
          <button
            onClick={handlePay}
            disabled={loading}
            className={`flex-1 py-2.5 rounded-xl text-black text-xs font-extrabold shadow-lg transition active:scale-95 disabled:opacity-50 ${
              activeTab === 'vip'
                ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 shadow-amber-500/20'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-purple-500/20'
            }`}
          >
            {loading ? '支付中...' : activeTab === 'vip' ? `开通【${currentVip.name}】¥${currentVip.price}` : `确认充值 ¥${selectedBalanceVal}`}
          </button>
        </div>
      </div>
    </div>
  );
};
