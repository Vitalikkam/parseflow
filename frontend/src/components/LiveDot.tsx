export function LiveDot({ color = "emerald" }: { color?: "emerald" | "amber" }) {
  const bg = color === "emerald" ? "bg-emerald-500" : "bg-amber-500";
  const ring = color === "emerald" ? "bg-emerald-400" : "bg-amber-400";
  return (
    <span className="relative inline-flex w-2 h-2">
      <span
        className={`absolute inline-flex h-full w-full rounded-full ${ring} opacity-75 animate-ping`}
      />
      <span className={`relative inline-flex rounded-full w-2 h-2 ${bg}`} />
    </span>
  );
}