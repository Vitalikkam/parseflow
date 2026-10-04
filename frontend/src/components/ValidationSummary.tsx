import type { ValidationResult } from "../lib/api";

export function ValidationSummary({ result }: { result: ValidationResult }) {
  const pct = Math.round(result.score * 100);
  const color =
    result.status === "high"
      ? "bg-emerald-500"
      : result.status === "review"
      ? "bg-amber-500"
      : "bg-red-500";

  return (
    <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wide text-neutral-500">
          Validation Score
        </span>
        <span className="text-sm font-semibold">{pct}%</span>
      </div>
      <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-3 text-xs text-neutral-600">
        {result.checks_passed} checks passed ·{" "}
        {result.checks_total - result.checks_passed} needs review
      </div>
    </div>
  );
}