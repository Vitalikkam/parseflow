import type { FieldValidation } from "../lib/api";
import { statusColor, statusIcon } from "../lib/format";

interface Props {
  label: string;
  value: string;
  validation?: FieldValidation;
}

export function FieldCard({ label, value, validation }: Props) {
  const status = validation?.status ?? "valid";

  return (
    <div className="border-b border-neutral-100 last:border-b-0 py-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs uppercase tracking-wide text-neutral-500">
          {label}
        </span>
        {validation && (
          <span className={`text-xs ${statusColor(status)}`}>
            {statusIcon(status)} {status}
          </span>
        )}
      </div>
      <div className="text-sm font-medium text-neutral-900">{value || "—"}</div>
      {validation?.checks && validation.checks.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
          {validation.checks.map((check) => (
            <span key={check} className="text-xs text-neutral-400">
              · {check.replace(/_/g, " ")}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}