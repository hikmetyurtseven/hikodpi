import { FC, useState } from "react";
import { Smartphone, Zap, Copy, Check, ShieldAlert, ArrowRight, ExternalLink, Settings, Wifi, Apple } from "lucide-react";

export const MobileSetupGuide: FC = () => {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  return (
    <div className="w-full space-y-4 pb-24">
      {/* Alert Banner: Why Mobile Setup is Different */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/30">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">
              📱 Mobil Cihazlarda (Android & iOS) Sansür Nasıl Aşılır?
            </h3>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              Mobil operatörler (Turkcell, Vodafone, Türk Telekom) DNS ve SNI paketlerini farklı filtreler.
              Aşağıdaki 3 pratik yöntemden birini kullanarak telefonunuzdan anında Discord, Roblox ve engelli sitelere erişebilirsiniz.
            </p>
          </div>
        </div>
      </div>

      {/* Method 1: Android Private DNS (1-Click Best Method) */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
            YÖNTEM 1 (EN HIZLI & ROOTSUZ)
          </span>
          <span className="text-[10px] text-slate-400">Android 9 ve Üzeri</span>
        </div>

        <h4 className="text-xs font-bold text-white mb-1">
          Android Özel DNS (Private DNS) Ayarı
        </h4>
        <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
          Telefonunuzun ayarlarından sadece 1 satır girerek tüm hücresel ve Wi-Fi bağlantılarında DNS zehirlemesini (BTK sahte IP tuzağını) kalıcı olarak yok edin:
        </p>

        {/* Copy Box 1 */}
        <div className="mb-3 p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] font-mono text-slate-400">Cloudflare DoT (1.1.1.1):</div>
            <div className="font-mono text-xs font-bold text-cyan-400 select-all">one.one.one.one</div>
          </div>
          <button
            onClick={() => copyToClipboard("one.one.one.one", "cf")}
            className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
          >
            {copiedItem === "cf" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedItem === "cf" ? "Kopyalandı!" : "Kopyala"}</span>
          </button>
        </div>

        {/* Copy Box 2 (AdGuard) */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2 mb-3">
          <div>
            <div className="text-[10px] font-mono text-slate-400">AdGuard Reklamsız DNS:</div>
            <div className="font-mono text-xs font-bold text-emerald-400 select-all">dns.adguard-dns.com</div>
          </div>
          <button
            onClick={() => copyToClipboard("dns.adguard-dns.com", "adg")}
            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
          >
            {copiedItem === "adg" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedItem === "adg" ? "Kopyalandı!" : "Kopyala"}</span>
          </button>
        </div>

        {/* Steps */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300 space-y-1.5">
          <div className="font-bold text-slate-200">Adım Adım Nasıl Yapılır?</div>
          <div>1. Telefonunuzun <strong>Ayarlar (Settings)</strong> menüsünü açın.</div>
          <div>2. <strong>Bağlantılar</strong> veya <strong>Ağ ve İnternet</strong> seçeneğine dokunun.</div>
          <div>3. <strong>Diğer Bağlantı Ayarları &gt; Özel DNS (Private DNS)</strong> kısmına gelin.</div>
          <div>4. <em>"Özel DNS sağlayıcı ana bilgisayar adı"</em> seçip yukarıdaki adresi yapıştırın ve <strong>Kaydet</strong>'e basın.</div>
        </div>
      </div>

      {/* Method 2: Android Wi-Fi Proxy with HikoDPI Engine */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-bold border border-cyan-500/30">
            YÖNTEM 2 (TAM DPI BAYPASI)
          </span>
          <span className="text-[10px] text-slate-400">Wi-Fi & Yerel Ağ</span>
        </div>

        <h4 className="text-xs font-bold text-white mb-1">
          HikoDPI Yerel Ağ Proxy Köprüsü
        </h4>
        <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
          Bilgisayarınızda veya yerel ağda çalışan HikoDPI motorunu (127.0.0.1:8080) telefonunuzun Wi-Fi vekili olarak ayarlayarak 2-baytlık agresif SNI parçalamasından faydalanabilirsiniz:
        </p>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300 space-y-1">
          <div>• Wi-Fi ağınıza basılı tutun ve <strong>Ağı Yönet / Gelişmiş</strong>'i seçin.</div>
          <div>• <strong>Proxy:</strong> Manuel (Elle)</div>
          <div>• <strong>Proxy Sunucu Adı:</strong> Bilgisayarınızın yerel IP'si (ör. <code className="text-cyan-400">192.168.1.100</code>)</div>
          <div>• <strong>Bağlantı Noktası (Port):</strong> <code className="text-cyan-400">8080</code></div>
        </div>
      </div>

      {/* Method 3: iOS (iPhone / iPad) */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold border border-slate-700">
            YÖNTEM 3
          </span>
          <span className="text-[10px] text-slate-400">Apple iOS / iPadOS</span>
        </div>

        <h4 className="text-xs font-bold text-white mb-1">
          iPhone / iPad için Şifreli DoH DNS Profili
        </h4>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          iOS cihazlarda Safari üzerinden resmi Cloudflare DoH mobil profilini yükleyerek veya <strong>1.1.1.1: Faster Internet</strong> uygulamasını App Store'dan indirip sadece <em>"1.1.1.1 DNS"</em> moduna alarak DPI ve DNS engellerini tek tıkla aşabilirsiniz.
        </p>
      </div>
    </div>
  );
};
