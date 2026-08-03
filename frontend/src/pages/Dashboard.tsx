import { useState } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import * as Lucide from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar
} from "recharts";
const hasNotifications = true;

const KPICard = ({
  title,
  value,
  icon: Icon,
  color,
}: any) => (
  <div className="card p-5 group">

    <div className="flex items-center justify-between mb-5">

      <div
        className={`
          w-12
          h-12
          rounded-2xl
          flex
          items-center
          justify-center
          shadow-sm
          ${color}
        `}
      >
        <Icon
          size={22}
          className="text-white"
        />
      </div>

      <Lucide.ArrowUpRight
        size={18}
        className="text-slate-400 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
      />

    </div>

    <p className="text-xs uppercase tracking-[0.15em] text-slate-500 font-semibold">
      {title}
    </p>

    <h3 className="text-3xl font-bold text-slate-900 mt-2">
      {value}
    </h3>

  </div>
);
const portfolioData = [
  { month: "Jan", amount: 1200000 },
  { month: "Feb", amount: 1800000 },
  { month: "Mar", amount: 2400000 },
  { month: "Apr", amount: 2800000 },
  { month: "May", amount: 3500000 },
  { month: "Jun", amount: 4250000 },
];

const collectionData = [
  { month: "Jan", amount: 320000 },
  { month: "Feb", amount: 420000 },
  { month: "Mar", amount: 510000 },
  { month: "Apr", amount: 630000 },
  { month: "May", amount: 710000 },
  { month: "Jun", amount: 840000 },
];
export const Dashboard = () => {
  const [currency, setCurrency] = useState('KES');
  
  const formatCurrency = (amount: number) => {
    const symbols: Record<string, string> = { KES: 'KES ', UGX: 'USh ', TZS: 'TSh ', RWF: 'FRw ', BIF: 'FBu ' };
    return symbols[currency] + amount.toLocaleString();
  };

  return (
    <div className="flex h-screen bg-[#f8f9f9] text-[#1a2e23]">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-6">
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-[#f1f5f9] px-3 py-2 rounded-full text-sm font-bold cursor-pointer outline-none"
            >
              <option value="KES">KES</option>
              <option value="UGX">UGX</option>
              <option value="TZS">TZS</option>
              <option value="RWF">RWF</option>
              <option value="BIF">BIF</option>
            </select>

            <div className="relative cursor-pointer">
              <span className="text-xl">🔔</span>
              {hasNotifications && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>}
            </div>

            <div className="flex items-center gap-3">
              <span className="font-medium text-sm">Andrew Forbist</span>
              <img src="/logo.png" alt="Client Logo" className="w-8 h-8 rounded-full border border-slate-200" />
            </div>
          </div>
        </header>

       {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6 space-y-8">
        
          {/* ================================================= */}
          {/* PORTFOLIO OVERVIEW */}
          {/* ================================================= */}
        
          <section>
        
            <div className="grid grid-cols-4 gap-5 mb-8">
        
              {/* Hero Card */}
        
              <div className="col-span-2 rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 p-8 text-white shadow-lg">
        
                <p className="text-blue-100 uppercase tracking-[0.2em] text-xs font-semibold">
                  Total Portfolio
                </p>
        
                <h2 className="text-5xl font-black mt-3">
                  {formatCurrency(4250000)}
                </h2>
        
                <p className="text-blue-100 mt-3">
                  Across all active loans
                </p>
        
              </div>
        
              <KPICard
                title="Active Loans"
                value="1,240"
                icon={Lucide.HandCoins}
                color="bg-brand"
              />
        
              <KPICard
                title="Collections"
                value={formatCurrency(840000)}
                icon={Lucide.TrendingUp}
                color="bg-cyan-600"
              />
        
            </div>
        
            <div className="grid grid-cols-4 gap-5">
        
              <KPICard
                title="Borrowers"
                value="3,284"
                icon={Lucide.Users}
                color="bg-indigo-600"
              />
        
              <KPICard
                title="Savings Accounts"
                value="2,912"
                icon={Lucide.PiggyBank}
                color="bg-violet-600"
              />
        
              <KPICard
                title="PAR 30"
                value="4.2%"
                icon={Lucide.AlertTriangle}
                color="bg-red-500"
              />
        
              <KPICard
                title="Branches"
                value="12"
                icon={Lucide.Building2}
                color="bg-slate-700"
              />
        
            </div>
        
            {/* Quick Actions */}
        
            <div className="flex flex-wrap gap-3 mt-8">
        
              <button className="btn-primary">
                <Lucide.Plus size={18} />
                New Loan
              </button>
        
              <button className="btn-secondary">
                <Lucide.FileText size={18} />
                View Reports
              </button>
        
              <button className="btn-secondary">
                <Lucide.Users size={18} />
                Add Borrower
              </button>
        
              <button className="btn-secondary">
                <Lucide.PiggyBank size={18} />
                Open Account
              </button>
        
            </div>
        
          </section>
        
          {/* ================================================= */}
          {/* CHARTS */}
          {/* ================================================= */}
        
          <section className="grid grid-cols-3 gap-6">
        
            <div className="col-span-2 grid grid-cols-2 gap-6">
        
              {/* Portfolio */}
        
              <div className="card p-6 h-80">
        
                <h3 className="section-title mb-4">
                  Portfolio Growth
                </h3>
        
                <ResponsiveContainer width="100%" height="90%">
                  <LineChart data={portfolioData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
        
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#2563EB"
                      strokeWidth={3}
                    />
        
                  </LineChart>
                </ResponsiveContainer>
        
              </div>
        
              {/* Collections */}
        
              <div className="card p-6 h-80">
        
                <h3 className="section-title mb-4">
                  Monthly Collections
                </h3>
        
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={collectionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
        
                    <Bar
                      dataKey="amount"
                      fill="#2563EB"
                      radius={[8,8,0,0]}
                    />
        
                  </BarChart>
                </ResponsiveContainer>
        
              </div>
        
            </div>
        
            {/* Approval Queue */}
        
            <div className="card p-6 h-80">
        
              <div className="flex items-center justify-between mb-5">
        
                <h3 className="section-title">
                  Approval Queue
                </h3>
        
                <Lucide.Clock3 className="text-amber-500" />
        
              </div>
        
              <div className="space-y-4">
        
                {["LN-1001","LN-1002","LN-1003"].map((loan) => (
        
                  <div
                    key={loan}
                    className="rounded-2xl border border-amber-200 bg-amber-50 p-4 flex items-center justify-between"
                  >
        
                    <div>
        
                      <p className="font-semibold">
                        Loan #{loan}
                      </p>
        
                      <p className="text-sm text-slate-500">
                        Awaiting approval
                      </p>
        
                    </div>
        
                    <Lucide.ChevronRight
                      size={18}
                      className="text-slate-400"
                    />
        
                  </div>
        
                ))}
        
              </div>
        
            </div>
        
          </section>
        
          {/* ================================================= */}
          {/* BUSINESS INSIGHTS */}
          {/* ================================================= */}
        
          <section className="grid grid-cols-3 gap-6">
        
            <div className="card p-6">
        
              <p className="text-sm text-slate-500">
                PAR 30
              </p>
        
              <h2 className="mt-3 text-4xl font-black text-red-500">
                4.2%
              </h2>
        
            </div>
        
            <div className="card p-6">
        
              <p className="text-sm text-slate-500">
                Best Performing Branch
              </p>
        
              <h2 className="mt-3 text-4xl font-black">
                Kampala
              </h2>
        
            </div>
        
            <div className="card p-6">
        
              <p className="text-sm text-slate-500">
                Collection Rate
              </p>
        
              <h2 className="mt-3 text-4xl font-black text-green-600">
                96%
              </h2>
        
            </div>
        
          </section>
        
         </main>

      </div>

    </div>

  );
};
