import { FC } from "react";
import { Shield, Sparkles, Zap, HelpCircle, Activity } from "lucide-react";

interface MobileHeaderProps {
  isActive: boolean;
  pingMs?: number;
  onOpenHelp: () => void;
  onOpenLogs: () => void;
  unreadLogsCount?: number;
}

export const MobileHeader: FC<MobileHeaderProps> = ({
  isActive,
  pingMs = 14,
  onOpenHelp,
  onOpenLogs,
  unreadLogsCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a0e17]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 pt-3 pb-3 safe-top">
      <div className="flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className={`p-2 rounded-xl transition-all duration-300 ${
              isActive 
                ? "bg-gradient-to-tr from-cyan-500/20 to-emerald-500/20 border border-cyan-500/50 shadow-lg shadow-cyan-500/20" 
                : "bg-slate-900 border border-slate-800"
            }`}>
              <Shield className={`w-5 h-5 transition-colors ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
            </div>
            {isActive && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm tracking-tight text-white">HikoDPI</span>
              <span className="px-1.5 py-0.2 rounded-md bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/30">
                MOBILE
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <span>v0.2.0</span>
              <span>•</span>
              <span className="text-cyan-400/90 font-medium">Vibecoding 🎧</span>
            </p>
          </div>
        </div>

        {/* Right Status Badges & Quick Action */}
        <div className="flex items-center gap-2">
          {/* Latency chip */}
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono border ${
            isActive 
              ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-400" 
              : "bg-slate-900 border-slate-800 text-slate-500"
          }`}>
            <Activity className="w-3 h-3" />
            <span>{isActive ? `${pingMs}ms` : "--"}</span>
          </div>

          {/* Quick Logs Trigger */}
          <button
            onClick={onOpenLogs}
            aria-label="Trafik Günlüğü"
            className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 active:scale-95 transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 text-cyan-400" />
            {unreadLogsCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1 min-w-[14px] h-[14px] rounded-full bg-cyan-500 text-slate-950 text-[9px] font-bold flex items-center justify-center">
                {unreadLogsCount > 9 ? "9+" : unreadLogsCount}
              </span>
            )}
          </button>

          {/* Help / Guide Trigger */}
          <button
            onClick={onOpenHelp}
            aria-label="DNS Çözüm Rehberi"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 active:scale-95 transition-all cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
