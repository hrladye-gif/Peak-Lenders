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
      items: [
        "Dashboard",
        "Notifications",
        "Activity Feed",
      ],
    },

    {
      title: "Customers",
      icon: "Users",
      items: [
        "Borrowers",
        "Groups",
      ],
    },

    {
      title: "Lending",
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
      title: "Administration",
      icon: "ShieldCheck",
      items: [
        "Institution",
        "Branches",
        "Tenants",
        "Users",
        "Roles & Permissions",
        "Audit Trail",
        "System Settings",
      ],
    },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-screen shadow-sm">

      {/* Logo */}

      <div className="p-6 border-b border-slate-100">

        <label className="flex items-center gap-3 cursor-pointer">

          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleLogoUpload}
          />

          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-blue-50 border border-blue-100 flex items-center justify-center">

            {logo ? (
              <img
                src={logo}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <Lucide.Building2
                size={22}
                className="text-blue-600"
              />
            )}

          </div>

          <div>

            <h2 className="font-bold text-lg text-slate-900">
              Peak Lenders
            </h2>

            <p className="text-xs text-slate-500">
              Digital Microfinance
            </p>

          </div>

        </label>

      </div>

      {/* Menu */}

      <div className="flex-1 overflow-y-auto px-4 py-5">

        <nav className="space-y-5">

          {menu.map((section) => {
            const Icon = (Lucide as any)[section.icon];

            return (
              <div key={section.title}>

                <button
                  onClick={() => toggle(section.title)}
                  className="flex items-center justify-between w-full text-slate-700 hover:text-blue-600 transition"
                >

                  <div className="flex items-center gap-3 uppercase tracking-wide text-xs font-bold">

                    <Icon size={17} />

                    {section.title}

                  </div>

                  <Lucide.ChevronDown
                    size={16}
                    className={`transition ${
                      open[section.title]
                        ? "rotate-180"
                        : ""
                    }`}
                  />

                </button>

                {open[section.title] && (

                  <ul className="mt-3 ml-3 space-y-1">

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
                            className={`flex items-center px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                              active
                                ? "bg-blue-50 text-blue-700 border border-blue-200 font-semibold shadow-sm"
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

      <div className="border-t border-slate-200 p-4">

        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition">

          <Lucide.LogOut size={18} />

          Log Out

        </button>

      </div>

    </aside>
  );
};
