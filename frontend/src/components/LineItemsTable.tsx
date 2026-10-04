import type { LineItem } from "../lib/api";
import { formatCurrency } from "../lib/format";

interface Props {
  items: LineItem[];
  currency: string;
}

export function LineItemsTable({ items, currency }: Props) {
  if (!items || items.length === 0) {
    return (
      <div className="text-sm text-neutral-400 py-3">No line items</div>
    );
  }

  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
          <tr>
            <th className="text-left px-3 py-2 font-medium">Description</th>
            <th className="text-right px-3 py-2 font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} className="border-t border-neutral-100">
              <td className="px-3 py-2 text-neutral-800">{item.description}</td>
              <td className="px-3 py-2 text-right text-neutral-800 font-mono">
                {formatCurrency(item.amount, currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}