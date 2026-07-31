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

const KPICard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all">
    
    <div className="flex items-center justify-between mb-4">

      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}
      >
        <Icon size={22} className="text-white" />
      </div>

      <Lucide.ArrowUpRight size={18} className="text-slate-300" />

    </div>

    <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
      {title}
    </p>

    <h3 className="text-2xl font-bold text-slate-900 mt-2">
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
        <main className="flex-1 p-6 overflow-y-auto space-y-8">
        
          {/* KPI SECTION */}
          <section>
        
            <div className="grid grid-cols-4 gap-5 mb-8">
        
              <div className="bg-gradient-to-r from-[#166534] to-[#1f7a4c] text-white p-7 rounded-3xl col-span-2 shadow-sm">
        
                <p className="text-emerald-200 uppercase text-xs font-semibold tracking-wider">
                  Total Portfolio
                </p>
        
                <h2 className="text-4xl font-bold mt-2">
                  {formatCurrency(4250000)}
                </h2>
        
                <p className="text-emerald-100 text-sm mt-2">
                  Across all active loans
                </p>
        
              </div>
        
              <KPICard
                title="Active Loans"
                value="1,240"
                icon={Lucide.HandCoins}
                color=" bg-blue-600"
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
        
            <div className="flex flex-wrap gap-3 mt-6">
        
              <button className="bg-[#166534] text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                <Lucide.Plus size={16} />
                New Loan
              </button>
        
              <button className="bg-white border border-slate-200 px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                <Lucide.FileText size={16} />
                View Reports
              </button>
        
              <button className="bg-white border border-slate-200 px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-slate-50">
                <Lucide.Users size={16} />
                Add Borrower
              </button>
        
              <button className="bg-white border border-slate-200 px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-slate-50">
                <Lucide.PiggyBank size={16} />
                Open Account
              </button>
        
            </div>
        
          </section>
        
          {/* CHARTS SECTION */}
        
          <section className="grid grid-cols-3 gap-6">
        
            <div className="col-span-2 grid grid-cols-2 gap-6">
        
              {/* Portfolio Trend */}
        
              <div className="bg-white p-6 rounded-3xl border border-slate-100 h-80 shadow-sm">
        
                <h3 className="font-semibold mb-4">
                  Portfolio Trend
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
                      stroke="#166534"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
        
              </div>
        
              {/* Collections */}
        
              <div className="bg-white p-6 rounded-3xl border border-slate-100 h-80 shadow-sm">
        
                <h3 className="font-semibold mb-4">
                  Collections
                </h3>
        
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={collectionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
        
                    <Bar
                      dataKey="amount"
                      fill="#3EB489"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
        
              </div>
        
            </div>
        
            {/* Approval Queue */}
        
            <div className="bg-white p-6 rounded-3xl border border-slate-100 h-80 shadow-sm">
        
              <h3 className="font-semibold mb-4">
                Approval Queue
              </h3>
        
              <div className="space-y-3">
        
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                  Loan #LN-1001
                </div>
        
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                  Loan #LN-1002
                </div>
        
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                  Loan #LN-1003
                </div>
        
              </div>
        
            </div>
        
          </section>
        
          {/* ANALYTICS SECTION */}
        
          <section className="grid grid-cols-3 gap-6">
        
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        
              <p className="text-slate-500 text-sm">
                PAR 30
              </p>
        
              <h2 className="text-3xl font-bold text-red-600 mt-2">
                4.2%
              </h2>
        
            </div>
        
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        
              <p className="text-slate-500 text-sm">
                Best Branch
              </p>
        
              <h2 className="text-3xl font-bold mt-2">
                Kampala
              </h2>
        
            </div>
        
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        
              <p className="text-slate-500 text-sm">
                Collection Rate
              </p>
        
              <h2 className="text-3xl font-bold text-emerald-600 mt-2">
                96%
              </h2>
        
            </div>
        
          </section>
        
        </main>
