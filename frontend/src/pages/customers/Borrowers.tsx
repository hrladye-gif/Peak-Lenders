import { formatMoney } from "../../config/regional";
import { Link } from "react-router-dom";
import React, { useEffect, useMemo, useState } from "react";
import { api } from "../../api/axios";
import {
  Users,
  UserPlus,
  Search,
  FileText,
  CreditCard,
  Filter,
  Phone,
  Mail,
  MapPin,
  MoreVertical,
  X,
  Trash2,
  UserCheck,
  UserX,
  ChevronDown,
  Eye,
  Copy,
  RefreshCw,
} from "lucide-react";

interface Borrower {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationalId: string;
  location: string;
  activeLoans: number;
  totalBorrowed: string;
  status: "Active" | "Pending" | "In Default" | "Inactive";
  is_active: boolean;
}

type FilterType = "ALL" | "ACTIVE" | "INACTIVE";

export const Borrowers = () => {
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<FilterType>("ALL");
  const [filterOpen, setFilterOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    national_id: "",
    gender: "",
    address: "",
    borrower_type: "INDIVIDUAL",
  });

  const fetchBorrowers = async () => {
    try {
      setLoading(true);

      const response = await api.get("/borrowers");

      const mapped = (response.data || []).map((b: any) => {
        const isActive = b.is_active !== false;

        return {
          id: b.id,
          name:
            `${b.first_name || ""} ${b.last_name || ""}`.trim() ||
            b.business_name ||
            "Unnamed Borrower",
          email: b.email || "No email",
          phone: b.phone || "No phone",
          nationalId: b.national_id || "Not provided",
          location: b.address || "Location not provided",
          activeLoans: b.activeLoans || 0,
          totalBorrowed: b.totalBorrowed || formatMoney(0),
          is_active: isActive,
          status: isActive
            ? b.status === "Pending"
              ? "Pending"
              : b.status === "In Default"
              ? "In Default"
              : "Active"
            : "Inactive",
        };
      });

      setBorrowers(mapped);
    } catch (err) {
      console.error("Failed to load borrowers:", err);
      setBorrowers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowers();
  }, []);

  const openModal = () => {
    setError("");
    setForm({
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      national_id: "",
      gender: "",
      address: "",
      borrower_type: "INDIVIDUAL",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (!saving) {
      setIsModalOpen(false);
      setError("");
    }
  };

  const handleCreateBorrower = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.first_name.trim() ||
      !form.last_name.trim() ||
      !form.phone.trim()
    ) {
      setError("First name, last name, and phone number are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await api.post("/borrowers", {
        borrower_type: form.borrower_type,
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || null,
        national_id: form.national_id.trim() || null,
        gender: form.gender || null,
        address: form.address.trim() || null,
      });

      setIsModalOpen(false);
      await fetchBorrowers();
    } catch (err: any) {
      console.error("Failed to create borrower:", err);

      setError(
        err?.response?.data?.detail ||
          "Failed to register borrower. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const filteredBorrowers = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return borrowers.filter((b) => {
      const matchesSearch =
        !search ||
        b.name.toLowerCase().includes(search) ||
        b.phone.toLowerCase().includes(search) ||
        b.email.toLowerCase().includes(search) ||
        b.location.toLowerCase().includes(search) ||
        b.id.toLowerCase().includes(search);

      const matchesFilter =
        filterType === "ALL" ||
        (filterType === "ACTIVE" && b.is_active) ||
        (filterType === "INACTIVE" && !b.is_active);

      return matchesSearch && matchesFilter;
    });
  }, [borrowers, searchTerm, filterType]);

  const totalBorrowers = borrowers.length;
  const activeBorrowers = borrowers.filter((b) => b.is_active).length;
  const inactiveBorrowers = borrowers.filter((b) => !b.is_active).length;
  const activeLoans = borrowers.reduce(
    (total, borrower) => total + borrower.activeLoans,
    0
  );

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ").filter(Boolean);

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }

    return name.slice(0, 2).toUpperCase();
  };

  const getStatusClasses = (borrower: Borrower) => {
    if (!borrower.is_active) {
      return "bg-slate-100 text-slate-600 border-slate-200";
    }

    if (borrower.status === "In Default") {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }

    if (borrower.status === "Pending") {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }

    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  };

  const getFilterLabel = () => {
    if (filterType === "ACTIVE") return "Active borrowers";
    if (filterType === "INACTIVE") return "Inactive borrowers";
    return "All borrowers";
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* ========================================================= */}
        {/* HEADER */}
        {/* ========================================================= */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#189AB4]">
              <Users size={15} />
              Customer Management
            </div>

            <h1 className="text-3xl font-black tracking-tight text-[#05445E] sm:text-4xl">
              Borrowers
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage borrower profiles, relationships, contact records and
              lending activity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchBorrowers}
              disabled={loading}
              className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 sm:flex"
              title="Refresh borrowers"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              onClick={openModal}
              className="flex items-center gap-2 rounded-xl bg-[#189AB4] px-5 py-2.5 font-bold text-white shadow-md shadow-[#189AB4]/20 transition hover:bg-[#05445E] hover:shadow-lg"
            >
              <UserPlus size={18} />
              Register Borrower
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* STAT CARDS */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Total Borrowers
                </p>
                <p className="mt-2 text-3xl font-black text-[#05445E]">
                  {totalBorrowers}
                </p>
                <p className="mt-1 text-xs font-medium text-slate-400">
                  Registered customers
                </p>
              </div>

              <div className="rounded-2xl bg-[#D4F1F4] p-3 text-[#05445E]">
                <Users size={23} />
              </div>
            </div>
          </div>

          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Active Borrowers
                </p>
                <p className="mt-2 text-3xl font-black text-[#05445E]">
                  {activeBorrowers}
                </p>
                <p className="mt-1 text-xs font-medium text-emerald-600">
                  {totalBorrowers
                    ? `${Math.round(
                        (activeBorrowers / totalBorrowers) * 100
                      )}% of customers`
                    : "0% of customers"}
                </p>
              </div>

              <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
                <UserCheck size={23} />
              </div>
            </div>
          </div>

          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Inactive
                </p>
                <p className="mt-2 text-3xl font-black text-[#05445E]">
                  {inactiveBorrowers}
                </p>
                <p className="mt-1 text-xs font-medium text-slate-400">
                  Deactivated profiles
                </p>
              </div>

              <div className="rounded-2xl bg-slate-100 p-3 text-slate-500">
                <UserX size={23} />
              </div>
            </div>
          </div>

          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Active Loans
                </p>
                <p className="mt-2 text-3xl font-black text-[#05445E]">
                  {activeLoans}
                </p>
                <p className="mt-1 text-xs font-medium text-slate-400">
                  Across all borrowers
                </p>
              </div>

              <div className="rounded-2xl bg-amber-50 p-3 text-amber-600">
                <CreditCard size={23} />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SEARCH / FILTER */}
        {/* ========================================================= */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-xl">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, phone, email, location or borrower ID..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#189AB4] focus:bg-white focus:ring-2 focus:ring-[#189AB4]/10"
              />

              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-auto">
                <button
                  onClick={() => setFilterOpen((value) => !value)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:min-w-[190px]"
                >
                  <span className="flex items-center gap-2">
                    <Filter size={16} className="text-[#189AB4]" />
                    {getFilterLabel()}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      filterOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {filterOpen && (
                  <div className="absolute right-0 top-14 z-40 w-full min-w-[190px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                    {[
                      ["ALL", "All borrowers"],
                      ["ACTIVE", "Active borrowers"],
                      ["INACTIVE", "Inactive borrowers"],
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        onClick={() => {
                          setFilterType(value as FilterType);
                          setFilterOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm font-semibold transition hover:bg-slate-50 ${
                          filterType === value
                            ? "bg-[#D4F1F4]/60 text-[#05445E]"
                            : "text-slate-600"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="hidden rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-500 sm:block">
                {filteredBorrowers.length}{" "}
                {filteredBorrowers.length === 1 ? "borrower" : "borrowers"}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TABLE */}
        {/* ========================================================= */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="font-bold text-[#05445E]">Borrower Directory</h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Customer records and lending activity
              </p>
            </div>

            {filterType !== "ALL" && (
              <button
                onClick={() => setFilterType("ALL")}
                className="text-xs font-bold text-[#189AB4] hover:text-[#05445E]"
              >
                Clear filter
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1180px] text-left">
              <thead className="border-b border-slate-200 bg-[#05445E]/[0.035]">
                <tr className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-4">Borrower</th>
                  <th className="px-5 py-4">Contact</th>
                  <th className="px-5 py-4">National ID</th>
                  <th className="px-5 py-4">Location</th>
                  <th className="px-5 py-4 text-center">Active Loans</th>
                  <th className="px-5 py-4">Total Borrowed</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#189AB4]" />
                        <p className="font-semibold text-slate-600">
                          Loading borrowers...
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Retrieving customer records
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : filteredBorrowers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-16 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <div className="mb-4 rounded-2xl bg-[#D4F1F4] p-4 text-[#05445E]">
                          <Users size={28} />
                        </div>

                        <h3 className="font-bold text-[#05445E]">
                          No borrowers found
                        </h3>

                        <p className="mt-1 text-sm text-slate-400">
                          {searchTerm
                            ? "Try changing your search terms."
                            : "There are no borrower records matching this filter."}
                        </p>

                        {searchTerm && (
                          <button
                            onClick={() => setSearchTerm("")}
                            className="mt-4 rounded-lg px-4 py-2 text-sm font-bold text-[#189AB4] hover:bg-[#D4F1F4]"
                          >
                            Clear search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBorrowers.map((borrower) => (
                    <tr
                      key={borrower.id}
                      className="group transition-colors hover:bg-slate-50/80"
                    >
                      {/* Borrower */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                              borrower.is_active
                                ? "bg-[#D4F1F4] text-[#05445E]"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {getInitials(borrower.name)}
                          </div>

                          <div className="min-w-0">
                            <Link
                              to={`/borrowers/${borrower.id}`}
                              className="block truncate font-bold text-[#05445E] transition hover:text-[#189AB4]"
                            >
                              {borrower.name}
                            </Link>

                            <p className="mt-0.5 truncate text-[11px] font-medium text-slate-400">
                              ID: {borrower.id.slice(0, 12)}...
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                            <Phone size={13} className="text-[#189AB4]" />
                            {borrower.phone}
                          </div>

                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Mail size={13} />
                            <span className="max-w-[180px] truncate">
                              {borrower.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* National ID */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <CreditCard
                            size={14}
                            className="shrink-0 text-[#189AB4]"
                          />
                          <span className="font-semibold text-slate-700">
                            {borrower.nationalId || "Not provided"}
                          </span>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-5 py-4">
                        <div className="flex max-w-[180px] items-center gap-2 text-xs font-medium text-slate-600">
                          <MapPin
                            size={14}
                            className="shrink-0 text-[#189AB4]"
                          />
                          <span className="truncate">
                            {borrower.location}
                          </span>
                        </div>
                      </td>

                      {/* Loans */}
                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex min-w-[36px] items-center justify-center rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-black text-slate-700">
                          {borrower.activeLoans}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="px-5 py-4">
                        <span className="font-black text-[#05445E]">
                          {borrower.totalBorrowed}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold ${getStatusClasses(
                            borrower
                          )}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              !borrower.is_active
                                ? "bg-slate-400"
                                : borrower.status === "In Default"
                                ? "bg-rose-500"
                                : borrower.status === "Pending"
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                          />
                          {borrower.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="relative px-5 py-4 text-right">
                        <button
                          onClick={() =>
                            setOpenMenu(
                              openMenu === borrower.id ? null : borrower.id
                            )
                          }
                          className={`rounded-xl p-2 transition ${
                            openMenu === borrower.id
                              ? "bg-[#D4F1F4] text-[#05445E]"
                              : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                          }`}
                          title="Borrower actions"
                        >
                          <MoreVertical size={18} />
                        </button>

                        {openMenu === borrower.id && (
                          <div className="absolute right-5 top-14 z-30 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-2xl">
                            <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
                              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                Borrower Actions
                              </p>
                            </div>

                            <Link
                              to={`/borrowers/${borrower.id}`}
                              onClick={() => setOpenMenu(null)}
                              className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                              <Eye size={16} className="text-[#189AB4]" />
                              View Details
                            </Link>

                            <Link
                              to={`/loans?borrower=${borrower.id}`}
                              onClick={() => setOpenMenu(null)}
                              className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                              <FileText
                                size={16}
                                className="text-[#189AB4]"
                              />
                              View Loans
                            </Link>

                            <button
                              onClick={async () => {
                                try {
                                  await navigator.clipboard.writeText(
                                    borrower.id
                                  );
                                } catch {
                                  console.error(
                                    "Unable to copy borrower ID"
                                  );
                                }

                                setOpenMenu(null);
                              }}
                              className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                              <Copy size={16} className="text-[#189AB4]" />
                              Copy Borrower ID
                            </button>

                            <div className="my-1 border-t border-slate-100" />

                            <button
                              disabled={deletingId === borrower.id}
                              onClick={async () => {
                                const confirmed = window.confirm(
                                  `Delete ${borrower.name}?\n\nThis permanently removes the borrower if they have no related records.`
                                );

                                if (!confirmed) {
                                  return;
                                }

                                try {
                                  setDeletingId(borrower.id);
                                  setOpenMenu(null);
                                  setError("");

                                  await api.delete(
                                    `/borrowers/${borrower.id}`
                                  );

                                  await fetchBorrowers();
                                } catch (err: any) {
                                  console.error(
                                    "Failed to delete borrower:",
                                    err
                                  );

                                  const detail =
                                    err?.response?.data?.detail;

                                  const message = Array.isArray(detail)
                                    ? detail
                                        .map((item: any) => item?.msg)
                                        .filter(Boolean)
                                        .join(", ")
                                    : detail ||
                                      "Failed to delete borrower. Please try again.";

                                  setError(message);
                                } finally {
                                  setDeletingId(null);
                                }
                              }}
                              className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Trash2 size={16} />
                              {deletingId === borrower.id
                                ? "Deleting..."
                                : "Delete Borrower"}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && filteredBorrowers.length > 0 && (
            <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-3">
              <p className="text-xs font-medium text-slate-400">
                Showing{" "}
                <span className="font-bold text-slate-600">
                  {filteredBorrowers.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-slate-600">
                  {borrowers.length}
                </span>{" "}
                borrowers
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* REGISTER BORROWER MODAL */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#D4F1F4] p-2.5 text-[#05445E]">
                  <UserPlus size={20} />
                </div>

                <div>
                  <h3 className="text-xl font-black text-[#05445E]">
                    Register New Borrower
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Create a new customer profile
                  </p>
                </div>
              </div>

              <button
                onClick={closeModal}
                disabled={saving}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                  <div className="mt-0.5 shrink-0 rounded-full bg-rose-100 p-1">
                    <X size={13} />
                  </div>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleCreateBorrower} className="space-y-6">
                {/* Personal Details */}
                <div>
                  <div className="mb-4">
                    <h4 className="text-sm font-black text-[#05445E]">
                      Personal Information
                    </h4>
                    <p className="mt-0.5 text-xs text-slate-400">
                      Basic borrower identification details
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                        First Name *
                      </label>
                      <input
                        required
                        value={form.first_name}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            first_name: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm font-medium outline-none transition focus:border-[#189AB4] focus:bg-white focus:ring-2 focus:ring-[#189AB4]/10"
                        placeholder="First name"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                        Last Name *
                      </label>
                      <input
                        required
                        value={form.last_name}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            last_name: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm font-medium outline-none transition focus:border-[#189AB4] focus:bg-white focus:ring-2 focus:ring-[#189AB4]/10"
                        placeholder="Last name"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                        Phone Number *
                      </label>
                      <input
                        required
                        value={form.phone}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            phone: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm font-medium outline-none transition focus:border-[#189AB4] focus:bg-white focus:ring-2 focus:ring-[#189AB4]/10"
                        placeholder="+256 700 000000"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            email: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm font-medium outline-none transition focus:border-[#189AB4] focus:bg-white focus:ring-2 focus:ring-[#189AB4]/10"
                        placeholder="borrower@example.com"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                        National ID
                      </label>
                      <input
                        value={form.national_id}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            national_id: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm font-medium outline-none transition focus:border-[#189AB4] focus:bg-white focus:ring-2 focus:ring-[#189AB4]/10"
                        placeholder="National ID"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                        Gender
                      </label>
                      <select
                        value={form.gender}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            gender: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm font-medium outline-none transition focus:border-[#189AB4] focus:bg-white focus:ring-2 focus:ring-[#189AB4]/10"
                      >
                        <option value="">Select gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                    Address / Location
                  </label>

                  <div className="relative">
                    <MapPin
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#189AB4]"
                    />

                    <input
                      value={form.address}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          address: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3.5 text-sm font-medium outline-none transition focus:border-[#189AB4] focus:bg-white focus:ring-2 focus:ring-[#189AB4]/10"
                      placeholder="e.g. Nakawa Market, Kampala"
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={saving}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 sm:w-1/2"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#189AB4] px-4 py-3 text-sm font-bold text-white shadow-md shadow-[#189AB4]/20 transition hover:bg-[#05445E] disabled:cursor-not-allowed disabled:opacity-60 sm:w-1/2"
                  >
                    {saving ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        Registering...
                      </>
                    ) : (
                      <>
                        <UserPlus size={16} />
                        Register Borrower
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
