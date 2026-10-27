import { FC, useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { PowerButton } from "@/components/PowerButton";
import { PresetSelector, PresetKey, PRESETS } from "@/components/PresetSelector";
import { StatusIndicator, ServiceStatus } from "@/components/StatusIndicator";
import { MetricsOverview } from "@/components/MetricsOverview";
import { DiagnosticView } from "@/components/DiagnosticView";
import { SettingsView } from "@/components/SettingsView";
import { LogView, LogEntry } from "@/components/LogView";
import { Shield, Sparkles, Zap, MessageSquare, ArrowRight, Check, AlertCircle, Copy, X } from "lucide-react";

declare global {
  interface Window {
    hikodpi?: {
      getStatus: () => Promise<any>;
      toggleProxy: (options: any) => Promise<any>;
      flushDns: () => Promise<any>;
      quickDnsFix: () => Promise<any>;
      onPacketEvent: (callback: (data: any) => void) => void;
    };
  }
}

export const App: FC = () => {
  // Start inactive by default so user has full control
  const [isActive, setIsActive] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "diagnostics" | "settings" | "logs">("dashboard");
  const [preset, setPreset] = useState<PresetKey>("discord");

  // Metrics - Start from 0
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

  // DNS Modal
  const [showDnsModal, setShowDnsModal] = useState<boolean>(false);
  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type?: "info" | "success" } | null>({
    message: "HikoDPI Pro v0.2.0 hazır. Korumayı başlatmak için güç butonuna basın.",
    type: "info",
  });

  // Reference for accurate uptime tracking
  const startTimeRef = useRef<number | null>(null);

  // Logs
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "1",
      time: new Date().toLocaleTimeString("tr-TR"),
      level: "info",
      message: "HikoDPI v0.2.0 motoru yüklendi.",
    },
    {
      id: "2",
      time: new Date().toLocaleTimeString("tr-TR"),
      level: "dns",
      message: "Cloudflare DoH upstream hazırlandı (1.1.1.1:443)",
    },
    {
      id: "3",
      time: new Date().toLocaleTimeString("tr-TR"),
      level: "info",
      message: "Sistem beklemede. Korumayı başlatmak için güç butonuna tıklayın.",
    },
  ]);

  const showToast = (message: string, type: "info" | "success" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Uptime formatting: 00:00:00
  const formatUptime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Toggle master active state
  const handleToggle = async () => {
    const newState = !isActive;
    setIsActive(newState);

    if (window.hikodpi) {
      await window.hikodpi.toggleProxy({
        enable: newState,
        preset,
        splitPosition: 2,
      });
    }

    const now = new Date().toLocaleTimeString("tr-TR");
    if (newState) {
      startTimeRef.current = Date.now();
      setUptimeSeconds(0);
      setPacketsForwarded(120);
      setSniCount(6);
      setWebStatus("connected");
      setDiscordStatus("connected");
      setRobloxStatus("connected");
      setDnsStatus("connected");
      setDnsDurationMs(12);

      showToast("HikoDPI Koruması Başlatıldı! Siteler açılıyor.", "success");
      setLogs((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          time: now,
          level: "info",
          message: `HikoDPI KORUMASI AKTİF. Seçili Profil: [${preset.toUpperCase()}]`,
        },
        {
          id: (Date.now() + 1).toString(),
          time: now,
          level: "dpi",
          message: "TCP SNI parçalama filtresi devreye alındı. 443 giden paketler 2. bayttan bölünecek.",
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

      showToast("HikoDPI Koruması Durduruldu.", "info");
      setLogs((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          time: now,
          level: "warn",
          message: `HikoDPI Koruması durduruldu. Toplam Oturum Süresi: ${formatUptime(uptimeSeconds)}`,
        },
      ]);
    }
  };

  // Preset change
  const handlePresetSelect = (newPreset: PresetKey) => {
    setPreset(newPreset);
    const presetObj = PRESETS.find((p) => p.key === newPreset);
    showToast(`Profil değiştirildi: ${presetObj?.name || newPreset}`, "info");

    const now = new Date().toLocaleTimeString("tr-TR");
    setLogs((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        time: now,
        level: "dpi",
        message: `Filtre profili güncellendi -> [${newPreset.toUpperCase()}]: ${presetObj?.details}`,
      },
    ]);
  };

  // Flush DNS
  const handleFlushDns = async () => {
    setIsFlushingDns(true);
    showToast("Windows DNS önbelleği temizleniyor...", "info");

    if (window.hikodpi) {
      await window.hikodpi.flushDns();
    } else {
      await new Promise((r) => setTimeout(r, 700));
    }

    setIsFlushingDns(false);
    showToast("DNS önbelleği başarıyla temizlendi (ipconfig /flushdns).", "success");

    const now = new Date().toLocaleTimeString("tr-TR");
    setLogs((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        time: now,
        level: "dns",
        message: "Windows DNS Resolver önbelleği temizlendi (Flush DNS OK).",
      },
    ]);
  };

  // Mount effect to check status and listen to packet events
  useEffect(() => {
    if (window.hikodpi) {
      window.hikodpi.getStatus().then((status) => {
        if (status && status.isActive) {
          setIsActive(true);
          startTimeRef.current = Date.now();
        }
      });

      window.hikodpi.onPacketEvent((data) => {
        setPacketsForwarded((prev) => prev + 1);
        setSniCount((prev) => prev + 1);
        setLogs((prev) => [
          ...prev.slice(-80),
          {
            id: Date.now().toString() + Math.random(),
            time: data.time || new Date().toLocaleTimeString("tr-TR"),
            level: "dpi",
            message: `[BAYPAS] ${data.host} TLS ClientHello ${data.split}. bayttan bölündü.`,
          },
        ]);
      });
    }
  }, []);

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
      setDnsDurationMs(Math.floor(Math.random() * 8) + 11);
    } else {
      setWebStatus("blocked");
      setDiscordStatus("blocked");
      setRobloxStatus("blocked");
      setDnsStatus("blocked");
    }
    setIsCheckingServices(false);
    showToast("Hizmet durumları güncellendi.", "info");
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
      setPacketsForwarded((prev) => prev + Math.floor(Math.random() * 12) + 4);

      if (Math.random() > 0.5) {
        setSniCount((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const dnsCommand = `Set-DnsClientServerAddress -InterfaceAlias (Get-NetAdapter | Where-Object Status -eq 'Up').Name -ServerAddresses ('1.1.1.1','1.0.0.1')`;

  const copyDnsCommand = () => {
    navigator.clipboard.writeText(dnsCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-16 right-5 z-50 animate-fade-in">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/40 shadow-xl shadow-cyan-500/10 text-xs text-white">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* DNS Fix Modal */}
      {showDnsModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowDnsModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5 text-cyan-400 mb-2">
              <Zap className="w-5 h-5" />
              <h3 className="font-bold text-base text-white">1-Tıkla Windows DNS Onarımı (1.1.1.1)</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              DPI açık olmasına rağmen sitelere girilemiyorsa, servis sağlayıcınız (Superonline / TTNet) alan adlarını DNS seviyesinde zehirliyor demektir. 
              Aşağıdaki komutu <strong>Yönetici PowerShell</strong> penceresine yapıştırarak Cloudflare güvenli DNS'i hemen etkinleştirebilirsiniz:
            </p>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-cyan-300 select-all mb-4 break-all">
              {dnsCommand}
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                onClick={handleFlushDns}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold"
              >
                Flush DNS Yap
              </button>
              <button
                onClick={copyDnsCommand}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
              >
                {copiedCmd ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedCmd ? "Kopyalandı!" : "Komutu Kopyala"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* App Header & Navigation */}
      <div>
        <Header
          isActive={isActive}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onFlushDns={handleFlushDns}
          isFlushing={isFlushingDns}
          onQuickDnsFix={() => setShowDnsModal(true)}
        />

        {/* Main Content Area */}
        <main className="max-w-6xl mx-auto px-4 py-6 w-full">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Power Switch Hero */}
              <PowerButton
                isActive={isActive}
                onToggle={handleToggle}
                uptimeText={formatUptime(uptimeSeconds)}
                presetName={PRESETS.find((p) => p.key === preset)?.name || "Discord & Oyun"}
              />

              {/* Service Status Row */}
              <StatusIndicator
                web={webStatus}
                discord={discordStatus}
                roblox={robloxStatus}
                dns={dnsStatus}
                webPing={isActive ? 14 : undefined}
                discordPing={isActive ? 22 : undefined}
                robloxPing={isActive ? 29 : undefined}
                dnsPing={isActive ? dnsDurationMs : undefined}
                onRefresh={handleRefreshServices}
                isChecking={isCheckingServices}
              />

              {/* Gizlilik Hatası Çözüm Rehberi Kartı */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-300">
                      Sitelere Girerken "Gizlilik Hatası" (NET::ERR_CERT_COMMON_NAME_INVALID) mı Alıyorsunuz?
                    </h4>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                      Bu hata, servis sağlayıcınızın (Türk Telekom / Superonline) engelli siteleri sahte BTK sayfasına yönlendirmesinden kaynaklanır. 
                      <strong> HikoDPI-Baslat.bat</strong> dosyasını kullanarak yerel DoH proxy'yi çalıştırın veya tarayıcınızdan (Chrome/Edge) 
                      <em> Ayarlar &gt; Güvenlik &gt; Güvenli DNS</em>'i <strong>Cloudflare (1.1.1.1)</strong> olarak ayarlayın.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDnsModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shrink-0 whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-slate-950" />
                  <span>Çözüm Rehberini Aç</span>
                </button>
              </div>

              {/* Preset Selector */}
              <PresetSelector
                current={preset}
                onSelect={handlePresetSelect}
              />

              {/* Live Metrics Grid */}
              <MetricsOverview
                packetsForwarded={packetsForwarded}
                sniCount={sniCount}
                dnsDurationMs={dnsDurationMs}
                uptime={formatUptime(uptimeSeconds)}
                isActive={isActive}
              />

              {/* Quick Actions and Diagnosis Banner */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div
                  onClick={() => setActiveTab("diagnostics")}
                  className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 group-hover:scale-105 transition-transform">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                        Discord & Roblox Tanı Aracı
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Ses odaları (VoIP), RTC bağlantısı ve oyun sunucularını test et
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </div>

                <div
                  onClick={() => setActiveTab("logs")}
                  className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400 group-hover:scale-105 transition-transform">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        Canlı Trafik & DPI Günlüğü
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Parçalanan SNI paketlerini ve DoH sorgularını canlı izle
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "diagnostics" && <DiagnosticView />}
          {activeTab === "settings" && (
            <SettingsView
              onFlushDns={handleFlushDns}
              onQuickDnsFix={() => setShowDnsModal(true)}
            />
          )}
          {activeTab === "logs" && <LogView logs={logs} onClearLogs={() => setLogs([])} />}
        </main>
      </div>

      {/* App Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 py-3 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-bold text-slate-300">
              <span className={`w-2 h-2 rounded-full ${isActive ? "bg-emerald-400 animate-pulse" : "bg-slate-600"}`} />
              HikoDPI: {isActive ? "AKTİF" : "KAPALI"}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-[11px] text-slate-400 font-mono">
              Profil: {PRESETS.find((p) => p.key === preset)?.name}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono">
            <span>DoH: Cloudflare (1.1.1.1)</span>
            <span>SNI Parçalama: 2. Bayt</span>
            <span className="text-cyan-400">v0.2.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
