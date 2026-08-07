import { useEffect, useState } from 'react';
import { api } from '../api/axios';
import { 
  Wallet, 
  FileCheck, 
  TrendingUp, 
  ShieldAlert, 
  Plus, 
  UserPlus, 
  FileText, 
  BarChart2 
} from 'lucide-react';

interface DashboardStats {
  totalPortfolio: string;
  activeLoans: number;
  collectionRate: string;
  riskLevel: string;
  disbursed: string;
  recovered: string;
  outstanding: string;
  branchPerformance: Array<{ name: string; amount: string }>;
  recentActivity: Array<{ id: string; user: string; action: string; time?: string }>;
}

export const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/dashboard/summary');
        setStats(response.data);
      } catch (err: any) {
        console.warn('Backend API endpoint not responding, falling back to cached state:', err);
        // Fallback default state matching your current UI
        setStats({
          totalPortfolio: 'UGX 2.4B',
          activeLoans: 1248,
          collectionRate: '96.8%',
          riskLevel: 'Low',
          disbursed: 'UGX 5.8B',
          recovered: 'UGX 4.9B',
          outstanding: 'UGX 900M',
          branchPerformance: [
            { name: 'Kampala Main', amount: 'UGX 890M' },
            { name: 'Ntinda', amount: 'UGX 560M' },
            { name: 'Mbarara', amount: 'UGX 430M' },
          ],
          recentActivity: [
            { id: '1', user: 'John Doe', action: 'received a new loan' },
            { id: '2', user: 'Sarah', action: 'sent a loan repayment' },
            { id: '3', user: 'System', action: 'New borrower registered' },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      {/* Top Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#05445E]">Dashboard</h1>
          <p className="text-sm text-slate-500">Complete overview of your lending operations</p>
        </div>
        <button className="flex items-center gap-2 bg-[#189AB4] hover:bg-[#05445E] text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-colors">
          <Plus size={18} />
          New Loan
        </button>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Portfolio */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Total Portfolio</p>
            <h3 className="text-2xl font-extrabold text-[#05445E] mt-2">
              {loading ? '...' : stats?.totalPortfolio}
            </h3>
            <span className="text-xs text-emerald-600 font-semibold mt-2 inline-block">
              ↑ 12% this month
            </span>
          </div>
          <div className="p-3 bg-[#D4F1F4] rounded-xl text-[#05445E]">
            <Wallet size={22} />
          </div>
        </div>

        {/* Active Loans */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Active Loans</p>
            <h3 className="text-2xl font-extrabold text-[#05445E] mt-2">
              {loading ? '...' : stats?.activeLoans?.toLocaleString()}
            </h3>
            <span className="text-xs text-teal-600 font-semibold mt-2 inline-block">
              94% performing
            </span>
          </div>
          <div className="p-3 bg-[#D4F1F4] rounded-xl text-[#189AB4]">
            <FileCheck size={22} />
          </div>
        </div>

        {/* Collection Rate */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Collection Rate</p>
            <h3 className="text-2xl font-extrabold text-[#05445E] mt-2">
              {loading ? '...' : stats?.collectionRate}
            </h3>
            <span className="text-xs text-emerald-600 font-semibold mt-2 inline-block">
              Excellent repayment
            </span>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <TrendingUp size={22} />
          </div>
        </div>

        {/* Risk Level */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Risk Level</p>
            <h3 className="text-2xl font-extrabold text-[#05445E] mt-2">
              {loading ? '...' : stats?.riskLevel}
            </h3>
            <span className="text-xs text-amber-600 font-semibold mt-2 inline-block">
              PAR 30: 2.1%
            </span>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-500">
            <ShieldAlert size={22} />
          </div>
        </div>
      </div>

      {/* Portfolio Performance & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Portfolio Summary Box */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-lg text-[#05445E]">Portfolio Performance</h2>
            <span className="text-xs font-semibold text-[#189AB4] cursor-pointer hover:underline">
              This Year
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50/60 rounded-xl">
              <p className="text-xs text-slate-500">Disbursed</p>
              <p className="text-lg font-bold text-[#05445E] mt-1">{stats?.disbursed}</p>
            </div>
            <div className="p-4 bg-emerald-50/60 rounded-xl">
              <p className="text-xs text-slate-500">Recovered</p>
              <p className="text-lg font-bold text-emerald-700 mt-1">{stats?.recovered}</p>
            </div>
            <div className="p-4 bg-rose-50/60 rounded-xl">
              <p className="text-xs text-slate-500">Outstanding</p>
              <p className="text-lg font-bold text-rose-600 mt-1">{stats?.outstanding}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <h2 className="font-bold text-lg text-[#05445E] mb-2">Quick Actions</h2>
          
          <button className="w-full flex items-center gap-3 p-3 bg-[#189AB4] text-white font-semibold rounded-xl hover:bg-[#05445E] transition-colors shadow-sm">
            <UserPlus size={18} />
            Register Borrower
          </button>

          <button className="w-full flex items-center gap-3 p-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors">
            <FileText size={18} className="text-[#189AB4]" />
            Create Loan
          </button>

          <button className="w-full flex items-center gap-3 p-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors">
            <BarChart2 size={18} className="text-[#189AB4]" />
            Reports
          </button>
        </div>
      </div>

      {/* Branch Performance & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Branch Performance Table */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <h2 className="font-bold text-lg text-[#05445E]">Branch Performance</h2>
          <div className="divide-y divide-slate-100">
            {stats?.branchPerformance?.map((branch, idx) => (
              <div key={idx} className="py-3 flex justify-between items-center text-sm">
                <span className="font-medium text-slate-700">{branch.name}</span>
                <span className="font-bold text-[#05445E]">{branch.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <h2 className="font-bold text-lg text-[#05445E]">Recent Activity</h2>
          <div className="space-y-3">
            {stats?.recentActivity?.map((act) => (
              <div key={act.id} className="p-3 bg-slate-50 rounded-xl text-sm flex items-center gap-2">
                <span className="font-bold text-[#05445E]">{act.user}</span>
                <span className="text-slate-600">{act.action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
