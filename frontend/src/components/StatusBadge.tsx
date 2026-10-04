export function StatusBadge({ status }: { status: string }) {
  const color =
    status === "processed"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : status === "processing"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : status === "failed"
      ? "bg-red-50 text-red-700 border-red-200"
      : "bg-neutral-100 text-neutral-600 border-neutral-200";
  return (
    <span className={`text-xs px-2 py-0.5 rounded border ${color}`}>
      {status}
    </span>
  );
}