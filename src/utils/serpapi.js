export async function fetchQuote(symbol, apiKey, noCache = true) {
  if (!apiKey) throw new Error("API key belum diisi");

  const params = new URLSearchParams({
    engine: "google_finance",
    q: symbol,
    api_key: apiKey,
  });
  if (noCache) params.set("no_cache", "true");

  const url = `/serpapi/search.json?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();

  const price =
    data?.summary?.price ??
    data?.price ??
    data?.finance_results?.price ??
    null;

  const name =
    data?.summary?.title ??
    data?.finance_results?.title ??
    data?.ticker_results?.title ??
    symbol;

  const currency =
    data?.summary?.currency ??
    data?.currency ??
    "IDR";

  if (price == null) throw new Error("Harga tidak ditemukan di response");

  return {
    symbol,
    name,
    currency,
    price: Number(String(price).replace(/[^\d.]/g, "")),
    raw: data,
  };
}
