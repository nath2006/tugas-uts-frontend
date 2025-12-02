export const LOT_SIZE = 100;

export function toNumber(v) {
  const n = Number(String(v).replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function rupiah(n) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function pct(n) {
  return `${(n * 100).toFixed(2)}%`;
}

export function normalizeSymbol(sym) {
  if (!sym) return "";
  const s = sym.toUpperCase().trim();
  if (s.startsWith("IDX:")) return `${s.replace("IDX:", "")}:IDX`;
  return s.includes(":") ? s : `${s}:IDX`;
}

export function calcRow(row, quotePrice) {
  const buyPrice = toNumber(row.buyPrice);
  const lots = toNumber(row.lots);
  const shares = lots * LOT_SIZE;
  const totalBuy = buyPrice * shares;

  const nowPrice = quotePrice ?? 0;
  const totalNow = nowPrice * shares;

  const retNominal = totalNow - totalBuy;
  const retPct = totalBuy > 0 ? retNominal / totalBuy : 0;

  return {
    shares,
    totalBuy,
    nowPrice,
    totalNow,
    retNominal,
    retPct,
  };
}
