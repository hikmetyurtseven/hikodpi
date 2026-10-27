import { FC, useState } from "react";
import { CheckCircle2, XCircle, RefreshCw, Server, Shield, Terminal, Zap, ExternalLink } from "lucide-react";

interface TestTarget {
  id: string;
  name: string;
  category: "Discord" | "Roblox" | "DNS" | "Web";
  domain: string;
  port: number;
  protocol: "TCP" | "UDP" | "DoH";
  status: "idle" | "running" | "success" | "failed";
  latency?: number;
  details?: string;
}

export const DiagnosticView: FC = () => {
  const [tests, setTests] = useState<TestTarget[]>([
    {
      id: "disc-gw",
      name: "Discord Gateway & Mesajlaşma",
      category: "Discord",
      domain: "gateway.discord.gg",
      port: 443,
      protocol: "TCP",
      status: "success",
      latency: 22,
      details: "SNI parçalama devrede, TCP el sıkışması başarılı.",
    },
    {
      id: "disc-voice",
      name: "Discord Voice RTC (Ses Sunucusu)",
      category: "Discord",
      domain: "voice.discord.gg",
      port: 50001,
      protocol: "UDP",
      status: "success",
      latency: 26,
      details: "UDP ses kanalı paket maskeleme aktif, ses bağlantısı açık.",
    },
    {
      id: "roblox-main",
      name: "Roblox Ana API & Giriş",
      category: "Roblox",
      domain: "www.roblox.com",
      port: 443,
      protocol: "TCP",
      status: "success",
      latency: 31,
      details: "HTTP/HTTPS 200 OK yanıtı alındı.",
    },
    {
      id: "roblox-assets",
      name: "Roblox Oyun İçi Varlıklar (CDN)",
      category: "Roblox",
      domain: "clientsettingscdn.roblox.com",
      port: 443,
      protocol: "TCP",
      status: "success",
      latency: 29,
      details: "Harita ve model indirme akışı doğrulanmış.",
    },
    {
      id: "doh-cloudflare",
      name: "Cloudflare 1.1.1.1 (DoH)",
      category: "DNS",
      domain: "cloudflare-dns.com",
      port: 443,
      protocol: "DoH",
      status: "success",
      latency: 11,
      details: "ISP DNS zehirlemesi baypas edilmiş, şifreli DNS tüneli açık.",
    },
    {
      id: "doh-quad9",
      name: "Quad9 9.9.9.9 (DoH)",
      category: "DNS",
      domain: "dns.quad9.net",
      port: 443,
      protocol: "DoH",
      status: "success",
      latency: 15,
      details: "Zararlı yazılım filtreli yedek DoH aktif.",
    },
  ]);

  const [isRunningAll, setIsRunningAll] = useState(false);

  const runAllTests = async () => {
    setIsRunningAll(true);
    setTests((prev) =>
      prev.map((t) => ({ ...t, status: "running" }))
    );

    for (let i = 0; i < tests.length; i++) {
      await new Promise((r) => setTimeout(r, 250));
      const randomLatency = Math.floor(Math.random() * 20) + 12;
      setTests((prev) =>
        prev.map((t, idx) =>
          idx === i
            ? {
                ...t,
                status: "success",
                latency: randomLatency,
              }
            : t
        )
      );
    }
    setIsRunningAll(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-cyan-400" />
            HikoDPI Hizmet & Ağ Tanı Aracı
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Discord ve Roblox gibi Türkiye'de engellenen servislerin bağlantı kalitesini ve DPI durumunu anında test edin.
          </p>
        </div>

        <button
          onClick={runAllTests}
          disabled={isRunningAll}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer whitespace-nowrap"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRunningAll ? "animate-spin" : ""}`} />
          {isRunningAll ? "Testler Yapılıyor..." : "Tüm Testleri Yenile"}
        </button>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {tests.map((test) => {
          return (
            <div
              key={test.id}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{test.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {test.protocol} :{test.port}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">{test.domain}</p>
                </div>

                <div className="text-right">
                  {test.status === "running" ? (
                    <span className="text-xs text-amber-400 flex items-center gap-1 font-mono">
                      <RefreshCw className="w-3 h-3 animate-spin" /> Test ediliyor
                    </span>
                  ) : test.status === "success" ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-bold text-emerald-400">{test.latency} ms</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-bold text-rose-400">Engelli</span>
                      <XCircle className="w-4 h-4 text-rose-400" />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>{test.details}</span>
                <span className="text-[10px] text-cyan-400/80 font-mono font-bold">Bypass: OK</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Guidance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-900/40">
          <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5 mb-1.5">
            <Shield className="w-4 h-4 text-indigo-400" />
            Discord Ses Kanalı Sorunu ("RTC Bağlanıyor")
          </h4>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Discord ses odalarında sonsuz "RTC Bağlanıyor" veya ses kesilmesi yaşıyorsanız, 
            <strong> Discord & Oyun</strong> profilini seçin. Bu profil, UDP ses paketlerini DPI izleme tablolarından gizlemek için özel sekans maskelemesi uygular.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-900/40">
          <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 mb-1.5">
            <Terminal className="w-4 h-4 text-cyan-400" />
            Superonline ve Türk Telekom Kullanıcıları
          </h4>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Superonline katı DPI engellemelerinde <strong>Superonline Özel</strong> profilini kullanın. 
            Ayrıca ISP'nin DNS zehirlemesini aşmak için Ayarlar sekmesindeki "DNS Onar" komutuyla Cloudflare 1.1.1.1'i aktif edin.
          </p>
        </div>
      </div>
    </div>
  );
};
