import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface RealNameAuthModalProps {
  isVerified: boolean;
  verifiedName?: string;
  verifiedIdCard?: string;
  onClose: () => void;
  onVerifySuccess: (name: string, idCard: string) => void;
  onShowToast: (msg: string) => void;
}

export const RealNameAuthModal: React.FC<RealNameAuthModalProps> = ({
  isVerified,
  verifiedName = '',
  verifiedIdCard = '',
  onClose,
  onVerifySuccess,
  onShowToast,
}) => {
  const [realName, setRealName] = useState('');
  const [idCard, setIdCard] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!realName.trim() || realName.trim().length < 2) {
      onShowToast('❌ 请输入完整的真实姓名');
      return;
    }

    const cleanedId = idCard.trim().toUpperCase();
    if (!cleanedId || cleanedId.length !== 18) {
      onShowToast('❌ 请输入正确的 18 位身份证号码');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onVerifySuccess(realName.trim(), cleanedId);
      onShowToast('🎉 实名认证通过！已为您保障账户安全与更高权益。');
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#12111d] border border-white/10 rounded-3xl w-full max-w-sm p-6 shadow-2xl relative space-y-5">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/50 hover:text-white transition"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center shrink-0">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">实名身份认证</h3>
            <p className="text-xs text-white/40 mt-0.5">根据国家法规保障网络会话安全</p>
          </div>
        </div>

        {isVerified ? (
          /* Already verified card */
          <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 space-y-3">
            <div className="flex items-center gap-2 text-teal-300 font-bold text-xs">
              <CheckCircle2 size={16} />
              <span>已完成实名身份核验</span>
            </div>
            <div className="space-y-1.5 text-xs text-white/70">
              <div className="flex justify-between">
                <span className="text-white/40">真实姓名：</span>
                <span className="font-medium text-white">{verifiedName || '*雪'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">身份证号：</span>
                <span className="font-mono text-white">{verifiedIdCard || '3301**********12'}</span>
              </div>
            </div>
            <p className="text-[11px] text-teal-200/60 pt-1 border-t border-teal-500/10">
              您的个人敏感信息已加密存储在本地安全沙盒中。
            </p>
          </div>
        ) : (
          /* Auth Form */
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-white/70 font-medium">真实姓名</label>
              <input
                type="text"
                value={realName}
                onChange={(e) => setRealName(e.target.value)}
                placeholder="请输入您的真实姓名"
                className="w-full bg-white/[0.05] border border-white/10 focus:border-teal-500/50 rounded-xl px-3.5 py-2.5 text-white placeholder-white/30 outline-none transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-white/70 font-medium">身份证号码</label>
              <input
                type="text"
                maxLength={18}
                value={idCard}
                onChange={(e) => setIdCard(e.target.value)}
                placeholder="请输入 18 位二代身份证号"
                className="w-full bg-white/[0.05] border border-white/10 focus:border-teal-500/50 rounded-xl px-3.5 py-2.5 text-white font-mono placeholder-white/30 outline-none transition uppercase"
              />
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-white/50 space-y-1">
              <div className="flex items-center gap-1 text-amber-300 font-semibold">
                <AlertCircle size={13} />
                <span>隐私声明</span>
              </div>
              <p>实名认证仅用于未成年人保护及符合国家合规指引，绝不向第三方泄露。</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? '核验中...' : '提交实名认证'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
