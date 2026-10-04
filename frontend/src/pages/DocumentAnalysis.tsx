import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Download, CheckCircle2 } from "lucide-react";
import { documentFileUrl, getDocument } from "../lib/api";
import { PdfViewer } from "../components/PdfViewer";
import { FieldCard } from "../components/FieldCard";
import { ValidationSummary } from "../components/ValidationSummary";
import { LineItemsTable } from "../components/LineItemsTable";
import { StatusBadge } from "../components/StatusBadge";
import { formatCurrency, formatDate } from "../lib/format";

export function DocumentAnalysis() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useQuery({
    queryKey: ["document", id],
    queryFn: () => getDocument(id!),
    enabled: !!id,
  });

  const exportJson = () => {
    if (!data?.structured_data) return;
    const blob = new Blob([JSON.stringify(data.structured_data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.filename.replace(/\.pdf$/i, "")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <div className="p-8 text-sm text-neutral-500">Loading…</div>;
  }

  if (error || !data) {
    return (
      <div className="p-8">
        <Link
          to="/documents"
          className="text-sm text-neutral-500 hover:text-neutral-900 inline-flex items-center gap-1"
        >
          <ArrowLeft size={14} /> Back
        </Link>
        <div className="mt-4 text-sm text-red-600">Document not found</div>
      </div>
    );
  }

  const sd = data.structured_data;
  const vr = data.validation_result;

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/documents"
            className="text-neutral-500 hover:text-neutral-900"
          >
            <ArrowLeft size={18} />
          </Link>
          <span className="font-medium text-sm">{data.filename}</span>
          <StatusBadge status={data.status} />
        </div>
        <div className="text-xs text-neutral-500">
          {data.processing_ms
            ? `Processed in ${(data.processing_ms / 1000).toFixed(1)}s`
            : ""}
        </div>
      </div>

      {/* Split view */}
      <div className="flex-1 grid grid-cols-2 overflow-hidden">
        {/* Left: PDF */}
        <div className="border-r border-neutral-200 overflow-hidden">
          <PdfViewer fileUrl={documentFileUrl(data.id)} />
        </div>

        {/* Right: extracted data */}
        <div className="overflow-y-auto bg-white">
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Extracted Information</h2>
              <p className="text-xs text-neutral-500 mt-1">
                {data.document_type ?? "document"}
              </p>
            </div>

            {vr && <ValidationSummary result={vr} />}

            {sd ? (
              <>
                <div className="border border-neutral-200 rounded-lg px-4">
                  <FieldCard label="Vendor" value={sd.vendor} validation={vr?.fields.vendor} />
                  <FieldCard label="Invoice Number" value={sd.invoice_number} validation={vr?.fields.invoice_number} />
                  <FieldCard label="Invoice Date" value={formatDate(sd.invoice_date)} validation={vr?.fields.invoice_date} />
                  <FieldCard label="Due Date" value={formatDate(sd.due_date)} validation={vr?.fields.due_date} />
                  <FieldCard label="Currency" value={sd.currency} validation={vr?.fields.currency} />
                </div>

                <div className="border border-neutral-200 rounded-lg px-4">
                  <FieldCard label="Subtotal" value={formatCurrency(sd.subtotal, sd.currency)} validation={vr?.fields.subtotal} />
                  <FieldCard label="Tax" value={formatCurrency(sd.tax, sd.currency)} validation={vr?.fields.tax} />
                  <FieldCard label="Total" value={formatCurrency(sd.total, sd.currency)} validation={vr?.fields.total} />
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">
                    Line Items
                  </div>
                  <LineItemsTable items={sd.line_items} currency={sd.currency} />
                </div>

                <div className="flex gap-2 pt-2">
                  <button className="inline-flex items-center gap-2 bg-emerald-600 text-white text-sm px-4 py-2 rounded-md hover:bg-emerald-700">
                    <CheckCircle2 size={16} />
                    Approve
                  </button>
                  <button
                    onClick={exportJson}
                    className="inline-flex items-center gap-2 border border-neutral-200 text-sm px-4 py-2 rounded-md hover:bg-neutral-50"
                  >
                    <Download size={16} />
                    Export JSON
                  </button>
                </div>
              </>
            ) : (
              <div className="text-sm text-neutral-500">
                No structured data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}