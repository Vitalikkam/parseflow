import { useRef } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listDocuments, uploadDocument } from "../lib/api";
import { StatusBadge } from "../components/StatusBadge";
import { Upload } from "lucide-react";

export function Documents() {
  const qc = useQueryClient();
  const fileInput = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: listDocuments,
  });

  const upload = useMutation({
    mutationFn: uploadDocument,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["documents"] }),
  });

  const onPick = () => fileInput.current?.click();
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload.mutate(file);
    e.target.value = "";
  };

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Documents</h1>
          <p className="text-sm text-neutral-500 mt-1">All uploaded invoices</p>
        </div>
        <div>
          <input
            ref={fileInput}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={onFile}
          />
          <button
            onClick={onPick}
            disabled={upload.isPending}
            className="inline-flex items-center gap-2 bg-neutral-900 text-white text-sm px-4 py-2 rounded-md hover:bg-neutral-800 disabled:opacity-50"
          >
            <Upload size={16} />
            {upload.isPending ? "Processing…" : "Upload PDF"}
          </button>
        </div>
      </div>

      {upload.isError && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">
          Upload failed. Check the file and try again.
        </div>
      )}

      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        {isLoading && <div className="p-5 text-sm text-neutral-500">Loading…</div>}
        {(data?.documents ?? []).map((d) => (
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