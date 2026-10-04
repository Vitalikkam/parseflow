export function ApiDocs() {
  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-semibold">API</h1>
      <p className="text-sm text-neutral-500 mt-1 mb-6">
        ParseFlow exposes a REST API for programmatic access.
      </p>
      <div className="bg-white border border-neutral-200 rounded-lg p-5 space-y-3 text-sm font-mono">
        <div><span className="text-emerald-700">POST</span> /api/v1/documents — upload and process</div>
        <div><span className="text-blue-700">GET</span>  /api/v1/documents — list documents</div>
        <div><span className="text-blue-700">GET</span>  /api/v1/documents/{"{id}"} — retrieve result</div>
        <div><span className="text-blue-700">GET</span>  /api/v1/documents/{"{id}"}/file — original PDF</div>
      </div>
    </div>
  );
}