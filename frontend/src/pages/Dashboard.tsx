import { useState } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import * as Lucide from 'lucide-react';

const hasNotifications = true;

const KPICard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
    <div className={`p-3 rounded-2xl ${color}`}>
      <Icon className="text-white" size={24} />
    </div>
    <div>
      <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{title}</p>
      <h3 className="text-xl font-bold text-[#1a2e23]">{value}</h3>
    </div>
  </div>
);

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
          
          {/* PHASE 1: KPI Cards & Quick Actions */}
          <section>
            <div className="grid grid-cols-4 gap-6 mb-6">
              <div className="bg-[#1a2e23] text-white p-6 rounded-3xl col-span-2 flex flex-col justify-center">
                <p className="text-emerald-400 font-medium text-sm uppercase">Total Portfolio</p>
                <h2 className="text-3xl font-bold">{formatCurrency(4250000)}</h2>
              </div>
              <KPICard title="Active Loans" value="1,240" icon={Lucide.HandCoins} color="bg-blue-500" />
              <KPICard title="Collections" value={formatCurrency(840000)} icon={Lucide.TrendingUp} color="bg-emerald-500" />
            </div>
            <div className="flex gap-4">
              <button className="bg-[#166534] text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                <Lucide.Plus size={16} /> New Loan
              </button>
              <button className="bg-white border border-slate-200 px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                <Lucide.FileText size={16} /> View Reports
              </button>
            </div>
          </section>

          {/* PHASE 2: Charts & Queue */}
          <section className="grid grid-cols-3 gap-6">
            <div className="col-span-2 grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 h-64 shadow-sm">Portfolio Trend</div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 h-64 shadow-sm">Collections Chart</div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 h-64 shadow-sm">Approval Queue</div>
          </section>

          {/* PHASE 3: Advanced Analytics */}
          <section className="grid grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 h-48 shadow-sm">PAR Dashboard</div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 h-48 shadow-sm">Branch Performance</div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 h-48 shadow-sm">Exec Analytics</div>
          </section>

        </main>
      </div>
    </div>
  );
};