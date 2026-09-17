import React, { useState, useRef } from 'react';
import { X, Camera, Upload, Link, User, Image as ImageIcon } from 'lucide-react';
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
  const [nickname, setNickname] = useState(userProfile.nickname);
  const [avatar, setAvatar] = useState(userProfile.avatar || '😊');
  const [uploadType, setUploadType] = useState<'local' | 'url'>('local');
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle Local File Selection
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
        onShowToast('本地头像读取成功！');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      onShowToast('请输入有效的图片 URL 链接');
      return;
    }
    setAvatar(trimmed);
    onShowToast('图片 URL 设置成功');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedNick = nickname.trim();
    if (!trimmedNick) {
      onShowToast('昵称不能为空哦');
      return;
    }

    onSave({
      nickname: trimmedNick,
      avatar,
    });

    onShowToast('✨ 个人资料修改成功！');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#12121c] border border-white/10 rounded-2xl w-full max-w-sm p-5 shadow-2xl space-y-4 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <User size={16} className="text-pink-400" />
            修改个人资料
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Avatar Preview Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-white/60 uppercase tracking-wider">
                头像设置
              </label>
              <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/5">
                <button
                  type="button"
                  onClick={() => setUploadType('local')}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition ${
                    uploadType === 'local'
                      ? 'bg-pink-600 text-white shadow'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  本地上传
                </button>
                <button
                  type="button"
                  onClick={() => setUploadType('url')}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition ${
                    uploadType === 'url'
                      ? 'bg-pink-600 text-white shadow'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  网络 URL
                </button>
              </div>
            </div>

            {/* Clickable Big Avatar Preview */}
            <div className="text-center py-2">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative w-22 h-22 mx-auto rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 p-0.5 shadow-xl cursor-pointer group transition hover:scale-105"
              >
                <div className="w-full h-full rounded-full bg-[#181824] overflow-hidden flex items-center justify-center text-4xl border border-white/20 relative">
                  {avatar && (avatar.startsWith('http') || avatar.startsWith('data:')) ? (
                    <img
                      src={avatar}
                      alt="avatar preview"
                      className="w-full h-full object-cover"
                      onError={() => onShowToast('图片未成功加载，请检查图片或重新选择')}
                    />
                  ) : (
                    <span className="text-3xl">{avatar}</span>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white/90 gap-1 text-[10px]">
                    <Camera size={18} className="text-pink-400" />
                    <span>更换头像</span>
                  </div>
                </div>

                <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-pink-600 text-white flex items-center justify-center shadow-lg border border-black/50">
                  <Upload size={13} />
                </div>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Upload Mode Controls */}
            {uploadType === 'local' ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-pink-300 font-medium flex items-center justify-center gap-2 transition active:scale-98"
              >
                <ImageIcon size={14} />
                选择本地照片 / 相册图片
              </button>
            ) : (
              <div className="space-y-1.5">
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/avatar.png"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-pink-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="px-3 py-2 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-xl transition"
                  >
                    应用
                  </button>
                </div>
                <p className="text-[10px] text-white/30 text-center">粘贴网络图片直链，点击应用后预览</p>
              </div>
            )}
          </div>

          {/* Nickname Input */}
          <div className="space-y-1.5 pt-1">
            <label className="text-[11px] font-semibold text-white/60 uppercase tracking-wider block">
              网络昵称
            </label>
            <input
              type="text"
              maxLength={12}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="请输入您的专属昵称"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-pink-500 font-medium"
            />
            <div className="text-[10px] text-white/30 text-right">{nickname.length}/12</div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-white/70 transition"
            >
              取消
            </button>
            <button
              type="submit"
              className="py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-95 text-xs font-bold text-white transition active:scale-95 shadow-lg shadow-pink-600/20"
            >
              保存资料修改
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
