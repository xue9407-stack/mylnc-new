import React, { useState, useRef } from 'react';
import { ChevronLeft, Camera, Upload, Image as ImageIcon, Check } from 'lucide-react';
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
  const [school, setSchool] = useState(userProfile.school || '');
  const [bio, setBio] = useState(userProfile.bio || '');
  const [emergencyContact, setEmergencyContact] = useState(userProfile.emergencyContact || '');
  
  const [showGenderModal, setShowGenderModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle Local File Selection for Avatar
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        onShowToast('头像更新成功！');
      };
      reader.readAsDataURL(file);
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
      school,
      bio,
      emergencyContact,
    });

    onShowToast('✨ 资料保存成功！');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0b0b12] text-white animate-fadeIn overflow-hidden">
      {/* Top Bar matching Image 3 */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-white/10 shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/80 transition cursor-pointer"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-base font-bold text-white tracking-wide">编辑资料</h2>
        <button
          type="button"
          onClick={handleSave}
          className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xs shadow-md shadow-pink-500/20 hover:opacity-90 active:scale-95 transition cursor-pointer"
        >
          保存
        </button>
      </div>

      {/* Main Form Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center justify-center pt-4 pb-2">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative w-28 h-28 rounded-3xl bg-white/10 border-2 border-white/20 shadow-2xl overflow-hidden cursor-pointer group flex items-center justify-center transition hover:scale-105"
          >
            {avatar && (avatar.startsWith('http') || avatar.startsWith('data:')) ? (
              <img src={avatar} alt="avatar preview" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl">{avatar || '😊'}</span>
            )}

            {/* Camera Overlay Badge */}
            <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg border border-black/30">
              <Camera size={14} />
            </div>
          </div>
          <span className="text-xs text-white/40 mt-2">点击更换头像照片</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Group 1: Standard Details Card (Matching Image 3) */}
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl divide-y divide-white/5 overflow-hidden text-xs">
          {/* 名字 */}
          <div className="p-4 flex items-center justify-between">
            <label className="text-white/80 font-medium w-24 shrink-0">名字</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="请输入您的名字"
              className="flex-1 bg-transparent text-right text-white placeholder-white/30 focus:outline-none font-medium"
            />
          </div>

          {/* 性别 */}
          <div
            onClick={() => setShowGenderModal(true)}
            className="p-4 flex items-center justify-between hover:bg-white/5 cursor-pointer transition"
          >
            <span className="text-white/80 font-medium">性别</span>
            <div className="flex items-center gap-1.5 text-white/60">
              <span>{gender || '选择你的性别'}</span>
              <span className="text-white/30 text-sm">›</span>
            </div>
          </div>

          {/* 学校 */}
          <div className="p-4 flex items-center justify-between">
            <label className="text-white/80 font-medium w-24 shrink-0">学校</label>
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="选择你的学校"
              className="flex-1 bg-transparent text-right text-white placeholder-white/30 focus:outline-none"
            />
          </div>

          {/* 简介 */}
          <div className="p-4 flex items-center justify-between">
            <label className="text-white/80 font-medium w-24 shrink-0">简介</label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="填写你的简介"
              className="flex-1 bg-transparent text-right text-white placeholder-white/30 focus:outline-none"
            />
          </div>

          {/* 紧急联系人 */}
          <div className="p-4 flex items-center justify-between">
            <label className="text-white/80 font-medium w-24 shrink-0">紧急联系人</label>
            <input
              type="text"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              placeholder="去填写"
              className="flex-1 bg-transparent text-right text-white placeholder-white/30 focus:outline-none"
            />
          </div>
        </div>

        {/* Group 2: Background Image (Matching Image 3) */}
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:bg-white/5 cursor-pointer transition"
             onClick={() => fileInputRef.current?.click()}
        >
          <span className="text-xs text-white/80 font-medium">背景图</span>
          <div className="flex items-center gap-1.5 text-white/40 text-xs">
            <span>支持自定义</span>
            <span className="text-white/30 text-sm">›</span>
          </div>
        </div>
      </div>

      {/* Gender Picker Modal */}
      {showGenderModal && (
        <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-sm flex items-end justify-center p-4">
          <div className="bg-[#181824] border border-white/10 rounded-3xl w-full max-w-sm p-5 space-y-3 animate-slideUp">
            <h3 className="text-sm font-bold text-center text-white pb-2 border-b border-white/10">
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
                className={`w-full py-3 rounded-2xl flex items-center justify-between px-4 text-xs font-semibold transition ${
                  gender === g ? 'bg-purple-600/30 text-purple-300 border border-purple-500/30' : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                <span>{g}</span>
                {gender === g && <Check size={16} className="text-purple-400" />}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setShowGenderModal(false)}
              className="w-full py-2.5 rounded-2xl bg-white/5 text-white/50 text-xs font-medium hover:bg-white/10 transition mt-2"
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
