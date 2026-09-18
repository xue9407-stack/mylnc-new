import React, { useState } from 'react';
import { X, Clapperboard, Sparkles, Coins, Check, Zap, Image as ImageIcon, Volume2 } from 'lucide-react';
import { Role, MiniTheaterItem, UserProfile } from '../types';

interface TheaterCreateModalProps {
  isOpen: boolean;
  role: Role;
  userProfile: UserProfile;
  onClose: () => void;
  onCreated: (newTheater: MiniTheaterItem) => void;
  onShowToast: (msg: string) => void;
  onDeductMoney?: (amount: number) => boolean;
}

const THEATER_OPTIONS = [
  { words: 800, price: 2.0, title: '精细小剧场', desc: '包含 800字场景描述 + 动态 GIF + 独立原声语音' },
  { words: 1500, price: 3.5, title: '全沉浸大剧场', desc: '包含 1500字多场景演绎 + 动态光影 + 多段多角色独白配音' },
];

export const TheaterCreateModal: React.FC<TheaterCreateModalProps> = ({
  isOpen,
  role,
  userProfile,
  onClose,
  onCreated,
  onShowToast,
  onDeductMoney,
}) => {
  const [prompt, setPrompt] = useState('');
  const [selectedOption, setSelectedOption] = useState(THEATER_OPTIONS[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed) {
      onShowToast('请输入您想与【' + role.name + '】演绎的小剧场情节或场景');
      return;
    }

    if (userProfile.money < selectedOption.price) {
      onShowToast(`余额不足（需 ¥${selectedOption.price.toFixed(2)}，当前余额 ¥${userProfile.money.toFixed(2)}），请先前往个人中心充值！`);
      return;
    }

    if (onDeductMoney) {
      const ok = onDeductMoney(selectedOption.price);
      if (!ok) {
        onShowToast('扣费失败，请检查余额');
        return;
      }
    }

    setIsGenerating(true);
    onShowToast(`⚡ 正在扣除 ¥${selectedOption.price.toFixed(2)}，AI 导演正在渲染视听小剧场……`);

    setTimeout(() => {
      const newTheater: MiniTheaterItem = {
        id: `theater_custom_${Date.now()}`,
        roleId: role.id,
        title: `《${trimmed.slice(0, 10)}·专属小剧场》`,
        desc: `包含 ${selectedOption.words}字场景演练 + 动态 GIF + 背景音画`,
        wordCount: selectedOption.words,
        bgImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
        dynamicGif: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80',
        scenes: [
          {
            id: 's1',
            speaker: role.name,
            dialogue: `（根据你的提示“${trimmed}”，【${role.name}】身处唯美光影之中，眼神专一地凝视着你）既然来到了这里，接下来这一幕，就由我们共同完成。`,
            hasVoice: true,
            choices: [
              `“【${role.name}】，我很期待接下来的剧情发展。”`,
              `“能和你一起在这个小剧场里，真的很开心。”`
            ]
          }
        ],
        isCustom: true,
        createdAt: new Date().toISOString().split('T')[0]
      };

      setIsGenerating(false);
      onShowToast(`🎉 视听小剧场创建成功！消耗 ¥${selectedOption.price.toFixed(2)}`);
      onCreated(newTheater);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn select-none">
      <div className="w-full max-w-md bg-[#131120] border border-purple-500/30 rounded-3xl p-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition"
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-2.5 mb-4 border-b border-white/10 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/30">
            <Clapperboard size={20} />
          </div>
          <div>
            <h3 className="text-base font-black text-white">AI 智能创建小剧场</h3>
            <p className="text-[11px] text-purple-300/70">生成文字互动 + 动态 GIF + 背景图 + 原声配音</p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          {/* Prompt Description Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-white/70 uppercase tracking-wider block">
              1. 剧场场景与互动情境设定
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`请输入剧场情境，如：“豪门夜宴后半山别墅里的独处对话”、“雨夜露营帐篷里的即兴真心话”……`}
              className="w-full p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-purple-500 leading-relaxed"
            />
          </div>

          {/* Billing Options */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-white/70 uppercase tracking-wider block flex items-center justify-between">
              <span>2. 选择小剧场渲染规模</span>
              <span className="text-[10px] text-amber-300 font-normal">按字数与音画规格收费</span>
            </label>

            <div className="space-y-2">
              {THEATER_OPTIONS.map((opt) => (
                <div
                  key={opt.words}
                  onClick={() => setSelectedOption(opt)}
                  className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                    selectedOption.words === opt.words
                      ? 'bg-purple-600/20 border-purple-400 text-white shadow-md'
                      : 'bg-white/[0.03] border-white/5 text-white/70 hover:bg-white/5'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{opt.title} ({opt.words}字)</span>
                      {selectedOption.words === opt.words && (
                        <Check size={14} className="text-purple-400" />
                      )}
                    </div>
                    <div className="text-[10px] text-white/40 mt-0.5">{opt.desc}</div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-amber-300 font-mono">
                      ¥ {opt.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Wallet Balance Display */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs text-white/80">
            <div className="flex items-center gap-1.5">
              <Coins size={15} className="text-amber-400" />
              <span>当前钱包余额：</span>
            </div>
            <span className="font-bold font-mono text-amber-300">
              ¥ {userProfile.money.toFixed(2)}
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white text-xs font-black shadow-lg shadow-purple-500/30 active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Zap size={15} className="animate-spin text-amber-300" />
                <span>AI 视听引擎渲染中……</span>
              </>
            ) : (
              <>
                <Sparkles size={15} />
                <span>确认支付 ¥{selectedOption.price.toFixed(2)} · 生成视听小剧场</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
