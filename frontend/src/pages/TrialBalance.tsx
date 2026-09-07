import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";
import { api } from "../api/axios";

type TrialBalanceAccount = {
  id: string;
  code: string;
  account: string;
  account_type: string;
  debit: number;
  credit: number;
};

type TrialBalanceResponse = {
  accounts: TrialBalanceAccount[];
  total_debit: number;
  total_credit: number;
  balanced: boolean;
};

const formatMoney = (value: number) =>
  Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const TrialBalance = () => {
  const [report, setReport] = useState<TrialBalanceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReport = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get<TrialBalanceResponse>(
        "/accounting/reports/trial-balance"
      );

      setReport(response.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Failed to load trial balance."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const accounts = report?.accounts || [];

  const totalDebit = useMemo(
    () => Number(report?.total_debit || 0),
    [report]
  );

  const totalCredit = useMemo(
    () => Number(report?.total_credit || 0),
    [report]
  );

  const balanced =
    report?.balanced ?? Math.abs(totalDebit - totalCredit) < 0.01;

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black">
              Trial Balance
            </h1>

            <p className="text-slate-500">
              Verify debit and credit balances before financial reporting
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
          >
            <Lucide.Download size={18} />
            Export Report
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-3 gap-5 mb-8">
          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Total Debit
            </p>

            <h2 className="text-4xl font-black text-blue-600">
              {loading ? "—" : formatMoney(totalDebit)}
            </h2>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Total Credit
            </p>

            <h2 className="text-4xl font-black text-red-600">
              {loading ? "—" : formatMoney(totalCredit)}
            </h2>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Status
            </p>

            <h2
              className={`text-3xl font-black ${
                balanced
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {loading ? "—" : balanced ? "Balanced" : "Mismatch"}
            </h2>
          </div>
        </div>

        <div className="bg-white border rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-4 text-left">
                  Account Code
                </th>

                <th className="p-4 text-left">
                  Account Name
                </th>

                <th className="p-4 text-left">
                  Debit
                </th>

                <th className="p-4 text-left">
                  Credit
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-10 text-center text-slate-500"
                  >
                    Loading trial balance...
                  </td>
                </tr>
              ) : accounts.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-10 text-center text-slate-500"
                  >
                    No accounting accounts found.
                  </td>
                </tr>
              ) : (
                <>
                  {accounts.map((account) => (
                    <tr
                      key={account.id}
                      className="border-t"
                    >
                      <td className="p-4 font-bold">
                        {account.code}
                      </td>

                      <td className="p-4 font-bold text-blue-700">
                        {account.account}
                      </td>

                      <td className="p-4 font-bold">
                        {formatMoney(Number(account.debit))}
                      </td>

                      <td className="p-4 font-bold">
                        {formatMoney(Number(account.credit))}
                      </td>
                    </tr>
                  ))}

                  <tr className="border-t bg-slate-50 font-black">
                    <td className="p-4" colSpan={2}>
                      TOTAL
                    </td>

                    <td className="p-4">
                      {formatMoney(totalDebit)}
                    </td>

                    <td className="p-4">
                      {formatMoney(totalCredit)}
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};
