import React, { useState, useRef, useEffect } from 'react';
import { Save, Globe, Lock, CheckCircle2, Upload, Building2 } from 'lucide-react';

export const Settings = () => {
  const [orgName, setOrgName] = useState(() => localStorage.getItem('peak_org_name') || 'Peak Lenders East Africa Ltd');
  const [currency, setCurrency] = useState(() => localStorage.getItem('peak_currency') || 'UGX');
  const [timezone, setTimezone] = useState(() => localStorage.getItem('peak_timezone') || 'Africa/Nairobi');
  const [timeout, setTimeoutVal] = useState(() => localStorage.getItem('peak_timeout') || '30');
  const [gracePeriod, setGracePeriod] = useState(() => localStorage.getItem('peak_grace') || '3');
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [logo, setLogo] = useState<string | null>(() => localStorage.getItem('peak_logo'));
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to localStorage so sidebar and other components can read it
    localStorage.setItem('peak_org_name', orgName);
    localStorage.setItem('peak_currency', currency);
    localStorage.setItem('peak_timezone', timezone);
    localStorage.setItem('peak_timeout', timeout);
    localStorage.setItem('peak_grace', gracePeriod);
    if (logo) {
      localStorage.setItem('peak_logo', logo);
    }

    // Dispatch a custom event so the Sidebar/Layout immediately detects the change
    window.dispatchEvent(new Event('peak-settings-changed'));

    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#05445E]">System Settings</h1>
          <p className="text-sm text-slate-500">Configure regional parameters, East African currencies, and system policies</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-[#189AB4] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md hover:bg-[#05445E] transition-colors cursor-pointer"
        >
          <Save size={16} /> Save Configurations
        </button>
      </div>

      {showSavedToast && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-bold">
          <CheckCircle2 size={16} className="text-emerald-600" />
          Settings successfully updated across East African regional nodes!
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 max-w-3xl">
        
        <div className="space-y-4">
          <h2 className="font-bold text-[#05445E] text-sm uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
            <Building2 size={16} className="text-[#189AB4]" /> Branding
          </h2>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center bg-slate-50 overflow-hidden relative">
              {logo ? (
                <img src={logo} alt="Org Logo" className="w-full h-full object-contain" />
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
            <input type="file" ref={fileInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-bold text-[#05445E] text-sm uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
            <Globe size={16} className="text-[#189AB4]" /> Regional & Currency Parameters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Organization Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Base Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189AB4] font-medium text-slate-700"
              >
                <option value="UGX">UGX - Ugandan Shilling</option>
                <option value="KES">KES - Kenyan Shilling</option>
                <option value="TZS">TZS - Tanzanian Shilling</option>
                <option value="RWF">RWF - Rwandan Franc</option>
                <option value="SSP">SSP - South Sudanese Pound</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-slate-600 font-semibold mb-1">Regional Time Zone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189AB4] font-medium text-slate-700"
              >
                <option value="Africa/Nairobi">EAT - Nairobi, Kampala, Dar es Salaam (UTC+3)</option>
                <option value="Africa/Kigali">CAT - Kigali, Bujumbura (UTC+2)</option>
                <option value="Africa/Juba">CAT - Juba (UTC+2)</option>
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
              <label className="block text-slate-600 font-semibold mb-1">Session Timeout (Minutes)</label>
              <input
                type="number"
                value={timeout}
                onChange={(e) => setTimeoutVal(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">PAR Grace Period (Days)</label>
              <input
                type="number"
                value={gracePeriod}
                onChange={(e) => setGracePeriod(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189AB4]"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
