export default function Header({ lastRefresh, refreshing, onRefreshNow }) {
  return (
    <header className="header">
      <div>
        <h1>IDX Stock Journal</h1>
        <div className="sub">
          {refreshing
            ? "Mengambil harga realtime…"
            : lastRefresh
              ? `Update terakhir: ${new Date(lastRefresh).toLocaleTimeString("id-ID")}`
              : "Belum ada update harga"}
        </div>
      </div>
      <div className="controls">
        <button className="primary" onClick={onRefreshNow}>
          Refresh Now
        </button>
      </div>
    </header>
  );
}
