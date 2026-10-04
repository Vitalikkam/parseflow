import { PageHeader } from "../components/PageHeader";

export function ApiDocs() {
  return (
    <div className="p-8 max-w-4xl">
      <PageHeader
        title="API"
        subtitle="ParseFlow exposes a REST API for programmatic access."
      />
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 text-sm">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-2 py-0.5 w-14 text-center">
            POST
          </span>
          <code className="font-mono text-slate-700">
            /api/v1/documents
          </code>
          <span className="text-slate-500">— upload and process</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded px-2 py-0.5 w-14 text-center">
            GET
          </span>
          <code className="font-mono text-slate-700">
            /api/v1/documents
          </code>
          <span className="text-slate-500">— list documents</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded px-2 py-0.5 w-14 text-center">
            GET
          </span>
          <code className="font-mono text-slate-700">
            /api/v1/documents/{"{id}"}
          </code>
          <span className="text-slate-500">— retrieve result</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded px-2 py-0.5 w-14 text-center">
            GET
          </span>
          <code className="font-mono text-slate-700">
            /api/v1/documents/{"{id}"}/file
          </code>
          <span className="text-slate-500">— original PDF</span>
        </div>
      </div>
    </div>
  );
}