import { NavLink } from "react-router-dom";

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
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `btn-link primary ${isActive ? "btn-link--active" : ""}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/pengaturan"
          className={({ isActive }) =>
            `btn-link primary ${isActive ? "btn-link--active" : ""}`
          }
        >
          Pengaturan
        </NavLink>

        {/* <button className="primary" onClick={onRefreshNow}>
          Refresh
        </button> */}
      </div>
    </header>
  );
}
