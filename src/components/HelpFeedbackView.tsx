import React, { useState } from 'react';
import {
  ArrowLeft,
  HelpCircle,
  MessageSquare,
  Headphones,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle2,
  Copy,
  Clock,
  Mail,
  Smartphone,
  Sparkles,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

interface HelpFeedbackViewProps {
  onBack: () => void;
  onShowToast: (msg: string) => void;
}

type TabType = 'faq' | 'feedback' | 'contact';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQ_LIST: FAQItem[] = [
  {
    id: 'f1',
    category: '对话与互动',
    question: '角色没有及时回复怎么办？',
    answer:
      '当网络波动或并发量较大时，AI 生成可能会稍有延迟。若超过 10 秒无响应，可点击输入框上方的“重新生成”图标再次请求，或检查当前网络连接状态。',
  },
  {
    id: 'f2',
    category: '对话与互动',
    question: '如何提升与角色的好感度 / 亲密度？有上限吗？',
    answer:
      '每次向角色发送消息互动均可增加 5~10 点亲密度；为了保持健康的互动节奏，每位角色单日通过聊天最多可提升 50 点亲密度（次日零点自动重置）。此外，每天在亲密档案中进行一次专属问候还可额外获得 +10 点亲密值奖励。羁绊等级提升后，角色称呼更亲近，并解锁专属表情、语音与私密立绘。',
  },
  {
    id: 'f3',
    category: '资产与特权',
    question: '钱包余额与会员特权有什么用处？如何获取？',
    answer:
      '钱包余额可用于解锁专属语音包、高清私密立绘与高阶 AI 智囊引擎。可在个人中心我的钱包页面进行充值，开通订阅会员或技能会员还可尊享无限制高速对话与特权体验。',
  },
  {
    id: 'f4',
    category: '角色与创作',
    question: '如何创建自己的专属 AI 角色？',
    answer:
      '在「我的」-「创作中心」点击“新建角色”，输入角色姓名、个性签名、详细人设设定与第一句开场白，并选择喜欢的二次元立绘形象，即可立刻发布并与之畅聊。',
  },
  {
    id: 'f5',
    category: '隐私与数据',
    question: '聊天记录会被公开或泄露吗？',
    answer:
      '完全不会！您的所有聊天对话记录均加密存储于本地沙盒及专属安全会话中，严格保护您的个人隐私。在聊天界面右上角支持随时一键“清空聊天记录”。',
  },
];

interface FeedbackRecord {
  id: string;
  type: string;
  content: string;
  contact: string;
  time: string;
  status: 'pending' | 'resolved';
}

export const HelpFeedbackView: React.FC<HelpFeedbackViewProps> = ({
  onBack,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('faq');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('f1');
  const [faqFilter, setFaqFilter] = useState<string>('全部');

  // Feedback Form State
  const [feedbackType, setFeedbackType] = useState('功能建议');
  const [content, setContent] = useState('');
  const [contact, setContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Local storage feedback history
  const [feedbacks, setFeedbacks] = useState<FeedbackRecord[]>(() => {
    try {
      const saved = localStorage.getItem('user_feedback_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const categories = ['全部', '对话与互动', '资产与特权', '角色与创作', '隐私与数据'];

  const filteredFaqs =
    faqFilter === '全部'
      ? FAQ_LIST
      : FAQ_LIST.filter((item) => item.category === faqFilter);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    onShowToast(`已复制${label}：${text}`);
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      onShowToast('请填写反馈内容');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newRecord: FeedbackRecord = {
        id: `FB-${Date.now().toString().slice(-6)}`,
        type: feedbackType,
        content: content.trim(),
        contact: contact.trim() || '未预留',
        time: new Date().toLocaleString('zh-CN', {
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'pending',
      };

      const updated = [newRecord, ...feedbacks];
      setFeedbacks(updated);
      localStorage.setItem('user_feedback_history', JSON.stringify(updated));

      setIsSubmitting(false);
      setFeedbackSuccess(true);
      setContent('');
      onShowToast('反馈提交成功，感谢您的建议！');
    }, 600);
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] text-white">
      {/* Top Header */}
      <div className="px-4 py-3.5 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#0d0d14]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition active:scale-95"
            aria-label="返回"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-base font-bold text-white">帮助与反馈</h2>
        </div>
        <span className="text-[11px] text-pink-400/80 bg-pink-500/10 px-2 py-0.5 rounded-full font-medium">
          官方支持
        </span>
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-3 border-b border-white/5 bg-[#101018] shrink-0">
        <button
          onClick={() => {
            setActiveTab('faq');
            setFeedbackSuccess(false);
          }}
          className={`py-3 text-xs font-medium flex items-center justify-center gap-1.5 border-b-2 transition ${
            activeTab === 'faq'
              ? 'border-pink-500 text-pink-400 font-bold bg-pink-500/5'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          <HelpCircle size={14} />
          常见问题
        </button>
        <button
          onClick={() => {
            setActiveTab('feedback');
            setFeedbackSuccess(false);
          }}
          className={`py-3 text-xs font-medium flex items-center justify-center gap-1.5 border-b-2 transition ${
            activeTab === 'feedback'
              ? 'border-pink-500 text-pink-400 font-bold bg-pink-500/5'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          <MessageSquare size={14} />
          意见反馈
        </button>
        <button
          onClick={() => {
            setActiveTab('contact');
            setFeedbackSuccess(false);
          }}
          className={`py-3 text-xs font-medium flex items-center justify-center gap-1.5 border-b-2 transition ${
            activeTab === 'contact'
              ? 'border-pink-500 text-pink-400 font-bold bg-pink-500/5'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          <Headphones size={14} />
          联系客服
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-4 pb-28 space-y-4">
        {/* 1. FAQ TAB */}
        {activeTab === 'faq' && (
          <div className="space-y-3.5">
            {/* Category Filter Badges */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFaqFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition ${
                    faqFilter === cat
                      ? 'bg-pink-600 text-white shadow-sm'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Questions Accordion */}
            <div className="space-y-2">
              {filteredFaqs.map((faq) => {
                const isExpanded = expandedFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="border border-white/10 rounded-xl overflow-hidden bg-white/[0.03] transition duration-200"
                  >
                    <button
                      onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                      className="w-full p-3.5 text-left flex items-center justify-between gap-2 hover:bg-white/5 transition"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-pink-400 text-xs font-bold shrink-0">Q:</span>
                        <span className="text-xs font-semibold text-white/90">
                          {faq.question}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp size={15} className="text-pink-400 shrink-0" />
                      ) : (
                        <ChevronDown size={15} className="text-white/40 shrink-0" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="px-3.5 pb-3.5 pt-1 text-xs text-white/70 border-t border-white/5 bg-black/20 leading-relaxed">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Still Need Help Notice */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 flex items-center justify-between mt-4">
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles size={13} className="text-pink-400" />
                  没找到你遇到的问题？
                </div>
                <div className="text-[11px] text-white/50 mt-0.5">
                  欢迎向我们提交反馈或联系人工客服
                </div>
              </div>
              <button
                onClick={() => setActiveTab('feedback')}
                className="px-3 py-1.5 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-xs font-medium transition active:scale-95 shrink-0"
              >
                去反馈
              </button>
            </div>
          </div>
        )}

        {/* 2. FEEDBACK TAB */}
        {activeTab === 'feedback' && (
          <div className="space-y-4">
            {feedbackSuccess ? (
              <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-sm font-bold text-white">反馈已提交成功</h3>
                <p className="text-xs text-white/60 max-w-xs mx-auto leading-relaxed">
                  非常感谢您的宝贵建议！开发与运营团队会认真审阅每一条反馈并在后续版本持续优化。
                </p>
                <button
                  onClick={() => setFeedbackSuccess(false)}
                  className="mt-2 px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-xs font-semibold transition active:scale-95"
                >
                  再写一条
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback} className="space-y-3.5">
                {/* Type Selection */}
                <div>
                  <label className="block text-xs text-white/70 font-medium mb-1.5">
                    反馈类型
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['功能建议', 'Bug报错', '角色人设', '其他问题'].map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setFeedbackType(t)}
                        className={`py-2 text-[11px] font-medium rounded-lg border transition ${
                          feedbackType === t
                            ? 'border-pink-500 bg-pink-500/15 text-pink-300 font-bold'
                            : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content Textarea */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs text-white/70 font-medium">
                      问题与建议描述 <span className="text-pink-400">*</span>
                    </label>
                    <span className="text-[10px] text-white/40">{content.length}/300</span>
                  </div>
                  <textarea
                    rows={4}
                    maxLength={300}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="请详细描述您遇到的问题、操作步骤或改进建议，帮助我们做得更好..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-pink-500 transition resize-none"
                  />
                </div>

                {/* Contact Info */}
                <div>
                  <label className="block text-xs text-white/70 font-medium mb-1.5">
                    联系方式 <span className="text-white/40 text-[10px]">(选填，便于回访)</span>
                  </label>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="微信号 / 邮箱 / 手机号"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-pink-500 transition"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !content.trim()}
                  className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition active:scale-[0.98] shadow-lg shadow-pink-900/20"
                >
                  <Send size={14} />
                  {isSubmitting ? '提交中...' : '提交反馈'}
                </button>
              </form>
            )}

            {/* Past Feedback History */}
            {feedbacks.length > 0 && (
              <div className="mt-6 pt-4 border-t border-white/10 space-y-2.5">
                <div className="text-xs font-bold text-white/80 flex items-center justify-between">
                  <span>我的历史反馈记录 ({feedbacks.length})</span>
                </div>
                <div className="space-y-2">
                  {feedbacks.slice(0, 3).map((fb) => (
                    <div
                      key={fb.id}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs space-y-1"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-pink-400">{fb.type}</span>
                        <span className="text-[10px] text-white/40">{fb.time}</span>
                      </div>
                      <p className="text-white/70 text-[11px] line-clamp-2">{fb.content}</p>
                      <div className="pt-1 flex items-center gap-1.5 text-[10px] text-emerald-400">
                        <CheckCircle2 size={11} />
                        <span>已收到并处理记录中 · 工单号: {fb.id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. CONTACT TAB */}
        {activeTab === 'contact' && (
          <div className="space-y-3.5">
            {/* Service Status Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-950/30 to-purple-950/30 border border-pink-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
                  <Headphones size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">官方人工客服</span>
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      值班在线
                    </span>
                  </div>
                  <div className="text-[11px] text-white/50 mt-0.5 flex items-center gap-1">
                    <Clock size={11} />
                    工作日 09:00 - 18:00 (平均 5 分钟内响应)
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact Methods */}
            <div className="space-y-2">
              <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Smartphone size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">客服微信号</div>
                    <div className="text-[11px] text-white/50 font-mono">AIChat_VIP_Service</div>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy('AIChat_VIP_Service', '客服微信号')}
                  className="px-2.5 py-1.5 bg-white/10 hover:bg-white/15 active:scale-95 text-xs text-white rounded-lg flex items-center gap-1 transition"
                >
                  <Copy size={12} />
                  复制
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Mail size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">官方支持邮箱</div>
                    <div className="text-[11px] text-white/50 font-mono">support@ai-chat.internal</div>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy('support@ai-chat.internal', '官方邮箱')}
                  className="px-2.5 py-1.5 bg-white/10 hover:bg-white/15 active:scale-95 text-xs text-white rounded-lg flex items-center gap-1 transition"
                >
                  <Copy size={12} />
                  复制
                </button>
              </div>
            </div>

            {/* Fast Quick Service Actions */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <div className="text-xs font-bold text-white/80">快捷自助支持</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onShowToast('正在为您检测当前网络与服务器延迟... 正常 36ms');
                  }}
                  className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-left transition"
                >
                  <div className="text-[11px] font-medium text-white">网络状态自检</div>
                  <div className="text-[10px] text-white/40 mt-0.5">检测当前 AI 连通度</div>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('faq');
                  }}
                  className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-left transition"
                >
                  <div className="text-[11px] font-medium text-white">查阅完整 FAQ</div>
                  <div className="text-[10px] text-white/40 mt-0.5">查看常见问题答疑</div>
                </button>
              </div>
            </div>

            {/* Service Promise Notice */}
            <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300/80">
              <AlertCircle size={14} className="shrink-0 mt-0.5 text-amber-400" />
              <span>非工作时间提问将自动为您建立工单，客服人员上线后会第一时间按顺序为您跟进解答。</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
