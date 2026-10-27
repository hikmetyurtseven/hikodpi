import { FC } from "react";
import { Power } from "lucide-react";
import { motion } from "framer-motion";

interface PowerButtonProps {
  isActive: boolean;
  onToggle: () => void;
  uptimeText: string;
  presetName: string;
}

export const PowerButton: FC<PowerButtonProps> = ({
  isActive,
  onToggle,
  uptimeText,
  presetName,
}) => {
  return (
    <div className="flex flex-col items-center justify-center my-6 select-none">
      {/* Outer Glow Ring Container */}
      <div className="relative flex items-center justify-center">
        {/* Animated Background Ripple Rings when Active */}
        {isActive && (
          <>
            <motion.div
              initial={{ scale: 0.92, opacity: 0.8 }}
              animate={{ scale: 1.45, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeOut" }}
              className="absolute w-44 h-44 rounded-full border-2 border-cyan-400/40 pointer-events-none"
            />
            <motion.div
              initial={{ scale: 0.92, opacity: 0.5 }}
              animate={{ scale: 1.75, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 2.2, delay: 0.7, ease: "easeOut" }}
              className="absolute w-44 h-44 rounded-full border border-emerald-400/30 pointer-events-none"
            />
          </>
        )}

        {/* Pulsing Backlight */}
        <div
          className={`absolute w-52 h-52 rounded-full blur-3xl transition-all duration-700 pointer-events-none ${
            isActive
              ? "bg-gradient-to-tr from-cyan-500/40 via-emerald-500/30 to-blue-500/35 opacity-100 scale-110"
              : "bg-slate-800/40 opacity-30 scale-90"
          }`}
        />

        {/* The Main Round Button */}
        <motion.button
          onClick={onToggle}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          className={`relative z-10 w-44 h-44 rounded-full p-2.5 flex flex-col items-center justify-center transition-all duration-500 cursor-pointer shadow-2xl ${
            isActive
              ? "bg-gradient-to-b from-slate-900 via-[#0d1627] to-[#081220] border-2 border-cyan-400/80 shadow-cyan-500/30 glow-active"
              : "bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-2 border-slate-700/80 hover:border-slate-500 shadow-black/70"
          }`}
          aria-label={isActive ? "HikoDPI Korumasını Durdur" : "HikoDPI Korumasını Başlat"}
        >
          {/* Inner Accent Ring */}
          <div
            className={`w-36 h-36 rounded-full flex flex-col items-center justify-center transition-all duration-500 ${
              isActive
                ? "bg-gradient-to-b from-cyan-950/70 to-slate-950/80 border border-cyan-500/50"
                : "bg-slate-900/80 border border-slate-800"
            }`}
          >
            {/* SVG Power Icon */}
            <div
              className={`p-3 rounded-full mb-1 transition-all duration-500 ${
                isActive
                  ? "bg-cyan-500/20 text-cyan-300 drop-shadow-[0_0_14px_rgba(6,182,212,0.9)]"
                  : "bg-slate-800/80 text-slate-500"
              }`}
            >
              <Power className={`w-9 h-9 transition-transform duration-300 ${isActive ? "scale-105" : "scale-95"}`} />
            </div>

            {/* Label */}
            <span
              className={`text-xs font-black tracking-widest transition-colors duration-300 ${
                isActive ? "text-cyan-300 text-glow" : "text-slate-400"
              }`}
            >
              {isActive ? "KORUMA AKTİF" : "DEVRE DIŞI"}
            </span>

            {/* Sub-label: Uptime */}
            <span className={`text-[11px] font-mono mt-0.5 ${isActive ? "text-emerald-400 font-bold" : "text-slate-500"}`}>
              {isActive ? uptimeText : "Başlatmak için tıkla"}
            </span>
          </div>
        </motion.button>
      </div>

      {/* Button Subtext */}
      <div className="mt-4 text-center">
        <div className="flex items-center justify-center gap-2 text-xs font-medium">
          <span className={`w-2.5 h-2.5 rounded-full ${isActive ? "bg-emerald-400 animate-pulse" : "bg-slate-600"}`} />
          <span className={isActive ? "text-slate-200 font-bold" : "text-slate-400"}>
            {isActive ? `Trafik Korunuyor [${presetName}]` : "DPI Baypas Kapalı"}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">
          {isActive 
            ? `Oturum Süresi: ${uptimeText} • SNI parçalama ve DoH tünelleme devrede` 
            : "Discord, Roblox ve engelli sitelere erişmek için butona basın"}
        </p>
      </div>
    </div>
  );
};
