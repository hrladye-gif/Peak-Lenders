import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  UserCheck, 
  FileText, 
  CreditCard, 
  Banknote, 
  FolderMinus, 
  PiggyBank, 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  BookOpen, 
  FileSpreadsheet, 
  BookMarked, 
  AlertCircle, 
  FileBarChart, 
  Settings,
  ShieldCheck,
  Building2,
  ChevronDown, 
  ChevronRight 
} from 'lucide-react';

export const Sidebar = () => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    customers: true,
    loans: true,
    savings: true,
    accounting: true,
    reports: true,
    admin: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
      isActive
        ? 'bg-[#189AB4] text-white shadow-sm'
        : 'text-slate-300 hover:bg-[#05445E]/50 hover:text-white'
    }`;

  return (
    <aside className="w-64 bg-[#05445E] text-slate-200 min-h-screen flex flex-col border-r border-slate-700/50">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-700/50 flex items-center gap-3">
        <div className="p-2 bg-[#189AB4] text-white rounded-xl font-bold">PL</div>
        <div>
          <h1 className="font-bold text-white tracking-wide text-sm">Peak Lenders</h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest">MFI Portal</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-4 overflow-y-auto text-xs">
        {/* Main */}
        <div>
          <NavLink to="/dashboard" className={linkClass}>
            <BarChart3 size={16} /> Dashboard
          </NavLink>
        </div>

        {/* Customers */}
        <div>
          <button
            onClick={() => toggleSection('customers')}
            className="w-full flex items-center justify-between text-slate-400 font-bold text-[11px] uppercase tracking-wider mb-1 px-2 py-1 hover:text-white"
          >
            <span>Customers</span>
            {openSections.customers ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          {openSections.customers && (
            <div className="space-y-1 pl-2">
              <NavLink to="/borrowers" className={linkClass}>
                <UserCheck size={16} /> Borrowers
              </NavLink>
              <NavLink to="/groups" className={linkClass}>
                <Users size={16} /> Solidarity Groups
              </NavLink>
            </div>
          )}
        </div>

        {/* Loans */}
        <div>
          <button
            onClick={() => toggleSection('loans')}
            className="w-full flex items-center justify-between text-slate-400 font-bold text-[11px] uppercase tracking-wider mb-1 px-2 py-1 hover:text-white"
          >
            <span>Loans</span>
            {openSections.loans ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          {openSections.loans && (
            <div className="space-y-1 pl-2">
              <NavLink to="/applications" className={linkClass}>
                <FileText size={16} /> Applications
              </NavLink>
              <NavLink to="/loans" className={linkClass}>
                <CreditCard size={16} /> Active Loans
              </NavLink>
              <NavLink to="/repayments" className={linkClass}>
                <Banknote size={16} /> Repayments
              </NavLink>
              <NavLink to="/writeoffs" className={linkClass}>
                <FolderMinus size={16} /> Write-Offs
              </NavLink>
            </div>
          )}
        </div>

        {/* Savings */}
        <div>
          <button
            onClick={() => toggleSection('savings')}
            className="w-full flex items-center justify-between text-slate-400 font-bold text-[11px] uppercase tracking-wider mb-1 px-2 py-1 hover:text-white"
          >
            <span>Savings</span>
            {openSections.savings ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          {openSections.savings && (
            <div className="space-y-1 pl-2">
              <NavLink to="/savings/products" className={linkClass}>
                <PiggyBank size={16} /> Products
              </NavLink>
              <NavLink to="/savings/accounts" className={linkClass}>
                <Wallet size={16} /> Accounts
              </NavLink>
              <NavLink to="/savings/deposits" className={linkClass}>
                <ArrowDownLeft size={16} /> Deposits
              </NavLink>
              <NavLink to="/savings/withdrawals" className={linkClass}>
                <ArrowUpRight size={16} /> Withdrawals
              </NavLink>
            </div>
          )}
        </div>

        {/* Accounting */}
        <div>
          <button
            onClick={() => toggleSection('accounting')}
            className="w-full flex items-center justify-between text-slate-400 font-bold text-[11px] uppercase tracking-wider mb-1 px-2 py-1 hover:text-white"
          >
            <span>Accounting</span>
            {openSections.accounting ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          {openSections.accounting && (
            <div className="space-y-1 pl-2">
              <NavLink to="/accounting/chart-of-accounts" className={linkClass}>
                <BookOpen size={16} /> Chart of Accounts
              </NavLink>
              <NavLink to="/accounting/journal" className={linkClass}>
                <FileSpreadsheet size={16} /> Journal Entries
              </NavLink>
              <NavLink to="/accounting/ledger" className={linkClass}>
                <BookMarked size={16} /> General Ledger
              </NavLink>
            </div>
          )}
        </div>

        {/* Reports */}
        <div>
          <button
            onClick={() => toggleSection('reports')}
            className="w-full flex items-center justify-between text-slate-400 font-bold text-[11px] uppercase tracking-wider mb-1 px-2 py-1 hover:text-white"
          >
            <span>Reports</span>
            {openSections.reports ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          {openSections.reports && (
            <div className="space-y-1 pl-2">
              <NavLink to="/reports/par-aging" className={linkClass}>
                <AlertCircle size={15} /> PAR & Aging
              </NavLink>
              <NavLink to="/reports/financial" className={linkClass}>
                <FileBarChart size={15} /> Financial Statements
              </NavLink>
            </div>
          )}
        </div>

        {/* Administration */}
        <div>
          <button
            onClick={() => toggleSection('admin')}
            className="w-full flex items-center justify-between text-slate-400 font-bold text-[11px] uppercase tracking-wider mb-1 px-2 py-1 hover:text-white"
          >
            <span>Administration</span>
            {openSections.admin ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          {openSections.admin && (
            <div className="space-y-1 pl-2">
              <NavLink to="/admin/users" className={linkClass}>
                <ShieldCheck size={16} /> Users & Roles
              </NavLink>
              <NavLink to="/admin/branches" className={linkClass}>
                <Building2 size={16} /> Branches
              </NavLink>
              <NavLink to="/admin/settings" className={linkClass}>
                <Settings size={16} /> System Settings
              </NavLink>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
};
