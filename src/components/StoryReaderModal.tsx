import React, { useState } from 'react';
import { X, BookOpen, Sparkles, Send, ArrowRight, Heart, Share2, CheckCircle2 } from 'lucide-react';
import { StoryLineItem, Role } from '../types';

interface StoryReaderModalProps {
  isOpen: boolean;
  role: Role;
  story: StoryLineItem | null;
  onClose: () => void;
  onShowToast: (msg: string) => void;
  onStartChat: (role: Role, prompt?: string) => void;
}

export const StoryReaderModal: React.FC<StoryReaderModalProps> = ({
  isOpen,
  role,
  story,
  onClose,
  onShowToast,
  onStartChat,
}) => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [customInput, setCustomInput] = useState('');
  const [interactiveLogs, setInteractiveLogs] = useState<Array<{ type: 'user' | 'response'; text: string }>>([]);
  const [likes, setLikes] = useState(128);
  const [isLiked, setIsLiked] = useState(false);

  if (!isOpen || !story) return null;

  const handleChoiceClick = (text: string, response: string) => {
    setSelectedChoice(text);
    setInteractiveLogs((prev) => [
      ...prev,
      { type: 'user', text },
      { type: 'response', text: response },
    ]);
    onShowToast('✨ 决策已生效，故事向新方向延伸！');
  };

  const handleSendCustomInput = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    setInteractiveLogs((prev) => [
      ...prev,
      { type: 'user', text: trimmed },
      {
        type: 'response',
        text: `【${role.name}】听完你的话，眼中掠过一丝温软，柔声说道：“你说得对，接下来无论发生什么，我们都一起面对。”`,
      },
    ]);
    setCustomInput('');
    onShowToast('互动成功，故事续写中……');
  };

  const toggleLike = () => {
    if (isLiked) {
      setLikes((l) => l - 1);
      setIsLiked(false);
    } else {
      setLikes((l) => l + 1);
      setIsLiked(true);
      onShowToast('感谢为你喜爱的故事点赞！');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-lg h-[88vh] bg-[#12111d] border border-purple-500/30 rounded-3xl overflow-hidden flex flex-col shadow-2xl relative">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-purple-900/40 via-[#181628] to-purple-900/40 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-purple-600/30 text-purple-300 border border-purple-400/30 flex items-center justify-center text-sm font-bold">
              <BookOpen size={18} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">{story.title}</h3>
              <p className="text-[10px] text-purple-300/70">
                角色故事线 · {story.wordCount}字 · {story.author}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleLike}
              className={`p-2 rounded-full border transition ${
                isLiked
                  ? 'bg-pink-500/20 text-pink-400 border-pink-500/40'
                  : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
              }`}
            >
              <Heart size={15} className={isLiked ? 'fill-pink-500' : ''} />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Story Text Flow */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 text-sm leading-relaxed text-white/90 font-light select-text">
          <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/20 text-xs text-purple-200 leading-relaxed font-normal">
            💡 <span className="font-bold">纯文字互动故事线：</span>
            本故事为沉浸式纯文字小说，你的每一次选择与互动回复，都会影响故事的下一步走向！
          </div>

          {story.paragraphs.map((para, idx) => (
            <p key={idx} className="indent-6 text-white/85 hover:text-white transition">
              {para}
            </p>
          ))}

          {/* Interactive Choices */}
          {story.choices && story.choices.length > 0 && (
            <div className="pt-4 border-t border-white/10 space-y-2.5">
              <div className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                <Sparkles size={14} />
                <span>选择你的剧情支线抉择：</span>
              </div>

              <div className="space-y-2">
                {story.choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => handleChoiceClick(choice.text, choice.response)}
                    className={`w-full p-3 rounded-2xl border text-xs text-left transition flex items-center justify-between group active:scale-[0.99] ${
                      selectedChoice === choice.text
                        ? 'bg-purple-600/30 border-purple-400 text-purple-100'
                        : 'bg-white/[0.03] border-white/10 hover:bg-white/10 text-white/80'
                    }`}
                  >
                    <span>👉 {choice.text}</span>
                    <ArrowRight size={14} className="text-purple-400 group-hover:translate-x-1 transition shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Logs */}
          {interactiveLogs.length > 0 && (
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="text-xs font-bold text-pink-300">最新互动衍伸片段：</div>
              {interactiveLogs.map((log, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    log.type === 'user'
                      ? 'bg-pink-600/20 border border-pink-500/30 text-pink-200 ml-6 text-right'
                      : 'bg-purple-900/30 border border-purple-500/30 text-purple-100 mr-6'
                  }`}
                >
                  {log.type === 'user' ? `你：${log.text}` : log.text}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Input & Actions */}
        <div className="p-3.5 bg-[#171526] border-t border-white/10 space-y-2 shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={`跟【${role.name}】输入文本互动，影响剧情……`}
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendCustomInput()}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={handleSendCustomInput}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
            >
              <Send size={13} />
              <span>发送</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-white/40 pt-1">
            <span>支持任意自定义文本推动剧情发展</span>
            <button
              onClick={() => {
                onClose();
                onStartChat(role, `关于故事《${story.title}》，我想继续和你细聊一下……`);
              }}
              className="text-purple-300 hover:underline flex items-center gap-1"
            >
              带入此故事进入主线聊天室 ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
