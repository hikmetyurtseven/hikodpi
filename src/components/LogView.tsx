import { FC, useState, useEffect, useRef } from "react";
import { Terminal, Trash2, Copy, Check, Filter } from "lucide-react";

export interface LogEntry {
  id: string;
  time: string;
  level: "info" | "dpi" | "dns" | "warn" | "error";
  message: string;
}

interface LogViewProps {
  logs: LogEntry[];
  onClearLogs: () => void;
}

export const LogView: FC<LogViewProps> = ({ logs, onClearLogs }) => {
  const [filter, setFilter] = useState<string>("all");
  const [copied, setCopied] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const filteredLogs = logs.filter((log) => {
    if (filter === "all") return true;
    return log.level === filter;
  });

  const handleCopy = () => {
    const text = filteredLogs.map((l) => `[${l.time}] [${l.level.toUpperCase()}] ${l.message}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLevelBadge = (level: LogEntry["level"]) => {
    switch (level) {
      case "dpi":
        return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
      case "dns":
        return "text-purple-400 bg-purple-500/10 border-purple-500/20";
      case "warn":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "error":
        return "text-rose-400 bg-rose-500/10 border-rose-500/20";
      case "info":
      default:
        return "text-slate-400 bg-slate-800 border-slate-700";
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Log Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-white">Canlı Ağ Olay Günlüğü</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
            {filteredLogs.length} Olay
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Level Filter */}
          <div className="flex items-center gap-1 text-xs">
            {["all", "dpi", "dns", "info"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilter(lvl)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                  filter === lvl
                    ? "bg-cyan-500 text-slate-950 font-bold"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {lvl === "all" ? "Tümü" : lvl.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="Kopyala"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onClearLogs}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-400 transition-colors cursor-pointer"
              title="Günlüğü Temizle"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Terminal Log Screen */}
      <div className="w-full h-80 rounded-2xl bg-[#070b13] border border-slate-800 p-4 font-mono text-xs overflow-y-auto space-y-1.5 shadow-inner">
        {filteredLogs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-600 text-xs">
            Kayıtlı olay bulunmuyor.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 hover:bg-slate-900/40 py-0.5 px-1 rounded transition-colors">
              <span className="text-slate-600 shrink-0 text-[11px] select-none">{log.time}</span>
              <span className={`shrink-0 text-[10px] font-semibold px-1.5 py-0.2 rounded border ${getLevelBadge(log.level)}`}>
                {log.level.toUpperCase()}
              </span>
              <span className="text-slate-300 break-all leading-relaxed text-[11px]">{log.message}</span>
            </div>
          ))
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  );
};
