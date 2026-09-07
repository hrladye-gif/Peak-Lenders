import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  PiggyBank, 
  BookOpen, 
  BarChart3, 
  Settings as SettingsIcon, 
  Bell, 
  Activity, 
  ChevronDown, 
  ChevronRight,
  Search,
  Building2,
  ShieldAlert,
  LogOut
} from 'lucide-react';

export const Layout = () => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('companyName');
    localStorage.removeItem('peak_org_name');

    window.location.href = '/login';
  };
  const [orgName, setOrgName] = useState(() => localStorage.getItem('peak_org_name') || 'Peak Lenders EA');
  const [logo, setLogo] = useState(() => localStorage.getItem('peak_logo'));
  const [currency, setCurrency] = useState(() => localStorage.getItem('peak_currency') || 'UGX');

  const getStoredUser = () => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  };

  const [currentUser, setCurrentUser] = useState(getStoredUser);

  // Sub-menu toggle states
  const [customersOpen, setCustomersOpen] = useState(true);
  const [loansOpen, setLoansOpen] = useState(true);
  const [savingsOpen, setSavingsOpen] = useState(true);
  const [accountingOpen, setAccountingOpen] = useState(true);
  const [reportsOpen, setReportsOpen] = useState(true);
  const [adminOpen, setAdminOpen] = useState(true);

  useEffect(() => {
    const updateSidebarState = () => {
      setOrgName(localStorage.getItem('peak_org_name') || 'Peak Lenders EA');
      setLogo(localStorage.getItem('peak_logo'));
      setCurrency(localStorage.getItem('peak_currency') || 'UGX');
      setCurrentUser(getStoredUser());
    };

    window.addEventListener('peak-settings-changed', updateSidebarState);
    window.addEventListener('storage', updateSidebarState);
    window.addEventListener('user-changed', updateSidebarState);

    return () => {
      window.removeEventListener('peak-settings-changed', updateSidebarState);
      window.removeEventListener('storage', updateSidebarState);
      window.removeEventListener('user-changed', updateSidebarState);
    };
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#05445E] text-white flex flex-col shadow-xl z-20">
        <div className="p-6 flex items-center gap-3 border-b border-[#189AB4]/30">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-md shrink-0">
            {logo ? (
              <img src={logo} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <Building2 className="text-[#05445E]" size={22} />
            )}
          </div>
          <div className="overflow-hidden">
            <h1 className="font-bold text-xs tracking-wide truncate">{orgName}</h1>
            <span className="text-[10px] text-[#189AB4] bg-[#189AB4]/10 px-2 py-0.5 rounded-full font-mono font-bold inline-block mt-0.5">
              Base: {currency}
            </span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1 text-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase px-3 pb-1 tracking-wider">Main</div>
          <Link to="/dashboard" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${isActive('/dashboard') ? 'bg-[#189AB4] text-white shadow-md' : 'text-slate-300 hover:bg-[#189AB4]/20'}`}>
            <LayoutDashboard size={16} /> Dashboard
          </Link>
          <Link to="/notifications" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${isActive('/notifications') ? 'bg-[#189AB4] text-white shadow-md' : 'text-slate-300 hover:bg-[#189AB4]/20'}`}>
            <Bell size={16} /> Notifications
          </Link>
          <Link to="/activity-feed" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${isActive('/activity-feed') ? 'bg-[#189AB4] text-white shadow-md' : 'text-slate-300 hover:bg-[#189AB4]/20'}`}>
            <Activity size={16} /> Activity Feed
          </Link>

          {/* Customers */}
          <div className="pt-4 text-[10px] font-bold text-slate-400 uppercase px-3 pb-1 tracking-wider">Customers</div>
          <div>
            <button 
              onClick={() => setCustomersOpen(!customersOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-slate-300 hover:bg-[#189AB4]/20 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3"><Users size={16} /> Borrowers & Groups</div>
              {customersOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            {customersOpen && (
              <div className="pl-9 space-y-1 mt-1">
                <Link to="/borrowers" className={`block px-3 py-1.5 rounded-lg transition-colors ${isActive('/borrowers') ? 'text-white font-bold bg-[#189AB4]/40' : 'text-slate-400 hover:text-white'}`}>Borrowers</Link>
                <Link to="/groups" className={`block px-3 py-1.5 rounded-lg transition-colors ${isActive('/groups') ? 'text-white font-bold bg-[#189AB4]/40' : 'text-slate-400 hover:text-white'}`}>Groups</Link>
              </div>
            )}
          </div>

          {/* Loans */}
          <div className="pt-4 text-[10px] font-bold text-slate-400 uppercase px-3 pb-1 tracking-wider">Loans</div>
          <div>
            <button 
              onClick={() => setLoansOpen(!loansOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-slate-300 hover:bg-[#189AB4]/20 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3"><Wallet size={16} /> Loan Management</div>
              {loansOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            {loansOpen && (
              <div className="pl-9 space-y-1 mt-1">
                <Link to="/applications" className={`block px-3 py-1.5 rounded-lg transition-colors ${isActive('/applications') ? 'text-white font-bold bg-[#189AB4]/40' : 'text-slate-400 hover:text-white'}`}>Applications</Link>
                <Link to="/loans" className={`block px-3 py-1.5 rounded-lg transition-colors ${isActive('/loans') ? 'text-white font-bold bg-[#189AB4]/40' : 'text-slate-400 hover:text-white'}`}>Loans</Link>
                <Link to="/loan-products" className={`block px-3 py-1.5 rounded-lg transition-colors ${isActive('/loan-products') ? 'text-white font-bold bg-[#189AB4]/40' : 'text-slate-400 hover:text-white'}`}>Loan Products</Link>
                <Link to="/repayments" className={`block px-3 py-1.5 rounded-lg transition-colors ${isActive('/repayments') ? 'text-white font-bold bg-[#189AB4]/40' : 'text-slate-400 hover:text-white'}`}>Repayments</Link>
                <Link to="/collections" className={`block px-3 py-1.5 rounded-lg transition-colors ${isActive('/collections') ? 'text-white font-bold bg-[#189AB4]/40' : 'text-slate-400 hover:text-white'}`}>Collections</Link>
                <Link to="/writeoffs" className={`block px-3 py-1.5 rounded-lg transition-colors ${isActive('/writeoffs') ? 'text-white font-bold bg-[#189AB4]/40' : 'text-slate-400 hover:text-white'}`}>Write-Offs</Link>
              </div>
            )}
          </div>

          {/* Savings */}
          <div className="pt-4 text-[10px] font-bold text-slate-400 uppercase px-3 pb-1 tracking-wider">Savings</div>
          <div>
            <button 
              onClick={() => setSavingsOpen(!savingsOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-slate-300 hover:bg-[#189AB4]/20 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3"><PiggyBank size={16} /> Savings & Deposits</div>
              {savingsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            {savingsOpen && (
              <div className="pl-9 space-y-1 mt-1">
                <Link to="/savings/products" className={`block px-3 py-1.5 rounded-lg transition-colors ${isActive('/savings/products') ? 'text-white font-bold bg-[#189AB4]/40' : 'text-slate-400 hover:text-white'}`}>Savings Products</Link>
                <Link to="/savings/accounts" className={`block px-3 py-1.5 rounded-lg transition-colors ${isActive('/savings/accounts') ? 'text-white font-bold bg-[#189AB4]/40' : 'text-slate-400 hover:text-white'}`}>Accounts</Link>
                <Link to="/savings/deposits" className={`block px-3 py-1.5 rounded-lg transition-colors ${isActive('/savings/deposits') ? 'text-white font-bold bg-[#189AB4]/40' : 'text-slate-400 hover:text-white'}`}>Deposits</Link>
                <Link to="/savings/withdrawals" className={`block px-3 py-1.5 rounded-lg transition-colors ${isActive('/savings/withdrawals') ? 'text-white font-bold bg-[#189AB4]/40' : 'text-slate-400 hover:text-white'}`}>Withdrawals</Link>
              </div>
            )}
          </div>

          {/* Accounting */}
          <div className="pt-4 text-[10px] font-bold text-slate-400 uppercase px-3 pb-1 tracking-wider">Accounting</div>
          <div>
            <button 
              onClick={() => setAccountingOpen(!accountingOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-slate-300 hover:bg-[#189AB4]/20 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3"><BookOpen size={16} /> General Ledger</div>
              {accountingOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            {accountingOpen && (
              <div className="pl-9 space-y-1 mt-1">
                <Link to="/accounting/chart-of-accounts" className={`block px-3 py-1.5 rounded-lg transition-colors ${isActive('/accounting/chart-of-accounts') ? 'text-white font-bold bg-[#189AB4]/40' : 'text-slate-400 hover:text-white'}`}>Chart of Accounts</Link>
                <Link to="/accounting/journal" className={`block px-3 py-1.5 rounded-lg transition-colors ${isActive('/accounting/journal') ? 'text-white font-bold bg-[#189AB4]/40' : 'text-slate-400 hover:text-white'}`}>Journal Entries</Link>
                <Link to="/accounting/ledger" className={`block px-3 py-1.5 rounded-lg transition-colors ${isActive('/accounting/ledger') ? 'text-white font-bold bg-[#189AB4]/40' : 'text-slate-400 hover:text-white'}`}>General Ledger</Link>
              </div>
            )}
          </div>

          {/* Reports */}
          <div className="pt-4 text-[10px] font-bold text-slate-400 uppercase px-3 pb-1 tracking-wider">Reports</div>
          <div>
            <button 
              onClick={() => setReportsOpen(!reportsOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-slate-300 hover:bg-[#189AB4]/20 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3"><BarChart3 size={16} /> Financial Reports</div>
              {reportsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            {reportsOpen && (
              <div className="pl-9 space-y-1 mt-1">
                <Link to="/reports/par-aging" className={`block px-3 py-1.5 rounded-lg transition-colors ${isActive('/reports/par-aging') ? 'text-white font-bold bg-[#189AB4]/40' : 'text-slate-400 hover:text-white'}`}>PAR & Aging</Link>
                <Link to="/reports/financial" className={`block px-3 py-1.5 rounded-lg transition-colors ${isActive('/reports/financial') ? 'text-white font-bold bg-[#189AB4]/40' : 'text-slate-400 hover:text-white'}`}>Financial Statements</Link>
              </div>
            )}
          </div>

          {/* Admin */}
          <div className="pt-4 text-[10px] font-bold text-slate-400 uppercase px-3 pb-1 tracking-wider">Administration</div>
          <div>
            <button 
              onClick={() => setAdminOpen(!adminOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-slate-300 hover:bg-[#189AB4]/20 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3"><ShieldAlert size={16} /> System Control</div>
              {adminOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            {adminOpen && (
              <div className="pl-9 space-y-1 mt-1">
                <Link to="/admin/users" className={`block px-3 py-1.5 rounded-lg transition-colors ${isActive('/admin/users') ? 'text-white font-bold bg-[#189AB4]/40' : 'text-slate-400 hover:text-white'}`}>Users & Roles</Link>
                <Link to="/admin/branches" className={`block px-3 py-1.5 rounded-lg transition-colors ${isActive('/admin/branches') ? 'text-white font-bold bg-[#189AB4]/40' : 'text-slate-400 hover:text-white'}`}>Branches</Link>
                <Link to="/admin/settings" className={`block px-3 py-1.5 rounded-lg transition-colors ${isActive('/admin/settings') ? 'text-white font-bold bg-[#189AB4]/40' : 'text-slate-400 hover:text-white'}`}>Settings</Link>
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search borrowers, loan IDs, branches..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 border-l pl-4 border-slate-200">
              <div className="w-8 h-8 rounded-full bg-[#189AB4] text-white font-bold flex items-center justify-center text-xs">
                {`${currentUser.first_name?.[0] || 'A'}${currentUser.last_name?.[0] || 'U'}`.toUpperCase()}
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-700">
                  {currentUser.first_name || currentUser.last_name
                    ? `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim()
                    : 'Admin User'}
                </p>
                <p className="text-[10px] text-slate-400">
                  {currentUser.role
                    ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)
                    : 'Administrator'}
                </p>
              </div>
              <ChevronDown size={14} className="text-slate-400" />

              <button
                type="button"
                onClick={handleLogout}
                title="Logout"
                className="ml-2 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
