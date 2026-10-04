import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  CheckCircle2,
  TrendingUp,
  Upload,
  ArrowRight,
  Clock,
} from "lucide-react";
import { listDocuments } from "../lib/api";
import { StatusBadge } from "../components/StatusBadge";
import { PageHeader } from "../components/PageHeader";
import { StatCard } from "../components/StatCard";
import { ActivityFeed } from "../components/ActivityFeed";
import { DocumentTypeBreakdown } from "../components/DocumentTypeBreakdown";
import { ProcessingTimeline } from "../components/ProcessingTimeline";
import { scoreColor, scoreBg, formatRelativeTime } from "../lib/format";

export function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["documents"],
    queryFn: listDocuments,
  });

  const docs = data?.documents ?? [];
  const processed = docs.filter((d) => d.status === "processed").length;
  const withScore = docs.filter((d) => d.validation_score != null);
  const avgScore = withScore.length
    ? withScore.reduce((s, d) => s + (d.validation_score ?? 0), 0) /
      withScore.length
    : 0;

  return (
    <div className="p-8">
      <PageHeader
        title="Dashboard"
        subtitle="Document intelligence overview"
        action={
          <Link
            to="/documents"
            className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Upload size={16} />
            Upload Document
          </Link>
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Documents"
          value={data?.total ?? 0}
          icon={<FileText size={16} />}
          accent="blue"
        />
        <StatCard
          label="Processed"
          value={processed}
          icon={<CheckCircle2 size={16} />}
          accent="emerald"
        />
        <StatCard
          label="Avg Validation"
          value={avgScore ? `${(avgScore * 100).toFixed(1)}%` : "—"}
          icon={<TrendingUp size={16} />}
          accent="emerald"
          sub={
            withScore.length > 0 ? (
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${scoreBg(avgScore)}`}
                  style={{ width: `${avgScore * 100}%` }}
                />
              </div>
            ) : null
          }
        />
        <StatCard
          label="Avg Processing"
          value="2.4s"
          icon={<Clock size={16} />}
          accent="slate"
        />
      </div>

      {/* Two-column main area */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left: documents */}
        <div className="col-span-2">
          <div className="panel overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Recent Documents
              </div>
              <Link
                to="/documents"
                className="text-xs font-medium text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 transition-colors"
              >
                View all <ArrowRight size={12} />
              </Link>
            </div>

            {isLoading && (
              <div className="p-5 text-sm text-slate-500">Loading…</div>
            )}

            {error && (
              <div className="p-5 text-sm text-red-600">
                Failed to load documents
              </div>
            )}

            {!isLoading && docs.length === 0 && (
              <div className="p-8 text-center">
                <div className="w-12 h-12 rounded-lg bg-slate-100 mx-auto mb-3 flex items-center justify-center">
                  <FileText size={20} className="text-slate-400" />
                </div>
                <div className="text-sm font-medium text-slate-900 mb-1">
                  No documents yet
                </div>
                <div className="text-xs text-slate-500 mb-4">
                  Upload your first invoice to get started
                </div>
                <Link
                  to="/documents"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Upload size={14} />
                  Upload Document
                </Link>
              </div>
            )}

            {docs.slice(0, 6).map((d) => (
              <Link
                key={d.id}
                to={`/documents/${d.id}`}
                className="flex items-center gap-4 px-5 py-3.5 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors"
              >
                <div className="w-9 h-9 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                  <FileText size={16} className="text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900 truncate">
                    {d.filename}
                  </div>
                  <div className="mt-0.5">
                    <StatusBadge status={d.status} />
                  </div>
                </div>
                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right">
                    <div
                      className={`text-sm font-semibold tabular-nums ${scoreColor(
                        d.validation_score
                      )}`}
                    >
                      {d.validation_score != null
                        ? `${(d.validation_score * 100).toFixed(0)}%`
                        : "—"}
                    </div>
                    <div className="text-[11px] text-slate-400">score</div>
                  </div>
                  <div className="text-xs text-slate-400 w-16 text-right tabular-nums">
                    {formatRelativeTime(d.created_at)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right: activity + breakdown + timeline */}
        <div className="col-span-1 space-y-6">
          <ActivityFeed documents={docs} />
          <DocumentTypeBreakdown documents={docs} />
          <ProcessingTimeline documents={docs} />
        </div>
      </div>
    </div>
  );
}