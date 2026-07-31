import { useState } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import * as Lucide from 'lucide-react';

export const Users = () => {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');

  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Alex Omondi',
      role: 'Admin',
      email: 'alex@peak.com',
      branch: 'Nairobi CBD',
      status: 'Active',
      lastLogin: 'Today, 08:24 AM',
    },
    {
      id: 2,
      name: 'Sarah Kimani',
      role: 'Loan Officer',
      email: 'sarah@peak.com',
      branch: 'Kampala Main',
      status: 'Active',
      lastLogin: 'Yesterday, 04:12 PM',
    },
  ]);

  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newBranch, setNewBranch] = useState('');

  const handleSave = () => {
    if (!newName || !newRole || !newEmail) return;

    setUsers([
      ...users,
      {
        id: Date.now(),
        name: newName,
        role: newRole,
        email: newEmail,
        branch: newBranch || 'Unassigned',
        status: 'Active',
        lastLogin: 'Never',
      },
    ]);

    setNewName('');
    setNewRole('');
    setNewEmail('');
    setNewBranch('');
    setShowModal(false);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  const activeUsers = users.filter((u) => u.status === 'Active').length;
  const admins = users.filter((u) => u.role === 'Admin').length;
  const officers = users.filter((u) => u.role === 'Loan Officer').length;

  return (
    <div className="flex h-screen bg-[#f8f9f9] text-[#1a2e23]">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-bold">Users</h1>
            <p className="text-sm text-slate-500">
              Manage system users, permissions and branch assignments
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-[#166534] text-white px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-[#14532d]"
          >
            <Lucide.Plus size={16} />
            Add User
          </button>
        </header>

        {/* Main */}
        <main className="flex-1 p-6 overflow-y-auto space-y-6">

          {/* Stats */}
          <section className="grid grid-cols-4 gap-5">
            <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs uppercase font-bold text-slate-400">
                    Total Users
                  </p>
                  <h2 className="text-3xl font-bold mt-2">
                    {users.length}
                  </h2>
                </div>
                <div className="p-3 rounded-2xl bg-blue-600">
                  <Lucide.Users className="text-white" size={22} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs uppercase font-bold text-slate-400">
                    Active Users
                  </p>
                  <h2 className="text-3xl font-bold mt-2">
                    {activeUsers}
                  </h2>
                </div>
                <div className="p-3 rounded-2xl bg-green-600">
                  <Lucide.UserCheck className="text-white" size={22} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs uppercase font-bold text-slate-400">
                    Admins
                  </p>
                  <h2 className="text-3xl font-bold mt-2">
                    {admins}
                  </h2>
                </div>
                <div className="p-3 rounded-2xl bg-purple-600">
                  <Lucide.ShieldCheck className="text-white" size={22} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs uppercase font-bold text-slate-400">
                    Loan Officers
                  </p>
                  <h2 className="text-3xl font-bold mt-2">
                    {officers}
                  </h2>
                </div>
                <div className="p-3 rounded-2xl bg-amber-500">
                  <Lucide.Briefcase className="text-white" size={22} />
                </div>
              </div>
            </div>
          </section>

          {/* Search */}
          <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
            <div className="relative max-w-md">
              <Lucide.Search
                size={18}
                className="absolute left-4 top-3 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-green-100"
              />
            </div>
          </section>

          {/* Table */}
          <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="font-bold text-lg">
                System Users
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 text-xs uppercase font-bold border-b border-slate-100">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Branch</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Last Login</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b border-slate-50 hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#166534] text-white flex items-center justify-center font-bold">
                            {u.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .substring(0, 2)}
                          </div>

                          <div>
                            <p className="font-bold">{u.name}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm">
                        {u.role}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500">
                        {u.email}
                      </td>

                      <td className="px-6 py-4 text-sm">
                        {u.branch}
                      </td>

                      <td className="px-6 py-4">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                          {u.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500">
                        {u.lastLogin}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="p-2 rounded-lg hover:bg-slate-100">
                            <Lucide.Eye size={16} />
                          </button>

                          <button className="p-2 rounded-lg hover:bg-slate-100">
                            <Lucide.Pencil size={16} />
                          </button>

                          <button className="p-2 rounded-lg hover:bg-slate-100">
                            <Lucide.KeyRound size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl w-[500px] shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                Add New User
              </h2>

              <button onClick={() => setShowModal(false)}>
                <Lucide.X />
              </button>
            </div>

            <div className="space-y-4">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                type="text"
                placeholder="Full Name"
                className="w-full p-3 border border-slate-200 rounded-xl"
              />

              <input
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                type="email"
                placeholder="Email Address"
                className="w-full p-3 border border-slate-200 rounded-xl"
              />

              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl"
              >
                <option value="">Select Role</option>
                <option>Admin</option>
                <option>Branch Manager</option>
                <option>Loan Officer</option>
                <option>Cashier</option>
                <option>Accountant</option>
              </select>

              <input
                value={newBranch}
                onChange={(e) => setNewBranch(e.target.value)}
                type="text"
                placeholder="Assigned Branch"
                className="w-full p-3 border border-slate-200 rounded-xl"
              />

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-full font-bold text-slate-500 border border-slate-200"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  className="flex-1 bg-[#166534] text-white py-3 rounded-full font-bold"
                >
                  Save User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
