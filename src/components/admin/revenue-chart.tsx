"use client";

import { formatPrice } from "@/lib/format";

type Point = { date: Date; value: number };

function niceMax(max: number) {
  if (max <= 0) return 1000;
  const magnitude = 10 ** Math.floor(Math.log10(max));
  const step = [1, 2, 2.5, 5, 10].find((s) => s * magnitude >= max / 4)! * magnitude;
  return Math.ceil(max / step) * step;
}

const dayLabel = new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short" });

/** Single-series daily revenue columns with a per-bar tooltip and a table view. */
export function RevenueChart({ points }: { points: Point[] }) {
  const max = niceMax(Math.max(...points.map((p) => p.value)));
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max);

  return (
    <figure>
      <div className="relative flex h-56 gap-3">
        {/* Y axis */}
        <div className="relative w-14 shrink-0 text-right text-[11px] text-muted tabular-nums" aria-hidden="true">
          {ticks.map((t) => (
            <span key={t} className="absolute right-0 -translate-y-1/2" style={{ bottom: `${(t / max) * 100}%` }}>
              {t >= 1000 ? `${Math.round(t / 1000)}k` : t}
            </span>
          ))}
        </div>
        {/* Plot */}
        <div className="relative flex-1">
          {ticks.map((t) => (
            <div
              key={t}
              className="absolute inset-x-0 h-px bg-line"
              style={{ bottom: `${(t / max) * 100}%` }}
              aria-hidden="true"
            />
          ))}
          <ol className="absolute inset-0 flex items-end gap-0.5" aria-hidden="true">
            {points.map((p) => (
              <li key={p.date.toISOString()} className="group relative flex h-full flex-1 items-end justify-center">
                <span
                  className="w-full max-w-6 rounded-t-[4px] bg-ink transition-opacity group-hover:opacity-80"
                  style={{ height: p.value > 0 ? `max(${(p.value / max) * 100}%, 3px)` : 0 }}
                />
                <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 rounded-lg bg-ink px-2.5 py-1.5 text-center text-[11px] whitespace-nowrap text-paper shadow-lift group-hover:block">
                  <span className="block text-paper/70">{dayLabel.format(p.date)}</span>
                  <span className="font-medium tabular-nums">{formatPrice(p.value)}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="mt-2 flex justify-between pl-[4.25rem] text-[11px] text-muted" aria-hidden="true">
        <span>{dayLabel.format(points[0].date)}</span>
        <span>{dayLabel.format(points[points.length - 1].date)}</span>
      </div>
      <details className="mt-4 text-[13px]">
        <summary className="text-muted hover:text-ink">View as table</summary>
        <div className="mt-3 max-h-56 overflow-auto rounded-xl border border-line">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-surface">
              <tr className="border-b border-line">
                <th scope="col" className="px-3 py-2 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-2 text-right font-medium">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody>
              {points
                .filter((p) => p.value > 0)
                .map((p) => (
                  <tr key={p.date.toISOString()} className="border-b border-line last:border-0">
                    <td className="px-3 py-2">{dayLabel.format(p.date)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{formatPrice(p.value)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
