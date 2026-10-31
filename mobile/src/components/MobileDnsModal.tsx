import { FC, useState } from "react";
import { X, Zap, Copy, Check, ShieldCheck, ArrowRight } from "lucide-react";

interface MobileDnsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFlushDns: () => void;
}

export const MobileDnsModal: FC<MobileDnsModalProps> = ({ isOpen, onClose, onFlushDns }) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText("one.one.one.one");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#0b101b] border border-cyan-500/30 rounded-3xl max-w-md w-full p-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-cyan-400 mb-2">
          <Zap className="w-5 h-5" />
          <h3 className="font-bold text-sm text-white">1-Dokunuşla Mobil DNS Onarımı</h3>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          DPI açık olmasına rağmen siteler veya Discord açılmıyorsa, mobil operatörünüz (Turkcell/TTNet/Vodafone) alan adlarını zehirliyor demektir.
        </p>

        <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 mb-4">
          <div className="text-[10px] text-slate-400 font-mono mb-1">Android Özel DNS (Private DNS) Sunucusu:</div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm font-bold text-cyan-400 select-all">one.one.one.one</span>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Kopyalandı!" : "Kopyala"}</span>
            </button>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-300 mb-4 space-y-1">
          <div>1. Telefonunuzun <strong>Ayarlar &gt; Bağlantılar</strong> menüsüne girin.</div>
          <div>2. <strong>Özel DNS (Private DNS)</strong> seçeneğini bulun.</div>
          <div>3. <strong>one.one.one.one</strong> yapıştırıp kaydedin.</div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onFlushDns}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 cursor-pointer"
          >
            DNS Önbelleğini Temizle
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
};
