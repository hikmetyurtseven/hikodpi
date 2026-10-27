import { FC } from "react";
import { ArrowUpRight, Clock, Gauge, Zap } from "lucide-react";

interface MetricsOverviewProps {
  packetsForwarded: number;
  sniCount: number;
  dnsDurationMs: number;
  uptime: string;
  isActive: boolean;
}

export const MetricsOverview: FC<MetricsOverviewProps> = ({
  packetsForwarded,
  sniCount,
  dnsDurationMs,
  uptime,
  isActive,
}) => {
  const metrics = [
    {
      title: "Aktarılan Paketler",
      value: isActive ? packetsForwarded.toLocaleString("tr-TR") : "0",
      unit: "pkt",
      change: isActive ? "+124 paket/sn" : "Durduruldu",
      color: "text-emerald-400",
      icon: ArrowUpRight,
      bg: "from-emerald-500/10 to-transparent",
    },
    {
      title: "Parçalanan SNI Blokları",
      value: isActive ? sniCount.toLocaleString("tr-TR") : "0",
      unit: "blok",
      change: isActive ? "DPI Baypas Başarılı" : "Kapalı",
      color: "text-cyan-400",
      icon: Zap,
      bg: "from-cyan-500/10 to-transparent",
    },
    {
      title: "DoH Çözüm Gecikmesi",
      value: isActive ? `${dnsDurationMs}` : "--",
      unit: "ms",
      change: isActive ? "Cloudflare 1.1.1.1" : "Kapalı",
      color: "text-indigo-400",
      icon: Gauge,
      bg: "from-indigo-500/10 to-transparent",
    },
    {
      title: "Oturum Süresi",
      value: isActive ? uptime : "00:00:00",
      unit: "",
      change: isActive ? "Canlı Sayaç Aktif" : "Beklemede",
      color: "text-amber-400",
      icon: Clock,
      bg: "from-amber-500/10 to-transparent",
    },
  ];

  return (
    <div className="w-full my-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Canlı Ağ Telemetrisi & Oturum
        </h3>
        <span className="text-[11px] font-mono text-slate-400">
          HikoDPI TCP/TLS Segment Motoru
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 bg-gradient-to-br ${m.bg} flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400">{m.title}</span>
                <Icon className={`w-4 h-4 ${m.color}`} />
              </div>

              <div className="my-1">
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-2xl font-black font-mono tracking-tight ${m.color}`}>
                    {m.value}
                  </span>
                  {m.unit && <span className="text-xs text-slate-400">{m.unit}</span>}
                </div>
              </div>

              <div className="text-[10px] text-slate-400 flex items-center gap-1.5 font-mono mt-1">
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-cyan-400 animate-pulse" : "bg-slate-600"}`} />
                {m.change}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
