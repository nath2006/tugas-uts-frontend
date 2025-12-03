import { useEffect, useState } from "react";
import { normalizeSymbol } from "../utils/format.js";
import Alert from "./Alerts/Alerts.jsx";

const empty = {
  id: null,
  symbol: "",
  company: "",
  buyPrice: "",
  lots: 1,
  date: "",
};

export default function TransactionForm({ editing, onSubmit, onCancel }) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (editing) setForm(editing);
    else setForm(empty);
  }, [editing]);

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      ...form,
      symbol: normalizeSymbol(form.symbol),
      buyPrice: Number(form.buyPrice),
      lots: Number(form.lots),
      id: form.id ?? crypto.randomUUID(),
      date: form.date || new Date().toISOString().slice(0, 10),
    };
    onSubmit(payload);
    setForm(empty);
  }

  return (
    <section className="card">
      <h2>{editing ? "Edit Transaksi" : "Tambah Transaksi"}</h2>
      <div>
            <Alert
              type="warning"
              title="Data Harus Lengkap"
              message="Pastika harga saham lebih dari Rp 0 dan jumlah lot minimal 1."
              duration={400000} // auto close 4 detik (optional)
            />
          </div>
      <form className="form" onSubmit={handleSubmit}>
        <div>
          <label>Kode Saham</label>
          <input
            required
            placeholder="contoh: IDX:BBRI atau BBRI:IDX"
            value={form.symbol}
            onChange={(e) => update("symbol", e.target.value)}
          />
        </div>

        <div>
          <label>Nama Perusahaan (opsional)</label>
          <input
            placeholder="biarkan kosong jika mau auto"
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
          />
        </div>

        <div>
          <label>Harga Beli / Saham</label>
          <input
            required
            type="number"
            min="0"
            step="1"
            placeholder="mis: 3700"
            value={form.buyPrice}
            onChange={(e) => update("buyPrice", e.target.value)}
          />
        </div>

        <div>
          <label>Jumlah Lot</label>
          <input
            required
            type="number"
            min="1"
            step="1"
            value={form.lots}
            onChange={(e) => update("lots", e.target.value)}
          />
        </div>

        <div className="full form-actions">
          <button className="primary" type="submit">
            {editing ? "Simpan Perubahan" : "Tambah"}
          </button>
          {editing && (
            <button type="button" onClick={onCancel}>
              Batal
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
