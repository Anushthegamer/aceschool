import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Lock, Eye, EyeOff, Shield } from "lucide-react";

export function LockerApp() {
  const [lockerNum, setLockerNum] = useLocalStorage("edison-locker-num", "");
  const [combo, setCombo] = useLocalStorage("edison-locker-combo", "");
  const [showCombo, setShowCombo] = useState(false);

  return (
    <div className="flex flex-col h-full p-5">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-400 to-gray-600 flex items-center justify-center">
          <Lock className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-foreground">Locker Vault</h3>
          <p className="text-[10px] text-muted-foreground">Securely store your locker info</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">Locker Number</label>
          <input type="text" placeholder="e.g., 142" value={lockerNum} onChange={(e) => setLockerNum(e.target.value)} className="w-full max-w-xs px-3 py-2.5 bg-muted/40 border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">Combination</label>
          <div className="relative max-w-xs">
            <input type={showCombo ? "text" : "password"} placeholder="e.g., 24-16-8" value={combo} onChange={(e) => setCombo(e.target.value)} className="w-full px-3 py-2.5 pr-10 bg-muted/40 border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            <button onClick={() => setShowCombo(!showCombo)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showCombo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
          <Shield className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
            Your locker combination is stored locally on this device only. It is never sent to any server.
          </p>
        </div>
      </div>
    </div>
  );
}
