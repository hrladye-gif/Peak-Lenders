import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";

const activities = [
  {
    id: 1,
    user: "Andrew Forbist",
    action: "Approved loan application",
    target: "John Doe",
    time: "10m ago",
  },
  {
    id: 2,
    user: "System",
    action: "Automated disbursement",
    target: "Nairobi Branch",
    time: "1h ago",
  },
  {
    id: 3,
    user: "Sarah Kimani",
    action: "Updated branch settings",
    target: "Kampala Office",
    time: "3h ago",
  },
  {
    id: 4,
    user: "System",
    action: "Monthly interest accrued",
    target: "All Accounts",
    time: "5h ago",
  },
];

export const ActivityFeed = () => {
  const systemActivities = activities.filter(
    (a) => a.user === "System"
  ).length;

  const userActivities = activities.length - systemActivities;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}

        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Activity Feed
            </h1>

            <p className="text-sm text-slate-500">
              Monitor user actions and system events
            </p>
          </div>

          <button className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition flex items-center gap-2">
            <Lucide.RefreshCw size={16} />
            Refresh
          </button>

        </header>

        {/* Main */}

        <main className="flex-1 overflow-y-auto p-6">

          {/* Summary Cards */}

          <div className="grid grid-cols-3 gap-5 mb-6">

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                    Total Activities
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    {activities.length}
                  </h2>
                </div>

                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                  <Lucide.Activity
                    size={22}
                    className="text-white"
                  />
                </div>

              </div>

            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                    User Actions
                  </p>

                  <h2 className="text-3xl font-bold mt-2 text-emerald-600">
                    {userActivities}
                  </h2>
                </div>

                <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center">
                  <Lucide.Users
                    size={22}
                    className="text-white"
                  />
                </div>

              </div>

            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                    System Events
                  </p>

                  <h2 className="text-3xl font-bold mt-2 text-purple-600">
                    {systemActivities}
                  </h2>
                </div>

                <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center">
                  <Lucide.Server
                    size={22}
                    className="text-white"
                  />
                </div>

              </div>

            </div>

          </div>

          {/* Activity Timeline */}

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">

              <div>
                <h2 className="font-bold text-lg">
                  Recent Activity
                </h2>

                <p className="text-sm text-slate-500">
                  Latest actions across the institution
                </p>
              </div>

              <Lucide.History
                size={22}
                className="text-slate-400"
              />

            </div>

            <div className="divide-y divide-slate-100">

              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-6 flex items-start gap-4 hover:bg-slate-50 transition"
                >

                  {/* Activity Icon */}

                  <div className="relative">

                    <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">

                      <Lucide.Activity
                        size={18}
                        className="text-slate-700"
                      />

                    </div>

                    <div className="absolute top-11 left-1/2 -translate-x-1/2 w-px h-8 bg-slate-200 last:hidden"></div>

                  </div>

                  {/* Content */}

                  <div className="flex-1">

                    <p className="text-sm leading-6">

                      <span className="font-bold text-slate-900">
                        {activity.user}
                      </span>

                      {" "}
                      {activity.action}
                      {" "}

                      <span className="font-semibold text-emerald-600">
                        {activity.target}
                      </span>

                    </p>

                  </div>

                  {/* Time */}

                  <div className="text-right">

                    <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                      {activity.time}
                    </span>

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
