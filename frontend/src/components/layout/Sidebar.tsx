import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import * as Lucide from "lucide-react";

export const Sidebar = () => {
  const location = useLocation();

  const [logo, setLogo] = useState<string | null>(null);

  const [open, setOpen] = useState<Record<string, boolean>>({
    Dashboard: true,
    Customers: true,
    Lending: true,
    Savings: false,
    Accounting: false,
    Reports: false,
    Administration: false,
  });

  const toggle = (menu: string) => {
    setOpen((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const handleLogoUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files?.[0]) {
      setLogo(URL.createObjectURL(e.target.files[0]));
    }
  };

  const menu = [
    {
      title: "Dashboard",
      icon: "LayoutDashboard",
      items: ["Dashboard", "Notifications", "Activity Feed"],
    },
    {
      title: "Organization",
      icon: "Building2",
      items: ["Tenants", "Branches", "Users"],
    },
    {
      title: "Clients",
      icon: "Users",
      items: ["Borrowers", "Groups", "Guarantors"],
    },
    {
      title: "Loans",
      icon: "HandCoins",
      items: [
        "Applications",
        "Active Loans",
        "Repayments",
        "Collections",
        "Write-Offs",
      ],
    },
    {
      title: "Savings",
      icon: "PiggyBank",
      items: [
        "Products",
        "Accounts",
        "Deposits",
        "Withdrawals",
      ],
    },
    {
      title: "Accounting",
      icon: "Calculator",
      items: [
        "Chart of Accounts",
        "Journal Entries",
        "General Ledger",
        "Trial Balance",
        "Income Statement",
        "Balance Sheet",
      ],
    },
    {
      title: "Reports",
      icon: "FileText",
      items: [
        "Portfolio Reports",
        "Financial Reports",
        "Branch Reports",
      ],
    },
    {
      title: "Settings",
      icon: "Settings",
      items: [
        "Institution",
        "Users & Roles",
        "System Settings",
      ],
    },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-200 h-screen flex flex-col shadow-sm">

      {/* Header */}

      <div className="p-6 border-b border-slate-100">

        <div className="flex items-center gap-3">

          <label className="cursor-pointer">

            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleLogoUpload}
            />

            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">

              {logo ? (
                <img
                  src={logo}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Lucide.Building2
                  size={22}
                  className="text-slate-500"
                />
              )}

            </div>

          </label>

          <div>
            <h1 className="font-bold text-lg text-slate-900">
              Peak Lenders
            </h1>

            <p className="text-xs text-slate-500">
              Microfinance Platform
            </p>
          </div>

        </div>

      </div>

      {/* Menu */}

      <div className="flex-1 overflow-y-auto p-4">

        <nav className="space-y-5">

          {menu.map((section) => {
            const Icon = (Lucide as any)[section.icon];

            return (
              <div key={section.title}>

                <button
                  onClick={() => toggle(section.title)}
                  className="w-full flex items-center justify-between text-slate-700 hover:text-emerald-700 transition"
                >
                  <span className="flex items-center gap-3 font-semibold text-sm uppercase tracking-wide">

                    <Icon size={16} />

                    {section.title}

                  </span>

                  <Lucide.ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      open[section.title]
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>

                {open[section.title] && (
                  <ul className="mt-3 ml-2 space-y-1">

                    {section.items.map((item) => {
                      const path =
                        item === "Dashboard"
                          ? "/"
                          : `/${item
                              .toLowerCase()
                              .replace(/\s+/g, "-")
                              .replace(/&/g, "")}`;

                      const active =
                        location.pathname === path;

                      return (
                        <li key={item}>

                          <Link
                            to={path}
                            className={`flex items-center px-4 py-2.5 rounded-xl text-sm transition-all ${
                              active
                                ? "bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200"
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            }`}
                          >
                            {item}
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

      {/* Footer */}

      <div className="p-4 border-t border-slate-200">

        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition font-medium">
          <Lucide.LogOut size={18} />
          Log Out
        </button>

      </div>

    </aside>
  );
};
