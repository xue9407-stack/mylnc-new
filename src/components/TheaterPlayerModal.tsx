import React, { useState, useEffect } from 'react';
import { X, Volume2, VolumeX, Sparkles, Send, Clapperboard, Heart, Image as ImageIcon, Play, Pause } from 'lucide-react';
import { MiniTheaterItem, Role, TheaterScene } from '../types';

interface TheaterPlayerModalProps {
  isOpen: boolean;
  role: Role;
  theater: MiniTheaterItem | null;
  onClose: () => void;
  onShowToast: (msg: string) => void;
  onStartChat: (role: Role, prompt?: string) => void;
}

export const TheaterPlayerModal: React.FC<TheaterPlayerModalProps> = ({
  isOpen,
  role,
  theater,
  onClose,
  onShowToast,
  onStartChat,
}) => {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [customReply, setCustomReply] = useState('');
  const [extraDialogueLogs, setExtraDialogueLogs] = useState<Array<{ speaker: string; text: string }>>([]);

  useEffect(() => {
    setCurrentSceneIdx(0);
    setIsPlayingVoice(false);
    setExtraDialogueLogs([]);
  }, [theater?.id]);

  if (!isOpen || !theater) return null;

  const currentScene: TheaterScene = theater.scenes[currentSceneIdx] || theater.scenes[0];

  // Speech TTS Player
  const toggleVoice = () => {
    if (isPlayingVoice) {
      window.speechSynthesis?.cancel();
      setIsPlayingVoice(false);
      return;
    }

    if (!('speechSynthesis' in window)) {
      onShowToast('当前浏览器暂不支持原声语音播放，改用文字配音');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentScene.dialogue);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsPlayingVoice(false);
    utterance.onerror = () => setIsPlayingVoice(false);

    setIsPlayingVoice(true);
    window.speechSynthesis.speak(utterance);
    onShowToast(`🔊 正在播放【${role.name}】的小剧场角色原声配音……`);
  };

  const handleChooseOption = (optText: string) => {
    setExtraDialogueLogs((prev) => [
      ...prev,
      { speaker: '你', text: optText },
      {
        speaker: role.name,
        text: `（凝视着你，目光中温存万千）“既然你选择了‘${optText}’，那从现在起，我的所有决定都为你倾斜。”`,
      },
    ]);
    onShowToast('互动抉择已推高小剧场剧情！');
  };

  const handleSendCustomReply = () => {
    const trimmed = customReply.trim();
    if (!trimmed) return;
    setExtraDialogueLogs((prev) => [
      ...prev,
      { speaker: '你', text: trimmed },
      {
        speaker: role.name,
        text: `（轻声倾身靠近，在你耳畔回应）“你的话……我都记在心里了。接下来这一幕，由我们共同开启。”`,
      },
    ]);
    setCustomReply('');
    onShowToast('剧场互动文字已录入，驱动场景变幻！');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-4 animate-fadeIn select-none">
      <div className="w-full max-w-lg h-[90vh] bg-[#0c0a17] border border-purple-500/40 rounded-3xl overflow-hidden flex flex-col shadow-2xl relative">
        {/* Top Atmosphere Background & Dynamic Visual */}
        <div className="relative h-64 w-full bg-slate-900 overflow-hidden shrink-0">
          <img
            src={theater.bgImage || 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&auto=format&fit=crop&q=80'}
            alt="Theater Background"
            className="w-full h-full object-cover filter brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a17] via-[#0c0a17]/40 to-black/30" />

          {/* Dynamic GIF / Photo Frame Overlay */}
          <div className="absolute bottom-3 right-4 w-28 h-20 rounded-2xl overflow-hidden border-2 border-purple-400/50 shadow-2xl bg-black/40 backdrop-blur-sm group">
            <img
              src={theater.dynamicGif || theater.bgImage}
              alt="Dynamic Scene"
              className="w-full h-full object-cover filter group-hover:scale-110 transition duration-500"
            />
            <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] text-purple-300 font-mono font-bold">
              GIF 动态场景
            </div>
          </div>

          {/* Top Header Buttons */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-bold">
              <Clapperboard size={14} className="text-purple-400" />
              <span>{theater.title}</span>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 text-white flex items-center justify-center transition border border-white/10"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Dialogue & Scene Interactive Area */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 relative z-10 bg-[#0c0a17]">
          {/* Role Speaker Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-0.5 shadow-md">
                <div className="w-full h-full rounded-full bg-[#161329] overflow-hidden flex items-center justify-center text-lg">
                  {role.avatarUrl ? (
                    <img src={role.avatarUrl} alt={role.name} className="w-full h-full object-cover" />
                  ) : (
                    role.emoji
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                  <span>{currentScene.speaker}</span>
                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-purple-500/20 text-purple-300 font-normal">
                    剧场主角
                  </span>
                </h4>
                <p className="text-[10px] text-white/40">实时文字演绎 + 背景原画 + 独白配音</p>
              </div>
            </div>

            {/* Voice Speech Button */}
            <button
              onClick={toggleVoice}
              className={`px-3 py-1.5 rounded-full border text-xs font-bold flex items-center gap-1.5 transition active:scale-95 ${
                isPlayingVoice
                  ? 'bg-pink-600 text-white border-pink-400 shadow-lg shadow-pink-600/30 animate-pulse'
                  : 'bg-purple-600/20 hover:bg-purple-600/40 text-purple-200 border-purple-500/30'
              }`}
            >
              {isPlayingVoice ? <VolumeX size={14} /> : <Volume2 size={14} />}
              <span>{isPlayingVoice ? '播放原音中…' : '🔊 点击听角色配音'}</span>
            </button>
          </div>

          {/* Current Scene Main Dialogue Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 via-[#18142e] to-purple-950/20 border border-purple-500/30 shadow-lg space-y-2">
            <p className="text-xs text-purple-100/90 leading-relaxed font-light">
              {currentScene.dialogue}
            </p>
          </div>

          {/* Choices Options */}
          {currentScene.choices && currentScene.choices.length > 0 && (
            <div className="space-y-2 pt-1">
              <div className="text-[11px] font-bold text-purple-300/80 flex items-center gap-1">
                <Sparkles size={13} />
                <span>输入或选择文字互动，影响故事发展：</span>
              </div>
              <div className="space-y-1.5">
                {currentScene.choices.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleChooseOption(opt)}
                    className="w-full p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/10 text-xs text-white/80 text-left transition flex items-center justify-between active:scale-[0.99]"
                  >
                    <span>💬 {opt}</span>
                    <span className="text-[10px] text-purple-400">选择 ›</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Extra Dialogue Logs */}
          {extraDialogueLogs.length > 0 && (
            <div className="pt-3 border-t border-white/10 space-y-2.5">
              {extraDialogueLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    log.speaker === '你'
                      ? 'bg-pink-600/20 text-pink-200 border border-pink-500/30 ml-6 text-right'
                      : 'bg-purple-900/30 text-purple-100 border border-purple-500/30 mr-6'
                  }`}
                >
                  <span className="font-bold block mb-0.5 text-[10px] text-white/50">{log.speaker}:</span>
                  {log.text}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Text Reply Input */}
        <div className="p-3.5 bg-[#141126] border-t border-white/10 space-y-2 shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="输入文字互动，配音与剧场即刻随你变幻……"
              value={customReply}
              onChange={(e) => setCustomReply(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendCustomReply()}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={handleSendCustomReply}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-xl transition flex items-center gap-1"
            >
              <Send size={13} />
              <span>发送</span>
            </button>
          </div>

          <p className="text-[10px] text-white/40 text-center">
            文字互动支持自创对白 · 根据叙述触发丰富多媒体效果
          </p>
        </div>
      </div>
    </div>
  );
};
