import { useParams } from "react-router-dom";

export function DocumentAnalysis() {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Document {id}</h1>
      <p className="text-sm text-neutral-500 mt-2">
        Full analysis view coming on Day 5.
      </p>
    </div>
  );
}