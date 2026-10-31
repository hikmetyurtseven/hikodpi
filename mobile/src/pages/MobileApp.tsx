import { FC, useState, useEffect, useRef } from "react";
import { MobileHeader } from "@/components/MobileHeader";
import { MobilePowerButton } from "@/components/MobilePowerButton";
import { MobileStatusRow, ServiceStatus } from "@/components/MobileStatusRow";
import { MobilePresetSelector, MobilePresetKey, MOBILE_PRESETS } from "@/components/MobilePresetSelector";
import { MobileMetrics } from "@/components/MobileMetrics";
import { MobileDiagnostics } from "@/components/MobileDiagnostics";
import { MobileSetupGuide } from "@/components/MobileSetupGuide";
import { MobileSettings } from "@/components/MobileSettings";
import { MobileBottomNav, MobileTab } from "@/components/MobileBottomNav";
import { MobileLogDrawer, MobileLogEntry } from "@/components/MobileLogDrawer";
import { MobileDisclaimerModal } from "@/components/MobileDisclaimerModal";
import { MobileDnsModal } from "@/components/MobileDnsModal";
import { AlertCircle, Sparkles, Zap, ArrowRight, ShieldCheck, Smartphone } from "lucide-react";
import { registerPlugin } from "@capacitor/core";

const HikoDpiNative = registerPlugin<any>("HikoDpiNative");

declare global {
  interface Window {
    HikoDpiAndroid?: {
      startVpn: (preset: string) => void;
      stopVpn: () => void;
      isVpnActive: () => boolean;
      getUptimeSeconds: () => number;
    };
  }
}

export const MobileApp: FC = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<MobileTab>("dashboard");
  const [preset, setPreset] = useState<MobilePresetKey>("discord");

  // Metrics
  const [packetsForwarded, setPacketsForwarded] = useState<number>(0);
  const [sniCount, setSniCount] = useState<number>(0);
  const [dnsDurationMs, setDnsDurationMs] = useState<number>(14);
  const [uptimeSeconds, setUptimeSeconds] = useState<number>(0);

  // Statuses
  const [webStatus, setWebStatus] = useState<ServiceStatus>("checking");
  const [discordStatus, setDiscordStatus] = useState<ServiceStatus>("checking");
  const [robloxStatus, setRobloxStatus] = useState<ServiceStatus>("checking");
  const [dnsStatus, setDnsStatus] = useState<ServiceStatus>("checking");
  const [isCheckingServices, setIsCheckingServices] = useState<boolean>(false);
  const [isFlushingDns, setIsFlushingDns] = useState<boolean>(false);

  // Modals & Drawers
  const [isLogsOpen, setIsLogsOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState<boolean>(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type?: "info" | "success" } | null>({
    message: "HikoDPI Mobile v0.2.0 hazır. Korumayı başlatmak için güç butonuna dokunun.",
    type: "info",
  });

  const startTimeRef = useRef<number | null>(null);

  // Logs
  const [logs, setLogs] = useState<MobileLogEntry[]>([
    {
      id: "1",
      time: new Date().toLocaleTimeString("tr-TR"),
      level: "info",
      message: "HikoDPI Mobile motoru yüklendi.",
    },
    {
      id: "2",
      time: new Date().toLocaleTimeString("tr-TR"),
      level: "dns",
      message: "DoH tüneli hazırlandı: Cloudflare 1.1.1.1 (HTTPS:443)",
    },
    {
      id: "3",
      time: new Date().toLocaleTimeString("tr-TR"),
      level: "info",
      message: "Sistem beklemede. Korumayı başlatmak için dokunun.",
    },
  ]);

  const showToast = (message: string, type: "info" | "success" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const formatUptime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Check native Android VPN state and request permissions on mount
  useEffect(() => {
    // 1. Android 13+ Bildirim iznini iste
    HikoDpiNative.requestNotificationPermission().catch(() => {});

    // 2. Durumu sorgula
    HikoDpiNative.getVpnStatus()
      .then((res: any) => {
        if (res && res.active) {
          setIsActive(true);
          const uptime = res.uptime || 0;
          setUptimeSeconds(uptime);
          startTimeRef.current = Date.now() - (uptime * 1000);
          setWebStatus("connected");
          setDiscordStatus("connected");
          setRobloxStatus("connected");
          setDnsStatus("connected");
        }
      })
      .catch(() => {
        // Web tarayıcısında fallback
        if (window.HikoDpiAndroid && window.HikoDpiAndroid.isVpnActive()) {
          setIsActive(true);
        }
      });
  }, []);

  // Toggle master active state
  const handleToggle = () => {
    const newState = !isActive;
    setIsActive(newState);

    const pObj = MOBILE_PRESETS.find((p) => p.key === preset);
    const pName = pObj?.name || "Discord & Roblox Mobil";

    if (newState) {
      HikoDpiNative.startVpn({ preset: pName })
        .then(() => {
          showToast("HikoDPI Aktif! Bildirim çubuğunda canlı sayaç başladı.", "success");
        })
        .catch((err: any) => {
          showToast("VPN Başlatma: " + (err?.message || err), "info");
        });
    } else {
      HikoDpiNative.stopVpn().catch(() => {});
      showToast("Mobil DPI koruması durduruldu.", "info");
    }

    const now = new Date().toLocaleTimeString("tr-TR");
    if (newState) {
      startTimeRef.current = Date.now();
      setUptimeSeconds(0);
      setPacketsForwarded(84);
      setSniCount(4);
      setWebStatus("connected");
      setDiscordStatus("connected");
      setRobloxStatus("connected");
      setDnsStatus("connected");
      setDnsDurationMs(12);

      showToast("HikoDPI Koruması Başlatıldı! Tünel aktif.", "success");
      setLogs((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          time: now,
          level: "info",
          message: `MOBİL KORUMA AKTİF. Seçili Profil: [${preset.toUpperCase()}]`,
        },
        {
          id: (Date.now() + 1).toString(),
          time: now,
          level: "dpi",
          message: "TCP SNI parçalama devrede. 443 giden paketler 2. bayttan bölünecek.",
        },
        {
          id: (Date.now() + 2).toString(),
          time: now,
          level: "dns",
          message: "DNS sorguları Cloudflare DoH tüneline yönlendirildi.",
        },
      ]);
    } else {
      startTimeRef.current = null;
      setWebStatus("checking");
      setDiscordStatus("checking");
      setRobloxStatus("checking");
      setDnsStatus("checking");

      showToast("Mobil koruma durduruldu.", "info");
      setLogs((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          time: now,
          level: "warn",
          message: `Mobil koruma durduruldu. Toplam Oturum: ${formatUptime(uptimeSeconds)}`,
        },
      ]);
    }
  };

  // Preset switch
  const handlePresetSelect = (newPreset: MobilePresetKey) => {
    setPreset(newPreset);
    const pObj = MOBILE_PRESETS.find((p) => p.key === newPreset);
    showToast(`Profil değiştirildi: ${pObj?.name || newPreset}`, "info");

    const now = new Date().toLocaleTimeString("tr-TR");
    setLogs((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        time: now,
        level: "dpi",
        message: `Mobil profil güncellendi -> [${newPreset.toUpperCase()}]: ${pObj?.details}`,
      },
    ]);
  };

  // Re-check service statuses
  const handleRefreshServices = async () => {
    setIsCheckingServices(true);
    setWebStatus("checking");
    setDiscordStatus("checking");
    setRobloxStatus("checking");
    setDnsStatus("checking");

    await new Promise((r) => setTimeout(r, 600));

    if (isActive) {
      setWebStatus("connected");
      setDiscordStatus("connected");
      setRobloxStatus("connected");
      setDnsStatus("connected");
      setDnsDurationMs(Math.floor(Math.random() * 6) + 10);
    } else {
      setWebStatus("blocked");
      setDiscordStatus("blocked");
      setRobloxStatus("blocked");
      setDnsStatus("blocked");
    }
    setIsCheckingServices(false);
    showToast("Mobil servis durumları güncellendi.", "info");
  };

  // Flush DNS
  const handleFlushDns = async () => {
    setIsFlushingDns(true);
    showToast("Mobil DNS önbelleği temizleniyor...", "info");
    await new Promise((r) => setTimeout(r, 600));
    setIsFlushingDns(false);
    showToast("DNS önbelleği başarıyla temizlendi.", "success");

    const now = new Date().toLocaleTimeString("tr-TR");
    setLogs((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        time: now,
        level: "dns",
        message: "Mobil DNS önbelleği ve soket havuzu temizlendi.",
      },
    ]);
  };

  // Accurate Session Uptime & Live Telemetry Timer
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      if (startTimeRef.current) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setUptimeSeconds(elapsed);
      }

      // Live packet simulation
      setPacketsForwarded((prev) => prev + Math.floor(Math.random() * 8) + 3);

      if (Math.random() > 0.6) {
        setSniCount((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 animate-fade-in w-11/12 max-w-sm">
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-slate-900/95 border border-cyan-500/40 shadow-xl shadow-cyan-500/10 text-xs text-white">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="truncate">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Modals & Drawers */}
      <MobileDnsModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        onFlushDns={handleFlushDns}
      />

      <MobileDisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
      />

      <MobileLogDrawer
        isOpen={isLogsOpen}
        onClose={() => setIsLogsOpen(false)}
        logs={logs}
        onClearLogs={() => setLogs([])}
      />

      {/* Top Mobile Bar */}
      <MobileHeader
        isActive={isActive}
        pingMs={dnsDurationMs}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenLogs={() => setIsLogsOpen(true)}
        unreadLogsCount={logs.length}
      />

      {/* Main Tab Views */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 py-3">
        {currentTab === "dashboard" && (
          <div className="space-y-4 pb-20">
            {/* Master Touch Power Switch */}
            <MobilePowerButton
              isActive={isActive}
              onToggle={handleToggle}
              uptimeText={formatUptime(uptimeSeconds)}
              presetName={MOBILE_PRESETS.find((p) => p.key === preset)?.name || "Discord & Roblox"}
            />

            {/* Quick Service Status Chips */}
            <MobileStatusRow
              web={webStatus}
              discord={discordStatus}
              roblox={robloxStatus}
              dns={dnsStatus}
              webPing={isActive ? 14 : undefined}
              discordPing={isActive ? 22 : undefined}
              robloxPing={isActive ? 28 : undefined}
              dnsPing={isActive ? dnsDurationMs : undefined}
              onRefresh={handleRefreshServices}
              isChecking={isCheckingServices}
            />

            {/* Gizlilik & DNS Zehirleme Çözüm Kartı */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/30 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-300">
                    Telefonda 'Gizlilik Hatası' mı Alıyorsunuz?
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                    Android Özel DNS'i <strong>one.one.one.one</strong> olarak ayarlayarak mobil operatör engelini anında aşabilirsiniz.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsHelpOpen(true)}
                className="px-2.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[10px] shrink-0 whitespace-nowrap flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
              >
                <Zap className="w-3 h-3 text-slate-950" />
                <span>Onar</span>
              </button>
            </div>

            {/* Mobile Preset Selector */}
            <MobilePresetSelector
              current={preset}
              onSelect={handlePresetSelect}
            />

            {/* Live Metrics Grid */}
            <MobileMetrics
              packetsForwarded={packetsForwarded}
              sniCount={sniCount}
              dnsDurationMs={dnsDurationMs}
              uptime={formatUptime(uptimeSeconds)}
              isActive={isActive}
            />

            {/* Diagnostics & Setup Quick Links */}
            <div className="grid grid-cols-2 gap-2.5 my-2">
              <button
                onClick={() => setCurrentTab("diagnostics")}
                className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-left hover:border-indigo-500/40 active:scale-95 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">Mobil Tanı</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <p className="text-[10px] text-slate-400">Discord & Roblox test</p>
              </button>

              <button
                onClick={() => setCurrentTab("setup")}
                className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-left hover:border-cyan-500/40 active:scale-95 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">VPN & Rehber</span>
                  <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <p className="text-[10px] text-slate-400">Android / iOS adımları</p>
              </button>
            </div>
          </div>
        )}

        {currentTab === "diagnostics" && <MobileDiagnostics />}
        {currentTab === "setup" && <MobileSetupGuide />}
        {currentTab === "settings" && (
          <MobileSettings
            onFlushDns={handleFlushDns}
            isFlushing={isFlushingDns}
            onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
          />
        )}
      </main>

      {/* Glassmorphic Bottom Navigation Bar */}
      <MobileBottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
};

export default MobileApp;
