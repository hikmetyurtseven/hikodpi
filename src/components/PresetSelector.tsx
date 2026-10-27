import { FC } from "react";
import { Globe, Zap, Gamepad2, SlidersHorizontal, Check } from "lucide-react";

export type PresetKey = "browser" | "superonline" | "discord" | "custom";

export interface PresetInfo {
  key: PresetKey;
  name: string;
  badge: string;
  icon: typeof Globe;
  description: string;
  details: string;
}

interface PresetSelectorProps {
  current: PresetKey;
  onSelect: (preset: PresetKey) => void;
  disabled?: boolean;
}

export const PRESETS: PresetInfo[] = [
  {
    key: "browser",
    name: "Genel Web & Tarayıcı",
    badge: "Önerilen",
    icon: Globe,
    description: "Tüm yasaklı web siteleri ve DoH koruması",
    details: "Standart SNI parçalama + Cloudflare DoH (1.1.1.1). Web siteleri, haberler ve forumlar için en kararlı mod.",
  },
  {
    key: "superonline",
    name: "Superonline & Katı ISP",
    badge: "Agresif",
    icon: Zap,
    description: "Derin paket incelemesi (DPI) baypas modu",
    details: "Superonline ve Türk Telekom kısıtlamalarını aşmak için 2 baytlık agresif SNI bölme ve sahte paket enjeksiyonu.",
  },
  {
    key: "discord",
    name: "Discord & Roblox & Oyun",
    badge: "Düşük Ping",
    icon: Gamepad2,
    description: "Discord VoIP ses + Roblox UDP/TCP fix",
    details: "Discord Gateway TCP + ses sunucuları (UDP 50000-65535) ve Roblox sunucuları için ses kanalı bozulmasını önleyen özel bypass.",
  },
  {
    key: "custom",
    name: "Özel Yapılandırma",
    badge: "Uzman",
    icon: SlidersHorizontal,
    description: "Özelleştirilebilir DoH ve parçalama kuralları",
    details: "Kullanıcı tanımlı upstream DNS (Quad9, AdGuard vb.) ve özel fragmentasyon kuralları.",
  },
];

export const PresetSelector: FC<PresetSelectorProps> = ({ current, onSelect, disabled }) => {
  return (
    <div className="w-full my-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Çalışma Profili (Preset) Seçimi
        </h3>
        <span className="text-[11px] text-cyan-400 font-mono">
          {PRESETS.find((p) => p.key === current)?.name}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {PRESETS.map((preset) => {
          const isSelected = current === preset.key;
          const Icon = preset.icon;

          return (
            <button
              key={preset.key}
              onClick={() => onSelect(preset.key)}
              disabled={disabled}
              className={`group text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-slate-800/95 border-cyan-500/80 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/40"
                  : "bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div
                    className={`p-2 rounded-lg transition-colors ${
                      isSelected
                        ? "bg-cyan-500/20 text-cyan-300"
                        : "bg-slate-800 text-slate-400 group-hover:text-slate-200"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isSelected
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {preset.badge}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 font-bold text-sm text-white mb-1">
                  <span>{preset.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 ml-auto" />}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  {preset.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono line-clamp-2">
                {preset.details}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
