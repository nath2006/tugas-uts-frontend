const KEY = "idx_stock_journal_v1";
const SETTINGS_KEY = "idx_stock_journal_settings_v1";

export function loadTransactions() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function saveTransactions(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {
      apiKey: "",
      refreshSec: 60,
      noCache: true,
    };
  } catch {
    return { apiKey: "", refreshSec: 60, noCache: true };
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
