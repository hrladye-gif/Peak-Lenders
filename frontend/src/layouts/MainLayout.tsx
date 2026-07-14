import { Outlet } from "react-router-dom";
import { useState } from "react";

import {
  Bell,
  Building2,
  Users,
  CreditCard,
  PiggyBank,
  Landmark,
  FileBarChart,
  Settings,
  Home,
  ChevronDown,
  Menu,
  Shield
} from "lucide-react";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [organizationOpen, setOrganizationOpen] = useState(true);
  const [clientsOpen, setClientsOpen] = useState(true);
  const [lendingOpen, setLendingOpen] = useState(true);
  const [savingsOpen, setSavingsOpen] = useState(true);
  const [accountingOpen, setAccountingOpen] = useState(true);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="app">
      <aside className={`sidebar ${sidebarOpen ? "" : "collapsed"}`}>
        <div className="logo">
          <Shield size={24} />
          <h3>Peak Lenders</h3>
        </div>

        <nav>
           {/* Organization */}
          <div className="menu-section">
            <div
              className="menu-title clickable"
              onClick={() => setOrganizationOpen(!organizationOpen)}
            >
              <span>Organization</span>

              <ChevronDown
                size={16}
                className={organizationOpen ? "rotate" : ""}
              />
            </div>

            {organizationOpen && (
              <div className="submenu">
                <a href="#">
                  <Building2 size={18} />
                  Tenants
                </a>

                <a href="#">
                  <Building2 size={18} />
                  Branches
                </a>
              </div>
            )}
          </div>

          {/* Clients */}
          <div className="menu-section">
            <div
              className="menu-title clickable"
              onClick={() => setClientsOpen(!clientsOpen)}
            >
              <span>Clients</span>

              <ChevronDown
                size={16}
                className={clientsOpen ? "rotate" : ""}
              />
            </div>

            {clientsOpen && (
              <div className="submenu">
                <a href="#">
                  <Users size={18} />
                  Borrowers
                </a>

                <a href="#">
                  <Users size={18} />
                  Guarantors
                </a>
              </div>
            )}
          </div>

          {/* Lending */}
          <div className="menu-section">
            <div
              className="menu-title clickable"
              onClick={() => setLendingOpen(!lendingOpen)}
            >
              <span>Lending</span>

              <ChevronDown
                size={16}
                className={lendingOpen ? "rotate" : ""}
              />
            </div>

            {lendingOpen && (
              <div className="submenu">
                <a href="#">
                  <CreditCard size={18} />
                  Loan Applications
                </a>

                <a href="#">
                  <CreditCard size={18} />
                  Loans
                </a>

                <a href="#">
                  <CreditCard size={18} />
                  Repayments
                </a>

                <a href="#">
                  <CreditCard size={18} />
                  Collections
                </a>
              </div>
            )}
          </div>

          {/* Savings */}
          <div className="menu-section">
            <div
              className="menu-title clickable"
              onClick={() => setSavingsOpen(!savingsOpen)}
            >
              <span>Savings</span>

              <ChevronDown
                size={16}
                className={savingsOpen ? "rotate" : ""}
              />
            </div>

            {savingsOpen && (
              <div className="submenu">
                <a href="#">
                  <PiggyBank size={18} />
                  Savings Accounts
                </a>

                <a href="#">
                  <PiggyBank size={18} />
                  Deposits
                </a>

                <a href="#">
                  <PiggyBank size={18} />
                  Withdrawals
                </a>
              </div>
            )}
          </div>

          {/* Accounting */}
          <div className="menu-section">
            <div
              className="menu-title clickable"
              onClick={() => setAccountingOpen(!accountingOpen)}
            >
              <span>Accounting</span>

              <ChevronDown
                size={16}
                className={accountingOpen ? "rotate" : ""}
              />
            </div>

            {accountingOpen && (
              <div className="submenu">
                <a href="#">
                  <Landmark size={18} />
                  Chart of Accounts
                </a>

                <a href="#">
                  <Landmark size={18} />
                  Journal Entries
                </a>

                <a href="#">
                  <Landmark size={18} />
                  General Ledger
                </a>

                <a href="#">
                  <Landmark size={18} />
                  Trial Balance
                </a>
              </div>
            )}
          </div>

          {/* Reports */}
          <div className="menu-section">
            <div
              className="menu-title clickable"
              onClick={() => setReportsOpen(!reportsOpen)}
            >
              <span>Reports</span>

              <ChevronDown
                size={16}
                className={reportsOpen ? "rotate" : ""}
              />
            </div>

            {reportsOpen && (
              <div className="submenu">
                <a href="#">
                  <FileBarChart size={18} />
                  Reports
                </a>
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="menu-section">
            <div
              className="menu-title clickable"
              onClick={() => setSettingsOpen(!settingsOpen)}
            >
              <span>Settings</span>

              <ChevronDown
                size={16}
                className={settingsOpen ? "rotate" : ""}
              />
            </div>

            {settingsOpen && (
              <div className="submenu">
                <a href="#">
                  <Settings size={18} />
                  Settings
                </a>
              </div>
            )}
          </div>
        </nav>
      </aside>

      <div className="content">
        <header className="topbar">
          <div className="topbar-left">
            <Menu
              size={20}
              className="menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            />
            <h2>Dashboard</h2>
          </div>

          <div className="topbar-right">
            <Bell size={20} />

            <div>
              <strong>Administrator</strong>
              <br />
              <small>Super Admin</small>
            </div>

            <div className="avatar"></div>
          </div>
        </header>

        <Outlet />
      </div>
    </div>
  );
}