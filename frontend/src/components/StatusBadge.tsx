export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    processed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    processing: "bg-amber-50 text-amber-700 border-amber-200",
    uploaded: "bg-slate-100 text-slate-600 border-slate-200",
    failed: "bg-red-50 text-red-700 border-red-200",
  };
  const cls =
    styles[status] ?? "bg-slate-100 text-slate-600 border-slate-200";
  return (
    <span
      className={`text-[11px] font-medium px-2 py-0.5 rounded border ${cls}`}
    >
      {status}
    </span>
  );
}