import { FC } from "react";
import { Power, ShieldCheck, Wifi, Flame } from "lucide-react";
import { motion } from "framer-motion";

interface MobilePowerButtonProps {
  isActive: boolean;
  onToggle: () => void;
  uptimeText: string;
  presetName: string;
  isConnecting?: boolean;
}

export const MobilePowerButton: FC<MobilePowerButtonProps> = ({
  isActive,
  onToggle,
  uptimeText,
  presetName,
  isConnecting = false,
}) => {
  const handleClick = () => {
    // Mobile Haptic Feedback
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(isActive ? 30 : [25, 40, 30]);
      } catch (e) {
        // Ignore devices that don't support vibration
      }
    }
    onToggle();
  };

  return (
    <div className="flex flex-col items-center justify-center my-6 select-none relative">
      {/* Outer Pulse Container */}
      <div className="relative flex items-center justify-center">
        {/* Animated Background Ripple Rings when Active */}
        {isActive && (
          <>
            <motion.div
              initial={{ scale: 0.9, opacity: 0.7 }}
              animate={{ scale: 1.45, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeOut" }}
              className="absolute w-44 h-44 rounded-full border-2 border-cyan-400/40 pointer-events-none"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0.4 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 2.2, delay: 0.6, ease: "easeOut" }}
              className="absolute w-44 h-44 rounded-full border border-emerald-400/30 pointer-events-none"
            />
          </>
        )}

        {/* Ambient Blur Glow */}
        <div
          className={`absolute w-48 h-48 rounded-full blur-3xl transition-all duration-700 pointer-events-none ${
            isActive
              ? "bg-gradient-to-tr from-cyan-500/40 via-emerald-500/30 to-blue-500/30 opacity-100 scale-110"
              : "bg-slate-800/30 opacity-20 scale-90"
          }`}
        />

        {/* Massive Touch-Optimized Power Switch */}
        <motion.button
          onClick={handleClick}
          whileTap={{ scale: 0.93 }}
          className={`relative z-10 w-44 h-44 rounded-full p-2.5 flex flex-col items-center justify-center transition-all duration-500 cursor-pointer shadow-2xl touch-manipulation ${
            isActive
              ? "bg-gradient-to-b from-slate-900 via-[#0d1627] to-[#081220] border-2 border-cyan-400/80 shadow-cyan-500/30 glow-active"
              : "bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-2 border-slate-700/80 active:border-slate-500 shadow-black/80"
          }`}
          aria-label={isActive ? "HikoDPI Korumasını Durdur" : "HikoDPI Korumasını Başlat"}
        >
          {/* Inner Accent Ring */}
          <div
            className={`w-36 h-36 rounded-full flex flex-col items-center justify-center transition-all duration-500 ${
              isActive
                ? "bg-gradient-to-b from-cyan-950/80 to-slate-950/90 border border-cyan-500/50"
                : "bg-slate-900/90 border border-slate-800"
            }`}
          >
            {/* Center Icon */}
            <div
              className={`p-3 rounded-full mb-1 transition-all duration-500 ${
                isActive
                  ? "bg-cyan-500/20 text-cyan-300 drop-shadow-[0_0_16px_rgba(6,182,212,0.9)]"
                  : "bg-slate-800 text-slate-500"
              }`}
            >
              <Power className={`w-9 h-9 transition-transform duration-300 ${isActive ? "scale-105" : "scale-95"}`} />
            </div>

            {/* Status Label */}
            <span
              className={`text-[11px] font-black tracking-widest transition-colors duration-300 ${
                isActive ? "text-cyan-300 text-glow" : "text-slate-400"
              }`}
            >
              {isConnecting ? "BAĞLANIYOR..." : isActive ? "KORUMA AKTİF" : "DEVRE DIŞI"}
            </span>

            {/* Uptime / Action Hint */}
            <span className={`text-[10px] font-mono mt-0.5 ${isActive ? "text-emerald-400 font-bold" : "text-slate-500"}`}>
              {isActive ? uptimeText : "Başlatmak için dokun"}
            </span>
          </div>
        </motion.button>
      </div>

      {/* Profile & State Sub-badge */}
      <div className="mt-4 flex flex-col items-center gap-1.5">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs">
          <span className={`w-2 h-2 rounded-full ${isActive ? "bg-emerald-400 animate-pulse" : "bg-slate-600"}`} />
          <span className="text-slate-300 font-medium">{isActive ? "DPI & DoH Tüneli Açık" : "Sistem Beklemede"}</span>
        </div>

        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
          <span className="text-cyan-400 font-medium">Profil:</span>
          <span>{presetName}</span>
        </div>
      </div>
    </div>
  );
};
