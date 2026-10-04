import type { ValidationResult } from "../lib/api";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

export function ValidationSummary({ result }: { result: ValidationResult }) {
  const pct = Math.round(result.score * 100);

  const config =
    result.status === "high"
      ? {
          bar: "bg-emerald-500",
          text: "text-emerald-700",
          bg: "bg-emerald-50",
          border: "border-emerald-200",
          icon: <CheckCircle2 size={16} className="text-emerald-600" />,
          label: "High confidence",
        }
      : result.status === "review"
      ? {
          bar: "bg-amber-500",
          text: "text-amber-700",
          bg: "bg-amber-50",
          border: "border-amber-200",
          icon: <AlertTriangle size={16} className="text-amber-600" />,
          label: "Needs review",
        }
      : {
          bar: "bg-red-500",
          text: "text-red-700",
          bg: "bg-red-50",
          border: "border-red-200",
          icon: <XCircle size={16} className="text-red-600" />,
          label: "Low confidence",
        };

  return (
    <div className={`${config.bg} border ${config.border} rounded-lg p-5`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Validation Score
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-4xl font-semibold tracking-tight ${config.text}`}>
              {pct}%
            </span>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 text-xs font-medium ${config.text}`}>
          {config.icon}
          {config.label}
        </div>
      </div>

      <div className="h-2 bg-white/70 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full ${config.bar} transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-600">
          <span className="font-semibold text-slate-900">
            {result.checks_passed}
          </span>{" "}
          of {result.checks_total} checks passed
        </span>
        {result.checks_total - result.checks_passed > 0 && (
          <span className={config.text}>
            {result.checks_total - result.checks_passed} need review
          </span>
        )}
      </div>
    </div>
  );
}