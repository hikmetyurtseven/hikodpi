import { FC, useState } from "react";
import { Sliders, Shield, Globe, Bell, RotateCcw, Check, Zap, Copy, Terminal, AlertCircle } from "lucide-react";

interface SettingsState {
  engineMode: "proxy" | "driver";
  dohProvider: string;
  customDohUrl: string;
  splitPosition: string;
  fakeSniHost: string;
  udpVoiceFix: boolean;
  autoStart: boolean;
  minimizeToTray: boolean;
  enableNotifications: boolean;
}

interface SettingsViewProps {
  onSave?: (settings: SettingsState) => void;
  onFlushDns?: () => void;
  onQuickDnsFix?: () => void;
}

export const SettingsView: FC<SettingsViewProps> = ({ onSave, onFlushDns, onQuickDnsFix }) => {
  const [settings, setSettings] = useState<SettingsState>({
    engineMode: "proxy",
    dohProvider: "cloudflare",
    customDohUrl: "https://1.1.1.1/dns-query",
    splitPosition: "2",
    fakeSniHost: "google.com",
    udpVoiceFix: true,
    autoStart: false,
    minimizeToTray: true,
    enableNotifications: true,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  const dnsPowerShellCommand = 
    `Set-DnsClientServerAddress -InterfaceAlias (Get-NetAdapter | Where-Object Status -eq 'Up').Name -ServerAddresses ('1.1.1.1','1.0.0.1')`;

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(dnsPowerShellCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleSave = () => {
    setSavedSuccess(true);
    if (onSave) onSave(settings);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetDefaults = () => {
    setSettings({
      engineMode: "proxy",
      dohProvider: "cloudflare",
      customDohUrl: "https://1.1.1.1/dns-query",
      splitPosition: "2",
      fakeSniHost: "google.com",
      udpVoiceFix: true,
      autoStart: false,
      minimizeToTray: true,
      enableNotifications: true,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Warning & Fix Guide: "DPI Açıkken Sitelere Erişilemiyorsa" */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/30">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="space-y-2 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-amber-300">
                Önemli: DPI Açıkken Hala Sitelere Erişilemiyor mu?
              </h3>
              <button
                onClick={onQuickDnsFix}
                className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
              >
                <Zap className="w-3.5 h-3.5 text-slate-950" />
                Otomatik DNS Onarımı Uygula
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Türkiye'deki servis sağlayıcılar (Superonline, TTNet, Vodafone), alan adlarını ISP seviyesinde <strong>DNS zehirlemesi</strong> ile engeller. 
              SNI parçalama yapılsa dahi, bilgisayarınız sitenin gerçek IP adresini alamıyorsa bağlantı kurulamaz.
            </p>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-2">
              <div className="font-mono text-[11px] text-cyan-300 select-all overflow-x-auto max-w-xl">
                {dnsPowerShellCommand}
              </div>
              <button
                onClick={handleCopyCmd}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors shrink-0 cursor-pointer"
              >
                {copiedCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCmd ? "Kopyalandı!" : "Komutu Kopyala"}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              💡 PowerShell'i yönetici olarak açıp bu komutu yapıştırarak 1 saniyede güvenli Cloudflare DNS'e geçebilirsiniz.
            </p>
          </div>
        </div>
      </div>

      {/* Settings Header */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            HikoDPI Çekirdek ve Ağ Ayarları
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Çalışma modunu, DoH sağlayıcısını ve paket segmentasyon ayarlarını özelleştirin.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Varsayılana Dön
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Kaydedildi!
              </>
            ) : (
              "Ayarları Kaydet"
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* DoH / DNS Ayarları */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Globe className="w-4 h-4 text-cyan-400" />
            DNS over HTTPS (DoH) Yapılandırması
          </h3>

          <div>
            <label className="text-xs text-slate-400 block mb-2 font-medium">
              Güvenli DNS Sunucusu:
            </label>
            <select
              value={settings.dohProvider}
              onChange={(e) => setSettings({ ...settings, dohProvider: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="cloudflare">Cloudflare DoH (1.1.1.1) - En Hızlı & Önerilen</option>
              <option value="google">Google DoH (8.8.8.8) - Yüksek Uyumluluk</option>
              <option value="quad9">Quad9 (9.9.9.9) - Güvenlik & Gizlilik Odaklı</option>
              <option value="adguard">AdGuard DNS (94.140.14.14) - Reklam Engelleyici</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1.5 font-medium">
              Özel DoH Sunucu URL'i:
            </label>
            <input
              type="text"
              value={settings.customDohUrl}
              onChange={(e) => setSettings({ ...settings, customDohUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500 transition-colors"
              placeholder="https://1.1.1.1/dns-query"
            />
          </div>

          <div className="pt-2">
            <button
              onClick={onFlushDns}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700/60 text-xs text-slate-200 font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Windows DNS Önbelleğini Temizle (Flush DNS)</span>
            </button>
          </div>
        </div>

        {/* DPI ve Segmentasyon Ayarları */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Shield className="w-4 h-4 text-emerald-400" />
            SNI Parçalama & Bypass Parametreleri
          </h3>

          <div>
            <label className="text-xs text-slate-400 block mb-2 font-medium">
              SNI Bölme Noktası:
            </label>
            <select
              value={settings.splitPosition}
              onChange={(e) => setSettings({ ...settings, splitPosition: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="2">2. Bayttan Böl (Superonline ve TT için en kararlı)</option>
              <option value="1">1. Bayttan Böl (Ultra Agresif)</option>
              <option value="middle">Domain Ortasından Böl</option>
            </select>
            <p className="text-[10px] text-slate-400 mt-1">
              TLS ClientHello paketinin ilk baytları ayrı TCP segmenti olarak gönderilir; DPI donanımı paketi birleştiremez.
            </p>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1.5 font-medium">
              Sahte SNI Kandırma Alan Adı:
            </label>
            <input
              type="text"
              value={settings.fakeSniHost}
              onChange={(e) => setSettings({ ...settings, fakeSniHost: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500 transition-colors"
              placeholder="google.com"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-xs font-semibold text-slate-200 block">Discord UDP Voice Fix</span>
              <span className="text-[10px] text-slate-400">Ses odalarında RTC paket manipülasyonu</span>
            </div>
            <input
              type="checkbox"
              checked={settings.udpVoiceFix}
              onChange={(e) => setSettings({ ...settings, udpVoiceFix: e.target.checked })}
              className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Sistem Tercihleri */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
          <Bell className="w-4 h-4 text-purple-400" />
          Sistem ve Başlangıç Davranışı
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 cursor-pointer hover:border-slate-700">
            <input
              type="checkbox"
              checked={settings.autoStart}
              onChange={(e) => setSettings({ ...settings, autoStart: e.target.checked })}
              className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
            />
            <div>
              <span className="text-xs font-semibold text-slate-200 block">Windows ile Başlat</span>
              <span className="text-[10px] text-slate-400">Bilgisayar açılışında otomatik aktif</span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 cursor-pointer hover:border-slate-700">
            <input
              type="checkbox"
              checked={settings.minimizeToTray}
              onChange={(e) => setSettings({ ...settings, minimizeToTray: e.target.checked })}
              className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
            />
            <div>
              <span className="text-xs font-semibold text-slate-200 block">Sistem Tepsisine Küçült</span>
              <span className="text-[10px] text-slate-400">Pencere kapatılınca arka planda çalışır</span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 cursor-pointer hover:border-slate-700">
            <input
              type="checkbox"
              checked={settings.enableNotifications}
              onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
              className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
            />
            <div>
              <span className="text-xs font-semibold text-slate-200 block">Masaüstü Bildirimleri</span>
              <span className="text-[10px] text-slate-400">Durum ve profil bildirimleri</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
