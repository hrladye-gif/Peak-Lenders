import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../api/axios";
import { formatMoney } from "../config/regional";

type Borrower = {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  business_name?: string | null;
  phone?: string | null;
};

type GroupMember = {
  id: string;
  borrower_id: string;
  role: string;
  borrower?: Borrower | null;
};

type Group = {
  id: string;
  name: string;
  location?: string | null;
  status: string;
  tenant_id: string;
  branch_id?: string | null;
  members: GroupMember[];
};

type Branch = {
  id: string;
  name: string;
};

type Loan = {
  id: string;
  borrower_id: string;
  principal: number | string;
  status: string;
};

type GroupRow = Group & {
  branchName: string;
  activeLoans: number;
  portfolio: number;
};

export const Groups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    location: "",
    branch_id: "",
  });

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const tenantId = user?.tenant_id;

  const loadGroups = async () => {
    if (!tenantId) {
      setError("Your session does not contain a tenant.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [groupsResponse, branchesResponse, loansResponse] =
        await Promise.all([
          api.get("/groups"),
          api.get(`/branches/${tenantId}`),
          api.get("/loans/"),
        ]);

      setGroups(Array.isArray(groupsResponse.data) ? groupsResponse.data : []);
      setBranches(
        Array.isArray(branchesResponse.data) ? branchesResponse.data : []
      );
      setLoans(Array.isArray(loansResponse.data) ? loansResponse.data : []);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Failed to load groups."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, [tenantId]);

  const rows = useMemo<GroupRow[]>(() => {
    const branchMap = new Map(
      branches.map((branch) => [branch.id, branch.name])
    );

    return groups.map((group) => {
      const memberIds = new Set(
        group.members.map((member) => member.borrower_id)
      );

      const groupLoans = loans.filter(
        (loan) =>
          memberIds.has(loan.borrower_id) &&
          ["ACTIVE", "OVERDUE"].includes(String(loan.status).toUpperCase())
      );

      const portfolio = groupLoans.reduce(
        (sum, loan) => sum + Number(loan.principal || 0),
        0
      );

      return {
        ...group,
        branchName: group.branch_id
          ? branchMap.get(group.branch_id) || group.branch_id
          : "Unassigned",
        activeLoans: groupLoans.length,
        portfolio,
      };
    });
  }, [groups, branches, loans]);

  const totalMembers = useMemo(
    () => groups.reduce((sum, group) => sum + group.members.length, 0),
    [groups]
  );

  const totalActiveLoans = useMemo(
    () => rows.reduce((sum, group) => sum + group.activeLoans, 0),
    [rows]
  );

  const registerGroup = async () => {
    if (!form.name.trim()) {
      setError("Group name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await api.post("/groups", {
        name: form.name.trim(),
        location: form.location.trim() || null,
        branch_id: form.branch_id || null,
      });

      setForm({
        name: "",
        location: "",
        branch_id: "",
      });

      setShowModal(false);
      await loadGroups();
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          "Failed to create group."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800">
      <Sidebar />

      <div className="flex-1 overflow-y-auto">
        <header className="bg-white border-b px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Groups</h1>
            <p className="text-slate-500">
              Manage group borrowers and collective lending operations
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={loadGroups}
              disabled={loading}
              className="border border-slate-200 bg-white hover:bg-slate-50 px-5 py-3 rounded-xl font-bold flex gap-2 items-center"
            >
              <Lucide.RefreshCw
                size={18}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              onClick={() => {
                setError("");
                setShowModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex gap-2 items-center"
            >
              <Lucide.Plus size={18} />
              Create Group
            </button>
          </div>
        </header>

        <main className="p-8">
          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-3xl border p-6">
              <p className="text-xs uppercase font-bold text-slate-400">
                Total Groups
              </p>

              <h2 className="text-4xl font-black mt-3">
                {loading ? "—" : groups.length}
              </h2>
            </div>

            <div className="bg-white rounded-3xl border p-6">
              <p className="text-xs uppercase font-bold text-slate-400">
                Total Members
              </p>

              <h2 className="text-4xl font-black mt-3 text-blue-600">
                {loading ? "—" : totalMembers}
              </h2>
            </div>

            <div className="bg-white rounded-3xl border p-6">
              <p className="text-xs uppercase font-bold text-slate-400">
                Active Loans
              </p>

              <h2 className="text-4xl font-black mt-3 text-indigo-600">
                {loading ? "—" : totalActiveLoans}
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b">
              <h2 className="font-black text-xl">Group Register</h2>
              <p className="text-sm text-slate-500">
                All registered borrower groups
              </p>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-500">
                Loading groups...
              </div>
            ) : rows.length === 0 ? (
              <div className="p-12 text-center">
                <Lucide.Users
                  size={42}
                  className="mx-auto mb-4 text-slate-300"
                />
                <h3 className="font-black text-lg text-slate-700">
                  No borrower groups yet
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Create your first group to get started.
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-slate-50 text-xs uppercase text-slate-400">
                  <tr>
                    <th className="p-5 text-left">ID</th>
                    <th className="p-5 text-left">Group</th>
                    <th className="p-5 text-left">Leader</th>
                    <th className="p-5 text-left">Branch</th>
                    <th className="p-5 text-left">Members</th>
                    <th className="p-5 text-left">Loans</th>
                    <th className="p-5 text-left">Portfolio</th>
                    <th className="p-5 text-left">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((group) => {
                    const leader =
                      group.members.find(
                        (member) =>
                          String(member.role).toUpperCase() === "LEADER"
                      )?.borrower ||
                      group.members[0]?.borrower ||
                      null;

                    const leaderName = leader
                      ? leader.business_name ||
                        `${leader.first_name || ""} ${
                          leader.last_name || ""
                        }`.trim() ||
                        "Unnamed borrower"
                      : "Not assigned";

                    return (
                      <tr
                        key={group.id}
                        className="border-t hover:bg-slate-50"
                      >
                        <td className="p-5 font-mono text-xs">
                          {group.id}
                        </td>

                        <td className="p-5">
                          <Link
                            to={`/groups/${group.id}`}
                            className="font-bold text-blue-600 hover:text-blue-700"
                          >
                            {group.name}
                          </Link>

                          {group.location && (
                            <p className="text-xs text-slate-400 mt-1">
                              {group.location}
                            </p>
                          )}
                        </td>

                        <td className="p-5">
                          {leaderName}
                        </td>

                        <td className="p-5">
                          {group.branchName}
                        </td>

                        <td className="p-5">
                          {group.members.length}
                        </td>

                        <td className="p-5">
                          {group.activeLoans}
                        </td>

                        <td className="p-5 font-bold">
                          {formatMoney(group.portfolio)}
                        </td>

                        <td className="p-5">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              String(group.status).toUpperCase() === "ACTIVE"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {group.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-[500px] shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-black">
                  Create Borrower Group
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Register a new group under your institution.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <Lucide.X size={22} />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold mb-2">
                  Group Name
                </label>

                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g. Kampala Market Traders"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Location
                </label>

                <input
                  value={form.location}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      location: e.target.value,
                    })
                  }
                  placeholder="Group meeting location"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Branch
                </label>

                <select
                  value={form.branch_id}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      branch_id: e.target.value,
                    })
                  }
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Use my current branch</option>

                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowModal(false)}
                disabled={saving}
                className="flex-1 border border-slate-200 rounded-xl px-5 py-3 font-bold hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={registerGroup}
                disabled={saving || !form.name.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl px-5 py-3 font-bold"
              >
                {saving ? "Creating..." : "Create Group"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
