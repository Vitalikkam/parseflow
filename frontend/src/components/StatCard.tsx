import type { ReactNode } from "react";

type Accent = "blue" | "emerald" | "amber" | "slate";

interface Props {
  label: string;
  value: string | number;
  icon?: ReactNode;
  sub?: ReactNode;
  accent?: Accent;
}

const accentStyles: Record<Accent, string> = {
  blue: "bg-blue-50 text-blue-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  slate: "bg-slate-100 text-slate-600",
};

export function StatCard({
  label,
  value,
  icon,
  sub,
  accent = "slate",
}: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-300 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </div>
        {icon && (
          <div
            className={`w-8 h-8 rounded-md flex items-center justify-center ${accentStyles[accent]}`}
          >
            {icon}
          </div>
        )}
      </div>
      <div className="text-3xl font-semibold text-slate-900 tracking-tight tabular-nums">
        {value}
      </div>
      {sub && <div className="mt-3">{sub}</div>}
    </div>
  );
}