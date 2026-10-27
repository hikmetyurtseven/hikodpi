import { FC } from "react";
import { ShieldCheck, ShieldAlert, RefreshCw, Zap, Headphones, Shield } from "lucide-react";

interface HeaderProps {
  isActive: boolean;
  activeTab: "dashboard" | "diagnostics" | "settings" | "logs";
  onTabChange: (tab: "dashboard" | "diagnostics" | "settings" | "logs") => void;
  onFlushDns: () => void;
  isFlushing: boolean;
  onQuickDnsFix: () => void;
  isAdmin?: boolean;
}

export const Header: FC<HeaderProps> = ({
  isActive,
  activeTab,
  onTabChange,
  onFlushDns,
  isFlushing,
  onQuickDnsFix,
  isAdmin = true,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-900/70 backdrop-blur-xl sticky top-0 z-40 px-5 py-3">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isActive 
                ? "bg-gradient-to-tr from-cyan-500 to-emerald-400 shadow-lg shadow-cyan-500/25 text-slate-950 font-black text-lg" 
                : "bg-slate-800 border border-slate-700 text-slate-400"
            }`}>
              {isActive ? <ShieldCheck className="w-5 h-5 text-slate-950" /> : <ShieldAlert className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black tracking-tight text-white text-lg">Hiko<span className="text-cyan-400">DPI</span></span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  PRO v0.2.0
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                  <Headphones className="w-3 h-3 text-purple-400" />
                  Vibecoding
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isActive ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
                {isActive ? "DPI Parçalama & DoH Koruma Aktif" : "Koruma Devre Dışı (Hazır)"}
                {isAdmin && (
                  <span className="text-[10px] text-emerald-400 font-mono ml-1 px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20">
                    Admin ✓
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Quick buttons on mobile */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={onQuickDnsFix}
              className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20"
              title="1-Tıkla DNS Onar"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
            </button>
            <button
              onClick={onFlushDns}
              disabled={isFlushing}
              className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300"
              title="Flush DNS"
            >
              <RefreshCw className={`w-4 h-4 ${isFlushing ? "animate-spin text-cyan-400" : ""}`} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center p-1 bg-slate-950/80 border border-slate-800/80 rounded-xl text-xs font-semibold w-full md:w-auto justify-center shadow-inner">
          <button
            onClick={() => onTabChange("dashboard")}
            className={`px-4 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Kontrol Paneli
          </button>
          <button
            onClick={() => onTabChange("diagnostics")}
            className={`px-4 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
              activeTab === "diagnostics"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Hizmet Testleri
          </button>
          <button
            onClick={() => onTabChange("settings")}
            className={`px-4 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
              activeTab === "settings"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Ayarlar & DNS
          </button>
          <button
            onClick={() => onTabChange("logs")}
            className={`px-4 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
              activeTab === "logs"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Canlı Loglar
          </button>
        </nav>

        {/* Header Right Actions */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={onQuickDnsFix}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-300 text-xs font-medium transition-colors cursor-pointer"
            title="Sitelere girilemiyorsa DNS zehirlemesini düzeltir"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>DNS Onar (1.1.1.1)</span>
          </button>

          <button
            onClick={onFlushDns}
            disabled={isFlushing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 hover:bg-slate-700/80 text-slate-300 hover:text-white text-xs transition-colors cursor-pointer"
            title="Sistem DNS önbelleğini temizler"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFlushing ? "animate-spin text-cyan-400" : "text-cyan-400"}`} />
            <span>{isFlushing ? "Temizleniyor..." : "Flush DNS"}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
