import React, { useState, useEffect } from 'react';
import { Wifi, BatteryCharging } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
  onOpenDevCenter?: () => void;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  const [timeStr, setTimeStr] = useState<string>('09:41');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      setTimeStr(`${h}:${m}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#050508] text-white flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 select-none relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-900/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-pink-900/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div
        className="w-full max-w-[420px] h-[100dvh] sm:h-[840px] sm:rounded-[44px] sm:border-[8px] sm:border-[#1e1e28] sm:shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_0_2px_rgba(255,255,255,0.08)] bg-[#0a0a0f] overflow-hidden transition-all duration-300 relative flex flex-col"
      >
        {/* Phone Status Bar */}
        <div className="h-10 px-6 pt-1 flex items-center justify-between text-xs font-semibold text-white/90 shrink-0 z-30 select-none bg-transparent">
          {/* Left Time */}
          <span className="font-mono text-[13px] tracking-tight">{timeStr}</span>

          {/* Center Dynamic Island Notch */}
          <div className="w-24 h-4 bg-black rounded-full border border-white/10 flex items-center justify-end px-2 gap-1.5 shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-[#151520]"></span>
            <span className="w-2 h-2 rounded-full bg-[#101025] border border-blue-900/50"></span>
          </div>

          {/* Right Signal & Battery */}
          <div className="flex items-center gap-2 text-white/80">
            <span className="text-[11px] font-mono">5G</span>
            <Wifi size={13} />
            <div className="flex items-center gap-0.5">
              <BatteryCharging size={14} className="text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Content Viewport */}
        <main className="flex-1 relative overflow-hidden flex flex-col">{children}</main>

        {/* Bottom Virtual Home Indicator (iOS / Android Style) */}
        <div className="h-3 w-full shrink-0 flex items-center justify-center bg-transparent z-30 pointer-events-none">
          <div className="w-32 h-1 bg-white/20 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
