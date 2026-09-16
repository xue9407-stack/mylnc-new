import React, { useState, useEffect } from 'react';

interface RoleAvatarProps {
  name: string;
  avatarUrl?: string;
  emoji: string;
  coverClass?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showOnlineBadge?: boolean;
}

const SIZE_MAP = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-xl',
  xl: 'w-16 h-16 text-3xl',
  '2xl': 'w-20 h-20 text-4xl',
};

export const RoleAvatar: React.FC<RoleAvatarProps> = ({
  name,
  avatarUrl,
  emoji,
  coverClass = 'bg-gradient-to-tr from-purple-700 to-indigo-800',
  size = 'md',
  className = '',
  showOnlineBadge = false,
}) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [avatarUrl]);

  const sizeClasses = SIZE_MAP[size];

  const hasValidImage = avatarUrl && !imgError;

  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      <div
        className={`${sizeClasses} rounded-full overflow-hidden flex items-center justify-center font-bold select-none border border-white/10 shadow-md ${
          hasValidImage ? 'bg-[#151520]' : coverClass
        }`}
      >
        {hasValidImage ? (
          <img
            src={avatarUrl}
            alt={name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <span>{emoji}</span>
        )}
      </div>

      {showOnlineBadge && (
        <span
          className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0a0a0f] ring-1 ring-emerald-500/50"
          title="拟真在线"
        />
      )}
    </div>
  );
};
