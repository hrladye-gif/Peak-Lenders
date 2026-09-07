import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";
import { api } from "../api/axios";

type LedgerItem = {
  id: string;
  date: string;
  journal_entry_id: string;
  reference_no: string | null;
  gl_code: string;
  gl_name: string;
  description: string | null;
  debit: number;
  credit: number;
  running_balance: number;
};

const formatMoney = (value: number) =>
  Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatDate = (value: string) =>
  new Date(`${value}T00:00:00`).toLocaleDateString();

export const GeneralLedger = () => {
  const [search, setSearch] = useState("");
  const [ledger, setLedger] = useState<LedgerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLedger = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get<LedgerItem[]>("/accounting/ledger");

      setLedger(response.data || []);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Failed to load the general ledger."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLedger();
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return ledger;

    return ledger.filter((item) =>
      [
        item.date,
        item.reference_no,
        item.gl_code,
        item.gl_name,
        item.description,
        item.debit,
        item.credit,
        item.running_balance,
      ]
        .map((value) => String(value ?? ""))
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [ledger, search]);

  const totalDebit = useMemo(
    () => ledger.reduce((sum, item) => sum + Number(item.debit || 0), 0),
    [ledger]
  );

  const totalCredit = useMemo(
    () => ledger.reduce((sum, item) => sum + Number(item.credit || 0), 0),
    [ledger]
  );

  const accountCount = useMemo(
    () => new Set(ledger.map((item) => item.gl_code)).size,
    [ledger]
  );

  const exportLedger = () => {
    window.print();
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black">General Ledger</h1>
            <p className="text-slate-500">
              View posted financial transactions by account
            </p>
          </div>

          <button
            onClick={exportLedger}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
          >
            <Lucide.Download size={18} />
            Export Ledger
          </button>
        </div>

        <div className="grid grid-cols-4 gap-5 mb-8">
          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">Transactions</p>
            <h2 className="text-4xl font-black">{ledger.length}</h2>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">Total Debits</p>
            <h2 className="text-3xl font-black text-blue-600">
              {formatMoney(totalDebit)}
            </h2>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">Total Credits</p>
            <h2 className="text-3xl font-black text-red-600">
              {formatMoney(totalCredit)}
            </h2>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">Accounts</p>
            <h2 className="text-4xl font-black">{accountCount}</h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="p-5 border-b flex items-center justify-between gap-4">
            <input
              className="border rounded-xl px-4 py-3 w-96"
              placeholder="Search ledger..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              onClick={loadLedger}
              disabled={loading}
              className="border px-4 py-3 rounded-xl font-semibold hover:bg-slate-50 disabled:opacity-50"
            >
              <Lucide.RefreshCw
                size={18}
                className={loading ? "animate-spin" : ""}
              />
            </button>
          </div>

          {error && (
            <div className="m-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="p-12 text-center text-slate-500">
              Loading general ledger...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <Lucide.BookOpen className="mx-auto mb-3 text-slate-400" size={40} />
              <p className="font-semibold text-slate-700">
                {ledger.length === 0
                  ? "No posted ledger transactions yet."
                  : "No transactions match your search."}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Ledger activity will appear here when financial transactions
                are posted.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-4 text-left">Date</th>
                    <th className="p-4 text-left">Account</th>
                    <th className="p-4 text-left">Reference</th>
                    <th className="p-4 text-left">Description</th>
                    <th className="p-4 text-right">Debit</th>
                    <th className="p-4 text-right">Credit</th>
                    <th className="p-4 text-right">Balance</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.id} className="border-t hover:bg-slate-50">
                      <td className="p-4 whitespace-nowrap">
                        {formatDate(item.date)}
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-blue-700">
                          {item.gl_code}
                        </div>
                        <div className="text-sm text-slate-500">
                          {item.gl_name}
                        </div>
                      </td>

                      <td className="p-4">
                        {item.reference_no || "—"}
                      </td>

                      <td className="p-4">
                        {item.description || "—"}
                      </td>

                      <td className="p-4 text-right text-green-600 font-bold">
                        {Number(item.debit || 0) > 0
                          ? formatMoney(item.debit)
                          : "—"}
                      </td>

                      <td className="p-4 text-right text-red-600 font-bold">
                        {Number(item.credit || 0) > 0
                          ? formatMoney(item.credit)
                          : "—"}
                      </td>

                      <td className="p-4 text-right font-bold">
                        {formatMoney(item.running_balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>

                <tfoot className="bg-slate-50 border-t-2">
                  <tr>
                    <td colSpan={4} className="p-4 font-black">
                      Total
                    </td>
                    <td className="p-4 text-right font-black text-green-600">
                      {formatMoney(totalDebit)}
                    </td>
                    <td className="p-4 text-right font-black text-red-600">
                      {formatMoney(totalCredit)}
                    </td>
                    <td className="p-4 text-right font-black">
                      {formatMoney(totalDebit - totalCredit)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
