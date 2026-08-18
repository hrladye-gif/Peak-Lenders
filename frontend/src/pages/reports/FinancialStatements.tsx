import { formatMoney, getCurrency } from "../../config/regional";
import React, { useState } from 'react';
import { FileSpreadsheet, Download, Calendar, DollarSign, TrendingUp, Layers } from 'lucide-react';

export const FinancialStatements = () => {
  const [statementType, setStatementType] = useState<'balance' | 'income' | 'cashflow'>('balance');

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#05445E]">Financial Statements</h1>
          <p className="text-sm text-slate-500">Comprehensive MFI reporting: Balance Sheet, Income Statement, & Cash Flow</p>
        </div>
        <button className="flex items-center gap-2 bg-[#189AB4] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md hover:bg-[#05445E] transition-colors">
          <Download size={16} /> Export PDF Report
        </button>
      </div>

      {/* Statement Selector Tabs */}
      <div className="flex gap-3 border-b border-slate-200 pb-3">
        <button
          onClick={() => setStatementType('balance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            statementType === 'balance'
              ? 'bg-[#05445E] text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers size={16} /> Balance Sheet (BS)
        </button>

        <button
          onClick={() => setStatementType('income')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            statementType === 'income'
              ? 'bg-[#05445E] text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <TrendingUp size={16} /> Income Statement (IS)
        </button>

        <button
          onClick={() => setStatementType('cashflow')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            statementType === 'cashflow'
              ? 'bg-[#05445E] text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <DollarSign size={16} /> Cash Flow Statement (CF)
        </button>
      </div>

      {/* Main Statement Display Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#189AB4]/10 rounded-xl text-[#189AB4]">
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <h2 className="font-bold text-[#05445E] text-lg">
                {statementType === 'balance' && 'Statement of Financial Position (Balance Sheet)'}
                {statementType === 'income' && 'Statement of Comprehensive Income (Profit & Loss)'}
                {statementType === 'cashflow' && 'Statement of Cash Flows'}
              </h2>
              <p className="text-xs text-slate-400">As of August 07, 2026 • Reporting Currency: {getCurrency()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
            <Calendar size={14} className="text-[#189AB4]" /> FY 2026 - Q3
          </div>
        </div>

        {/* 1. BALANCE SHEET */}
        {statementType === 'balance' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-[#05445E] text-xs uppercase tracking-wider bg-slate-100 p-2.5 rounded-lg mb-3">
                Assets
              </h3>
              <div className="space-y-2.5 text-xs text-slate-700 px-3">
                <div className="flex justify-between"><span>1000 - Cash & Cash Equivalents</span><span className="font-mono font-semibold">{formatMoney(15200000)}</span></div>
                <div className="flex justify-between"><span>1100 - Gross Outstanding Loan Portfolio</span><span className="font-mono font-semibold">{formatMoney(420000000)}</span></div>
                <div className="flex justify-between text-rose-600"><span>1200 - Less: Provision for Loan Losses (PAR Reserve)</span><span className="font-mono font-semibold">({formatMoney(9800000)})</span></div>
                <div className="flex justify-between"><span>1300 - Equipment & Fixed Assets</span><span className="font-mono font-semibold">{formatMoney(18500000)}</span></div>
                <div className="flex justify-between font-bold border-t border-slate-200 pt-3 text-[#05445E] text-sm">
                  <span>Total Assets</span>
                  <span className="font-mono">{formatMoney(443900000)}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-[#05445E] text-xs uppercase tracking-wider bg-slate-100 p-2.5 rounded-lg mb-3">
                Liabilities & Equity
              </h3>
              <div className="space-y-2.5 text-xs text-slate-700 px-3">
                <div className="flex justify-between"><span>2000 - Client Voluntary Savings Deposits</span><span className="font-mono font-semibold">{formatMoney(185000000)}</span></div>
                <div className="flex justify-between"><span>2100 - Accounts Payable & Accrued Expenses</span><span className="font-mono font-semibold">{formatMoney(8700000)}</span></div>
                <div className="flex justify-between font-semibold text-slate-800 border-t border-slate-100 pt-2">
                  <span>Total Liabilities</span>
                  <span className="font-mono">{formatMoney(193700000)}</span>
                </div>

                <div className="pt-3">
                  <div className="flex justify-between"><span>3000 - Paid-in Share Capital</span><span className="font-mono font-semibold">{formatMoney(110000000)}</span></div>
                  <div className="flex justify-between"><span>3100 - Retained Earnings</span><span className="font-mono font-semibold">{formatMoney(123600000)}</span></div>
                  <div className="flex justify-between text-emerald-700"><span>3200 - Current Period Surplus / Net Income</span><span className="font-mono font-semibold">{formatMoney(16600000)}</span></div>
                  <div className="flex justify-between font-semibold text-slate-800 border-t border-slate-100 pt-2">
                    <span>Total Equity</span>
                    <span className="font-mono">{formatMoney(250200000)}</span>
                  </div>
                </div>

                <div className="flex justify-between font-bold border-t-2 border-slate-300 pt-3 text-[#05445E] text-sm">
                  <span>Total Liabilities & Equity</span>
                  <span className="font-mono">{formatMoney(443900000)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. INCOME STATEMENT */}
        {statementType === 'income' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-emerald-800 text-xs uppercase tracking-wider bg-emerald-50 p-2.5 rounded-lg mb-3">
                Operating Revenue
              </h3>
              <div className="space-y-2.5 text-xs text-slate-700 px-3">
                <div className="flex justify-between"><span>4000 - Interest Income on Microfinance Loans</span><span className="font-mono font-semibold">{formatMoney(38500000)}</span></div>
                <div className="flex justify-between"><span>4100 - Loan Application & Processing Fees</span><span className="font-mono font-semibold">{formatMoney(3800000)}</span></div>
                <div className="flex justify-between"><span>4200 - Late Penalty Charges & Recoveries</span><span className="font-mono font-semibold">{formatMoney(1400000)}</span></div>
                <div className="flex justify-between font-bold border-t border-slate-200 pt-3 text-emerald-800 text-sm">
                  <span>Total Revenue</span>
                  <span className="font-mono">{formatMoney(43700000)}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-rose-800 text-xs uppercase tracking-wider bg-rose-50 p-2.5 rounded-lg mb-3">
                Operating Expenses
              </h3>
              <div className="space-y-2.5 text-xs text-slate-700 px-3">
                <div className="flex justify-between"><span>5000 - Staff Salaries & Benefits</span><span className="font-mono font-semibold">{formatMoney(14000000)}</span></div>
                <div className="flex justify-between"><span>5100 - Rent & Utilities</span><span className="font-mono font-semibold">{formatMoney(4200000)}</span></div>
                <div className="flex justify-between"><span>5200 - Field Travel & Collection Costs</span><span className="font-mono font-semibold">{formatMoney(3100000)}</span></div>
                <div className="flex justify-between"><span>5300 - Provision for Bad Debts</span><span className="font-mono font-semibold">{formatMoney(5800000)}</span></div>
                <div className="flex justify-between font-bold border-t border-slate-200 pt-3 text-rose-800 text-sm">
                  <span>Total Operating Expenses</span>
                  <span className="font-mono">{formatMoney(27100000)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#05445E]/5 rounded-xl flex justify-between items-center text-sm font-bold text-[#05445E]">
              <span>Net Profit Before Tax (Surplus)</span>
              <span className="font-mono text-base text-teal-700">{formatMoney(16600000)}</span>
            </div>
          </div>
        )}

        {/* 3. CASH FLOW STATEMENT */}
        {statementType === 'cashflow' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-[#05445E] text-xs uppercase tracking-wider bg-slate-100 p-2.5 rounded-lg mb-3">
                1. Cash Flow from Operating Activities
              </h3>
              <div className="space-y-2.5 text-xs text-slate-700 px-3">
                <div className="flex justify-between"><span>Net Operating Surplus</span><span className="font-mono font-semibold">{formatMoney(16600000)}</span></div>
                <div className="flex justify-between"><span>Add: Non-Cash Provision for Bad Debts</span><span className="font-mono font-semibold">{formatMoney(5800000)}</span></div>
                <div className="flex justify-between text-rose-600"><span>Net Increase in Loan Outstanding Portfolio</span><span className="font-mono font-semibold">({formatMoney(25000000)})</span></div>
                <div className="flex justify-between text-emerald-700"><span>Net Increase in Client Savings Deposits</span><span className="font-mono font-semibold">{formatMoney(12500000)}</span></div>
                <div className="flex justify-between font-bold border-t border-slate-200 pt-3 text-[#05445E] text-sm">
                  <span>Net Cash Provided by Operating Activities</span>
                  <span className="font-mono">{formatMoney(9900000)}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-[#05445E] text-xs uppercase tracking-wider bg-slate-100 p-2.5 rounded-lg mb-3">
                2. Cash Flow from Investing Activities
              </h3>
              <div className="space-y-2.5 text-xs text-slate-700 px-3">
                <div className="flex justify-between text-rose-600"><span>Purchase of Office Computers & Hardware</span><span className="font-mono font-semibold">({formatMoney(2400000)})</span></div>
                <div className="flex justify-between font-bold border-t border-slate-200 pt-3 text-[#05445E] text-sm">
                  <span>Net Cash Used in Investing Activities</span>
                  <span className="font-mono text-rose-700">({formatMoney(2400000)})</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-[#05445E] text-xs uppercase tracking-wider bg-slate-100 p-2.5 rounded-lg mb-3">
                3. Cash Flow from Financing Activities
              </h3>
              <div className="space-y-2.5 text-xs text-slate-700 px-3">
                <div className="flex justify-between text-emerald-700"><span>Additional Capital Injection by Shareholders</span><span className="font-mono font-semibold">{formatMoney(5000000)}</span></div>
                <div className="flex justify-between font-bold border-t border-slate-200 pt-3 text-[#05445E] text-sm">
                  <span>Net Cash Provided by Financing Activities</span>
                  <span className="font-mono">{formatMoney(5000000)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between text-slate-700"><span>Net Increase in Cash & Equivalents</span><span className="font-mono font-bold">{formatMoney(12500000)}</span></div>
              <div className="flex justify-between text-slate-700"><span>Cash Balance at Beginning of Period</span><span className="font-mono font-bold">{formatMoney(2700000)}</span></div>
              <div className="flex justify-between border-t border-teal-200 pt-2 font-bold text-[#05445E] text-sm">
                <span>Ending Cash Balance</span>
                <span className="font-mono text-teal-800">{formatMoney(15200000)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
