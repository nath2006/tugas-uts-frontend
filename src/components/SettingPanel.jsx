import { useEffect, useState } from "react";

export default function SettingsPanel({ settings, onSave }) {
  const [draft, setDraft] = useState({
    apiKey: "",
    refreshSec: 60,
    noCache: true,
    ...settings,
  });

  useEffect(() => {
    setDraft((d) => ({ ...d, ...settings }));
  }, [settings]);

  function update(k, v) {
    setDraft((d) => ({ ...d, [k]: v }));
  }

  function handleSave() {
    const normalized = {
      apiKey: draft.apiKey.trim(),
      refreshSec: Number(draft.refreshSec) || 60,
      noCache: !!draft.noCache,
    };
    onSave(normalized);
  }

  return (
    <section className="card">
      <h2>Settings</h2>

      <div className="settings-grid">
        <div>
          <label>SerpAPI Key</label>
          <input
            type="password"
            placeholder="isi api_key SerpAPI"
            value={draft.apiKey}
            onChange={(e) => update("apiKey", e.target.value)}
          />
          <div className="hint">
            Disimpan lokal di browser. Jangan publish key ke publik.
          </div>
        </div>

        <div>
          <label>Refresh interval (detik)</label>
          <input
            type="number"
            min="15"
            step="5"
            value={draft.refreshSec}
            onChange={(e) => update("refreshSec", e.target.value)}
          />
        </div>

        <div className="toggle">
          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={draft.noCache}
              onChange={(e) => update("noCache", e.target.checked)}
            />
            Paksa realtime (no_cache)
          </label>
          <div className="hint">
            SerpAPI default cache ~1 jam kalau no_cache=false.
          </div>
        </div>

        <div className="settings-actions">
          <button className="primary" onClick={handleSave}>
            Simpan Settings
          </button>
        </div>
      </div>
    </section>
  );
}
