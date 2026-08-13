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
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { api } from '../../api/axios';

interface Borrower {
  id: string;
  tenant_id: string;
  branch_id?: string | null;
  borrower_type: string;
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

export const BorrowerDetail = () => {
  const { borrowerId } = useParams<{ borrowerId: string }>();

  const [borrower, setBorrower] = useState<Borrower | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBorrower = async () => {
      try {
        setLoading(true);

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

  if (loading) {
    return (
      <div className="p-8 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#05445E] font-semibold">
          <Loader2 size={22} className="animate-spin" />
          Loading borrower...
        </div>
      </div>
    );
  }

  if (!borrower || error) {
    return (
      <div className="p-8 bg-slate-50 min-h-screen">
        <Link
          to="/borrowers"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#189AB4] hover:text-[#05445E]"
        >
          <ArrowLeft size={16} />
          Back to Borrowers
        </Link>

        <div className="mt-6 bg-white rounded-2xl border border-rose-200 p-8 text-center text-rose-600 font-semibold">
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

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">

      {/* Header */}
      <div>
        <Link
          to="/borrowers"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#189AB4] hover:text-[#05445E] mb-3"
        >
          <ArrowLeft size={16} />
          Back to Borrowers
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

          <div className="flex items-center gap-4">

            <div className="p-4 bg-[#D4F1F4] text-[#05445E] rounded-2xl">
              <User size={30} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-[#05445E]">
                {fullName}
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Borrower ID: {borrower.id}
              </p>
            </div>

          </div>

          <span className="px-4 py-2 rounded-full text-sm font-semibold bg-teal-50 text-teal-700 border border-teal-200">
            Active Borrower
          </span>

        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#D4F1F4] text-[#05445E] rounded-xl">
              <CreditCard size={22} />
            </div>

            <div>
              <p className="text-xs uppercase font-semibold text-slate-400">
                Borrower Type
              </p>

              <p className="font-bold text-[#05445E]">
                {borrower.borrower_type}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
              <Phone size={22} />
            </div>

            <div>
              <p className="text-xs uppercase font-semibold text-slate-400">
                Phone
              </p>

              <p className="font-bold text-[#05445E]">
                {borrower.phone || '—'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <ShieldCheck size={22} />
            </div>

            <div>
              <p className="text-xs uppercase font-semibold text-slate-400">
                Verification
              </p>

              <p className="font-bold text-teal-600">
                Registered
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        <div className="p-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-[#05445E]">
            Personal Information
          </h2>

          <p className="text-xs text-slate-400 mt-1">
            Complete borrower profile information
          </p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">
              First Name
            </p>
            <p className="mt-1 font-semibold text-slate-700">
              {borrower.first_name || '—'}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">
              Last Name
            </p>
            <p className="mt-1 font-semibold text-slate-700">
              {borrower.last_name || '—'}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">
              Business Name
            </p>
            <p className="mt-1 font-semibold text-slate-700">
              {borrower.business_name || '—'}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">
              National ID
            </p>
            <p className="mt-1 font-semibold text-slate-700">
              {borrower.national_id || '—'}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">
              Gender
            </p>
            <p className="mt-1 font-semibold text-slate-700">
              {borrower.gender || '—'}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">
              Date of Birth
            </p>
            <p className="mt-1 font-semibold text-slate-700">
              {borrower.date_of_birth || '—'}
            </p>
          </div>

        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        <div className="p-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-[#05445E]">
            Contact Information
          </h2>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="flex items-start gap-3">
            <div className="p-3 bg-[#D4F1F4] text-[#05445E] rounded-xl">
              <Phone size={20} />
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">
                Phone Number
              </p>
              <p className="font-semibold text-slate-700 mt-1">
                {borrower.phone || '—'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
              <Mail size={20} />
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">
                Email Address
              </p>
              <p className="font-semibold text-slate-700 mt-1">
                {borrower.email || '—'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 md:col-span-2">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <MapPin size={20} />
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">
                Address
              </p>
              <p className="font-semibold text-slate-700 mt-1">
                {borrower.address || '—'}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Organization */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        <div className="p-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-[#05445E]">
            Organization
          </h2>
        </div>

        <div className="p-6 flex items-start gap-3">
          <div className="p-3 bg-[#D4F1F4] text-[#05445E] rounded-xl">
            <Building2 size={20} />
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">
              Branch
            </p>

            <p className="font-semibold text-slate-700 mt-1">
              {borrower.branch_id || 'Not assigned'}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
