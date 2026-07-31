import { useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";

export const Branches = () => {
  const [showModal, setShowModal] = useState(false);

  const [branches, setBranches] = useState([
    {
      id: 1,
      name: "Nairobi CBD",
      tenant: "Nairobi HQ",
      status: "Active",
    },
    {
      id: 2,
      name: "Kampala Main",
      tenant: "Uganda Ops",
      status: "Active",
    },
  ]);

  const [newName, setNewName] = useState("");
  const [newTenant, setNewTenant] = useState("");
  const [search, setSearch] = useState("");

  const handleSave = () => {
    if (newName && newTenant) {
      setBranches([
        ...branches,
        {
          id: Date.now(),
          name: newName,
          tenant: newTenant,
          status: "Active",
        },
      ]);

      setNewName("");
      setNewTenant("");
      setShowModal(false);
    }
  };

  const filteredBranches = branches.filter(
    (branch) =>
      branch.name.toLowerCase().includes(search.toLowerCase()) ||
      branch.tenant.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}

        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Branches
            </h1>

            <p className="text-sm text-slate-500">
              Manage branch offices and operational locations
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition"
          >
            <Lucide.Plus size={16} />
            Add Branch
          </button>

        </header>

        {/* Main Content */}

        <main className="flex-1 overflow-y-auto p-6">

          {/* KPI Cards */}

          <div className="grid grid-cols-3 gap-5 mb-6">

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                    Total Branches
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    {branches.length}
                  </h2>
                </div>

                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                  <Lucide.Building2
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
                    Active Branches
                  </p>

                  <h2 className="text-3xl font-bold mt-2 text-emerald-600">
                    {
                      branches.filter(
                        (b) => b.status === "Active"
                      ).length
                    }
                  </h2>
                </div>

                <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center">
                  <Lucide.CheckCircle
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
                    Parent Tenants
                  </p>

                  <h2 className="text-3xl font-bold mt-2 text-indigo-600">
                    {
                      new Set(
                        branches.map((b) => b.tenant)
                      ).size
                    }
                  </h2>
                </div>

                <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center">
                  <Lucide.Landmark
                    size={22}
                    className="text-white"
                  />
                </div>

              </div>

            </div>

          </div>

          {/* Search & Actions */}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6 flex items-center justify-between">

            <div className="relative w-80">

              <Lucide.Search
                size={18}
                className="absolute left-3 top-3 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search branches..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />

            </div>

            <button className="border border-slate-200 px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-slate-50">
              <Lucide.Download size={16} />
              Export
            </button>

          </div>

          {/* Branch Table */}

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

            <div className="px-6 py-5 border-b border-slate-100">

              <h2 className="font-bold text-lg">
                Branch Directory
              </h2>

              <p className="text-sm text-slate-500">
                All registered branch offices
              </p>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">

                    <th className="text-left px-6 py-4">
                      Branch Name
                    </th>

                    <th className="text-left px-6 py-4">
                      Parent Tenant
                    </th>

                    <th className="text-left px-6 py-4">
                      Status
                    </th>

                    <th className="text-right px-6 py-4">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {filteredBranches.map((branch) => (
                    <tr
                      key={branch.id}
                      className="border-t border-slate-100 hover:bg-slate-50 transition"
                    >

                      <td className="px-6 py-4 font-semibold">
                        {branch.name}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {branch.tenant}
                      </td>

                      <td className="px-6 py-4">
                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                          {branch.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">

                        <button className="p-2 rounded-lg hover:bg-slate-100">
                          <Lucide.Eye size={16} />
                        </button>

                        <button className="p-2 rounded-lg hover:bg-slate-100">
                          <Lucide.Edit size={16} />
                        </button>

                        <button className="p-2 rounded-lg hover:bg-slate-100 text-red-500">
                          <Lucide.Trash2 size={16} />
                        </button>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </main>
      </div>

      {/* Add Branch Modal */}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Lucide.Building2
                  size={22}
                  className="text-emerald-700"
                />
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Add New Branch
                </h2>

                <p className="text-sm text-slate-500">
                  Register a new operational branch
                </p>
              </div>

            </div>

            <div className="space-y-4">

              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                type="text"
                placeholder="Branch Name"
                className="w-full p-3 border border-slate-200 rounded-xl"
              />

              <input
                value={newTenant}
                onChange={(e) => setNewTenant(e.target.value)}
                type="text"
                placeholder="Parent Tenant"
                className="w-full p-3 border border-slate-200 rounded-xl"
              />

            </div>

            <div className="flex gap-3 mt-8">

              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="flex-1 py-3 rounded-xl bg-emerald-700 text-white font-semibold hover:bg-emerald-800"
              >
                Save Branch
              </button>

            </div>

          </div>

        </div>
      )}
    </div>
  );
};
