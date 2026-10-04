export function formatCurrency(
  amount: number | null | undefined,
  currency = "USD"
): string {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatRelativeTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;

  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  return formatDate(iso);
}

export function statusColor(status: "valid" | "review" | "invalid"): string {
  if (status === "valid") return "text-emerald-600";
  if (status === "review") return "text-amber-600";
  return "text-red-600";
}

export function statusIcon(status: "valid" | "review" | "invalid"): string {
  if (status === "valid") return "✓";
  if (status === "review") return "⚠";
  return "✗";
}

export function scoreColor(score: number | null): string {
  if (score == null) return "text-slate-400";
  if (score >= 0.9) return "text-emerald-600";
  if (score >= 0.7) return "text-amber-600";
  return "text-red-600";
}

export function scoreBg(score: number | null): string {
  if (score == null) return "bg-slate-300";
  if (score >= 0.9) return "bg-emerald-500";
  if (score >= 0.7) return "bg-amber-500";
  return "bg-red-500";
}