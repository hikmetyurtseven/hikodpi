import { FC } from "react";
import { Home, Activity, Smartphone, Settings } from "lucide-react";

export type MobileTab = "dashboard" | "diagnostics" | "setup" | "settings";

interface MobileBottomNavProps {
  currentTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
}

export const MobileBottomNav: FC<MobileBottomNavProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: "dashboard" as MobileTab, name: "Ana Panel", icon: Home },
    { id: "diagnostics" as MobileTab, name: "Tanı & Test", icon: Activity },
    { id: "setup" as MobileTab, name: "Kurulum", icon: Smartphone },
    { id: "settings" as MobileTab, name: "Ayarlar", icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0a0e17]/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-2 safe-bottom">
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
        {tabs.map((t) => {
          const isActive = currentTab === t.id;
          const Icon = t.icon;

          return (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer active:scale-95 touch-manipulation relative ${
                isActive
                  ? "text-cyan-400 font-bold"
                  : "text-slate-500 hover:text-slate-300 font-medium"
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-transform ${
                  isActive ? "bg-cyan-500/15 scale-110" : ""
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{t.name}</span>

              {isActive && (
                <span className="absolute -top-1 w-6 h-0.5 bg-cyan-400 rounded-full shadow-sm shadow-cyan-400" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
