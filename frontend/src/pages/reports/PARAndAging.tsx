import React, { useState } from 'react';
import { AlertTriangle, Download, Filter, Search, ShieldAlert, ArrowUpRight, TrendingDown } from 'lucide-react';

export const PARAndAging = () => {
  const [selectedBand, setSelectedBand] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const agingBands = [
    { label: 'Current (On-Time)', range: '0 Days', amount: 'UGX 380,000,000', percentage: '90.5%', color: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
    { label: 'PAR 1 - 30 Days', range: '1-30 Days', amount: 'UGX 18,500,000', percentage: '4.4%', color: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' },
    { label: 'PAR 31 - 60 Days', range: '31-60 Days', amount: 'UGX 10,200,000', percentage: '2.4%', color: 'bg-orange-500', text: 'text-orange-700', bg: 'bg-orange-50' },
    { label: 'PAR 61 - 90 Days', range: '61-90 Days', amount: 'UGX 6,800,000', percentage: '1.6%', color: 'bg-rose-500', text: 'text-rose-700', bg: 'bg-rose-50' },
    { label: 'PAR 90+ Days (Default)', range: '90+ Days', amount: 'UGX 4,500,000', percentage: '1.1%', color: 'bg-red-700', text: 'text-red-800', bg: 'bg-red-50' },
  ];

  const loans = [
    { id: 'LN-1089', borrower: 'Grace Namukasa', product: 'Individual Business', loanOfficer: 'John Opio', principalOutstanding: 'UGX 4,500,000', amountOverdue: 'UGX 750,000', daysOverdue: 42, status: 'PAR 31-60' },
    { id: 'LN-1042', borrower: 'Kampala Women Group (Seat 4)', product: 'Group Solidarity', loanOfficer: 'Sarah Akello', principalOutstanding: 'UGX 2,100,000', amountOverdue: 'UGX 420,000', daysOverdue: 14, status: 'PAR 1-30' },
    { id: 'LN-0982', borrower: 'David Mukasa', product: 'Agricultural Loan', loanOfficer: 'John Opio', principalOutstanding: 'UGX 6,800,000', amountOverdue: 'UGX 2,100,000', daysOverdue: 78, status: 'PAR 61-90' },
    { id: 'LN-0871', borrower: 'Kintu Joseph', product: 'Individual Business', loanOfficer: 'Robert Mulema', principalOutstanding: 'UGX 4,500,000', amountOverdue: 'UGX 4,500,000', daysOverdue: 112, status: 'PAR 90+' },
    { id: 'LN-1120', borrower: 'Amina Hassan', product: 'Boda Boda Asset', loanOfficer: 'Sarah Akello', principalOutstanding: 'UGX 3,200,000', amountOverdue: 'UGX 320,000', daysOverdue: 8, status: 'PAR 1-30' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAR 1-30':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'PAR 31-60':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'PAR 61-90':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'PAR 90+':
        return 'bg-red-100 text-red-900 border-red-300';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#05445E]">Portfolio at Risk (PAR) & Aging</h1>
          <p className="text-sm text-slate-500">Loan portfolio quality breakdown, delinquency tracking & aging buckets</p>
        </div>
        <button className="flex items-center gap-2 bg-[#189AB4] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md hover:bg-[#05445E] transition-colors">
          <Download size={16} /> Export Aging Report
        </button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Outstanding Portfolio</p>
          <p className="text-2xl font-bold text-[#05445E]">UGX 420.0M</p>
          <span className="text-xs text-slate-500 font-medium">1,240 Total Active Loans</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex justify-between items-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total PAR (&gt;30 Days)</p>
            <span className="p-1.5 bg-rose-50 text-rose-600 rounded-lg"><AlertTriangle size={16} /></span>
          </div>
          <p className="text-2xl font-bold text-rose-600">5.1%</p>
          <span className="text-xs text-rose-600 font-semibold flex items-center gap-1">
            <TrendingDown size={14} /> UGX 21,500,000 at risk
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex justify-between items-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">PAR 1 Day Rate</p>
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg"><ShieldAlert size={16} /></span>
          </div>
          <p className="text-2xl font-bold text-amber-600">9.5%</p>
          <span className="text-xs text-slate-500 font-medium">UGX 40,000,000 non-performing</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Required Loss Provision</p>
          <p className="text-2xl font-bold text-[#05445E]">UGX 9,800,000</p>
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-0.5">
            <ArrowUpRight size={14} /> 100% Fully Provisioned
          </span>
        </div>
      </div>

      {/* Portfolio Aging Buckets */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="font-bold text-[#05445E] text-base">Portfolio Aging Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {agingBands.map((band, idx) => (
            <div key={idx} className={`${band.bg} p-4 rounded-xl border border-slate-100 space-y-2`}>
              <div className="flex justify-between items-center text-xs">
                <span className={`font-bold ${band.text}`}>{band.label}</span>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-800">{band.amount}</p>
                <p className="text-xs text-slate-500 font-semibold">{band.percentage} of Portfolio</p>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div className={`${band.color} h-1.5 rounded-full`} style={{ width: band.percentage }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delinquent Loan Accounts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h2 className="font-bold text-[#05445E] text-lg">Delinquent Loan Register</h2>
            <p className="text-xs text-slate-400">Detailed list of loans currently past due</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search borrower or loan ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#189AB4] w-64"
              />
            </div>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
              <Filter size={14} className="text-slate-400" />
              <select
                value={selectedBand}
                onChange={(e) => setSelectedBand(e.target.value)}
                className="bg-transparent focus:outline-none text-slate-700 font-medium"
              >
                <option value="all">All PAR Bands</option>
                <option value="PAR 1-30">PAR 1 - 30 Days</option>
                <option value="PAR 31-60">PAR 31 - 60 Days</option>
                <option value="PAR 61-90">PAR 61 - 90 Days</option>
                <option value="PAR 90+">PAR 90+ Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                <th className="p-3 font-bold">Loan ID</th>
                <th className="p-3 font-bold">Borrower Name</th>
                <th className="p-3 font-bold">Product Type</th>
                <th className="p-3 font-bold">Loan Officer</th>
                <th className="p-3 font-bold text-right">Outstanding Principal</th>
                <th className="p-3 font-bold text-right">Overdue Amount</th>
                <th className="p-3 font-bold text-center">Days Overdue</th>
                <th className="p-3 font-bold text-center">Aging Band</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {loans.map((loan) => (
                <tr key={loan.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-mono font-bold text-[#05445E]">{loan.id}</td>
                  <td className="p-3 font-semibold text-slate-800">{loan.borrower}</td>
                  <td className="p-3 text-slate-500">{loan.product}</td>
                  <td className="p-3 text-slate-500">{loan.loanOfficer}</td>
                  <td className="p-3 font-mono text-right font-semibold">{loan.principalOutstanding}</td>
                  <td className="p-3 font-mono text-right font-bold text-rose-600">{loan.amountOverdue}</td>
                  <td className="p-3 font-mono text-center font-bold text-amber-700">{loan.daysOverdue} days</td>
                  <td className="p-3 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(loan.status)}`}>
                      {loan.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
