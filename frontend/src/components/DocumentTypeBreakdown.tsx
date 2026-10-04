import type { DocumentListItem } from "../lib/api";

interface Props {
  documents: DocumentListItem[];
}

export function DocumentTypeBreakdown({ documents }: Props) {
  const counts = documents.reduce<Record<string, number>>((acc, d) => {
    const key = d.document_type ?? "unknown";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const total = documents.length || 1;
  const types = [
    { key: "invoice", label: "Invoices", color: "bg-blue-500" },
    { key: "contract", label: "Contracts", color: "bg-emerald-500" },
    { key: "resume", label: "Resumes", color: "bg-amber-500" },
  ];

  return (
    <div className="panel overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-200">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Document Types
        </div>
      </div>
      <div className="p-5 space-y-3">
        {types.map(({ key, label, color }) => {
          const count = counts[key] ?? 0;
          const pct = (count / total) * 100;
          return (
            <div key={key}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-600 font-medium">{label}</span>
                <span className="text-slate-400 tabular-nums">{count}</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${color} transition-all`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}