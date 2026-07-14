import { Sidebar } from '../components/layout/Sidebar';
import * as Lucide from 'lucide-react';

const notifications = [
  { id: 1, type: 'Approval', message: 'New loan application for John Doe awaiting review.', time: '10m ago', read: false },
  { id: 2, type: 'System', message: 'System maintenance scheduled for 02:00 AM EAT.', time: '2h ago', read: false },
  { id: 3, type: 'Alert', message: 'Liquidity alert for Nairobi Branch.', time: '5h ago', read: true },
];

export const Notifications = () => (
  <div className="flex h-screen bg-[#f8f9f9] text-[#1a2e23]">
    <Sidebar />
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <header className="h-16 bg-white border-b border-slate-100 flex items-center px-6">
        <h1 className="text-xl font-bold">Notifications</h1>
      </header>

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-lg">Recent Alerts</h2>
            <button className="text-sm font-bold text-[#3EB489]">Mark all as read</button>
          </div>
          
          <div className="divide-y divide-slate-100">
            {notifications.map((n) => (
              <div key={n.id} className={`p-6 flex items-start gap-4 ${!n.read ? 'bg-[#e6f4ea]/30' : ''}`}>
                <div className={`p-2 rounded-full ${!n.read ? 'bg-[#3EB489]' : 'bg-slate-300'}`}>
                  <Lucide.Bell size={16} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">{n.type}</p>
                  <p className="text-sm text-slate-600">{n.message}</p>
                </div>
                <span className="text-xs text-slate-400 font-medium">{n.time}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  </div>
);
