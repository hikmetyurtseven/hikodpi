import { FC } from "react";
import { CheckCircle2, XCircle, AlertCircle, Globe, MessageSquare, Gamepad2, ShieldCheck, RefreshCw } from "lucide-react";

export type ServiceStatus = "connected" | "blocked" | "checking";

interface StatusIndicatorProps {
  web: ServiceStatus;
  discord: ServiceStatus;
  roblox: ServiceStatus;
  dns: ServiceStatus;
  webPing?: number;
  discordPing?: number;
  robloxPing?: number;
  dnsPing?: number;
  onRefresh?: () => void;
  isChecking?: boolean;
}

export const StatusIndicator: FC<StatusIndicatorProps> = ({
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
  const getStatusBadge = (status: ServiceStatus) => {
    switch (status) {
      case "connected":
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
          text: "Erişilebilir",
          color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          dot: "bg-emerald-400",
        };
      case "blocked":
        return {
          icon: <XCircle className="w-4 h-4 text-rose-400" />,
          text: "Engelli",
          color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
          dot: "bg-rose-400",
        };
      case "checking":
      default:
        return {
          icon: <AlertCircle className="w-4 h-4 text-amber-400 animate-spin" />,
          text: "Kontrol ediliyor",
          color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
          dot: "bg-amber-400 animate-ping",
        };
    }
  };

  const services = [
    {
      name: "Web / Siteler",
      target: "HTTP / HTTPS Port 443",
      icon: Globe,
      status: web,
      ping: webPing,
      desc: "Yasaklı siteler & forumlar",
    },
    {
      name: "Discord",
      target: "Gateway + RTC Voice UDP",
      icon: MessageSquare,
      status: discord,
      ping: discordPing,
      desc: "Ses odaları ve mesajlaşma",
    },
    {
      name: "Roblox",
      target: "Roblox Game Servers",
      icon: Gamepad2,
      status: roblox,
      ping: robloxPing,
      desc: "Oyun sunucu bağlantısı",
    },
    {
      name: "Güvenli DNS (DoH)",
      target: "1.1.1.1 / Quad9 over HTTPS",
      icon: ShieldCheck,
      status: dns,
      ping: dnsPing,
      desc: "Şifreli DNS tüneli",
    },
  ];

  return (
    <div className="w-full my-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Hizmet ve Ağ Durumları
        </h3>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isChecking}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? "animate-spin text-cyan-400" : ""}`} />
            <span>{isChecking ? "Taranıyor..." : "Yeniden Test Et"}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {services.map((srv, idx) => {
          const badge = getStatusBadge(srv.status);
          const Icon = srv.icon;

          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col justify-between"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-slate-800/90 text-cyan-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{srv.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">{srv.target}</p>
                  </div>
                </div>
                <span className={`w-2 h-2 rounded-full mt-1.5 ${badge.dot}`} />
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${badge.color}`}>
                  {badge.icon}
                  {badge.text}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {srv.status === "connected" ? `${srv.ping} ms` : "--"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
