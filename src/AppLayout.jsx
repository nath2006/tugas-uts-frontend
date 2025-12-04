import { Outlet } from "react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import Header from "./components/Header.jsx";

import { fetchQuote } from "./utils/serpapi.js";
import {
  loadSettings,
  loadTransactions,
  saveSettings,
  saveTransactions,
} from "./utils/storage.js";
import { normalizeSymbol } from "./utils/format.js";

export default function AppLayout() {
  const [transactions, setTransactions] = useState(loadTransactions);
  const [settings, setSettings] = useState(loadSettings);
  const [quotes, setQuotes] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);

  const timerRef = useRef(null);

  // persist to localStorage
  useEffect(() => saveTransactions(transactions), [transactions]);

  function handleSaveSettings(next) {
    setSettings(next);
    saveSettings(next);
  }

  // unique symbols
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

  // fetch first time
  useEffect(() => {
    refreshQuotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbols.join("|"), settings.apiKey]);

  function upsertTransaction(tx) {
    setTransactions((prev) => {
      const exists = prev.some((p) => p.id === tx.id);
      if (exists) return prev.map((p) => (p.id === tx.id ? tx : p));
      return [tx, ...prev];
    });
  }

  function deleteTransaction(id) {
    setTransactions((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="container">
      <Header
        lastRefresh={lastRefresh}
        refreshing={refreshing}
        onRefreshNow={refreshQuotes}
      />

      {/* context untuk child pages */}
      <Outlet
        context={{
          transactions,
          quotes,
          settings,
          refreshing,
          lastRefresh,
          refreshQuotes,
          upsertTransaction,
          deleteTransaction,
          handleSaveSettings,
        }}
      />
    </div>
  );
}
