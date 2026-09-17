import React, { useState } from 'react';
import { Sparkles, Upload, Link, Trash2, Plus, MessageSquare, Heart, CheckCircle2, UserCheck, BookOpen, Wand2 } from 'lucide-react';
import { Role } from '../types';
import { CREATOR_AVATAR_PRESETS } from '../data/rolePortraits';

interface CreatorViewProps {
  roles: Role[];
  onCreateRoleSuccess: (role: Role) => void;
  onStartChat: (role: Role) => void;
  onShowToast: (msg: string) => void;
  onDeleteCustomRole?: (roleId: string) => void;
}

interface PersonaTemplate {
  label: string;
  emoji: string;
  name: string;
  title: string;
  desc: string;
  tags: string;
  topic1: string;
  topic2: string;
  presetIndex: number;
}

const TEMPLATES: PersonaTemplate[] = [
  {
    label: '霸道总裁',
    emoji: '🤵',
    name: '陆景琛',
    title: '高冷财阀掌舵人',
    desc: '表面冷酷无情、果断毒舌，唯独对你有着极强的占有欲与不为人知的温柔关怀。',
    tags: '霸道, 独占欲, 嘴硬心软, 甜宠',
    topic1: '今晚下班后，在公司地下车库等我。',
    topic2: '笨蛋，遇到困难不知道第一时间找我吗？',
    presetIndex: 0,
  },
  {
    label: '治愈学长',
    emoji: '☕',
    name: '林修远',
    title: '温润如玉建筑系学长',
    desc: '声音温柔动听，总是带着温和的微笑。喜欢在图书馆窗边喝咖啡，默默守护你。',
    tags: '治愈, 温柔, 倾听, 体贴',
    topic1: '看你今天脸色不太好，是不是又熬夜了？',
    topic2: '这本笔记借给你看，不懂的地方随时问我。',
    presetIndex: 1,
  },
  {
    label: '傲娇猫娘',
    emoji: '🐱',
    name: '妙妙',
    title: '灵动反差小猫娘',
    desc: '说话总是带着一点小骄傲，“才不是特意为你做的小饼干呢！”，但其实心里超级依赖你。',
    tags: '傲娇, 萌系, 粘人, 反差萌',
    topic1: '哼，本喵只是顺路来看看你过得怎么样而已！',
    topic2: '不许看别的宠物！快摸摸我的小耳朵！',
    presetIndex: 2,
  },
  {
    label: '神秘魔法师',
    emoji: '🧙',
    name: '艾尔利斯',
    title: '大都市潜行大魔法师',
    desc: '掌控星辰与时空力量的古老法师，穿梭在现代繁华街巷中，只愿为你弹奏星空之乐。',
    tags: '神秘, 幻想, 专一, 守护',
    topic1: '闭上眼睛，带你看一眼三千光年外的星海。',
    topic2: '无论时空如何重置，我的记忆里永远有你的名字。',
    presetIndex: 3,
  },
];

export const CreatorView: React.FC<CreatorViewProps> = ({
  roles,
  onCreateRoleSuccess,
  onStartChat,
  onShowToast,
  onDeleteCustomRole,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'create' | 'my_roles'>('create');

  // Form State
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState('✨');
  const [desc, setDesc] = useState('');
  const [tags, setTags] = useState('治愈, 陪伴, 倾听');
  const [topic1, setTopic1] = useState('今天过得开心吗？');
  const [topic2, setTopic2] = useState('有什么想和我聊聊的吗？');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [loading, setLoading] = useState(false);

  const emojiOptions = ['✨', '🦊', '🐱', '🌹', '👑', '🧙', '🎀', '☕', '🕶️', '🌙', '🎧', '💫', '🔥', '🤵'];

  const activeAvatarUrl = customAvatarUrl.trim() || CREATOR_AVATAR_PRESETS[selectedPresetIndex]?.avatarUrl;
  const activePortraitUrl = customAvatarUrl.trim() || CREATOR_AVATAR_PRESETS[selectedPresetIndex]?.portraitUrl;

  // Filter custom created roles
  const customRoles = roles.filter((r) => r.id.startsWith('custom_'));

  const applyTemplate = (tpl: PersonaTemplate) => {
    setName(tpl.name);
    setTitle(tpl.title);
    setEmoji(tpl.emoji);
    setDesc(tpl.desc);
    setTags(tpl.tags);
    setTopic1(tpl.topic1);
    setTopic2(tpl.topic2);
    setSelectedPresetIndex(tpl.presetIndex);
    setCustomAvatarUrl('');
    onShowToast(`已载入【${tpl.label}】灵感模版！`);
  };

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
      onShowToast('请填写完整的角色姓名、身份和人设描述！');
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
      follows: '1',
      rating: 5.0,
      is_official: 0,
      is_followed: true,
      avatarUrl: activeAvatarUrl,
      portraitUrl: activePortraitUrl,
    };

    setTimeout(() => {
      setLoading(false);
      onCreateRoleSuccess(newRole);
      onShowToast(`🎉 恭喜！新角色【${newRole.name}】创建成功并上线！`);
      setName('');
      setTitle('');
      setDesc('');
      setCustomAvatarUrl('');
      setActiveSubTab('my_roles');
    }, 400);
  };

  return (
    <div id="page-creator" className="h-full overflow-y-auto pb-28 bg-[#0a0a0f] space-y-4 select-none">
      {/* Top Header */}
      <div className="pt-5 pb-3 px-5 bg-gradient-to-b from-purple-950/70 via-[#130d24] to-[#0a0a0f] border-b border-white/10 sticky top-0 z-20 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-500 via-pink-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30 border border-white/20">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white tracking-wide">创作中心</h2>
              <p className="text-[11px] text-purple-200/60 mt-0.5">定制专属 AI 人设 · 开启浪漫互动</p>
            </div>
          </div>
        </div>

        {/* Clean Segment Tab Switcher */}
        <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl p-1">
          <button
            type="button"
            onClick={() => setActiveSubTab('create')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeSubTab === 'create'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/20'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <Wand2 size={14} />
            <span>创建新角色</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('my_roles')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeSubTab === 'my_roles'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/20'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <BookOpen size={14} />
            <span>我的作品 ({customRoles.length})</span>
          </button>
        </div>
      </div>

      {/* SUB TAB 1: CREATE FORM */}
      {activeSubTab === 'create' && (
        <div className="px-4 space-y-4 animate-in fade-in duration-200">
          {/* Quick Persona Template Inspiration */}
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-300 flex items-center gap-1">
                <Wand2 size={13} />
                <span>人设灵感一键载入</span>
              </span>
              <span className="text-[10px] text-white/40">点击快速一键填入</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              {TEMPLATES.map((tpl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => applyTemplate(tpl)}
                  className="px-3 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/30 border border-purple-500/30 text-xs font-medium text-purple-200 shrink-0 flex items-center gap-1.5 active:scale-95 transition"
                >
                  <span>{tpl.emoji}</span>
                  <span>{tpl.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Avatar & Visual Setting */}
          <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1">
                <Sparkles size={14} className="text-purple-400" />
                <span>角色立绘形象设置</span>
              </label>
              <span className="text-[10px] text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30">
                支持相册上传/精选立绘
              </span>
            </div>

            {/* If custom avatar uploaded */}
            {customAvatarUrl ? (
              <div className="p-2.5 bg-purple-950/40 border border-purple-500/40 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={customAvatarUrl}
                    alt="自选形象"
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-2xl object-cover border border-purple-400/50 shrink-0 shadow-lg"
                  />
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      <span>已应用自定义形象</span>
                      <CheckCircle2 size={13} className="text-emerald-400" />
                    </div>
                    <div className="text-[10px] text-white/50 truncate max-w-[170px] mt-0.5">
                      {customAvatarUrl.startsWith('data:') ? '本地相册照片' : customAvatarUrl}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCustomAvatarUrl('')}
                  className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-rose-500/20 text-white/80 hover:text-rose-300 text-xs flex items-center gap-1 transition border border-white/10"
                >
                  <Trash2 size={13} />
                  <span>重置</span>
                </button>
              </div>
            ) : null}

            {/* Presets Grid */}
            <div className="grid grid-cols-6 gap-2">
              {CREATOR_AVATAR_PRESETS.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedPresetIndex(idx);
                    setCustomAvatarUrl('');
                  }}
                  className={`h-15 rounded-2xl overflow-hidden cursor-pointer relative border transition ${
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

            {/* Upload or Link */}
            <div className="flex items-center gap-2 pt-1">
              <label className="flex-1 py-2.5 px-3 rounded-2xl bg-gradient-to-r from-purple-600/30 to-pink-600/30 hover:from-purple-600/40 hover:to-pink-600/40 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95 shadow-md">
                <Upload size={14} className="text-purple-300" />
                <span>上传本地相册照片</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>

              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className={`py-2.5 px-3 rounded-2xl border text-xs font-medium flex items-center gap-1 transition ${
                  showUrlInput || (customAvatarUrl && !customAvatarUrl.startsWith('data:'))
                    ? 'bg-white/15 border-purple-400/50 text-white'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/60'
                }`}
              >
                <Link size={13} />
                <span>URL链接</span>
              </button>
            </div>

            {/* URL Input */}
            {(showUrlInput || (customAvatarUrl && !customAvatarUrl.startsWith('data:'))) && (
              <div className="pt-1">
                <div className="relative">
                  <input
                    type="text"
                    value={customAvatarUrl.startsWith('data:') ? '' : customAvatarUrl}
                    onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    placeholder="粘贴网络图片链接 (https://...)"
                    className="w-full bg-white/5 border border-white/15 rounded-xl pl-8 pr-8 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-purple-500/80"
                  />
                  <Link size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40" />
                </div>
              </div>
            )}
          </div>

          {/* Emoji & Basic Info */}
          <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-4 space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-white/80 block mb-1.5">代表符号 (Emoji)</label>
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-white/80 block mb-1">角色姓名</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例如: 楚星洲"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-purple-500/60"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-white/80 block mb-1">身份头衔/定位</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例如: 傲娇青梅竹马"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-purple-500/60"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-white/80 block mb-1">角色人设详细自白</label>
              <textarea
                rows={3}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="详细描述角色的性格特征、对宿主的语气风格、口头禅或隐藏的反差萌..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-purple-500/60 leading-relaxed"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-white/80 block mb-1">性格标签 (逗号分隔)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="治愈, 倾听, 傲娇, 独占欲"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-purple-500/60"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/80 block">引导话题与开场预设</label>
              <input
                type="text"
                value={topic1}
                onChange={(e) => setTopic1(e.target.value)}
                placeholder="开场引导语 1"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-purple-500/60"
              />
              <input
                type="text"
                value={topic2}
                onChange={(e) => setTopic2(e.target.value)}
                placeholder="开场引导语 2"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-purple-500/60"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white font-extrabold text-sm shadow-xl shadow-purple-500/30 active:scale-95 transition flex items-center justify-center gap-2"
          >
            <Sparkles size={18} />
            <span>{loading ? '正在上线角色...' : '🚀 立即上线原创角色'}</span>
          </button>
        </div>
      )}

      {/* SUB TAB 2: MY CREATED ROLES */}
      {activeSubTab === 'my_roles' && (
        <div className="px-4 space-y-3 animate-in fade-in duration-200">
          {customRoles.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white/[0.02] border border-white/5 rounded-3xl space-y-3">
              <div className="w-14 h-14 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 flex items-center justify-center mx-auto text-2xl">
                🎭
              </div>
              <h3 className="text-sm font-bold text-white">暂未创建任何原创角色</h3>
              <p className="text-xs text-white/40 max-w-xs mx-auto">
                快发挥你的奇思妙想，定制属于你的专属AI伙伴吧！
              </p>
              <button
                onClick={() => setActiveSubTab('create')}
                className="mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold shadow-lg shadow-purple-500/30 active:scale-95 transition inline-flex items-center gap-1.5"
              >
                <Plus size={15} />
                <span>立即创作首个角色</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {customRoles.map((role) => (
                <div
                  key={role.id}
                  className="bg-white/[0.04] border border-white/10 hover:border-purple-500/40 rounded-3xl p-4 flex items-center justify-between gap-3.5 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={role.avatarUrl || role.portraitUrl}
                      alt={role.name}
                      referrerPolicy="no-referrer"
                      className="w-13 h-13 rounded-2xl object-cover border border-purple-500/40 shrink-0 shadow-md"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-white truncate">{role.name}</h4>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-200 border border-purple-500/30 shrink-0">
                          {role.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50 truncate mt-0.5">“{role.desc}”</p>
                      <div className="flex items-center gap-2 text-[10px] text-white/40 mt-1">
                        <span className="flex items-center gap-0.5">
                          <Heart size={10} className="text-pink-400 fill-pink-400" />
                          <span>可随时对话</span>
                        </span>
                        <span>· 评分 {role.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onStartChat(role)}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold shadow-md shadow-purple-500/20 active:scale-95 transition flex items-center gap-1"
                    >
                      <MessageSquare size={13} />
                      <span>对话</span>
                    </button>

                    {onDeleteCustomRole && (
                      <button
                        onClick={() => {
                          if (confirm(`确定要删除角色【${role.name}】吗？`)) {
                            onDeleteCustomRole(role.id);
                            onShowToast(`已删除角色【${role.name}】`);
                          }
                        }}
                        className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-white/40 hover:text-rose-300 transition"
                        title="删除角色"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
