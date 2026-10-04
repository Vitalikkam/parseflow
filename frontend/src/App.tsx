import { useQuery } from "@tanstack/react-query";
import { getHealth } from "./lib/api";

export default function App() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
  });

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white border border-neutral-200 rounded-lg p-8 shadow-sm max-w-md w-full">
        <h1 className="text-2xl font-semibold mb-1">ParseFlow</h1>
        <p className="text-sm text-neutral-500 mb-6">
          Turn invoices into validated, structured business data.
        </p>

        <div className="border-t border-neutral-200 pt-4">
          <p className="text-xs uppercase tracking-wide text-neutral-400 mb-2">
            Backend status
          </p>
          {isLoading && <p className="text-sm text-neutral-500">Checking…</p>}
          {error && (
            <p className="text-sm text-red-600">
              Cannot reach backend. Is it running on port 8000?
            </p>
          )}
          {data && (
            <p className="text-sm text-emerald-600 font-medium">
              ✓ Connected — {JSON.stringify(data)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}