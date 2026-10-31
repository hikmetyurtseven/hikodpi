import { FC, useState } from "react";
import { Sliders, Shield, Zap, RefreshCw, Smartphone, Heart, ExternalLink, Moon, Bell, Check, Info } from "lucide-react";

interface MobileSettingsProps {
  onFlushDns: () => void;
  isFlushing: boolean;
  onOpenDisclaimer: () => void;
}

export const MobileSettings: FC<MobileSettingsProps> = ({
  onFlushDns,
  isFlushing,
  onOpenDisclaimer,
}) => {
  const [dnsProvider, setDnsProvider] = useState<string>("cloudflare");
  const [splitByte, setSplitByte] = useState<number>(2);
  const [batterySaver, setBatterySaver] = useState<boolean>(true);
  const [haptics, setHaptics] = useState<boolean>(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  return (
    <div className="w-full space-y-4 pb-24 relative">
      {toastMsg && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-slate-900 border border-cyan-500/50 text-white text-xs shadow-xl animate-fade-in flex items-center gap-1.5 whitespace-nowrap">
          <Check className="w-3.5 h-3.5 text-cyan-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Engine Parameters */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
        <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          Mobil Baypas Motoru Ayarları
        </h4>

        {/* Upstream DNS Provider */}
        <div className="mb-4">
          <label className="text-[11px] font-medium text-slate-300 block mb-1.5">
            Upstream Şifreli DNS (DoH) Sağlayıcısı
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "cloudflare", name: "Cloudflare (1.1.1.1)", badge: "En Hızlı" },
              { id: "google", name: "Google (8.8.8.8)", badge: "Kararlı" },
              { id: "adguard", name: "AdGuard DNS", badge: "Reklam Engelleyici" },
              { id: "quad9", name: "Quad9 (9.9.9.9)", badge: "Zararlı Yazılım Blok" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setDnsProvider(p.id);
                  showToast(`DNS sağlayıcı güncellendi: ${p.name}`);
                }}
                className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                  dnsProvider === p.id
                    ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-300"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="text-xs font-bold">{p.name}</div>
                <div className="text-[9px] text-slate-500 mt-0.5">{p.badge}</div>
              </button>
            ))}
          </div>
        </div>

        {/* SNI Split Byte */}
        <div className="mb-3">
          <label className="text-[11px] font-medium text-slate-300 block mb-1.5">
            TLS ClientHello SNI Parçalama Noktası
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { byte: 1, name: "1. Bayt", desc: "Hassas" },
              { byte: 2, name: "2. Bayt", desc: "Önerilen ⭐" },
              { byte: 5, name: "5. Bayt", desc: "Agresif" },
            ].map((s) => (
              <button
                key={s.byte}
                onClick={() => {
                  setSplitByte(s.byte);
                  showToast(`SNI Parçalama: ${s.byte}. bayt olarak ayarlandı.`);
                }}
                className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                  splitByte === s.byte
                    ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-300"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="text-xs font-bold">{s.name}</div>
                <div className="text-[9px] text-slate-500">{s.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Preferences & Battery */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          Mobil Tercihler
        </h4>

        {/* Battery Saver */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
          <div>
            <div className="text-xs font-bold text-white">Akıllı Pil Tasarrufu</div>
            <div className="text-[10px] text-slate-400">Ekran kapalıyken arka plan çizimlerini askıya al</div>
          </div>
          <button
            onClick={() => setBatterySaver(!batterySaver)}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              batterySaver ? "bg-cyan-500" : "bg-slate-800"
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                batterySaver ? "right-1" : "left-1"
              }`}
            />
          </button>
        </div>

        {/* Haptics */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
          <div>
            <div className="text-xs font-bold text-white">Titreşim & Haptik Geri Bildirim</div>
            <div className="text-[10px] text-slate-400">Butona basıldığında dokunsal geri bildirim ver</div>
          </div>
          <button
            onClick={() => setHaptics(!haptics)}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              haptics ? "bg-cyan-500" : "bg-slate-800"
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                haptics ? "right-1" : "left-1"
              }`}
            />
          </button>
        </div>

        {/* Flush DNS button */}
        <button
          onClick={onFlushDns}
          disabled={isFlushing}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-xs font-bold text-slate-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFlushing ? "animate-spin" : ""}`} />
          <span>{isFlushing ? "DNS Temizleniyor..." : "Mobil DNS Resolver Önbelleğini Temizle"}</span>
        </button>
      </div>

      {/* About & Legal */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
        <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-400" />
          Hakkında & Lisans
        </h4>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 space-y-2 mb-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Sürüm:</span>
            <span className="font-mono text-cyan-400 font-bold">HikoDPI Mobile v0.2.0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Geliştirme:</span>
            <span className="font-semibold text-purple-300">Built with Vibecoding 🎧</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Lisans:</span>
            <span className="font-semibold text-emerald-400">MIT License</span>
          </div>
        </div>

        <button
          onClick={onOpenDisclaimer}
          className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-amber-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Sorumluluk Reddi Beyanı (Disclaimer)</span>
        </button>
      </div>
    </div>
  );
};
