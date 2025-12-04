import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import TransactionForm from "../components/TransactionForm.jsx";
import PortfolioTable from "../components/PortofolioTable.jsx";
import SummaryBar from "../components/SummaryBar.jsx";

export default function Dashboard() {
  const {
    transactions,
    quotes,
    upsertTransaction,
    deleteTransaction,
  } = useOutletContext();

  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState("");

  return (
    <>
      <div className="row cols-1">
        <TransactionForm
          editing={editing}
          onSubmit={(tx) => {
            upsertTransaction(tx);
            setEditing(null);
          }}
          onCancel={() => setEditing(null)}
        />
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
    </>
  );
}
