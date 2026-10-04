import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listDocuments } from "../lib/api";
import { StatusBadge } from "../components/StatusBadge";
import { Upload } from "lucide-react";

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-5">
      <div className="text-xs uppercase tracking-wide text-neutral-500">{label}</div>
      <div className="text-3xl font-semibold mt-2">{value}</div>
      {sub && <div className="text-xs text-neutral-400 mt-1">{sub}</div>}
    </div>
  );
}

export function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["documents"],
    queryFn: listDocuments,
  });

  const docs = data?.documents ?? [];
  const processed = docs.filter((d) => d.status === "processed").length;
  const withScore = docs.filter((d) => d.validation_score != null);
  const avgScore = withScore.length
    ? withScore.reduce((s, d) => s + (d.validation_score ?? 0), 0) / withScore.length
    : 0;

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-neutral-500 mt-1">Document intelligence overview</p>
        </div>
        <Link
          to="/documents"
          className="inline-flex items-center gap-2 bg-neutral-900 text-white text-sm px-4 py-2 rounded-md hover:bg-neutral-800"
        >
          <Upload size={16} />
          Upload Document
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Documents" value={data?.total ?? 0} />
        <StatCard label="Processed" value={processed} />
        <StatCard
          label="Avg Validation"
          value={avgScore ? `${(avgScore * 100).toFixed(1)}%` : "—"}
        />
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <div className="px-5 py-3 border-b border-neutral-200 text-sm font-medium">
          Recent Documents
        </div>
        {isLoading && <div className="p-5 text-sm text-neutral-500">Loading…</div>}
        {error && <div className="p-5 text-sm text-red-600">Failed to load documents</div>}
        {!isLoading && docs.length === 0 && (
          <div className="p-5 text-sm text-neutral-500">
            No documents yet. Upload one to get started.
          </div>
        )}
        {docs.slice(0, 5).map((d) => (
          <Link
            key={d.id}
            to={`/documents/${d.id}`}
            className="flex items-center justify-between px-5 py-3 border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">{d.filename}</span>
              <StatusBadge status={d.status} />
            </div>
            <div className="flex items-center gap-6 text-xs text-neutral-500">
              <span>{d.validation_score != null ? `${(d.validation_score * 100).toFixed(0)}%` : "—"}</span>
              <span>{new Date(d.created_at).toLocaleDateString()}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}