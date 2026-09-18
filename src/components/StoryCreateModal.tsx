import React, { useState } from 'react';
import { X, Sparkles, BookOpen, Coins, Check, Zap, HelpCircle } from 'lucide-react';
import { Role, StoryLineItem, UserProfile } from '../types';

interface StoryCreateModalProps {
  isOpen: boolean;
  role: Role;
  userProfile: UserProfile;
  onClose: () => void;
  onCreated: (newStory: StoryLineItem) => void;
  onShowToast: (msg: string) => void;
  onDeductMoney?: (amount: number) => boolean;
}

const WORD_COUNT_OPTIONS = [
  { words: 500, price: 1.0, desc: '短篇精品故事 · 快速阅读' },
  { words: 1000, price: 2.0, desc: '中篇标准剧情 · 包含双支线选择' },
  { words: 2000, price: 3.8, desc: '长篇沉浸小说 · 多重情感高潮' },
];

export const StoryCreateModal: React.FC<StoryCreateModalProps> = ({
  isOpen,
  role,
  userProfile,
  onClose,
  onCreated,
  onShowToast,
  onDeductMoney,
}) => {
  const [prompt, setPrompt] = useState('');
  const [selectedOption, setSelectedOption] = useState(WORD_COUNT_OPTIONS[1]);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed) {
      onShowToast('请输入您希望与【' + role.name + '】展开的故事线设定');
      return;
    }

    // Check balance
    if (userProfile.money < selectedOption.price) {
      onShowToast(`余额不足（需 ¥${selectedOption.price.toFixed(2)}，当前余额 ¥${userProfile.money.toFixed(2)}），请先前往个人中心充值！`);
      return;
    }

    // Deduct
    if (onDeductMoney) {
      const ok = onDeductMoney(selectedOption.price);
      if (!ok) {
        onShowToast('扣费失败，请检查余额');
        return;
      }
    }

    setIsGenerating(true);
    onShowToast(`⚡ 正在扣除 ¥${selectedOption.price.toFixed(2)}，AI 小说家正在构思故事……`);

    // Simulate AI generation with Gemini prompt structure
    setTimeout(() => {
      const title = `《关于“${trimmed.slice(0, 8)}”的故事线》`;
      const paragraphs = [
        `那是一个阳光洒在【${role.name}】身上的下午，围绕着你提到的“${trimmed}”，命运的序幕缓缓拉开。`,
        `【${role.name}】微笑着走近你，眼神深沉而专注：“我一直都在等待这一刻，既然你提出了这个想法，那我便陪你到底。”`,
        `你们一同经历了欢笑与波折，文字在字里行间跳动，将故事的氛围推向最高潮……`,
        `无论未来漫长的岁月如何变幻，这一刻的故事线已深刻铭印在彼此的心间。`
      ];

      const newStory: StoryLineItem = {
        id: `story_custom_${Date.now()}`,
        roleId: role.id,
        title,
        summary: `用户专属定制剧情：${trimmed}`,
        wordCount: selectedOption.words,
        author: `${userProfile.nickname} & AI 创作`,
        isCustom: true,
        paragraphs,
        choices: [
          { id: 'c1', text: '“【' + role.name + '】，我们把这个故事继续写下去好吗？”', response: '【' + role.name + '】毫不犹豫地执起你的手：“只要你想，故事永不落幕。”' },
          { id: 'c2', text: '靠在【' + role.name + '】怀里，静静享受这一刻', response: '【' + role.name + '】温柔地抱紧你，轻声许下独一无二的诺言。' }
        ],
        createdAt: new Date().toISOString().split('T')[0]
      };

      setIsGenerating(false);
      onShowToast(`🎉 纯文字故事线创作完成！消耗 ¥${selectedOption.price.toFixed(2)}`);
      onCreated(newStory);
      onClose();
    }, 2000);
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
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-base font-black text-white">AI 智能生成故事线</h3>
            <p className="text-[11px] text-purple-300/70">根据你的故事描述，全自动生成专属小说</p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          {/* Prompt Description Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-white/70 uppercase tracking-wider block">
              1. 故事描述 / 剧情梗概设定
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`请输入希望与【${role.name}】发生的故事，例如：“我们一起在雨中打伞漫步发生误会”、“深夜在阳台喝红酒倾诉心事”……`}
              className="w-full p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-purple-500 leading-relaxed"
            />
          </div>

          {/* Word Count & Billing Options */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-white/70 uppercase tracking-wider block flex items-center justify-between">
              <span>2. 选定故事字数与收费档位</span>
              <span className="text-[10px] text-amber-300 font-normal">按生成字数精准计费</span>
            </label>

            <div className="space-y-2">
              {WORD_COUNT_OPTIONS.map((opt) => (
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
                      <span>{opt.words} 字故事线</span>
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

          {/* Submit button */}
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:opacity-95 text-white text-xs font-black shadow-lg shadow-purple-500/30 active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Zap size={15} className="animate-spin text-amber-300" />
                <span>AI 小说家生成中，请稍候……</span>
              </>
            ) : (
              <>
                <Sparkles size={15} />
                <span>确认支付 ¥{selectedOption.price.toFixed(2)} · 一键生成故事线</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
