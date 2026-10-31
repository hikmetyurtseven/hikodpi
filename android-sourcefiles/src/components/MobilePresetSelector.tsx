import { FC } from "react";
import { Globe, Zap, Gamepad2, SlidersHorizontal, Check } from "lucide-react";

export type MobilePresetKey = "discord" | "superonline" | "browser" | "custom";

export interface MobilePresetInfo {
  key: MobilePresetKey;
  name: string;
  badge: string;
  icon: typeof Globe;
  description: string;
  details: string;
}

export const MOBILE_PRESETS: MobilePresetInfo[] = [
  {
    key: "discord",
    name: "Discord & Roblox Mobil",
    badge: "Popüler 🎮",
    icon: Gamepad2,
    description: "Discord ses kanalları (VoIP RTC) + Roblox harita/sunucu erişimi",
    details: "Mobil Discord ses odalarında yaşanan 'RTC Bağlanıyor' hatasını ve Roblox oyun bağlantısını çözer.",
  },
  {
    key: "superonline",
    name: "Superonline & Katı ISP",
    badge: "Agresif ⚡",
    icon: Zap,
    description: "2-baytlık agresif SNI bölme + derin paket (DPI) baypası",
    details: "Superonline ve Türk Telekom mobil hatlarındaki katı sansür ve paket filtrelerini atlatır.",
  },
  {
    key: "browser",
    name: "Genel Mobil Web",
    badge: "Önerilen 🌐",
    icon: Globe,
    description: "Yasaklı web siteleri + Cloudflare DoH (1.1.1.1)",
    details: "Tüm web siteleri ve tarayıcılar için en kararlı, batarya dostu şifreli DNS ve SNI modu.",
  },
  {
    key: "custom",
    name: "Özel Yapılandırma",
    badge: "Gelişmiş 🛠️",
    icon: SlidersHorizontal,
    description: "Özel DoH sunucusu ve esnek fragmentasyon",
    details: "AdGuard, Quad9 veya kendi DoH sunucunuz ile özel baypas parametreleri.",
  },
];

interface MobilePresetSelectorProps {
  current: MobilePresetKey;
  onSelect: (preset: MobilePresetKey) => void;
}

export const MobilePresetSelector: FC<MobilePresetSelectorProps> = ({ current, onSelect }) => {
  return (
    <div className="w-full my-4">
      <div className="flex items-center justify-between mb-2.5 px-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Mobil Baypas Profili
        </span>
        <span className="text-[10px] text-cyan-400 font-mono">
          {MOBILE_PRESETS.find((p) => p.key === current)?.badge}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {MOBILE_PRESETS.map((p) => {
          const isSelected = current === p.key;
          const Icon = p.icon;

          return (
            <button
              key={p.key}
              onClick={() => onSelect(p.key)}
              className={`w-full p-3.5 rounded-2xl text-left transition-all relative cursor-pointer active:scale-[0.99] touch-manipulation ${
                isSelected
                  ? "bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border-2 border-cyan-400/80 shadow-lg shadow-cyan-500/10"
                  : "bg-slate-900/80 border border-slate-800/90 hover:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 mt-0.5 transition-colors ${
                      isSelected
                        ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${isSelected ? "text-white" : "text-slate-200"}`}>
                        {p.name}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          isSelected
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {p.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      {p.description}
                    </p>
                  </div>
                </div>

                {/* Selected Check Indicator */}
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    isSelected
                      ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/40 scale-100"
                      : "border border-slate-700 text-transparent scale-90"
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
