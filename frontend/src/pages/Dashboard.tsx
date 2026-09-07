import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/axios';
import { formatMoney } from '../config/regional';
import {
  Wallet,
  FileCheck,
  TrendingUp,
  ShieldAlert,
  Plus,
  UserPlus,
  FileText,
  BarChart2,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface DashboardStats {
  totalPortfolio: number;
  activeLoans: number;
  collectionRate: string;
  riskLevel: string;
  disbursed: number;
  recovered: number;
  outstanding: number;

  branchPerformance: Array<{
    name: string;
    amount: string;
    amountValue: number;
    activeLoans: number;
  }>;

  loanStatus: Array<{
    status: string;
    count: number;
    amount: number;
    amountFormatted: string;
  }>;

  portfolioTrend: Array<{
    month: string;
    disbursed: number;
    recovered: number;
  }>;

  recentActivity: Array<{
    id: string;
    user: string;
    action: string;
    time?: string;
  }>;

  risk: {
    portfolio_outstanding: number;
    overdue_amount: number;
    par_percentage: number;
  };
}



const statusLabels: Record<string, string> = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  ACTIVE: 'Active',
  OVERDUE: 'Overdue',
  CLOSED: 'Closed',
  COMPLETED: 'Completed',
  DEFAULTED: 'Defaulted',
  REJECTED: 'Rejected',
};

const statusClasses: Record<string, string> = {
  ACTIVE: 'bg-emerald-50 text-emerald-700',
  OVERDUE: 'bg-amber-50 text-amber-700',
  DEFAULTED: 'bg-rose-50 text-rose-700',
  CLOSED: 'bg-slate-100 text-slate-600',
  COMPLETED: 'bg-sky-50 text-sky-700',
  PENDING: 'bg-slate-100 text-slate-600',
  APPROVED: 'bg-blue-50 text-blue-700',
  REJECTED: 'bg-rose-50 text-rose-700',
};

export const Dashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const response = await api.get('/dashboard/summary');

        setStats(response.data);
        setError(null);
      } catch (err: any) {
        console.error('Failed to load dashboard data:', err);

        setError(
          err?.response?.data?.detail ||
          'Unable to load dashboard data from the server.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (error && !stats) {
    return (
      <div className="p-8 bg-slate-50 min-h-screen">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h1 className="text-3xl font-bold text-[#05445E]">
            Dashboard
          </h1>

          <p className="text-slate-500 mt-2">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-[#189AB4] hover:bg-[#05445E] text-white px-5 py-2.5 rounded-xl font-semibold transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const pieData = stats?.loanStatus || [];

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#05445E]">
            Dashboard
          </h1>

          <p className="text-sm text-slate-500">
            Complete overview of your lending operations
          </p>
        </div>

        <button
          onClick={() => navigate('/applications')}
          className="flex items-center gap-2 bg-[#189AB4] hover:bg-[#05445E] text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-colors"
        >
          <Plus size={18} />
          New Loan
        </button>
      </div>

      {/* =====================================================
          KPI CARDS
      ===================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">
              Total Portfolio
            </p>

            <h3 className="text-2xl font-extrabold text-[#05445E] mt-2">
              {loading ? '...' : formatMoney(stats?.totalPortfolio ?? 0)}
            </h3>

            <span className="text-xs text-emerald-600 font-semibold mt-2 inline-flex items-center gap-1">
              <ArrowUpRight size={12} />
              Active portfolio
            </span>
          </div>

          <div className="p-3 bg-[#D4F1F4] rounded-xl text-[#05445E]">
            <Wallet size={22} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">
              Active Loans
            </p>

            <h3 className="text-2xl font-extrabold text-[#05445E] mt-2">
              {loading
                ? '...'
                : stats?.activeLoans?.toLocaleString()}
            </h3>

            <span className="text-xs text-teal-600 font-semibold mt-2 inline-block">
              Currently outstanding
            </span>
          </div>

          <div className="p-3 bg-[#D4F1F4] rounded-xl text-[#189AB4]">
            <FileCheck size={22} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">
              Collection Rate
            </p>

            <h3 className="text-2xl font-extrabold text-[#05445E] mt-2">
              {loading ? '...' : stats?.collectionRate}
            </h3>

            <span className="text-xs text-emerald-600 font-semibold mt-2 inline-flex items-center gap-1">
              <TrendingUp size={12} />
              Schedule performance
            </span>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <TrendingUp size={22} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">
              Risk Level
            </p>

            <h3 className="text-2xl font-extrabold text-[#05445E] mt-2">
              {loading ? '...' : stats?.riskLevel}
            </h3>

            <span className="text-xs text-amber-600 font-semibold mt-2 inline-block">
              PAR 30: {stats?.risk?.par_percentage ?? 0}%
            </span>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl text-amber-500">
            <ShieldAlert size={22} />
          </div>
        </div>
      </div>

      {/* =====================================================
          PORTFOLIO TREND
      ===================================================== */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="font-bold text-lg text-[#05445E]">
              Portfolio Trend
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              Monthly disbursements compared with repayments
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#189AB4]" />
              Disbursed
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Recovered
            </div>
          </div>
        </div>

        <div className="h-80">
          {stats?.portfolioTrend?.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.portfolioTrend}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tickFormatter={(value) => formatMoney(Number(value || 0))}
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={75}
                />

                <Tooltip
                  formatter={(value) =>
                    formatMoney(Number(value || 0))
                  }
                />

                <Area
                  type="monotone"
                  dataKey="disbursed"
                  name="Disbursed"
                  stroke="#189AB4"
                  fill="#D4F1F4"
                  strokeWidth={3}
                />

                <Area
                  type="monotone"
                  dataKey="recovered"
                  name="Recovered"
                  stroke="#10B981"
                  fill="#ECFDF5"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-slate-400">
              No portfolio history available yet.
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          CHART ROW
      ===================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* Loan Status */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">

          <div className="mb-4">
            <h2 className="font-bold text-lg text-[#05445E]">
              Loan Portfolio by Status
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              Distribution of loans across their current lifecycle
            </p>
          </div>

          <div className="h-80">
            {pieData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.status}-${index}`}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value) =>
                      `${Number(value || 0)} loans`
                    }
                  />

                  <Legend
                    formatter={(value) =>
                      statusLabels[value] || value
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-slate-400">
                No loan status data available.
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-2">
            {pieData.map((item) => (
              <div
                key={item.status}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
              >
                <span className="text-xs font-semibold text-slate-600">
                  {statusLabels[item.status] || item.status}
                </span>

                <span className="text-xs font-bold text-[#05445E]">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Branch Performance */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">

          <div className="mb-4">
            <h2 className="font-bold text-lg text-[#05445E]">
              Branch Portfolio
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              Active loan portfolio by branch
            </p>
          </div>

          <div className="h-80">
            {stats?.branchPerformance?.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.branchPerformance}
                  layout="vertical"
                  margin={{
                    left: 20,
                    right: 20,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                  />

                  <XAxis
                    type="number"
                    tickFormatter={(value) => formatMoney(Number(value || 0))}
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    type="category"
                    dataKey="name"
                    width={110}
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    formatter={(value) =>
                      formatMoney(Number(value || 0))
                    }
                  />

                  <Bar
                    dataKey="amountValue"
                    name="Portfolio"
                    fill="#189AB4"
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-slate-400">
                No branch portfolio data available.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          FINANCIAL SUMMARY + QUICK ACTIONS
      ===================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">

          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="font-bold text-lg text-[#05445E]">
                Portfolio Summary
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                Current lending position
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="p-5 bg-blue-50/60 rounded-xl">
              <p className="text-xs text-slate-500">
                Disbursed
              </p>

              <p className="text-xl font-bold text-[#05445E] mt-2">
                {formatMoney(stats?.disbursed ?? 0)}
              </p>

              <p className="text-[11px] text-slate-400 mt-2">
                Total qualifying disbursements
              </p>
            </div>

            <div className="p-5 bg-emerald-50/60 rounded-xl">
              <p className="text-xs text-slate-500">
                Recovered
              </p>

              <p className="text-xl font-bold text-emerald-700 mt-2">
                {formatMoney(stats?.recovered ?? 0)}
              </p>

              <p className="text-[11px] text-slate-400 mt-2">
                Total repayments received
              </p>
            </div>

            <div className="p-5 bg-rose-50/60 rounded-xl">
              <p className="text-xs text-slate-500">
                Outstanding
              </p>

              <p className="text-xl font-bold text-rose-600 mt-2">
                {formatMoney(stats?.outstanding ?? 0)}
              </p>

              <p className="text-[11px] text-slate-400 mt-2">
                Estimated remaining balance
              </p>
            </div>
          </div>

          <div className="mt-5 p-4 rounded-xl bg-slate-50 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">
                Overdue Amount
              </p>

              <p className="text-lg font-bold text-amber-600 mt-1">
                {formatMoney(
                  stats?.risk?.overdue_amount || 0
                )}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-slate-500">
                Portfolio at Risk
              </p>

              <p className="text-lg font-bold text-[#05445E] mt-1">
                {stats?.risk?.par_percentage || 0}%
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">

          <h2 className="font-bold text-lg text-[#05445E]">
            Quick Actions
          </h2>

          <button
            onClick={() => navigate('/borrowers')}
            className="w-full flex items-center gap-3 p-3 bg-[#189AB4] text-white font-semibold rounded-xl hover:bg-[#05445E] transition-colors shadow-sm"
          >
            <UserPlus size={18} />
            Register Borrower
          </button>

          <button
            onClick={() => navigate('/applications')}
            className="w-full flex items-center gap-3 p-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
          >
            <FileText
              size={18}
              className="text-[#189AB4]"
            />
            Create Loan
          </button>

          <button
            onClick={() => navigate('/reports/financial')}
            className="w-full flex items-center gap-3 p-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
          >
            <BarChart2
              size={18}
              className="text-[#189AB4]"
            />
            Financial Reports
          </button>
        </div>
      </div>

      {/* =====================================================
          BRANCH TABLE + ACTIVITY
      ===================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">

          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="font-bold text-lg text-[#05445E]">
                Branch Performance
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                Active portfolio by branch
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">

            {stats?.branchPerformance?.length ? (
              stats.branchPerformance.map((branch) => (
                <div
                  key={branch.name}
                  className="py-3 flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      {branch.name}
                    </p>

                    <p className="text-[11px] text-slate-400 mt-1">
                      {branch.activeLoans} active loan
                      {branch.activeLoans === 1 ? '' : 's'}
                    </p>
                  </div>

                  <span className="font-bold text-[#05445E]">
                    {branch.amount}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 py-6 text-center">
                No branch data available.
              </p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">

          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="font-bold text-lg text-[#05445E]">
                Recent Activity
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                Latest system events
              </p>
            </div>
          </div>

          <div className="space-y-3">

            {stats?.recentActivity?.length ? (
              stats.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="p-3 bg-slate-50 rounded-xl"
                >
                  <div className="flex items-start justify-between gap-3">

                    <div>
                      <p className="text-sm">
                        <span className="font-bold text-[#05445E]">
                          {activity.user}
                        </span>{' '}
                        <span className="text-slate-600">
                          {activity.action}
                        </span>
                      </p>
                    </div>

                    {activity.time && (
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        {new Date(
                          activity.time
                        ).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 py-6 text-center">
                No recent activity.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
