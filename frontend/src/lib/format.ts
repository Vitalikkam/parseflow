export function formatCurrency(amount: number | null | undefined, currency = "USD"): string {
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

export function statusColor(status: "valid" | "review" | "invalid"): string {
  if (status === "valid") return "text-emerald-600";
  if (status === "review") return "text-amber-600";
  return "text-red-600";
}

export function statusBg(status: "valid" | "review" | "invalid"): string {
  if (status === "valid") return "bg-emerald-50 border-emerald-200";
  if (status === "review") return "bg-amber-50 border-amber-200";
  return "bg-red-50 border-red-200";
}

export function statusIcon(status: "valid" | "review" | "invalid"): string {
  if (status === "valid") return "✓";
  if (status === "review") return "⚠";
  return "✗";
}