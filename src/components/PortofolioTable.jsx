import { useEffect, useMemo, useState } from "react";
import Alert from "./Alerts/Alerts.jsx";
import { calcRow, pct, rupiah } from "../utils/format.js";

export default function PortfolioTable({
  rows = [],
  quotes = {},
  onEdit,
  onDelete,
  filter = "",
  onFilterChange = () => {},
  sortKey = "",
  onSortChange = () => {},
}) {
  const [confirmId, setConfirmId] = useState(null);

  // row yang mau dihapus (aman walau rows kosong)
  const targetRow = useMemo(
    () => (rows ?? []).find((r) => r.id === confirmId),
    [rows, confirmId]
  );

  // close modal on ESC
  useEffect(() => {
    if (!confirmId) return;
    const onKey = (e) => {
      if (e.key === "Escape") setConfirmId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirmId]);

  const filtered = useMemo(() => {
    const q = filter.toLowerCase().trim();
    if (!q) return rows;
    return rows.filter((r) => {
      return (
        r.symbol.toLowerCase().includes(q) ||
        (r.company || "").toLowerCase().includes(q)
      );
    });
  }, [rows, filter]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    if (!sortKey) return list;

    return list.sort((a, b) => {
      const qa = quotes[a.symbol]?.price ?? 0;
      const qb = quotes[b.symbol]?.price ?? 0;
      const ca = calcRow(a, qa);
      const cb = calcRow(b, qb);

      switch (sortKey) {
        case "symbol":
          return a.symbol.localeCompare(b.symbol);
        case "return":
          return cb.retNominal - ca.retNominal;
        case "valueNow":
          return cb.totalNow - ca.totalNow;
        default:
          return 0;
      }
    });
  }, [filtered, sortKey, quotes]);

  function openConfirm(id) {
    setConfirmId(id);
  }

  function closeConfirm() {
    setConfirmId(null);
  }

  function confirmDelete() {
    if (!confirmId) return;
    onDelete(confirmId);
    setConfirmId(null);
  }

  return (
    <section className="card">
      {/* ===== MODAL CONFIRM DELETE */}
      {confirmId && (
        <div className="alert-overlay" onClick={closeConfirm}>
          <div className="alert-modal" onClick={(e) => e.stopPropagation()}>
            <Alert
              type="warning"
              title="Yakin mau hapus transaksi ini?"
              message={`${targetRow?.symbol ?? ""} ${
                (targetRow?.company ?? "").trim()
              }`}
              duration={0}
              hideClose
              onClose={closeConfirm}
              actions={
                <>
                  <button className="btn btn-danger" onClick={confirmDelete}>
                    Hapus
                  </button>
                  <button className="btn btn-ghost" onClick={closeConfirm}>
                    Batal
                  </button>
                </>
              }
            />
          </div>
        </div>
      )}

      {/* ===== HEAD + CONTROLS DATA===== */}
      <div className="table-head">
        <h2>Portofolio</h2>

        <div className="table-controls">
          <input
            className="search"
            placeholder="Search kode/nama…"
            value={filter}
            onChange={(e) => onFilterChange(e.target.value)}
          />

          <select
            value={sortKey}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="">Sort: none</option>
            <option value="symbol">Kode Saham</option>
            <option value="return">Return terbesar</option>
            <option value="valueNow">Nilai sekarang terbesar</option>
          </select>
        </div>
      </div>

      {/* ===== TABLE DATA INVESMENT===== */}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Kode Saham</th>
              <th>Nama Perusahaan</th>
              <th className="num">Harga Beli</th>
              <th className="num">Lot</th>
              <th className="num">Total Beli</th>
              <th className="num">Harga Sekarang</th>
              <th className="num">Total Sekarang</th>
              <th className="num">Return</th>
              <th className="num">%</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td
                  colSpan="10"
                  style={{ textAlign: "center", color: "var(--muted)" }}
                >
                  Belum ada transaksi.
                </td>
              </tr>
            ) : (
              sorted.map((r) => {
                const q = quotes[r.symbol];
                const c = calcRow(r, q?.price);
                const pos = c.retNominal >= 0;

                return (
                  <tr key={r.id}>
                    <td>{r.symbol}</td>
                    <td>{r.company || q?.name || "-"}</td>
                    <td className="num">{rupiah(r.buyPrice)}</td>
                    <td className="num">{r.lots}</td>
                    <td className="num">{rupiah(c.totalBuy)}</td>
                    <td className="num">{q ? rupiah(q.price) : "—"}</td>
                    <td className="num">{rupiah(c.totalNow)}</td>
                    <td className={`num ${pos ? "pos" : "neg"}`}>
                      {pos ? "+" : "-"}
                      {rupiah(Math.abs(c.retNominal))}
                    </td>
                    <td className={`num ${pos ? "pos" : "neg"}`}>
                      {pct(c.retPct)}
                    </td>

                    <td>
                      <div className="actions">
                        <button onClick={() => onEdit(r)}>Edit</button>
                        <button
                          className="danger"
                          onClick={() => openConfirm(r.id)}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
