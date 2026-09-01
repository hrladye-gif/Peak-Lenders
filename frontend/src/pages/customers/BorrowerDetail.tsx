import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Building2,
  CalendarDays,
  ShieldCheck,
  Loader2,
  Pencil,
  MoreHorizontal,
  X,
} from 'lucide-react';
import { api } from '../../api/axios';

interface Borrower {
  id: string;
  tenant_id: string;
  branch_id?: string | null;
  borrower_type: string;
  is_active: boolean;
  first_name?: string | null;
  last_name?: string | null;
  business_name?: string | null;
  phone: string;
  email?: string | null;
  national_id?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
  address?: string | null;
}

const InfoRow = ({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | null;
  icon?: React.ReactNode;
}) => (
  <div className="flex items-start justify-between gap-6 py-4 border-b border-slate-100 last:border-b-0">
    <div className="flex items-center gap-3 min-w-0">
      {icon && (
        <div className="text-slate-400 shrink-0">
          {icon}
        </div>
      )}

      <span className="text-sm text-slate-500">
        {label}
      </span>
    </div>

    <span className="text-sm font-semibold text-slate-700 text-right break-words">
      {value || '—'}
    </span>
  </div>
);

export const BorrowerDetail = () => {
  const { borrowerId } = useParams<{ borrowerId: string }>();

  const [borrower, setBorrower] = useState<Borrower | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showActions, setShowActions] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');

  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    business_name: '',
    phone: '',
    email: '',
    national_id: '',
    date_of_birth: '',
    gender: '',
    address: '',
    borrower_type: 'INDIVIDUAL',
  });

  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [borrowerLoans, setBorrowerLoans] = useState<any[]>([]);
  const [borrowerRepayments, setBorrowerRepayments] = useState<any[]>([]);

  useEffect(() => {
    const fetchBorrower = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await api.get(`/borrowers/${borrowerId}`);
        setBorrower(response.data);
      } catch (err) {
        console.error('Failed to load borrower:', err);
        setError('Unable to load borrower information.');
      } finally {
        setLoading(false);
      }
    };

    if (borrowerId) {
      fetchBorrower();
    }
  }, [borrowerId]);

  const openEditBorrower = () => {
    setEditError('');

    setEditForm({
      first_name: borrower?.first_name || '',
      last_name: borrower?.last_name || '',
      business_name: borrower?.business_name || '',
      phone: borrower?.phone || '',
      email: borrower?.email || '',
      national_id: borrower?.national_id || '',
      date_of_birth: borrower?.date_of_birth || '',
      gender: borrower?.gender || '',
      address: borrower?.address || '',
      borrower_type: borrower?.borrower_type || 'INDIVIDUAL',
    });

    setShowActions(false);
    setEditOpen(true);
  };

  const closeEditBorrower = () => {
    if (!editSaving) {
      setEditOpen(false);
      setEditError('');
    }
  };

  const handleEditBorrower = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editForm.first_name.trim() ||
        !editForm.last_name.trim() ||
        !editForm.phone.trim()) {
      setEditError(
        'First name, last name, and phone number are required.'
      );
      return;
    }

    try {
      setEditSaving(true);
      setEditError('');

      const response = await api.put(
        `/borrowers/${borrowerId}`,
        {
          borrower_type: editForm.borrower_type,
          first_name: editForm.first_name.trim(),
          last_name: editForm.last_name.trim(),
          business_name: editForm.business_name.trim() || null,
          phone: editForm.phone.trim(),
          email: editForm.email.trim() || null,
          national_id: editForm.national_id.trim() || null,
          date_of_birth: editForm.date_of_birth || null,
          gender: editForm.gender || null,
          address: editForm.address.trim() || null,
        }
      );

      setBorrower(response.data);
      setEditOpen(false);
    } catch (err: any) {
      console.error('Failed to update borrower:', err);

      setEditError(
        err?.response?.data?.detail ||
          'Failed to update borrower. Please try again.'
      );
    } finally {
      setEditSaving(false);
    }
  };

  const handleToggleBorrowerStatus = async () => {
    if (!borrower || statusSaving) return;

    const nextStatus = !borrower.is_active;

    const confirmed = window.confirm(
      nextStatus
        ? 'Reactivate this borrower?'
        : 'Deactivate this borrower? The borrower will remain in the system and their loan history will be preserved.'
    );

    if (!confirmed) {
      setShowActions(false);
      return;
    }

    try {
      setStatusSaving(true);
      setError('');

      const response = await api.patch(
        `/borrowers/${borrower.id}/status`,
        {
          is_active: nextStatus,
        }
      );

      setBorrower(response.data);
      setShowActions(false);
    } catch (err: any) {
      console.error('Failed to update borrower status:', err);

      setError(
        err?.response?.data?.detail ||
          'Failed to update borrower status. Please try again.'
      );

      setShowActions(false);
    } finally {
      setStatusSaving(false);
    }
  };

  const loadBorrowerHistory = async () => {
    if (!borrowerId) return;

    try {
      setHistoryLoading(true);
      setHistoryError('');

      const [loansResponse, repaymentsResponse] = await Promise.all([
        api.get('/loans/'),
        api.get('/repayments/'),
      ]);

      const loans = Array.isArray(loansResponse.data)
        ? loansResponse.data
        : [];

      const repayments = Array.isArray(repaymentsResponse.data)
        ? repaymentsResponse.data
        : [];

      const loansForBorrower = loans.filter(
        (loan: any) => loan.borrower_id === borrowerId
      );

      const repaymentsForBorrower = repayments.filter(
        (payment: any) => payment.borrower_id === borrowerId
      );

      setBorrowerLoans(loansForBorrower);
      setBorrowerRepayments(repaymentsForBorrower);
      setHistoryOpen(true);
      setShowActions(false);
    } catch (err: any) {
      console.error('Failed to load borrower history:', err);

      setHistoryError(
        err?.response?.data?.detail ||
          'Unable to load borrower history.'
      );

      setHistoryOpen(true);
      setShowActions(false);
    } finally {
      setHistoryLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#05445E] font-semibold">
          <Loader2 size={22} className="animate-spin" />
          Loading borrower...
        </div>
      </div>
    );
  }

  if (!borrower || error) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <Link
          to="/borrowers"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#189AB4] hover:text-[#05445E]"
        >
          <ArrowLeft size={16} />
          Back to Borrowers
        </Link>

        <div className="mt-6 bg-white border border-rose-200 rounded-2xl p-10 text-center text-rose-600 font-semibold">
          {error || 'Borrower not found.'}
        </div>
      </div>
    );
  }

  const fullName =
    borrower.business_name ||
    [borrower.first_name, borrower.last_name]
      .filter(Boolean)
      .join(' ') ||
    'Unnamed Borrower';

  const borrowerType =
    borrower.borrower_type?.replace(/_/g, ' ') || 'Individual';

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}
      <div className="max-w-7xl mx-auto">

        <Link
          to="/borrowers"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#05445E] transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to Borrowers
        </Link>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          {/* Profile Header */}
          <div className="px-6 py-6 lg:px-8 lg:py-7 border-b border-slate-100">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

              <div className="flex items-center gap-4">

                <div className="w-16 h-16 rounded-2xl bg-[#D4F1F4] text-[#05445E] flex items-center justify-center shrink-0">
                  <User size={30} />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-3">

                    <h1 className="text-2xl lg:text-3xl font-black text-[#05445E]">
                      {fullName}
                    </h1>

                    <span
                      className={
                        borrower.is_active
                          ? "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold"
                          : "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold"
                      }
                    >
                      <span
                        className={
                          borrower.is_active
                            ? "w-1.5 h-1.5 rounded-full bg-emerald-500"
                            : "w-1.5 h-1.5 rounded-full bg-slate-400"
                        }
                      />
                      {borrower.is_active ? 'Active' : 'Inactive'}
                    </span>

                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-slate-500">

                    <span>
                      Borrower ID: <strong className="text-slate-700">{borrower.id}</strong>
                    </span>

                    <span className="hidden sm:inline text-slate-300">
                      |
                    </span>

                    <span className="capitalize">
                      {borrowerType.toLowerCase()}
                    </span>

                  </div>
                </div>

              </div>

              <div className="flex items-center gap-2">

                <button
                  type="button"
                  onClick={openEditBorrower}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  <Pencil size={16} />
                  Edit
                </button>

                <div className="relative">

                  <button
                    type="button"
                    onClick={() => setShowActions((value) => !value)}
                    className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
                    aria-label="More actions"
                    aria-expanded={showActions}
                  >
                    <MoreHorizontal size={18} />
                  </button>

                  {showActions && (
                    <div className="absolute right-0 top-12 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-20">

                      <button
                        type="button"
                        onClick={openEditBorrower}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        Edit borrower
                      </button>

                      <button
                        type="button"
                        onClick={loadBorrowerHistory}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        View history
                      </button>

                      <div className="my-1 border-t border-slate-100" />

                      <button
                        type="button"
                        onClick={handleToggleBorrowerStatus}
                        disabled={statusSaving}
                        className={
                          borrower.is_active
                            ? "w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                            : "w-full text-left px-4 py-2.5 text-sm text-emerald-600 hover:bg-emerald-50 disabled:opacity-50"
                        }
                      >
                        {statusSaving
                          ? 'Updating...'
                          : borrower.is_active
                            ? 'Deactivate borrower'
                            : 'Reactivate borrower'}
                      </button>

                    </div>
                  )}

                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              PROFILE CONTENT
          ================================================= */}
          <div className="p-6 lg:p-8">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-9 h-9 rounded-lg bg-[#D4F1F4] text-[#05445E] flex items-center justify-center">
                <User size={18} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#05445E]">
                  Borrower Profile
                </h2>

                <p className="text-xs text-slate-400">
                  Personal and contact information
                </p>
              </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12">

              {/* Personal Information */}
              <section>

                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Personal Information
                  </h3>
                </div>

                <div>

                  <InfoRow
                    label="First Name"
                    value={borrower.first_name}
                  />

                  <InfoRow
                    label="Last Name"
                    value={borrower.last_name}
                  />

                  <InfoRow
                    label="Business Name"
                    value={borrower.business_name}
                  />

                  <InfoRow
                    label="Gender"
                    value={borrower.gender}
                  />

                  <InfoRow
                    label="Date of Birth"
                    value={borrower.date_of_birth}
                    icon={<CalendarDays size={16} />}
                  />

                </div>

              </section>

              {/* Contact & Identification */}
              <section className="mt-8 lg:mt-0">

                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Contact & Identification
                  </h3>
                </div>

                <div>

                  <InfoRow
                    label="Phone Number"
                    value={borrower.phone}
                    icon={<Phone size={16} />}
                  />

                  <InfoRow
                    label="Email Address"
                    value={borrower.email}
                    icon={<Mail size={16} />}
                  />

                  <InfoRow
                    label="National ID"
                    value={borrower.national_id}
                    icon={<CreditCard size={16} />}
                  />

                  <InfoRow
                    label="Address"
                    value={borrower.address}
                    icon={<MapPin size={16} />}
                  />

                </div>

              </section>

            </div>

          </div>

          {/* =================================================
              ACCOUNT INFORMATION
          ================================================= */}
          <div className="border-t border-slate-100 px-6 py-6 lg:px-8">

            <div className="flex items-center gap-3 mb-5">

              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                <Building2 size={18} />
              </div>

              <div>
                <h2 className="text-base font-bold text-[#05445E]">
                  Account Information
                </h2>

                <p className="text-xs text-slate-400">
                  Borrower registration and organizational assignment
                </p>
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Borrower Type
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-700 capitalize">
                  {borrowerType.toLowerCase()}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Branch
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {borrower.branch_id || 'Not assigned'}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Verification
                </p>

                <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                  <ShieldCheck size={16} />
                  Registered
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          BORROWER HISTORY MODAL
      ===================================================== */}
      {/* =================================================
          EDIT BORROWER MODAL
      ================================================= */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between items-center border-b border-slate-100 px-6 py-5">
              <div>
                <h3 className="text-xl font-bold text-[#05445E]">
                  Edit Borrower
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Update borrower profile information
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditBorrower}
                disabled={editSaving}
                className="text-slate-400 hover:text-slate-600 text-2xl leading-none"
                aria-label="Close edit borrower"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleEditBorrower} className="p-6 space-y-5">

              {editError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold">
                  {editError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    First Name *
                  </label>
                  <input
                    required
                    value={editForm.first_name}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        first_name: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    required
                    value={editForm.last_name}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        last_name: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Business Name
                  </label>
                  <input
                    value={editForm.business_name}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        business_name: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    required
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        phone: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    National ID
                  </label>
                  <input
                    value={editForm.national_id}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        national_id: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={editForm.date_of_birth}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        date_of_birth: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={editForm.gender}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        gender: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                  >
                    <option value="">Select gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Address / Location
                </label>
                <input
                  value={editForm.address}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      address: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEditBorrower}
                  disabled={editSaving}
                  className="w-1/2 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={editSaving}
                  className="w-1/2 py-2.5 bg-[#189AB4] hover:bg-[#05445E] disabled:opacity-60 text-white rounded-xl font-semibold transition-colors"
                >
                  {editSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {historyOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl border border-slate-200">

            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-black text-[#05445E]">
                  Borrower History
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Loans and repayments for {fullName}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setHistoryOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                aria-label="Close history"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[75vh]">

              {historyLoading && (
                <div className="py-16 flex items-center justify-center gap-3 text-[#05445E] font-semibold">
                  <Loader2 size={20} className="animate-spin" />
                  Loading borrower history...
                </div>
              )}

              {!historyLoading && historyError && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold">
                  {historyError}
                </div>
              )}

              {!historyLoading && !historyError && (
                <div className="space-y-8">

                  {/* LOANS */}
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-wider text-[#05445E]">
                          Loan History
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          {borrowerLoans.length} loan{borrowerLoans.length === 1 ? '' : 's'}
                        </p>
                      </div>
                    </div>

                    {borrowerLoans.length === 0 ? (
                      <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center text-sm text-slate-400">
                        No loans found for this borrower.
                      </div>
                    ) : (
                      <div className="overflow-x-auto border border-slate-200 rounded-xl">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-50">
                            <tr>
                              <th className="text-left p-3 font-bold text-slate-500">
                                Loan
                              </th>
                              <th className="text-left p-3 font-bold text-slate-500">
                                Principal
                              </th>
                              <th className="text-left p-3 font-bold text-slate-500">
                                Rate
                              </th>
                              <th className="text-left p-3 font-bold text-slate-500">
                                Term
                              </th>
                              <th className="text-left p-3 font-bold text-slate-500">
                                Issue Date
                              </th>
                              <th className="text-left p-3 font-bold text-slate-500">
                                Maturity
                              </th>
                              <th className="text-left p-3 font-bold text-slate-500">
                                Status
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {borrowerLoans.map((loan: any) => (
                              <tr
                                key={loan.id}
                                className="border-t border-slate-100"
                              >
                                <td className="p-3 font-semibold text-[#05445E]">
                                  {loan.loan_number || loan.id}
                                </td>

                                <td className="p-3 font-semibold text-slate-700">
                                  {loan.principal != null
                                    ? Number(loan.principal).toLocaleString()
                                    : '—'}
                                </td>

                                <td className="p-3 text-slate-600">
                                  {loan.interest_rate != null
                                    ? `${loan.interest_rate}%`
                                    : '—'}
                                </td>

                                <td className="p-3 text-slate-600">
                                  {loan.term_months != null
                                    ? `${loan.term_months} mo`
                                    : '—'}
                                </td>

                                <td className="p-3 text-slate-600">
                                  {loan.disbursement_date || '—'}
                                </td>

                                <td className="p-3 text-slate-600">
                                  {loan.maturity_date || '—'}
                                </td>

                                <td className="p-3">
                                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                                    {loan.status || 'Unknown'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </section>

                  {/* REPAYMENTS */}
                  <section>
                    <div className="mb-4">
                      <h3 className="text-sm font-black uppercase tracking-wider text-[#05445E]">
                        Repayment History
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        {borrowerRepayments.length} payment{borrowerRepayments.length === 1 ? '' : 's'}
                      </p>
                    </div>

                    {borrowerRepayments.length === 0 ? (
                      <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center text-sm text-slate-400">
                        No repayments found for this borrower.
                      </div>
                    ) : (
                      <div className="overflow-x-auto border border-slate-200 rounded-xl">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-50">
                            <tr>
                              <th className="text-left p-3 font-bold text-slate-500">
                                Date
                              </th>
                              <th className="text-left p-3 font-bold text-slate-500">
                                Loan
                              </th>
                              <th className="text-left p-3 font-bold text-slate-500">
                                Amount
                              </th>
                              <th className="text-left p-3 font-bold text-slate-500">
                                Principal
                              </th>
                              <th className="text-left p-3 font-bold text-slate-500">
                                Interest
                              </th>
                              <th className="text-left p-3 font-bold text-slate-500">
                                Penalty
                              </th>
                              <th className="text-left p-3 font-bold text-slate-500">
                                Method
                              </th>
                              <th className="text-left p-3 font-bold text-slate-500">
                                Reference
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {borrowerRepayments.map((payment: any) => (
                              <tr
                                key={payment.id}
                                className="border-t border-slate-100"
                              >
                                <td className="p-3 text-slate-600">
                                  {payment.payment_date || '—'}
                                </td>

                                <td className="p-3 font-semibold text-[#05445E]">
                                  {payment.loan_number || payment.loan_id || '—'}
                                </td>

                                <td className="p-3 font-bold text-slate-700">
                                  {payment.amount != null
                                    ? Number(payment.amount).toLocaleString()
                                    : '—'}
                                </td>

                                <td className="p-3 text-slate-600">
                                  {payment.principal_paid != null
                                    ? Number(payment.principal_paid).toLocaleString()
                                    : '—'}
                                </td>

                                <td className="p-3 text-slate-600">
                                  {payment.interest_paid != null
                                    ? Number(payment.interest_paid).toLocaleString()
                                    : '—'}
                                </td>

                                <td className="p-3 text-slate-600">
                                  {payment.penalty_paid != null
                                    ? Number(payment.penalty_paid).toLocaleString()
                                    : '—'}
                                </td>

                                <td className="p-3 text-slate-600">
                                  {payment.method || '—'}
                                </td>

                                <td className="p-3 text-slate-500">
                                  {payment.reference || '—'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </section>

                </div>
              )}

            </div>

            <div className="flex justify-end px-6 py-4 border-t border-slate-100 bg-slate-50">
              <button
                type="button"
                onClick={() => setHistoryOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-[#05445E] text-white text-sm font-bold hover:bg-[#04364B] transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
