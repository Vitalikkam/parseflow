import type { DocumentListItem } from "../lib/api";

interface Props {
  documents: DocumentListItem[];
}

export function ProcessingTimeline({ documents }: Props) {
  const days: { date: string; count: number }[] = [];
  const now = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const count = documents.filter((doc) =>
      doc.created_at.startsWith(key)
    ).length;
    days.push({ date: key, count });
  }

  const max = Math.max(...days.map((d) => d.count), 1);

  return (
    <div className="panel overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-200">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Processing Timeline
        </div>
        <div className="text-[11px] text-slate-400 mt-0.5">Last 14 days</div>
      </div>
      <div className="p-5">
        <div className="flex items-end gap-1 h-16">
          {days.map((d) => (
            <div
              key={d.date}
              className="flex-1 bg-blue-500 rounded-sm min-h-[2px] transition-all hover:bg-blue-600"
              style={{ height: `${Math.max((d.count / max) * 100, 4)}%` }}
              title={`${d.date}: ${d.count}`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 mt-2">
          <span>14d ago</span>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}