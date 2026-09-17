import React, { useState } from 'react';
import { X, Sparkles, Image as ImageIcon, Upload, Link, Trash2 } from 'lucide-react';
import { Role } from '../types';
import { CREATOR_AVATAR_PRESETS } from '../data/rolePortraits';

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSuccess: (role: Role) => void;
  onShowToast: (msg: string) => void;
}

export const CreateRoleModal: React.FC<CreateRoleModalProps> = ({
  isOpen,
  onClose,
  onCreateSuccess,
  onShowToast,
}) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState('✨');
  const [desc, setDesc] = useState('');
  const [tags, setTags] = useState('治愈, 倾听, 陪伴');
  const [topic1, setTopic1] = useState('今天过得开心吗？');
  const [topic2, setTopic2] = useState('有什么想和我聊聊的吗？');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const emojiOptions = ['✨', '🦊', '🐱', '🌹', '👑', '🧙', '🎀', '☕', '🕶️', '🌙', '🎧'];

  const activeAvatarUrl = customAvatarUrl.trim() || CREATOR_AVATAR_PRESETS[selectedPresetIndex]?.avatarUrl;
  const activePortraitUrl = customAvatarUrl.trim() || CREATOR_AVATAR_PRESETS[selectedPresetIndex]?.portraitUrl;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        onShowToast('图片文件大小不能超过 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setCustomAvatarUrl(result);
          onShowToast('🖼️ 本地照片上传成功！已设为角色形象');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = async () => {
    if (!name.trim() || !title.trim() || !desc.trim()) {
      onShowToast('请填写完整的角色名称、身份和人设！');
      return;
    }

    setLoading(true);
    const newRole: Role = {
      id: `custom_${Date.now()}`,
      name: name.trim(),
      title: title.trim(),
      emoji,
      cover: 'c-warm-senpai',
      desc: desc.trim(),
      tags: tags.split(/[,，]/).map((t) => t.trim()).filter(Boolean),
      topics: [topic1.trim(), topic2.trim()].filter(Boolean),
      users: '1',
      follows: '0',
      rating: 5.0,
      is_official: 0,
      is_followed: true,
      avatarUrl: activeAvatarUrl,
      portraitUrl: activePortraitUrl,
    };

    setTimeout(() => {
      setLoading(false);
      onCreateSuccess(newRole);
      onShowToast(`🎉 恭喜！新角色【${newRole.name}】已创建并上架！`);
      onClose();
    }, 400);
  };

  return (
    <div
      id="create-role-modal"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 select-none"
    >
      <div className="w-full max-w-md bg-[#0f0f18] border border-white/10 rounded-3xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-purple-400" />
            <h3 className="text-base font-bold text-white">创作全新AI角色</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 mt-4">
          {/* Preset Visual Avatar Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-white/80">角色立绘形象设置</label>
              <span className="text-[10px] text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30">
                支持相册上传/精选立绘
              </span>
            </div>

            {/* If custom image is set, show preview highlight banner */}
            {customAvatarUrl ? (
              <div className="mb-2.5 p-2 bg-purple-950/40 border border-purple-500/40 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src={customAvatarUrl}
                    alt="自选形象"
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-xl object-cover border border-purple-400/50 shrink-0"
                  />
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      <span>已应用自定义形象</span>
                      <span className="text-[10px] text-emerald-400 font-normal">已激活</span>
                    </div>
                    <div className="text-[10px] text-white/50 truncate max-w-[180px]">
                      {customAvatarUrl.startsWith('data:') ? '本地上传照片' : customAvatarUrl}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCustomAvatarUrl('')}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-rose-500/20 text-white/70 hover:text-rose-300 text-xs flex items-center gap-1 transition"
                  title="使用预设"
                >
                  <Trash2 size={13} />
                  <span className="text-[10px]">重置</span>
                </button>
              </div>
            ) : null}

            {/* Presets Grid */}
            <div className="grid grid-cols-6 gap-2 mb-2.5">
              {CREATOR_AVATAR_PRESETS.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedPresetIndex(idx);
                    setCustomAvatarUrl('');
                  }}
                  className={`h-14 rounded-xl overflow-hidden cursor-pointer relative border transition ${
                    selectedPresetIndex === idx && !customAvatarUrl
                      ? 'border-purple-500 ring-2 ring-purple-500/50 scale-105 z-10'
                      : 'border-white/10 opacity-60 hover:opacity-100'
                  }`}
                  title={preset.name}
                >
                  <img
                    src={preset.avatarUrl}
                    alt={preset.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              ))}
            </div>

            {/* Custom Upload / Link Action Row */}
            <div className="flex items-center gap-2">
              <label className="flex-1 py-2 px-3 rounded-xl bg-purple-600/25 hover:bg-purple-600/40 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95">
                <Upload size={14} className="text-purple-300" />
                <span>上传本地相册照片</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>

              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center gap-1 transition ${
                  showUrlInput || (customAvatarUrl && !customAvatarUrl.startsWith('data:'))
                    ? 'bg-white/15 border-purple-400/50 text-white'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/60'
                }`}
              >
                <Link size={13} />
                <span>URL链接</span>
              </button>
            </div>

            {/* Optional URL Input */}
            {(showUrlInput || (customAvatarUrl && !customAvatarUrl.startsWith('data:'))) && (
              <div className="mt-2 flex items-center gap-1.5 animate-in fade-in duration-150">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={customAvatarUrl.startsWith('data:') ? '' : customAvatarUrl}
                    onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    placeholder="粘贴网络图片链接 (https://...)"
                    className="w-full bg-white/5 border border-white/15 rounded-xl pl-8 pr-8 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-purple-500/80"
                  />
                  <Link size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40" />
                  {customAvatarUrl && (
                    <button
                      type="button"
                      onClick={() => setCustomAvatarUrl('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-white/40 hover:text-white"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Avatar Emoji Select */}
          <div>
            <label className="text-xs font-medium text-white/60 block mb-1.5">角色代表符号 (Emoji)</label>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {emojiOptions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setEmoji(item)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 transition ${
                    emoji === item
                      ? 'bg-purple-600/40 border-2 border-purple-500 scale-110'
                      : 'bg-white/5 hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Name & Title */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-white/60 block mb-1">角色姓名</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如: 楚子航"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/60"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-white/60 block mb-1">角色身份/头衔</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如: 冷酷学长 / 首席法医"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/60"
              />
            </div>
          </div>

          {/* Desc */}
          <div>
            <label className="text-xs font-medium text-white/60 block mb-1">人设描述与自白</label>
            <textarea
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="描述TA的性格、口癖、对用户的态度..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-purple-500/60 resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-medium text-white/60 block mb-1">性格标签 (逗号分隔)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="高冷, 护短, 禁欲"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/60"
            />
          </div>

          {/* Opening Starters */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-white/60 block">开场备选话题</label>
            <input
              type="text"
              value={topic1}
              onChange={(e) => setTopic1(e.target.value)}
              placeholder="话题1"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500/60"
            />
            <input
              type="text"
              value={topic2}
              onChange={(e) => setTopic2(e.target.value)}
              placeholder="话题2"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500/60"
            />
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-sm font-medium transition"
          >
            取消
          </button>
          <button
            onClick={handleCreate}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold shadow-md shadow-purple-500/25 active:scale-95 transition disabled:opacity-50"
          >
            {loading ? '发布中...' : '立即发布角色'}
          </button>
        </div>
      </div>
    </div>
  );
};
