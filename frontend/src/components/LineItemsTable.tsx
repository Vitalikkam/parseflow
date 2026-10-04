import type { LineItem } from "../lib/api";
import { formatCurrency } from "../lib/format";

interface Props {
  items: LineItem[];
  currency: string;
}

export function LineItemsTable({ items, currency }: Props) {
  if (!items || items.length === 0) {
    return <div className="text-sm text-slate-400 py-3">No line items</div>;
  }

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="text-left px-4 py-2.5 text-[11px] font-medium uppercase tracking-wider text-slate-500">
              Description
            </th>
            <th className="text-right px-4 py-2.5 text-[11px] font-medium uppercase tracking-wider text-slate-500">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} className="border-t border-slate-100">
              <td className="px-4 py-2.5 text-slate-800">{item.description}</td>
              <td className="px-4 py-2.5 text-right text-slate-800 font-mono tabular-nums">
                {formatCurrency(item.amount, currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}