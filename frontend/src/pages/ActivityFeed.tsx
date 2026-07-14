import { Sidebar } from '../components/layout/Sidebar';
import * as Lucide from 'lucide-react';

const activities = [
  { id: 1, user: 'Andrew Forbist', action: 'Approved loan application', target: 'John Doe', time: '10m ago' },
  { id: 2, user: 'System', action: 'Automated disbursement', target: 'Nairobi Branch', time: '1h ago' },
  { id: 3, user: 'Sarah Kimani', action: 'Updated branch settings', target: 'Kampala Office', time: '3h ago' },
  { id: 4, user: 'System', action: 'Monthly interest accrued', target: 'All Accounts', time: '5h ago' },
];

export const ActivityFeed = () => (
  <div className="flex h-screen bg-[#f8f9f9] text-[#1a2e23]">
    <Sidebar />
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <header className="h-16 bg-white border-b border-slate-100 flex items-center px-6">
        <h1 className="text-xl font-bold">Activity Feed</h1>
      </header>

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {activities.map((act) => (
              <div key={act.id} className="p-6 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className="p-2 bg-slate-100 rounded-full">
                  <Lucide.Activity size={16} className="text-[#1a2e23]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-bold">{act.user}</span> {act.action} <span className="font-medium text-[#3EB489]">{act.target}</span>
                  </p>
                </div>
                <span className="text-xs text-slate-400 font-medium whitespace-nowrap">{act.time}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  </div>
);
