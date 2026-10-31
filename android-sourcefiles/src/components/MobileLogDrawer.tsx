import { FC, useState } from "react";
import { X, Trash2, Copy, Check, Terminal, Filter, Shield, Zap } from "lucide-react";

export interface MobileLogEntry {
  id: string;
  time: string;
  level: "info" | "dpi" | "dns" | "warn";
  message: string;
}

interface MobileLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  logs: MobileLogEntry[];
  onClearLogs: () => void;
}

export const MobileLogDrawer: FC<MobileLogDrawerProps> = ({
  isOpen,
  onClose,
  logs,
  onClearLogs,
}) => {
  const [filter, setFilter] = useState<"all" | "dpi" | "dns" | "warn">("all");
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const filteredLogs = logs.filter((l) => (filter === "all" ? true : l.level === filter));

  const handleCopyLogs = () => {
    const text = filteredLogs.map((l) => `[${l.time}] [${l.level.toUpperCase()}] ${l.message}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLevelBadge = (lvl: string) => {
    switch (lvl) {
      case "dpi":
        return <span className="text-cyan-400 font-bold">[DPI]</span>;
      case "dns":
        return <span className="text-emerald-400 font-bold">[DoH]</span>;
      case "warn":
        return <span className="text-amber-400 font-bold">[UYARI]</span>;
      default:
        return <span className="text-slate-400 font-bold">[BİLGİ]</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-end animate-fade-in">
      <div className="bg-[#0b101b] border-t border-cyan-500/30 rounded-t-3xl max-h-[82vh] h-[82vh] flex flex-col shadow-2xl safe-bottom">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Canlı Ağ & DPI Günlüğü</h3>
              <p className="text-[10px] text-slate-400 font-mono">Gerçek Zamanlı Paket Manipülasyonu</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyLogs}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              title="Günlüğü Kopyala"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={onClearLogs}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-rose-400"
              title="Günlüğü Temizle"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 bg-slate-950/70 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: "all", name: `Tümü (${logs.length})` },
            { id: "dpi", name: "DPI Parçalama" },
            { id: "dns", name: "DoH Sorguları" },
            { id: "warn", name: "Uyarılar" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold transition-colors whitespace-nowrap cursor-pointer ${
                filter === f.id
                  ? "bg-cyan-500 text-slate-950 font-black"
                  : "bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700"
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>

        {/* Log Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-[11px]">
          {filteredLogs.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-slate-500 text-xs">
              Bu filtrede henüz günlük kaydı yok.
            </div>
          ) : (
            filteredLogs.map((l) => (
              <div
                key={l.id}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-900 leading-relaxed break-all"
              >
                <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-0.5">
                  <span>{l.time}</span>
                  <span>{getLevelBadge(l.level)}</span>
                </div>
                <div className="text-slate-300">{l.message}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
