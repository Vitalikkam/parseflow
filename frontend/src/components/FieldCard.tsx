import type { FieldValidation } from "../lib/api";
import { Check, AlertTriangle, X } from "lucide-react";

interface Props {
  label: string;
  value: string;
  validation?: FieldValidation;
}

export function FieldCard({ label, value, validation }: Props) {
  const status = validation?.status ?? "valid";

  const icon =
    status === "valid" ? (
      <Check size={14} className="text-emerald-600" strokeWidth={3} />
    ) : status === "review" ? (
      <AlertTriangle size={14} className="text-amber-600" />
    ) : (
      <X size={14} className="text-red-600" strokeWidth={3} />
    );

  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-slate-100 last:border-b-0">
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-medium uppercase tracking-wider text-slate-500 mb-1">
          {label}
        </div>
        <div className="text-sm font-medium text-slate-900 break-words">
          {value || "—"}
        </div>
        {validation?.checks && validation.checks.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5">
            {validation.checks.map((check) => (
              <span key={check} className="text-[11px] text-slate-400">
                {check.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="shrink-0 mt-0.5">{icon}</div>
    </div>
  );
}