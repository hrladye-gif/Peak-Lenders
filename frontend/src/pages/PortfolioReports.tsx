import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";
import { api } from "../api/axios";

type Branch = {
  id: string;
  name: string;
  code?: string;
};

type Loan = {
  id: string;
  loan_number: string;
  branch_id?: string | null;
  principal: number;
  status: string;
};

type Repayment = {
  loan_id: string;
  amount: number;
  principal_paid: number;
  payment_date: string;
};

type Schedule = {
  id: string;
  loan_id: string;
  due_date: string;
  principal_due: number;
  total_due: number;
  status: string;
};

type PortfolioRow = {
  branch: string;
  loans: number;
  outstanding: number;
  overdue: number;
  par: number;
  collection: number;
};

const money = (value: number) =>
  Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const percentage = (value: number) =>
  `${Number(value || 0).toFixed(1)}%`;

export const PortfolioReports = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [repayments, setRepayments] = useState<Repayment[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        setLoading(true);
        setError("");

        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          throw new Error("Authenticated user information is unavailable.");
        }

        const user = JSON.parse(storedUser);

        if (!user?.tenant_id) {
          throw new Error("Institution information is unavailable.");
        }

        const [
          branchesResponse,
          loansResponse,
          repaymentsResponse,
          schedulesResponse,
        ] = await Promise.all([
          api.get(`/branches/${user.tenant_id}`),
          api.get("/loans/"),
          api.get("/repayments/"),
          api.get("/schedules/"),
        ]);

        setBranches(Array.isArray(branchesResponse.data) ? branchesResponse.data : []);
        setLoans(Array.isArray(loansResponse.data) ? loansResponse.data : []);
        setRepayments(
          Array.isArray(repaymentsResponse.data)
            ? repaymentsResponse.data
            : []
        );
        setSchedules(
          Array.isArray(schedulesResponse.data)
            ? schedulesResponse.data
            : []
        );
      } catch (err: any) {
        console.error("Portfolio report loading failed:", err);
        setError(
          err?.response?.data?.detail ||
            err?.message ||
            "Unable to load portfolio report."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, []);

  const portfolio = useMemo<PortfolioRow[]>(() => {
    const today = new Date();

    return branches.map((branch) => {
      const branchLoans = loans.filter(
        (loan) =>
          loan.branch_id === branch.id &&
          ["ACTIVE", "OVERDUE"].includes(
            String(loan.status || "").toUpperCase()
          )
      );

      let outstanding = 0;
      let overdue = 0;
      let scheduledPrincipal = 0;
      let paidPrincipal = 0;

      branchLoans.forEach((loan) => {
        const loanSchedules = schedules.filter(
          (schedule) =>
            schedule.loan_id === loan.id &&
            schedule.status !== "PAID"
        );

        const loanRepayments = repayments.filter(
          (repayment) => repayment.loan_id === loan.id
        );

        const principalPaid = loanRepayments.reduce(
          (sum, repayment) =>
            sum + Number(repayment.principal_paid || 0),
          0
        );

        const principalDue = loanSchedules.reduce(
          (sum, schedule) =>
            sum + Number(schedule.principal_due || 0),
          0
        );

        paidPrincipal += principalPaid;
        scheduledPrincipal += principalDue;

        const loanOutstanding = Math.max(
          Number(loan.principal || 0) - principalPaid,
          0
        );

        outstanding += loanOutstanding;

        loanSchedules.forEach((schedule) => {
          const dueDate = new Date(schedule.due_date);
          const duePrincipal = Number(schedule.principal_due || 0);

          const schedulePaid = loanRepayments
            .filter(
              (repayment) =>
                repayment.loan_id === loan.id &&
                new Date(repayment.payment_date) <= dueDate
            )
            .reduce(
              (sum, repayment) =>
                sum + Number(repayment.principal_paid || 0),
              0
            );

          if (dueDate < today) {
            overdue += Math.max(
              duePrincipal - schedulePaid,
              0
            );
          }
        });
      });

      const par =
        outstanding > 0
          ? (overdue / outstanding) * 100
          : 0;

      const collection =
        scheduledPrincipal > 0
          ? Math.min(
              (paidPrincipal / scheduledPrincipal) * 100,
              100
            )
          : 0;

      return {
        branch: branch.name,
        loans: branchLoans.length,
        outstanding,
        overdue,
        par,
        collection,
      };
    });
  }, [branches, loans, repayments, schedules]);

  const totalLoans = portfolio.reduce(
    (sum, row) => sum + row.loans,
    0
  );

  const totalOutstanding = portfolio.reduce(
    (sum, row) => sum + row.outstanding,
    0
  );

  const totalOverdue = portfolio.reduce(
    (sum, row) => sum + row.overdue,
    0
  );

  const portfolioPAR =
    totalOutstanding > 0
      ? (totalOverdue / totalOutstanding) * 100
      : 0;

  const portfolioHealth =
    portfolioPAR <= 5
      ? "Excellent"
      : portfolioPAR <= 10
      ? "Good"
      : portfolioPAR <= 20
      ? "Watch"
      : "At Risk";

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
              Portfolio Reports
            </h1>

            <p className="text-slate-500">
              Analyze loan portfolio performance and risk
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

        {loading && (
          <div className="bg-white border rounded-2xl p-8 mb-8">
            <p className="text-slate-500">
              Loading live portfolio data...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5 mb-8">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-4 gap-5 mb-8">
              <div className="bg-white border rounded-2xl p-6">
                <p className="text-sm text-slate-500">
                  Active Loans
                </p>

                <h2 className="text-4xl font-black">
                  {totalLoans}
                </h2>
              </div>

              <div className="bg-white border rounded-2xl p-6">
                <p className="text-sm text-slate-500">
                  Outstanding Portfolio
                </p>

                <h2 className="text-3xl font-black text-blue-600">
                  {money(totalOutstanding)}
                </h2>
              </div>

              <div className="bg-white border rounded-2xl p-6">
                <p className="text-sm text-slate-500">
                  Overdue Amount
                </p>

                <h2 className="text-3xl font-black text-red-600">
                  {money(totalOverdue)}
                </h2>
              </div>

              <div className="bg-white border rounded-2xl p-6">
                <p className="text-sm text-slate-500">
                  Portfolio Health
                </p>

                <h2 className="text-3xl font-black text-green-600">
                  {portfolioHealth}
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  PAR {percentage(portfolioPAR)}
                </p>
              </div>
            </div>

            <div className="bg-white border rounded-2xl overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-black">
                  Branch Portfolio Performance
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-4 text-left">Branch</th>
                      <th className="p-4 text-left">Active Loans</th>
                      <th className="p-4 text-left">Outstanding</th>
                      <th className="p-4 text-left">Overdue</th>
                      <th className="p-4 text-left">PAR</th>
                      <th className="p-4 text-left">
                        Collection Rate
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {portfolio.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="p-8 text-center text-slate-500"
                        >
                          No portfolio data available.
                        </td>
                      </tr>
                    ) : (
                      portfolio.map((row) => (
                        <tr
                          key={row.branch}
                          className="border-t"
                        >
                          <td className="p-4 font-bold text-blue-700">
                            {row.branch}
                          </td>

                          <td className="p-4">
                            {row.loans}
                          </td>

                          <td className="p-4 font-bold">
                            {money(row.outstanding)}
                          </td>

                          <td className="p-4 font-bold text-red-600">
                            {money(row.overdue)}
                          </td>

                          <td className="p-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                row.par <= 5
                                  ? "bg-green-100 text-green-700"
                                  : row.par <= 10
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {percentage(row.par)}
                            </span>
                          </td>

                          <td className="p-4 font-bold text-green-600">
                            {percentage(row.collection)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-5">
              <div className="bg-white border rounded-2xl p-6">
                <h3 className="font-black mb-2">
                  Risk Analysis
                </h3>

                <p className="text-slate-500">
                  Live portfolio-at-risk and overdue principal
                  calculated from loan schedules and repayments.
                </p>
              </div>

              <div className="bg-white border rounded-2xl p-6">
                <h3 className="font-black mb-2">
                  Loan Growth
                </h3>

                <p className="text-slate-500">
                  Branch performance is calculated from active
                  loans currently recorded in the institution.
                </p>
              </div>

              <div className="bg-white border rounded-2xl p-6">
                <h3 className="font-black mb-2">
                  Collections
                </h3>

                <p className="text-slate-500">
                  Collection performance is calculated from
                  recorded principal repayments against scheduled
                  principal.
                </p>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};
