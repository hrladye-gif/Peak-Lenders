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
  assets: StatementItem[];
  liabilities: StatementItem[];
  equity: StatementItem[];
  income: StatementItem[];
  expenses: StatementItem[];
  totals: {
    assets: number | string;
    liabilities: number | string;
    equity: number | string;
    income: number | string;
    expenses: number | string;
  };
  net_income: number | string;
  total_assets: number | string;
  total_liabilities_equity: number | string;
};

export const BalanceSheet = () => {
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
          "Failed to load balance sheet."
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

  const assets = report?.assets || [];
  const liabilities = report?.liabilities || [];
  const equity = report?.equity || [];

  const totalAssets = Number(report?.total_assets || 0);
  const totalLiabilities = Number(
    report?.totals?.liabilities || 0
  );
  const totalEquity = Number(
    report?.totals?.equity || 0
  );
  const netIncome = Number(report?.net_income || 0);

  const totalLiabilityEquity =
    Number(report?.total_liabilities_equity || 0);

  const difference = totalAssets - totalLiabilityEquity;

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
              Balance Sheet
            </h1>

            <p className="text-slate-500">
              Financial position showing assets, liabilities and equity
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
            Loading live financial statements...
          </div>
        ) : report ? (
          <>
            <div className="grid grid-cols-3 gap-5 mb-8">

              <div className="bg-white border rounded-2xl p-6">
                <p className="text-sm text-slate-500">
                  Total Assets
                </p>

                <h2 className="text-4xl font-black text-blue-600">
                  {money(totalAssets)}
                </h2>
              </div>

              <div className="bg-white border rounded-2xl p-6">
                <p className="text-sm text-slate-500">
                  Liabilities
                </p>

                <h2 className="text-4xl font-black text-red-600">
                  {money(totalLiabilities)}
                </h2>
              </div>

              <div className="bg-white border rounded-2xl p-6">
                <p className="text-sm text-slate-500">
                  Equity
                </p>

                <h2 className="text-4xl font-black text-green-600">
                  {money(totalEquity)}
                </h2>
              </div>

            </div>

            <div className="grid grid-cols-2 gap-8">

              <div className="bg-white border rounded-2xl overflow-hidden">

                <div className="p-5 bg-blue-50 border-b">
                  <h2 className="text-xl font-black">
                    Assets
                  </h2>
                </div>

                <table className="w-full">
                  <tbody>

                    {assets.length === 0 ? (
                      <tr>
                        <td className="p-6 text-center text-slate-500">
                          No asset balances recorded.
                        </td>
                      </tr>
                    ) : (
                      assets.map((asset) => (
                        <tr
                          key={asset.code}
                          className="border-t"
                        >
                          <td className="p-4">
                            <div className="font-bold">
                              {asset.name}
                            </div>

                            <div className="text-xs text-slate-400">
                              {asset.code}
                            </div>
                          </td>

                          <td className="p-4 text-right font-bold">
                            {money(asset.amount)}
                          </td>
                        </tr>
                      ))
                    )}

                    <tr className="border-t bg-slate-50 font-black">
                      <td className="p-4">
                        Total Assets
                      </td>

                      <td className="p-4 text-right">
                        {money(totalAssets)}
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>

              <div className="bg-white border rounded-2xl overflow-hidden">

                <div className="p-5 bg-red-50 border-b">
                  <h2 className="text-xl font-black">
                    Liabilities & Equity
                  </h2>
                </div>

                <table className="w-full">
                  <tbody>

                    {liabilities.length === 0 ? (
                      <tr>
                        <td className="p-6 text-center text-slate-500">
                          No liability balances recorded.
                        </td>
                      </tr>
                    ) : (
                      liabilities.map((item) => (
                        <tr
                          key={item.code}
                          className="border-t"
                        >
                          <td className="p-4">
                            <div className="font-bold">
                              {item.name}
                            </div>

                            <div className="text-xs text-slate-400">
                              {item.code}
                            </div>
                          </td>

                          <td className="p-4 text-right font-bold">
                            {money(item.amount)}
                          </td>
                        </tr>
                      ))
                    )}

                    {equity.map((item) => (
                      <tr
                        key={item.code}
                        className="border-t"
                      >
                        <td className="p-4">
                          <div className="font-bold">
                            {item.name}
                          </div>

                          <div className="text-xs text-slate-400">
                            {item.code}
                          </div>
                        </td>

                        <td className="p-4 text-right font-bold text-green-600">
                          {money(item.amount)}
                        </td>
                      </tr>
                    ))}

                    <tr className="border-t">
                      <td className="p-4 font-bold">
                        Current Period Net Income
                      </td>

                      <td className="p-4 text-right font-bold text-green-600">
                        {money(netIncome)}
                      </td>
                    </tr>

                    <tr className="border-t bg-slate-50 font-black">
                      <td className="p-4">
                        Total Liabilities + Equity
                      </td>

                      <td className="p-4 text-right">
                        {money(totalLiabilityEquity)}
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>

            </div>

            <div className="mt-8 bg-white border rounded-3xl p-8">

              <h2 className="text-2xl font-black mb-3">
                Balance Check
              </h2>

              <p
                className={`text-xl font-black ${
                  Math.abs(difference) < 0.01
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {Math.abs(difference) < 0.01
                  ? "✓ Balance Sheet Balanced"
                  : `⚠ Balance Sheet Difference: ${money(difference)}`}
              </p>

              <p className="text-sm text-slate-500 mt-2">
                Calculated from posted general ledger balances.
              </p>

            </div>
          </>
        ) : null}

      </main>
    </div>
  );
};
