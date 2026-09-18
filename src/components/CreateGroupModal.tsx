import React, { useState } from 'react';
import { Role } from '../types';
import { X, Users, Sparkles, Check, Wand2, Plus } from 'lucide-react';
import { RoleAvatar } from './RoleAvatar';
import { ROLE_MEDIA_MAP } from '../data/rolePortraits';

interface CreateGroupModalProps {
  roles: Role[];
  onClose: () => void;
  onCreateGroup: (name: string, topic: string, roleIds: string[]) => void;
  onShowToast: (msg: string) => void;
}

const PRESET_GROUPS = [
  {
    name: '👑 豪门吃醋修罗场',
    topic: '极具嫉妒心的豪门角色聚在一起，因你展开暗流涌动的交锋',
    roleIds: ['1', '2', '8'], // 陆景琛, 林修远, 许逸
  },
  {
    name: '🍵 治愈深夜茶话会',
    topic: '倾听你的烦恼，温柔陪伴度过每一个难眠之夜',
    roleIds: ['2', '3', '7'], // 林修远, 林小柔, 沈星瑶
  },
  {
    name: '🎮 顶尖电竞开黑车队',
    topic: '全员大神聚集，商讨战术，带你在峡谷/赛场上分',
    roleIds: ['6', '5', '1'], // 沈凉, 楚言, 陆景琛
  },
  {
    name: '✨ 奇幻魔导师联盟',
    topic: '跨越次元与时空的大魔导师与神仙小聚会',
    roleIds: ['4', '1', '2'], // 艾尔利斯...
  },
];

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  roles,
  onClose,
  onCreateGroup,
  onShowToast,
}) => {
  const [groupName, setGroupName] = useState('');
  const [topic, setTopic] = useState('');
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>(['1', '2']);

  const toggleRoleSelection = (roleId: string) => {
    if (selectedRoleIds.includes(roleId)) {
      if (selectedRoleIds.length <= 2) {
        onShowToast('群聊至少需要保留 2 位 AI 角色哦！');
        return;
      }
      setSelectedRoleIds(selectedRoleIds.filter((id) => id !== roleId));
    } else {
      if (selectedRoleIds.length >= 6) {
        onShowToast('单次群聊最多选择 6 位 AI 角色！');
        return;
      }
      setSelectedRoleIds([...selectedRoleIds, roleId]);
    }
  };

  const applyPreset = (preset: typeof PRESET_GROUPS[0]) => {
    setGroupName(preset.name);
    setTopic(preset.topic);
    // filter valid role ids
    const validIds = preset.roleIds.filter((id) => roles.some((r) => r.id === id));
    if (validIds.length >= 2) {
      setSelectedRoleIds(validIds);
    } else {
      setSelectedRoleIds(roles.slice(0, 3).map((r) => r.id));
    }
    onShowToast(`已载入【${preset.name}】群预设！`);
  };

  const handleCreate = () => {
    if (!groupName.trim()) {
      onShowToast('请输入群聊名称！');
      return;
    }
    if (selectedRoleIds.length < 2) {
      onShowToast('请至少选择 2 位 AI 角色加入群聊！');
      return;
    }
    onCreateGroup(groupName.trim(), topic.trim(), selectedRoleIds);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#141221] border border-purple-500/30 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-purple-950/60 via-purple-900/40 to-pink-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
              <Users size={18} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">发起多角 AI 派对群聊</h2>
              <p className="text-[11px] text-purple-300/70">让多位心动角色同时与你热聊、修罗场碰撞</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Preset Party Quick Chips */}
          <div className="space-y-1.5">
            <label className="text-white/70 font-bold flex items-center gap-1">
              <Wand2 size={13} className="text-purple-400" />
              <span>一键预设经典派对剧情：</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_GROUPS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="p-2.5 rounded-2xl bg-white/[0.04] hover:bg-purple-500/15 border border-white/10 hover:border-purple-500/40 text-left transition active:scale-95 cursor-pointer group"
                >
                  <div className="font-bold text-purple-200 group-hover:text-purple-300 truncate">
                    {preset.name}
                  </div>
                  <div className="text-[10px] text-white/40 truncate mt-0.5">{preset.topic}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Group Title & Topic Input */}
          <div className="space-y-3 bg-white/[0.03] border border-white/10 p-3.5 rounded-2xl">
            <div>
              <label className="text-white/80 font-bold block mb-1">
                群聊名称 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="例：修罗场·我的后宫们 / 豪门吃醋群"
                className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-purple-500 transition"
              />
            </div>
            <div>
              <label className="text-white/80 font-bold block mb-1">
                剧情设定 / 聊天主题 <span className="text-white/40 font-normal">(可选)</span>
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="例：在豪门酒会上，大家发现你同时答应了多人的约会..."
                className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-purple-500 transition"
              />
            </div>
          </div>

          {/* Member Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-white/80 font-bold flex items-center gap-1.5">
                <span>选择入群 AI 角色</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-extrabold border border-purple-500/30">
                  已选 {selectedRoleIds.length} / 6
                </span>
              </label>
              <span className="text-[10px] text-white/40">点击勾选/取消</span>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {roles.map((r) => {
                const isSelected = selectedRoleIds.includes(r.id);
                return (
                  <div
                    key={r.id}
                    onClick={() => toggleRoleSelection(r.id)}
                    className={`p-2 rounded-2xl border flex items-center gap-2.5 cursor-pointer transition ${
                      isSelected
                        ? 'bg-purple-600/20 border-purple-500 text-white shadow-md shadow-purple-900/30'
                        : 'bg-white/[0.03] border-white/10 text-white/60 hover:bg-white/5'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <RoleAvatar
                        name={r.name}
                        avatarUrl={ROLE_MEDIA_MAP[r.id]?.avatarUrl || r.avatarUrl}
                        emoji={r.emoji}
                        coverClass={r.cover}
                        size="md"
                      />
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-500 text-white flex items-center justify-center text-[9px]">
                          <Check size={10} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs truncate text-white">{r.name}</div>
                      <div className="text-[10px] text-white/40 truncate">{r.title}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-[#0d0b17] flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 font-bold text-xs transition cursor-pointer"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleCreate}
            className="flex-[2] py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-xs shadow-lg shadow-purple-500/25 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            <Sparkles size={14} />
            <span>开启多角 AI 群聊</span>
          </button>
        </div>
      </div>
    </div>
  );
};
