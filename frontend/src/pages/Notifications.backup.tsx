import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "Approval",
    message: "New loan application for John Doe awaiting review.",
    time: "10m ago",
    read: false,
  },
  {
    id: 2,
    type: "System",
    message: "System maintenance scheduled for 02:00 AM EAT.",
    time: "2h ago",
    read: false,
  },
  {
    id: 3,
    type: "Alert",
    message: "Liquidity alert for Nairobi Branch.",
    time: "5h ago",
    read: true,
  },
];

export const Notifications = () => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}

        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Notifications
            </h1>

            <p className="text-sm text-slate-500">
              Monitor alerts, approvals, and system updates
            </p>
          </div>

          <button className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition">
            Mark All Read
          </button>
        </header>

        {/* Main */}

        <main className="flex-1 overflow-y-auto p-6">

          {/* Summary Cards */}

          <div className="grid grid-cols-3 gap-5 mb-6">

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs uppercase font-semibold text-slate-500 tracking-wider">
                    Total Notifications
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    {notifications.length}
                  </h2>
                </div>

                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                  <Lucide.Bell className="text-white" size={22} />
                </div>

              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs uppercase font-semibold text-slate-500 tracking-wider">
                    Unread
                  </p>

                  <h2 className="text-3xl font-bold mt-2 text-amber-600">
                    {unreadCount}
                  </h2>
                </div>

                <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center">
                  <Lucide.AlertCircle
                    className="text-white"
                    size={22}
                  />
                </div>

              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs uppercase font-semibold text-slate-500 tracking-wider">
                    Read
                  </p>

                  <h2 className="text-3xl font-bold mt-2 text-emerald-600">
                    {notifications.length - unreadCount}
                  </h2>
                </div>

                <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center">
                  <Lucide.CheckCircle
                    className="text-white"
                    size={22}
                  />
                </div>

              </div>
            </div>

          </div>

          {/* Notification List */}

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">

              <div>
                <h2 className="font-bold text-lg">
                  Recent Notifications
                </h2>

                <p className="text-sm text-slate-500">
                  Latest alerts across the institution
                </p>
              </div>

              <Lucide.BellRing
                size={22}
                className="text-slate-400"
              />

            </div>

            <div className="divide-y divide-slate-100">

              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 flex items-start gap-4 transition hover:bg-slate-50 ${
                    !notification.read
                      ? "bg-emerald-50/40"
                      : ""
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      !notification.read
                        ? "bg-emerald-600"
                        : "bg-slate-400"
                    }`}
                  >
                    <Lucide.Bell
                      size={18}
                      className="text-white"
                    />
                  </div>

                  <div className="flex-1">

                    <div className="flex items-center gap-2 mb-1">

                      <span className="font-semibold">
                        {notification.type}
                      </span>

                      {!notification.read && (
                        <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold uppercase">
                          New
                        </span>
                      )}

                    </div>

                    <p className="text-slate-600 text-sm">
                      {notification.message}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-xs text-slate-400 font-medium">
                      {notification.time}
                    </p>

                  </div>

                </div>
              ))}

            </div>
          </div>

        </main>
      </div>
    </div>
  );
};
