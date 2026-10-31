import { FC } from "react";
import { CheckCircle2, XCircle, AlertCircle, Globe, MessageSquare, Gamepad2, ShieldCheck, RefreshCw } from "lucide-react";

export type ServiceStatus = "connected" | "blocked" | "checking";

interface MobileStatusRowProps {
  web: ServiceStatus;
  discord: ServiceStatus;
  roblox: ServiceStatus;
  dns: ServiceStatus;
  webPing?: number;
  discordPing?: number;
  robloxPing?: number;
  dnsPing?: number;
  onRefresh: () => void;
  isChecking?: boolean;
}

export const MobileStatusRow: FC<MobileStatusRowProps> = ({
  web,
  discord,
  roblox,
  dns,
  webPing = 18,
  discordPing = 24,
  robloxPing = 32,
  dnsPing = 12,
  onRefresh,
  isChecking = false,
}) => {
  const services = [
    {
      id: "web",
      name: "Web / Siteler",
      icon: Globe,
      status: web,
      ping: webPing,
    },
    {
      id: "discord",
      name: "Discord VoIP",
      icon: MessageSquare,
      status: discord,
      ping: discordPing,
    },
    {
      id: "roblox",
      name: "Roblox Mobil",
      icon: Gamepad2,
      status: roblox,
      ping: robloxPing,
    },
    {
      id: "dns",
      name: "Cloudflare DoH",
      icon: ShieldCheck,
      status: dns,
      ping: dnsPing,
    },
  ];

  const getStatusColor = (status: ServiceStatus) => {
    switch (status) {
      case "connected":
        return {
          dot: "bg-emerald-400 shadow-sm shadow-emerald-400/50",
          border: "border-emerald-500/30",
          text: "text-emerald-400",
          label: "Açık",
        };
      case "blocked":
        return {
          dot: "bg-rose-400",
          border: "border-rose-500/20",
          text: "text-rose-400",
          label: "Kapalı",
        };
      case "checking":
      default:
        return {
          dot: "bg-amber-400 animate-ping",
          border: "border-amber-500/30",
          text: "text-amber-400",
          label: "Test...",
        };
    }
  };

  return (
    <div className="w-full my-4">
      {/* Title with Refresh Button */}
      <div className="flex items-center justify-between mb-2.5 px-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Mobil Servis Durumu
        </span>
        <button
          onClick={onRefresh}
          disabled={isChecking}
          className="flex items-center gap-1 text-[11px] font-medium text-cyan-400 hover:text-cyan-300 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${isChecking ? "animate-spin" : ""}`} />
          <span>{isChecking ? "Taranıyor..." : "Test Et"}</span>
        </button>
      </div>

      {/* 2x2 Grid of Status Chips for Mobile */}
      <div className="grid grid-cols-2 gap-2.5">
        {services.map((s) => {
          const cfg = getStatusColor(s.status);
          const Icon = s.icon;
          return (
            <div
              key={s.id}
              className={`p-3 rounded-2xl bg-slate-900/90 border ${cfg.border} flex items-center justify-between transition-all`}
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-slate-800 text-slate-300">
                  <Icon className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-none mb-1">
                    {s.name}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    <span className={`text-[10px] font-medium ${cfg.text}`}>
                      {cfg.label}
                    </span>
                  </div>
                </div>
              </div>

              {s.status === "connected" && (
                <span className="text-[10px] font-mono font-semibold text-slate-400">
                  {s.ping}ms
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
