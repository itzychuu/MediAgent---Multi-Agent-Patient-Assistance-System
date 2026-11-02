import React from "react";
import { AlertTriangle, PhoneCall, ShieldAlert } from "lucide-react";

interface EmergencyAlertBannerProps {
  title?: string;
  guidance?: string;
  redFlags?: string[];
}

export function EmergencyAlertBanner({
  title = "EMERGENCY SAFETY WARNING",
  guidance = "Your reported symptoms match indicators that may require immediate emergency medical care. Please do not delay. Call your local emergency medical service (e.g. 911, 999, 112) or go immediately to the nearest Hospital Emergency Department.",
  redFlags = [],
}: EmergencyAlertBannerProps) {
  return (
    <div className="rounded-2xl border-2 border-rose-500 bg-rose-950/40 p-6 md:p-8 text-rose-100 shadow-2xl shadow-rose-950/50 backdrop-blur-md">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500 text-slate-950 shadow-lg">
          <AlertTriangle className="h-7 w-7" />
        </div>

        <div className="space-y-3 flex-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 px-3 py-1 text-xs font-bold text-rose-300 uppercase tracking-wider">
            <ShieldAlert className="h-3.5 w-3.5" />
            Immediate Action Recommended
          </div>

          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            {title}
          </h2>

          <p className="text-sm md:text-base leading-relaxed text-rose-200">
            {guidance}
          </p>

          {redFlags && redFlags.length > 0 && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-950/60 p-4 space-y-2 mt-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300">
                Triggered Warning Signs:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-rose-200">
                {redFlags.map((flag, idx) => (
                  <li key={idx} className="font-medium">
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-2 flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 rounded-lg bg-rose-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-sm">
              <PhoneCall className="h-4 w-4" />
              <span>Emergency Numbers: 911 (US/CA) &bull; 999 (UK) &bull; 112 (EU/Global)</span>
            </div>
            <span className="text-xs text-rose-300">
              Have someone assist or drive you. Do not drive if experiencing acute dizziness or weakness.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmergencyAlertBanner;
