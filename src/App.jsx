import { useEffect, useMemo, useRef, useState } from "react";
import Header from "./components/Header.jsx";
import SettingsPanel from "./components/SettingPanel.jsx";
import TransactionForm from "./components/TransactionForm.jsx";
import PortfolioTable from "./components/PortofolioTable.jsx";
import SummaryBar from "./components/SummaryBar.jsx";

import { fetchQuote } from "./utils/serpapi.js";
import {
  loadSettings,
  loadTransactions,
  saveSettings,
  saveTransactions,
} from "./utils/storage.js";
import { normalizeSymbol } from "./utils/format.js";

export default function App() {
  const [transactions, setTransactions] = useState(loadTransactions);
  const [settings, setSettings] = useState(loadSettings);
  const [quotes, setQuotes] = useState({});
  const [editing, setEditing] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);

  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState("");

  const timerRef = useRef(null);

  // persist transactions
  useEffect(() => saveTransactions(transactions), [transactions]);

  // persist settings
  function handleSaveSettings(next) {
    setSettings(next);
    saveSettings(next);
  }

  // unique symbols list
  const symbols = useMemo(() => {
    const set = new Set(transactions.map((t) => normalizeSymbol(t.symbol)));
    return [...set];
  }, [transactions]);

  async function refreshQuotes() {
    if (symbols.length === 0 || !settings.apiKey) return;
    setRefreshing(true);

    try {
      const results = await Promise.allSettled(
        symbols.map((sym) => fetchQuote(sym, settings.apiKey, settings.noCache))
      );

      const nextQuotes = {};
      results.forEach((r) => {
        if (r.status === "fulfilled") {
          nextQuotes[r.value.symbol] = {
            price: r.value.price,
            currency: r.value.currency,
            name: r.value.name,
            updatedAt: Date.now(),
          };
        }
      });

      setQuotes((q) => ({ ...q, ...nextQuotes }));
      setLastRefresh(Date.now());
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  }

  // auto refresh interval
  useEffect(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(
      refreshQuotes,
      Math.max(15, settings.refreshSec) * 1000
    );
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.refreshSec, settings.apiKey, settings.noCache, symbols.join("|")]);

  // first fetch on symbols/settings change
  useEffect(() => { refreshQuotes(); }, [symbols.join("|"), settings.apiKey]);

  function upsertTransaction(tx) {
    setTransactions((prev) => {
      const exists = prev.some((p) => p.id === tx.id);
      if (exists) return prev.map((p) => (p.id === tx.id ? tx : p));
      return [tx, ...prev];
    });
    setEditing(null);
  }

  function deleteTransaction(id) {
    setTransactions((prev) => prev.filter((p) => p.id !== id));
    if (editing?.id === id) setEditing(null);
  }

  return (
    <div className="container">
      <Header
        lastRefresh={lastRefresh}
        refreshing={refreshing}
        onRefreshNow={refreshQuotes}
      />

      <div className="row cols-1">
        <div className="col">
          <TransactionForm
            editing={editing}
            onSubmit={upsertTransaction}
            onCancel={() => setEditing(null)}
          />
        </div>
        {/* <div className="col">
          <SettingsPanel settings={settings} onSave={handleSaveSettings} />
        </div> */}
      </div>

      <SummaryBar rows={transactions} quotes={quotes} />

      <PortfolioTable
        rows={transactions}
        quotes={quotes}
        onEdit={setEditing}
        onDelete={deleteTransaction}
        filter={filter}
        onFilterChange={setFilter}
        sortKey={sortKey}
        onSortChange={setSortKey}
      />

    </div>
  );
}
