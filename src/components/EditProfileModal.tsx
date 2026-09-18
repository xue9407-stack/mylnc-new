import React, { useState, useRef } from 'react';
import { ChevronLeft, Camera, Check } from 'lucide-react';
import { UserProfile } from '../types';

interface EditProfileModalProps {
  isOpen: boolean;
  userProfile: UserProfile;
  onClose: () => void;
  onSave: (updatedProfile: Partial<UserProfile>) => void;
  onShowToast: (msg: string) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  userProfile,
  onClose,
  onSave,
  onShowToast,
}) => {
  const [nickname, setNickname] = useState(userProfile.nickname || '小星星oAJICM08');
  const [avatar, setAvatar] = useState(userProfile.avatar || '😊');
  const [gender, setGender] = useState(userProfile.gender || '保密');
  const [bio, setBio] = useState(userProfile.bio || '');
  
  const [showGenderModal, setShowGenderModal] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle Local File Selection for Avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        onShowToast('图片文件大小请控制在 8MB 以内');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setAvatar(result);
        onShowToast('头像已载入，点击保存生效 ✨');
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Background Image Upload
  const handleBgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        onShowToast('图片文件大小请控制在 8MB 以内');
        return;
      }
      onShowToast('背景图载入成功！点击保存生效 ✨');
    }
  };

  const handleSave = () => {
    const trimmedNick = nickname.trim();
    if (!trimmedNick) {
      onShowToast('❌ 名字不能为空');
      return;
    }

    onSave({
      nickname: trimmedNick,
      avatar,
      gender,
      bio,
    });

    onShowToast('✨ 资料保存成功！');
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#000000]/60 backdrop-blur-md flex items-center justify-center overflow-hidden animate-fadeIn">
      {/* Centered Phone Shape Container */}
      <div className="w-full max-w-[420px] h-full bg-[#0b0b12] text-white flex flex-col relative overflow-hidden sm:shadow-[0_25px_60px_rgba(0,0,0,0.8)] sm:border-x sm:border-white/10 animate-slideUp">
        
        {/* Top Bar matching Mobile App */}
        <div className="px-4 py-3.5 flex items-center justify-between border-b border-white/5 shrink-0 bg-[#0b0b12] relative z-10">
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center text-white/80 hover:text-white transition cursor-pointer"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-base font-bold text-white tracking-wide">编辑资料</h2>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xs shadow-md shadow-pink-500/20 hover:opacity-95 active:scale-95 transition cursor-pointer"
          >
            保存
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar pb-8 bg-[#0b0b12]">
          
          {/* Avatar Section */}
          <div className="flex flex-col items-center justify-center pt-4 pb-2">
            <div
              onClick={() => avatarInputRef.current?.click()}
              className="relative w-28 h-28 rounded-3xl bg-white/[0.03] border border-white/10 shadow-xl overflow-hidden cursor-pointer group flex items-center justify-center transition hover:scale-105"
            >
              {avatar && (avatar.startsWith('http') || avatar.startsWith('data:')) ? (
                <img src={avatar} alt="avatar preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl">{avatar || '😊'}</span>
              )}

              {/* Camera Overlay Badge (matching image) */}
              <div className="absolute bottom-2.5 right-2.5 w-7 h-7 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center shadow-md border border-[#0b0b12]">
                <Camera size={14} className="fill-current" />
              </div>
            </div>
            <span className="text-[11px] text-white/30 mt-3.5">点击更换头像照片</span>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          {/* Group 1: Standard Details Card (Matching Reference Screen) */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl divide-y divide-white/5 overflow-hidden">
            
            {/* 名字 */}
            <div className="p-4 flex items-center justify-between hover:bg-white/[0.01] transition">
              <label className="text-xs text-white/80 font-semibold w-20 shrink-0">名字</label>
              <div className="flex-1 flex items-center justify-end gap-1.5 min-w-0">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="请输入您的名字"
                  className="w-full bg-transparent text-right text-xs text-white placeholder-white/20 focus:outline-none font-medium truncate"
                />
                <span className="text-white/20 text-sm shrink-0">›</span>
              </div>
            </div>

            {/* 性别 */}
            <div
              onClick={() => setShowGenderModal(true)}
              className="p-4 flex items-center justify-between hover:bg-white/[0.01] cursor-pointer transition"
            >
              <span className="text-xs text-white/80 font-semibold">性别</span>
              <div className="flex items-center gap-1.5 text-white/40 text-xs">
                <span className={gender ? 'text-white/80 font-medium' : 'text-white/20'}>
                  {gender || '选择你的性别'}
                </span>
                <span className="text-white/20 text-sm">›</span>
              </div>
            </div>

            {/* 简介 */}
            <div className="p-4 flex flex-col gap-2.5 hover:bg-white/[0.01] transition">
              <div className="flex items-center justify-between">
                <label className="text-xs text-white/80 font-semibold">简介</label>
                <span className="text-[10px] text-white/30 font-mono font-medium">
                  {bio.length}/60
                </span>
              </div>
              <textarea
                value={bio}
                onChange={(e) => {
                  if (e.target.value.length <= 60) {
                    setBio(e.target.value);
                  }
                }}
                rows={3}
                placeholder="填写你的简介，让心仪的角色更了解你吧..."
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-3 text-xs text-white placeholder-white/25 focus:outline-none focus:border-purple-500/40 focus:bg-white/[0.04] resize-none leading-relaxed transition"
              />
            </div>

          </div>

          {/* Group 2: Background Image Card */}
          <div
            onClick={() => bgInputRef.current?.click()}
            className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:bg-white/[0.01] cursor-pointer transition"
          >
            <span className="text-xs text-white/80 font-semibold">背景图</span>
            <div className="flex items-center gap-1.5 text-white/40 text-xs">
              <span>支持自定义</span>
              <span className="text-white/20 text-sm">›</span>
            </div>
            <input
              ref={bgInputRef}
              type="file"
              accept="image/*"
              onChange={handleBgChange}
              className="hidden"
            />
          </div>

        </div>

        {/* Gender Picker Popup (inside App boundaries) */}
        {showGenderModal && (
          <div className="absolute inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end justify-center p-4">
            <div className="bg-[#141420] border border-white/10 rounded-3xl w-full p-5 space-y-3 animate-slideUp">
              <h3 className="text-xs font-bold text-center text-white/90 pb-3 border-b border-white/5">
                选择性别
              </h3>
              {['男', '女', '保密'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => {
                    setGender(g);
                    setShowGenderModal(false);
                    onShowToast(`已选择性别：${g}`);
                  }}
                  className={`w-full py-3.5 rounded-2xl flex items-center justify-between px-4 text-xs font-semibold transition ${
                    gender === g ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'bg-white/[0.03] text-white/70 hover:bg-white/[0.06]'
                  }`}
                >
                  <span>{g}</span>
                  {gender === g && <span className="w-2 h-2 rounded-full bg-purple-400"></span>}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setShowGenderModal(false)}
                className="w-full py-3 rounded-2xl bg-white/5 text-white/50 text-xs font-semibold hover:bg-white/10 transition mt-2"
              >
                取消
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
