import React, { useEffect, useRef, useState } from 'react';
import {
  Save,
  Globe,
  Lock,
  CheckCircle2,
  Upload,
  Building2,
} from 'lucide-react';
import { EAST_AFRICAN_CURRENCIES, DEFAULT_CURRENCY } from '../../config/regional';
import { api } from '../../api/axios';

interface TenantSettings {
  id?: string | null;
  tenant_id: string;
  org_name: string;
  currency: string;
  timezone: string;
  session_timeout_minutes: number;
  par_grace_period_days: number;
  logo?: string | null;
}

const DEFAULT_ORG_NAME = 'Peak Lenders East Africa Ltd';
const DEFAULT_TIMEZONE = 'Africa/Nairobi';

export const Settings = () => {
  const [orgName, setOrgName] = useState(DEFAULT_ORG_NAME);
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
  const [timezone, setTimezone] = useState(DEFAULT_TIMEZONE);
  const [timeout, setTimeoutVal] = useState('30');
  const [gracePeriod, setGracePeriod] = useState('3');
  const [logo, setLogo] = useState<string | null>(null);

  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSavedToast, setShowSavedToast] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');

        const response = await api.get<TenantSettings | null>('/settings/');

        if (response.data) {
          const settings = response.data;

          setSettingsId(settings.id ?? null);
          setOrgName(settings.org_name);
          setCurrency(settings.currency);
          setTimezone(settings.timezone);
          setTimeoutVal(String(settings.session_timeout_minutes));
          setGracePeriod(String(settings.par_grace_period_days));
          setLogo(settings.logo ?? null);

          syncLocalStorage(settings);
        }
      } catch (error: any) {
        console.error('Failed to load institution settings:', error);

        setErrorMessage(
          error.response?.data?.detail ||
            'Unable to load institution settings. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const syncLocalStorage = (settings: TenantSettings) => {
    localStorage.setItem('peak_org_name', settings.org_name);
    localStorage.setItem('peak_currency', settings.currency);
    localStorage.setItem('peak_timezone', settings.timezone);
    localStorage.setItem(
      'peak_timeout',
      String(settings.session_timeout_minutes)
    );
    localStorage.setItem(
      'peak_grace',
      String(settings.par_grace_period_days)
    );

    if (settings.logo) {
      localStorage.setItem('peak_logo', settings.logo);
    } else {
      localStorage.removeItem('peak_logo');
    }

    window.dispatchEvent(new Event('peak-settings-changed'));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSaving) {
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage('');
      setShowSavedToast(false);

      const payload = {
        org_name: orgName.trim(),
        currency: currency.trim().toUpperCase(),
        timezone: timezone.trim(),
        session_timeout_minutes: Number(timeout),
        par_grace_period_days: Number(gracePeriod),
        logo,
      };

      let response;

      if (settingsId) {
        response = await api.patch<TenantSettings>(
          '/settings/',
          payload
        );
      } else {
        response = await api.post<TenantSettings>(
          '/settings/',
          payload
        );
      }

      const savedSettings = response.data;

      setSettingsId(savedSettings.id ?? null);
      setOrgName(savedSettings.org_name);
      setCurrency(savedSettings.currency);
      setTimezone(savedSettings.timezone);
      setTimeoutVal(String(savedSettings.session_timeout_minutes));
      setGracePeriod(String(savedSettings.par_grace_period_days));
      setLogo(savedSettings.logo ?? null);

      syncLocalStorage(savedSettings);

      setShowSavedToast(true);

      window.setTimeout(() => {
        setShowSavedToast(false);
      }, 3000);
    } catch (error: any) {
      console.error('Failed to save institution settings:', error);

      setErrorMessage(
        error.response?.data?.detail ||
          'Unable to save institution settings. Please try again.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setLogo(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#05445E]">
            System Settings
          </h1>
          <p className="text-sm text-slate-500">
            Configure regional parameters, East African currencies, and system
            policies
          </p>
        </div>

        <button
          type="submit"
          form="settings-form"
          disabled={isLoading || isSaving}
          className="flex items-center gap-2 bg-[#189AB4] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md hover:bg-[#05445E] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Save size={16} />
          {isSaving ? 'Saving...' : 'Save Configurations'}
        </button>
      </div>

      {isLoading && (
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-500">
          Loading institution settings...
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-xs font-bold">
          {errorMessage}
        </div>
      )}

      {showSavedToast && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-bold">
          <CheckCircle2 size={16} className="text-emerald-600" />
          Settings successfully saved to the institution.
        </div>
      )}

      <form
        id="settings-form"
        onSubmit={handleSave}
        className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 max-w-3xl"
      >
        <div className="space-y-4">
          <h2 className="font-bold text-[#05445E] text-sm uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
            <Building2 size={16} className="text-[#189AB4]" /> Branding
          </h2>

          <div className="flex items-center gap-6">
            <div className="w-24 h-24 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center bg-slate-50 overflow-hidden relative">
              {logo ? (
                <img
                  src={logo}
                  alt="Org Logo"
                  className="w-full h-full object-contain"
                />
              ) : (
                <Building2 size={32} className="text-slate-300" />
              )}
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <Upload size={16} /> Upload New Logo
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleLogoUpload}
              className="hidden"
              accept="image/*"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-bold text-[#05445E] text-sm uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
            <Globe size={16} className="text-[#189AB4]" /> Regional & Currency
            Parameters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Organization Name
              </label>

              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                disabled={isLoading || isSaving}
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189AB4] disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Base Currency
              </label>

              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                disabled={isLoading || isSaving}
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189AB4] font-medium text-slate-700 disabled:opacity-60"
              >
                {EAST_AFRICAN_CURRENCIES.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.code} - {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-600 font-semibold mb-1">
                Regional Time Zone
              </label>

              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                disabled={isLoading || isSaving}
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189AB4] font-medium text-slate-700 disabled:opacity-60"
              >
                <option value="Africa/Nairobi">
                  EAT - Nairobi, Kampala, Dar es Salaam (UTC+3)
                </option>
                <option value="Africa/Kigali">
                  CAT - Kigali, Bujumbura (UTC+2)
                </option>
                <option value="Africa/Juba">
                  CAT - Juba (UTC+2)
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-bold text-[#05445E] text-sm uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
            <Lock size={16} className="text-[#189AB4]" /> System Policies
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Session Timeout (Minutes)
              </label>

              <input
                type="number"
                min="5"
                max="480"
                value={timeout}
                onChange={(e) => setTimeoutVal(e.target.value)}
                disabled={isLoading || isSaving}
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189AB4] disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                PAR Grace Period (Days)
              </label>

              <input
                type="number"
                min="0"
                max="365"
                value={gracePeriod}
                onChange={(e) => setGracePeriod(e.target.value)}
                disabled={isLoading || isSaving}
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189AB4] disabled:opacity-60"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
