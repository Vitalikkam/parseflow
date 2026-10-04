import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Download, FileText } from "lucide-react";
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
    return <div className="p-8 text-sm text-slate-500">Loading…</div>;
  }

  if (error || !data) {
    return (
      <div className="p-8">
        <Link
          to="/documents"
          className="text-sm text-slate-500 hover:text-slate-900 inline-flex items-center gap-1"
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
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link
            to="/documents"
            className="text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center">
            <FileText size={16} className="text-slate-600" />
          </div>
          <div>
            <div className="font-medium text-sm text-slate-900">
              {data.filename}
            </div>
            <div className="text-[11px] text-slate-500">
              {data.page_count ?? "—"} page{data.page_count !== 1 ? "s" : ""}
            </div>
          </div>
          <StatusBadge status={data.status} />
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          {data.processing_ms && (
            <>
              <span className="font-mono">
                {(data.processing_ms / 1000).toFixed(1)}s
              </span>
              <span className="text-slate-300">·</span>
            </>
          )}
          <span>Processed</span>
        </div>
      </div>

      {/* Split view */}
      <div className="flex-1 grid grid-cols-2 overflow-hidden">
        {/* Left: PDF */}
        <div className="border-r border-slate-200 overflow-hidden">
          <PdfViewer fileUrl={documentFileUrl(data.id)} />
        </div>

        {/* Right: extracted data */}
        <div className="overflow-y-auto bg-slate-50">
          <div className="p-6 space-y-5">
            {vr && <ValidationSummary result={vr} />}

            {sd ? (
              <>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 px-1">
                    Extracted Information
                  </div>
                  <div className="bg-white border border-slate-200 rounded-lg px-4">
                    <FieldCard
                      label="Vendor"
                      value={sd.vendor}
                      validation={vr?.fields.vendor}
                    />
                    <FieldCard
                      label="Invoice Number"
                      value={sd.invoice_number}
                      validation={vr?.fields.invoice_number}
                    />
                    <FieldCard
                      label="Invoice Date"
                      value={formatDate(sd.invoice_date)}
                      validation={vr?.fields.invoice_date}
                    />
                    <FieldCard
                      label="Due Date"
                      value={formatDate(sd.due_date)}
                      validation={vr?.fields.due_date}
                    />
                    <FieldCard
                      label="Currency"
                      value={sd.currency}
                      validation={vr?.fields.currency}
                    />
                    <FieldCard
                      label="Subtotal"
                      value={formatCurrency(sd.subtotal, sd.currency)}
                      validation={vr?.fields.subtotal}
                    />
                    <FieldCard
                      label="Tax"
                      value={formatCurrency(sd.tax, sd.currency)}
                      validation={vr?.fields.tax}
                    />
                    <FieldCard
                      label="Total"
                      value={formatCurrency(sd.total, sd.currency)}
                      validation={vr?.fields.total}
                    />
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 px-1">
                    Line Items
                  </div>
                  <LineItemsTable items={sd.line_items} currency={sd.currency} />
                </div>

                <div className="pt-1">
                  <button
                    onClick={exportJson}
                    className="inline-flex items-center gap-2 border border-slate-200 bg-white text-slate-700 text-sm font-medium px-4 py-2 rounded-md hover:bg-slate-50 transition-colors"
                  >
                    <Download size={16} />
                    Export JSON
                  </button>
                </div>
              </>
            ) : (
              <div className="text-sm text-slate-500">
                No structured data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}