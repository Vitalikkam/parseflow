import { Link } from "react-router-dom";
import type { DocumentListItem } from "../lib/api";
import { CheckCircle2 } from "lucide-react";
import { formatRelativeTime } from "../lib/format";

interface Props {
  documents: DocumentListItem[];
}

export function ActivityFeed({ documents }: Props) {
  return (
    <div className="panel overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-200">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Activity
        </div>
      </div>
      <div className="divide-y divide-slate-100">
        {documents.length === 0 && (
          <div className="px-5 py-4 text-xs text-slate-400">No activity yet</div>
        )}
        {documents.slice(0, 6).map((d) => (
          <Link
            key={d.id}
            to={`/documents/${d.id}`}
            className="flex items-start gap-3 px-5 py-3 hover:bg-slate-50 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 size={14} className="text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-slate-700 leading-snug">
                <span className="font-medium text-slate-900">
                  {d.filename}
                </span>{" "}
                processed
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {formatRelativeTime(d.created_at)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}