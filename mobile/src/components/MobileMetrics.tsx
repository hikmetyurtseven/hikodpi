import { FC } from "react";
import { ArrowUpRight, Clock, Gauge, Zap } from "lucide-react";

interface MobileMetricsProps {
  packetsForwarded: number;
  sniCount: number;
  dnsDurationMs: number;
  uptime: string;
  isActive: boolean;
}

export const MobileMetrics: FC<MobileMetricsProps> = ({
  packetsForwarded,
  sniCount,
  dnsDurationMs,
  uptime,
  isActive,
}) => {
  const metrics = [
    {
      title: "Aktarılan Paket",
      value: isActive ? packetsForwarded.toLocaleString("tr-TR") : "0",
      unit: "pkt",
      icon: ArrowUpRight,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Parçalanan SNI",
      value: isActive ? sniCount.toLocaleString("tr-TR") : "0",
      unit: "blok",
      icon: Zap,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/20",
    },
    {
      title: "DoH Gecikmesi",
      value: isActive ? `${dnsDurationMs}` : "--",
      unit: "ms",
      icon: Gauge,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10 border-indigo-500/20",
    },
    {
      title: "Oturum Süresi",
      value: isActive ? uptime : "00:00:00",
      unit: "",
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
  ];

  return (
    <div className="w-full my-4">
      <div className="flex items-center justify-between mb-2.5 px-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Canlı Mobil Telemetri
        </span>
        <span className={`text-[10px] font-mono ${isActive ? "text-emerald-400" : "text-slate-500"}`}>
          {isActive ? "● CANLI AKIŞ" : "○ DURDURULDU"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-slate-400">{m.title}</span>
                <div className={`p-1.5 rounded-lg border ${m.bg}`}>
                  <Icon className={`w-3.5 h-3.5 ${m.color}`} />
                </div>
              </div>

              <div className="flex items-baseline gap-1">
                <span className={`text-lg font-black tracking-tight ${isActive ? "text-white" : "text-slate-400"}`}>
                  {m.value}
                </span>
                {m.unit && (
                  <span className="text-[10px] font-mono text-slate-500">
                    {m.unit}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
