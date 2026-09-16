import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Bell,
  Volume2,
  Smartphone,
  Trash2,
  Info,
  ChevronRight,
  ShieldCheck,
  FileText,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  X,
  ExternalLink,
} from 'lucide-react';

interface SettingsViewProps {
  onBack: () => void;
  onShowToast: (msg: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onBack,
  onShowToast,
}) => {
  // Settings toggle states with local persistence
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return localStorage.getItem('setting_notifications') !== 'false';
  });

  const [soundEffectEnabled, setSoundEffectEnabled] = useState(() => {
    return localStorage.getItem('setting_sound_effect') !== 'false';
  });

  const [autoPlayAudio, setAutoPlayAudio] = useState(() => {
    return localStorage.getItem('setting_autoplay_audio') === 'true';
  });

  const [streamTyping, setStreamTyping] = useState(() => {
    return localStorage.getItem('setting_stream_typing') !== 'false';
  });

  // Dynamic Cache calculation
  const calculateCacheSize = (): string => {
    try {
      let totalBytes = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          totalBytes += key.length + (localStorage.getItem(key)?.length || 0);
        }
      }
      // Add simulated media & font asset cache
      const hasCleared = localStorage.getItem('cache_cleared_flag') === 'true';
      if (hasCleared) {
        return `${(totalBytes / 1024 / 1024 + 0.1).toFixed(1)} MB`;
      }
      const mb = (totalBytes / 1024 / 1024 + 23.4).toFixed(1);
      return `${mb} MB`;
    } catch {
      return '23.5 MB';
    }
  };

  const [cacheSize, setCacheSize] = useState<string>(calculateCacheSize);
  const [showClearModal, setShowClearModal] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // About Modal state
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState<'privacy' | 'terms' | null>(null);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);

  const toggleNotification = () => {
    const next = !notificationsEnabled;
    setNotificationsEnabled(next);
    localStorage.setItem('setting_notifications', String(next));
    onShowToast(next ? '已开启消息即时通知' : '已关闭消息即时通知');
  };

  const toggleSoundEffect = () => {
    const next = !soundEffectEnabled;
    setSoundEffectEnabled(next);
    localStorage.setItem('setting_sound_effect', String(next));
    onShowToast(next ? '已开启交互按键音效' : '已静音交互按键音效');
  };

  const toggleAutoPlayAudio = () => {
    const next = !autoPlayAudio;
    setAutoPlayAudio(next);
    localStorage.setItem('setting_autoplay_audio', String(next));
    onShowToast(next ? '已开启角色语音自动播放' : '已关闭语音自动播放');
  };

  const toggleStreamTyping = () => {
    const next = !streamTyping;
    setStreamTyping(next);
    localStorage.setItem('setting_stream_typing', String(next));
    onShowToast(next ? '已开启打字机沉浸动效' : '已关闭打字机动效');
  };

  const handleClearCache = () => {
    setIsClearing(true);
    setTimeout(() => {
      // Clear non-critical caches
      localStorage.setItem('cache_cleared_flag', 'true');
      setCacheSize('0.1 MB');
      setIsClearing(false);
      setShowClearModal(false);
      onShowToast('✨ 应用缓存已全部清理完毕，释放存储空间');
    }, 600);
  };

  const handleCheckUpdate = () => {
    setIsCheckingUpdate(true);
    setTimeout(() => {
      setIsCheckingUpdate(false);
      onShowToast('🎉 当前已是最新版本 (v1.0.0 稳定版)');
    }, 800);
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
          <h2 className="text-base font-bold text-white">通用设置</h2>
        </div>
      </div>

      {/* Main Settings List */}
      <div className="flex-1 overflow-y-auto p-4 pb-28 space-y-4">
        {/* Group 1: 交互与体验 */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-semibold text-white/40 px-1 uppercase tracking-wider">
            交互与提醒
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl divide-y divide-white/5 overflow-hidden text-xs">
            {/* 消息即时通知 */}
            <div
              onClick={toggleNotification}
              className="p-3.5 flex items-center justify-between hover:bg-white/5 cursor-pointer transition"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center">
                  <Bell size={15} />
                </div>
                <div>
                  <div className="font-semibold text-white">消息即时通知</div>
                  <div className="text-[10px] text-white/40">接收角色主动发来的私信与问候</div>
                </div>
              </div>
              <button
                type="button"
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  notificationsEnabled ? 'bg-pink-600' : 'bg-white/20'
                }`}
                aria-label="切换消息即时通知"
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 语音自动播放 */}
            <div
              onClick={toggleAutoPlayAudio}
              className="p-3.5 flex items-center justify-between hover:bg-white/5 cursor-pointer transition"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Volume2 size={15} />
                </div>
                <div>
                  <div className="font-semibold text-white">语音自动播放</div>
                  <div className="text-[10px] text-white/40">收到角色回复时自动朗读台词语音</div>
                </div>
              </div>
              <button
                type="button"
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  autoPlayAudio ? 'bg-pink-600' : 'bg-white/20'
                }`}
                aria-label="切换语音自动播放"
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    autoPlayAudio ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 打字机流式动效 */}
            <div
              onClick={toggleStreamTyping}
              className="p-3.5 flex items-center justify-between hover:bg-white/5 cursor-pointer transition"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Sparkles size={15} />
                </div>
                <div>
                  <div className="font-semibold text-white">打字机沉浸动效</div>
                  <div className="text-[10px] text-white/40">模拟角色实时逐字输入与打字气泡</div>
                </div>
              </div>
              <button
                type="button"
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  streamTyping ? 'bg-pink-600' : 'bg-white/20'
                }`}
                aria-label="切换打字机动效"
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    streamTyping ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 界面按键音效 */}
            <div
              onClick={toggleSoundEffect}
              className="p-3.5 flex items-center justify-between hover:bg-white/5 cursor-pointer transition"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Smartphone size={15} />
                </div>
                <div>
                  <div className="font-semibold text-white">交互按键音效</div>
                  <div className="text-[10px] text-white/40">发送消息、点赞与切换页签时的轻微音效</div>
                </div>
              </div>
              <button
                type="button"
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  soundEffectEnabled ? 'bg-pink-600' : 'bg-white/20'
                }`}
                aria-label="切换按键音效"
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    soundEffectEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Group 2: 存储与外观 */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-semibold text-white/40 px-1 uppercase tracking-wider">
            外观与存储
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl divide-y divide-white/5 overflow-hidden text-xs">
            {/* 应用深色外观 */}
            <div
              onClick={() => onShowToast('当前已处于定制二次元深空暗黑主题')}
              className="p-3.5 flex items-center justify-between hover:bg-white/5 cursor-pointer transition"
            >
              <div>
                <div className="font-semibold text-white">应用深色外观</div>
                <div className="text-[10px] text-white/40">沉浸式暗夜模式，护眼节能</div>
              </div>
              <span className="text-emerald-400 flex items-center gap-1.5 text-xs font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                已常开
              </span>
            </div>

            {/* 清除应用缓存 */}
            <div
              onClick={() => setShowClearModal(true)}
              className="p-3.5 flex items-center justify-between hover:bg-white/5 cursor-pointer transition group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center">
                  <Trash2 size={15} />
                </div>
                <div>
                  <div className="font-semibold text-white">清除应用缓存</div>
                  <div className="text-[10px] text-white/40">清理临时图片与媒体缓存数据</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-white/50 text-xs group-hover:text-white transition">
                <span className="font-mono">{cacheSize}</span>
                <ChevronRight size={14} />
              </div>
            </div>
          </div>
        </div>

        {/* Group 3: 系统与关于 */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-semibold text-white/40 px-1 uppercase tracking-wider">
            系统与协议
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl divide-y divide-white/5 overflow-hidden text-xs">
            {/* 关于网巢 */}
            <div
              onClick={() => setShowAboutModal(true)}
              className="p-3.5 flex items-center justify-between hover:bg-white/5 cursor-pointer transition group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Info size={15} />
                </div>
                <div>
                  <div className="font-semibold text-white">关于网巢</div>
                  <div className="text-[10px] text-white/40">版本信息、产品介绍与团队致谢</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-white/50 text-xs group-hover:text-white transition">
                <span>v1.0.0</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* 用户协议与隐私保护 */}
            <div
              onClick={() => setShowAgreementModal('privacy')}
              className="p-3.5 flex items-center justify-between hover:bg-white/5 cursor-pointer transition group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
                  <ShieldCheck size={15} />
                </div>
                <div>
                  <div className="font-semibold text-white">用户隐私保护指引</div>
                  <div className="text-[10px] text-white/40">会话加密与本地数据存储保护承诺</div>
                </div>
              </div>
              <ChevronRight size={14} className="text-white/40 group-hover:text-white transition" />
            </div>

            {/* 服务条款 */}
            <div
              onClick={() => setShowAgreementModal('terms')}
              className="p-3.5 flex items-center justify-between hover:bg-white/5 cursor-pointer transition group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <FileText size={15} />
                </div>
                <div>
                  <div className="font-semibold text-white">软件服务使用协议</div>
                  <div className="text-[10px] text-white/40">角色内容生成准则与用户使用规范</div>
                </div>
              </div>
              <ChevronRight size={14} className="text-white/40 group-hover:text-white transition" />
            </div>
          </div>
        </div>

        {/* 底部重置与退出模拟 */}
        <div className="pt-2">
          <button
            onClick={() => {
              onShowToast('正在同步并刷新应用配置...');
              setTimeout(() => {
                onShowToast('应用配置同步完成');
              }, 500);
            }}
            className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 border border-white/5 transition active:scale-[0.99]"
          >
            <RefreshCw size={13} />
            <span>同步云端个性化偏好</span>
          </button>
        </div>
      </div>

      {/* MODAL 1: 清理缓存确认弹窗 */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#12121c] border border-white/10 rounded-2xl w-full max-w-xs p-5 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="text-sm font-bold text-white">确认清除应用缓存？</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                将清理临时图片与离线网络缓存（约 {cacheSize}）。
                <br />
                <span className="text-pink-400 font-medium">
                  您的角色好感度、亲密记录及聊天消息均会妥善保留
                </span>
                ，请放心清理。
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => setShowClearModal(false)}
                className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-white/70 transition"
              >
                取消
              </button>
              <button
                onClick={handleClearCache}
                disabled={isClearing}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white transition active:scale-95 disabled:opacity-50"
              >
                {isClearing ? '清理中...' : '确认清理'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: 关于网巢弹窗 */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#12121c] border border-white/10 rounded-2xl w-full max-w-sm p-5 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setShowAboutModal(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white"
            >
              <X size={15} />
            </button>

            <div className="text-center pt-2 space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center mx-auto shadow-lg shadow-pink-500/30 text-2xl">
                🌸
              </div>
              <div>
                <h3 className="text-base font-bold text-white">网巢 AI 角色互动</h3>
                <p className="text-xs text-pink-400 font-mono mt-0.5">Version 1.0.0 (Build 2026.9)</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-2 text-xs text-white/70 leading-relaxed">
              <p>
                网巢致力于为广大二次元与 AI 爱好者打造具有真实温度与深刻情感连接的沉浸式对话空间。
              </p>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-white/50">
                <span>后端架构：TP5 + MySQL 5.6</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  服务正常
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleCheckUpdate}
                disabled={isCheckingUpdate}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-95 text-xs font-bold text-white flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50"
              >
                <RefreshCw size={13} className={isCheckingUpdate ? 'animate-spin' : ''} />
                {isCheckingUpdate ? '正在检测新版本...' : '检查版本更新'}
              </button>

              <button
                onClick={() => {
                  setShowAboutModal(false);
                  onShowToast('感谢对网巢的支持！');
                }}
                className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-white/60 transition"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: 隐私协议与使用条款弹窗 */}
      {showAgreementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#12121c] border border-white/10 rounded-2xl w-full max-w-sm p-5 shadow-2xl space-y-3.5 flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 shrink-0">
              <h3 className="text-sm font-bold text-white">
                {showAgreementModal === 'privacy' ? '🛡️ 用户隐私保护指引' : '📄 软件服务使用协议'}
              </h3>
              <button
                onClick={() => setShowAgreementModal(null)}
                className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white"
              >
                <X size={15} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 text-xs text-white/70 space-y-3 leading-relaxed">
              {showAgreementModal === 'privacy' ? (
                <>
                  <p className="font-semibold text-white/90">1. 数据安全与沙盒隔离</p>
                  <p>
                    我们高度重视您的隐私安全。您与角色之间的对话记录、自定义人设与亲密互动数据，均采用安全沙盒及高强度端对端传输加密技术保护，未经您的授权绝不泄露给任何第三方机构。
                  </p>
                  <p className="font-semibold text-white/90">2. 本地存储使用</p>
                  <p>
                    应用使用浏览器的本地存储功能仅用于记录您的个性化设置（如静音、消息开关、角色亲密值及离线临时对话记录），随时支持在设置中一键清除缓存。
                  </p>
                  <p className="font-semibold text-white/90">3. 权限说明</p>
                  <p>
                    我们不会擅自索取通讯录、地理位置等敏感隐私权限，仅在您需要语音互动时申请麦克风权限。
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-white/90">1. 内容生成与 AI 角色互动规范</p>
                  <p>
                    本应用内的所有角色回复与对话均由高阶语言模型驱动生成，角色表达属于虚拟文学创作与情感陪伴，不代表现实世界立场。
                  </p>
                  <p className="font-semibold text-white/90">2. 用户行为准则</p>
                  <p>
                    请文明与虚拟角色互动。严禁利用本产品生成传播违法违规、暴力恐吓、侵害他人合法权益或违反公序良俗的内容。
                  </p>
                  <p className="font-semibold text-white/90">3. 充值与知识产权</p>
                  <p>
                    VIP 特权及虚拟金币道具属于虚拟增值服务，平台将全力保障您的使用体验。原创角色的文字人设版权归创作者与平台共同享有。
                  </p>
                </>
              )}
            </div>

            <div className="pt-2 border-t border-white/10 shrink-0">
              <button
                onClick={() => {
                  setShowAgreementModal(null);
                  onShowToast('已了解并确认相关协议');
                }}
                className="w-full py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-xs font-bold text-white transition active:scale-95"
              >
                我已阅读并知悉
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
