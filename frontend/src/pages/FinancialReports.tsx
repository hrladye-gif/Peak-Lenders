import { useEffect, useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";
import { api } from "../api/axios";

type StatementItem = {
  code: string;
  name: string;
  amount: number | string;
};

type FinancialStatements = {
  income: StatementItem[];
  expenses: StatementItem[];
  totals: {
    income: number | string;
    expenses: number | string;
  };
  net_income: number | string;
};

export const FinancialReports = () => {
  const [report, setReport] = useState<FinancialStatements | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReport = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get<FinancialStatements>(
        "/accounting/reports/financial-statements"
      );

      setReport(response.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Failed to load financial report."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const money = (value: number | string | undefined) =>
    Number(value || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const income = Number(report?.totals?.income || 0);
  const expenses = Number(report?.totals?.expenses || 0);
  const profit = Number(report?.net_income || 0);

  const profitMargin =
    income > 0 ? (profit / income) * 100 : 0;

  const incomeAccounts = report?.income || [];
  const expenseAccounts = report?.expenses || [];

  const rows = [
    ...incomeAccounts.map((item) => ({
      ...item,
      category: "Income",
    })),
    ...expenseAccounts.map((item) => ({
      ...item,
      category: "Expense",
    })),
  ];

  const exportReport = () => {
    window.print();
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black">
              Financial Reports
            </h1>

            <p className="text-slate-500">
              Analyze revenue, expenses and financial performance
            </p>
          </div>

          <button
            onClick={exportReport}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
          >
            <Lucide.Download size={18} />
            Export Report
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 font-semibold">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white border rounded-2xl p-12 text-center text-slate-500">
            Loading live financial data...
          </div>
        ) : report ? (
          <>
            <div className="grid grid-cols-4 gap-5 mb-8">

              <div className="bg-white border rounded-2xl p-6">
                <p className="text-sm text-slate-500">
                  Revenue
                </p>

                <h2 className="text-4xl font-black text-green-600">
                  {money(income)}
                </h2>
              </div>

              <div className="bg-white border rounded-2xl p-6">
                <p className="text-sm text-slate-500">
                  Expenses
                </p>

                <h2 className="text-4xl font-black text-red-600">
                  {money(expenses)}
                </h2>
              </div>

              <div className="bg-white border rounded-2xl p-6">
                <p className="text-sm text-slate-500">
                  Net Profit
                </p>

                <h2
                  className={`text-4xl font-black ${
                    profit >= 0
                      ? "text-blue-600"
                      : "text-red-600"
                  }`}
                >
                  {money(profit)}
                </h2>
              </div>

              <div className="bg-white border rounded-2xl p-6">
                <p className="text-sm text-slate-500">
                  Profit Margin
                </p>

                <h2 className="text-4xl font-black">
                  {profitMargin.toFixed(1)}%
                </h2>
              </div>

            </div>

            <div className="bg-white border rounded-2xl overflow-hidden">

              <div className="p-6 border-b">
                <h2 className="text-xl font-black">
                  Financial Summary
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Posted income and expense account balances
                </p>
              </div>

              <table className="w-full">

                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-4 text-left">
                      Category
                    </th>

                    <th className="p-4 text-left">
                      Account
                    </th>

                    <th className="p-4 text-left">
                      GL Code
                    </th>

                    <th className="p-4 text-right">
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-10 text-center text-slate-500"
                      >
                        No posted income or expense balances recorded.
                      </td>
                    </tr>
                  ) : (
                    rows.map((item) => (
                      <tr
                        key={`${item.category}-${item.code}`}
                        className="border-t"
                      >
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              item.category === "Income"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {item.category}
                          </span>
                        </td>

                        <td className="p-4 font-bold">
                          {item.name}
                        </td>

                        <td className="p-4 text-slate-500 font-mono">
                          {item.code}
                        </td>

                        <td className="p-4 text-right font-black">
                          {money(item.amount)}
                        </td>
                      </tr>
                    ))
                  )}

                </tbody>

              </table>
            </div>

            <div className="grid grid-cols-3 gap-5 mt-8">

              <div className="bg-white border rounded-2xl p-6">
                <h3 className="font-black mb-2">
                  Income Analysis
                </h3>

                <p className="text-slate-500">
                  Revenue is derived from posted income accounts in the general ledger.
                </p>
              </div>

              <div className="bg-white border rounded-2xl p-6">
                <h3 className="font-black mb-2">
                  Expense Control
                </h3>

                <p className="text-slate-500">
                  Expenses are derived from posted expense accounts in the general ledger.
                </p>
              </div>

              <div className="bg-white border rounded-2xl p-6">
                <h3 className="font-black mb-2">
                  Profitability
                </h3>

                <p className="text-slate-500">
                  Net profit is calculated from live posted income less expenses.
                </p>
              </div>

            </div>
          </>
        ) : null}

      </main>
    </div>
  );
};
