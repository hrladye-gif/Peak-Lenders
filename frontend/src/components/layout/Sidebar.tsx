import { useState } from 'react';
import { Link } from 'react-router-dom';
import * as Lucide from 'lucide-react';

export const Sidebar = () => {
  const [open, setOpen] = useState<Record<string, boolean>>({ Dashboard: true });
  const [activeItem, setActiveItem] = useState<string>('Dashboard');
  const [logo, setLogo] = useState<string | null>(null);

  const toggle = (m: string) => setOpen(prev => ({ ...prev, [m]: !prev[m] }));

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(URL.createObjectURL(e.target.files[0]));
    }
  };

  const menu = [
    { title: 'Dashboard', icon: 'LayoutDashboard', items: ['Dashboard', 'Notifications', 'Activity Feed'] },
    { title: 'Organization', icon: 'Building2', items: ['Tenants', 'Branches', 'Users'] },
    { title: 'Clients', icon: 'Users', items: ['Borrowers', 'Groups', 'Guarantors'] },
    { title: 'Loans', icon: 'HandCoins', items: ['Applications', 'Active Loans', 'Repayments', 'Collections', 'Write-Offs'] },
    { title: 'Savings', icon: 'PiggyBank', items: ['Products', 'Accounts', 'Deposits', 'Withdrawals'] },
    { title: 'Accounting', icon: 'Calculator', items: ['Chart of Accounts', 'Journal Entries', 'General Ledger', 'Trial Balance', 'Income Statement', 'Balance Sheet'] },
    { title: 'Reports', icon: 'FileText', items: ['Portfolio Reports', 'Financial Reports', 'Branch Reports'] },
    { title: 'Settings', icon: 'Settings', items: ['Institution', 'Users & Roles', 'System Settings'] },
  ];

  return (
    <aside className="w-64 bg-[#e6f4ea] p-6 h-screen border-r border-slate-200 flex flex-col justify-between">
      <div className="overflow-y-auto">
        <div className="mb-10 flex items-center gap-3">
          <label className="cursor-pointer">
            <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
            <div className="w-10 h-10 bg-white rounded-full border border-slate-200 flex items-center justify-center overflow-hidden">
              {logo ? <img src={logo} alt="Logo" className="w-full h-full object-cover" /> : <span className="text-[10px] text-slate-400">Upload</span>}
            </div>
          </label>
          <h1 className="font-bold text-xl text-[#1a2e23]">PEAK-LENDERS</h1>
        </div>

        <nav className="space-y-4">
          {menu.map((m) => {
            const Icon = (Lucide as any)[m.icon];
            return (
              <div key={m.title}>
                <button onClick={() => toggle(m.title)} className="w-full font-bold text-[#1a2e23] flex justify-between items-center text-sm uppercase tracking-wider">
                  <span className="flex items-center gap-2"><Icon size={16} /> {m.title}</span>
                  <span>{open[m.title] ? '−' : '+'}</span>
                </button>
                {open[m.title] && (
                  <ul className="mt-2 space-y-1 ml-2 text-sm text-slate-700">
                    {m.items.map((i) => {
                      const path = i === 'Dashboard' ? '/' : `/${i.toLowerCase().replace(/\s+/g, '-')}`;
                      return (
                        <li key={i} onClick={() => setActiveItem(i)}>
                          <Link 
                            to={path}
                            className={`block px-3 py-2 rounded-lg transition-colors ${activeItem === i ? 'bg-[#3EB489]/20 text-[#3EB489] font-bold border-l-4 border-[#3EB489]' : 'hover:text-[#166534] hover:font-medium'}`}
                          >
                            {i}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <button className="flex items-center gap-2 text-red-600 font-bold hover:text-red-700 mt-6 pt-6 border-t border-slate-200">
        <Lucide.LogOut size={18} /> Log Out
      </button>
    </aside>
  );
};