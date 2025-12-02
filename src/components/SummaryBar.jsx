import { rupiah, calcRow } from "../utils/format.js";

export default function SummaryBar({ rows, quotes }) {
  const totals = rows.reduce(
    (acc, r) => {
      const qPrice = quotes[r.symbol]?.price ?? 0;
      const c = calcRow(r, qPrice);
      acc.totalBuy += c.totalBuy;
      acc.totalNow += c.totalNow;
      acc.ret += c.retNominal;
      return acc;
    },
    { totalBuy: 0, totalNow: 0, ret: 0 }
  );

  const pos = totals.ret >= 0;

  return (
    <section className="summary">
      <div className="summary-item">
        <div className="label">TOTAL NILAI INVESTASI SAHAM</div>
        <div className="value">{rupiah(totals.totalBuy)}</div>
      </div>
      <div className="summary-item">
        <div className="label">TOTAL NILAI DIINVESTASIKAN (SEKARANG)</div>
        <div className="value">{rupiah(totals.totalNow)}</div>
      </div>
      <div className={`summary-item ${pos ? "pos" : "neg"}`}>
        <div className="label">TOTAL RETURN</div>
        <div className="value">
          {pos ? "+" : "-"}{rupiah(Math.abs(totals.ret))}
        </div>
      </div>
    </section>
  );
}
