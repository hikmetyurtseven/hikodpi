import { FC } from "react";
import { X, ShieldAlert, Check } from "lucide-react";

interface MobileDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDisclaimerModal: FC<MobileDisclaimerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#0b101b] border border-cyan-500/30 rounded-3xl max-w-md w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Sorumluluk Reddi Beyanı</h3>
              <p className="text-[10px] text-slate-400">Hukuki Bilgilendirme ve Kullanım Şartları</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto text-xs text-slate-300 space-y-3 leading-relaxed">
          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-300 text-[11px]">
            <strong>DİKKAT:</strong> HikoDPI Mobile, yalnızca ağ protokolleri, DPI davranışları ve TLS/SNI analizi amacıyla eğitim ve araştırma kapsamında geliştirilmiştir.
          </div>

          <div>
            <h4 className="font-bold text-white text-xs mb-1">1. Kullanıcı Sorumluluğu</h4>
            <p className="text-slate-400 text-[11px]">
              Bu yazılımı kullanan her birey, bulunduğu ülkenin yasal mevzuatına (Türkiye Cumhuriyeti için 5651 Sayılı Kanun ve BTK düzenlemeleri) uymakla bizzat yükümlüdür. Doğabilecek her türlü hukuki ve idari sorumluluk münhasıran kullanıcıya aittir.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs mb-1">2. Garanti Muafiyeti ("AS IS")</h4>
            <p className="text-slate-400 text-[11px]">
              Yazılım, MIT Lisansı koşulları çerçevesinde "olduğu gibi" sunulmaktadır. Geliştiriciler kesintisiz veya kusursuz çalışma garantisi vermez.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs mb-1">3. Üçüncü Taraf Hakları</h4>
            <p className="text-slate-400 text-[11px]">
              Discord, Roblox, Cloudflare vb. ticari markalar kendi sahiplerinin mülkiyetindedir. HikoDPI'nin bu kurumlarla resmi bir bağı yoktur.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Okudum ve Anladım</span>
          </button>
        </div>
      </div>
    </div>
  );
};
