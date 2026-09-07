import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";
import { api } from "../api/axios";

type Branch = {
  id: string;
  name: string;
  code?: string;
};

type Borrower = {
  id: string;
  branch_id?: string | null;
  is_active?: boolean;
};

type Loan = {
  id: string;
  branch_id?: string | null;
  principal: number;
  status?: string | null;
};

type Repayment = {
  id: string;
  loan_id: string;
  amount: number;
  principal_paid: number;
};

type BranchReport = {
  id: string;
  name: string;
  borrowers: number;
  loans: number;
  disbursed: number;
  collected: number;
  outstanding: number;
  collectionRate: number;
  performance: string;
};

const formatMoney = (value: number) =>
  Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const getPerformance = (rate: number) => {
  if (rate >= 90) return "Excellent";
  if (rate >= 75) return "Good";
  if (rate >= 60) return "Watch";
  return "At Risk";
};

export const BranchReports = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [repayments, setRepayments] = useState<Repayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReport = async () => {
    try {
      setLoading(true);
      setError("");

      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        throw new Error("User session not found.");
      }

      const user = JSON.parse(storedUser);

      if (!user.tenant_id) {
        throw new Error("Institution information is missing from your session.");
      }

      const [
        branchesResponse,
        borrowersResponse,
        loansResponse,
        repaymentsResponse,
      ] = await Promise.all([
        api.get<Branch[]>(`/branches/${user.tenant_id}`),
        api.get<Borrower[]>("/borrowers"),
        api.get<Loan[]>("/loans/"),
        api.get<Repayment[]>("/repayments/"),
      ]);

      setBranches(branchesResponse.data || []);
      setBorrowers(borrowersResponse.data || []);
      setLoans(loansResponse.data || []);
      setRepayments(repaymentsResponse.data || []);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Failed to load branch report."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const report = useMemo<BranchReport[]>(() => {
    return branches.map((branch) => {
      const branchBorrowers = borrowers.filter(
        (borrower) => borrower.branch_id === branch.id
      );

      const branchLoans = loans.filter(
        (loan) => loan.branch_id === branch.id
      );

      const loanIds = new Set(branchLoans.map((loan) => loan.id));

      const branchRepayments = repayments.filter((repayment) =>
        loanIds.has(repayment.loan_id)
      );

      const disbursed = branchLoans.reduce(
        (sum, loan) => sum + Number(loan.principal || 0),
        0
      );

      const collected = branchRepayments.reduce(
        (sum, repayment) => sum + Number(repayment.amount || 0),
        0
      );

      const principalPaid = branchRepayments.reduce(
        (sum, repayment) => sum + Number(repayment.principal_paid || 0),
        0
      );

      const outstanding = Math.max(0, disbursed - principalPaid);

      const collectionRate =
        disbursed > 0
          ? Math.min(100, (principalPaid / disbursed) * 100)
          : 0;

      const activeLoans = branchLoans.filter((loan) =>
        ["ACTIVE", "OVERDUE"].includes(
          String(loan.status || "").toUpperCase()
        )
      );

      return {
        id: branch.id,
        name: branch.name,
        borrowers: branchBorrowers.length,
        loans: activeLoans.length,
        disbursed,
        collected,
        outstanding,
        collectionRate,
        performance: getPerformance(collectionRate),
      };
    });
  }, [branches, borrowers, loans, repayments]);

  const totals = useMemo(
    () =>
      report.reduce(
        (total, branch) => ({
          borrowers: total.borrowers + branch.borrowers,
          loans: total.loans + branch.loans,
          disbursed: total.disbursed + branch.disbursed,
          collected: total.collected + branch.collected,
          outstanding: total.outstanding + branch.outstanding,
        }),
        {
          borrowers: 0,
          loans: 0,
          disbursed: 0,
          collected: 0,
          outstanding: 0,
        }
      ),
    [report]
  );

  const overallCollectionRate =
    totals.disbursed > 0
      ? Math.min(
          100,
          (report.reduce(
            (sum, branch) =>
              sum +
              branch.disbursed -
              branch.outstanding,
            0
          ) /
            totals.disbursed) *
            100
        )
      : 0;

  const exportReport = () => {
    window.print();
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black">Branch Reports</h1>
            <p className="text-slate-500">
              Compare branch performance and operations
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={loadReport}
              disabled={loading}
              className="border bg-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50"
            >
              <Lucide.RefreshCw
                size={18}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              onClick={exportReport}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
            >
              <Lucide.Download size={18} />
              Export Report
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-4 gap-5 mb-8">
          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">Branches</p>
            <h2 className="text-4xl font-black">{report.length}</h2>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">Borrowers</p>
            <h2 className="text-4xl font-black text-blue-600">
              {totals.borrowers.toLocaleString()}
            </h2>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">Active Loans</p>
            <h2 className="text-4xl font-black">
              {totals.loans.toLocaleString()}
            </h2>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">Collections</p>
            <h2 className="text-3xl font-black text-green-600">
              {formatMoney(totals.collected)}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5 mb-8">
          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">Total Disbursed</p>
            <h2 className="text-2xl font-black">
              {formatMoney(totals.disbursed)}
            </h2>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">Outstanding Principal</p>
            <h2 className="text-2xl font-black text-red-600">
              {formatMoney(totals.outstanding)}
            </h2>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">Portfolio Collection Rate</p>
            <h2 className="text-2xl font-black text-green-600">
              {overallCollectionRate.toFixed(1)}%
            </h2>
          </div>
        </div>

        <div className="bg-white border rounded-2xl overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black">
                Branch Performance Register
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Live figures calculated from current institutional records
              </p>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500">
              Loading branch report...
            </div>
          ) : report.length === 0 ? (
            <div className="p-12 text-center">
              <Lucide.Building2
                size={42}
                className="mx-auto mb-3 text-slate-400"
              />
              <p className="font-semibold text-slate-700">
                No branches found.
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Branch performance will appear here once branches are
                configured.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-4 text-left">Branch</th>
                    <th className="p-4 text-left">Borrowers</th>
                    <th className="p-4 text-left">Active Loans</th>
                    <th className="p-4 text-left">Disbursed</th>
                    <th className="p-4 text-left">Collected</th>
                    <th className="p-4 text-left">Outstanding</th>
                    <th className="p-4 text-left">Collection Rate</th>
                    <th className="p-4 text-left">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {report.map((branch) => (
                    <tr
                      key={branch.id}
                      className="border-t hover:bg-slate-50"
                    >
                      <td className="p-4 font-bold text-blue-700">
                        {branch.name}
                      </td>

                      <td className="p-4">
                        {branch.borrowers.toLocaleString()}
                      </td>

                      <td className="p-4">
                        {branch.loans.toLocaleString()}
                      </td>

                      <td className="p-4 font-bold">
                        {formatMoney(branch.disbursed)}
                      </td>

                      <td className="p-4 font-bold text-green-600">
                        {formatMoney(branch.collected)}
                      </td>

                      <td className="p-4 font-bold text-red-600">
                        {formatMoney(branch.outstanding)}
                      </td>

                      <td className="p-4 font-bold">
                        {branch.collectionRate.toFixed(1)}%
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            branch.performance === "Excellent"
                              ? "bg-green-100 text-green-700"
                              : branch.performance === "Good"
                              ? "bg-blue-100 text-blue-700"
                              : branch.performance === "Watch"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {branch.performance}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>

                <tfoot className="bg-slate-50 border-t-2">
                  <tr>
                    <td className="p-4 font-black">Total</td>
                    <td className="p-4 font-black">
                      {totals.borrowers.toLocaleString()}
                    </td>
                    <td className="p-4 font-black">
                      {totals.loans.toLocaleString()}
                    </td>
                    <td className="p-4 font-black">
                      {formatMoney(totals.disbursed)}
                    </td>
                    <td className="p-4 font-black text-green-600">
                      {formatMoney(totals.collected)}
                    </td>
                    <td className="p-4 font-black text-red-600">
                      {formatMoney(totals.outstanding)}
                    </td>
                    <td className="p-4 font-black">
                      {overallCollectionRate.toFixed(1)}%
                    </td>
                    <td className="p-4">—</td>
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
