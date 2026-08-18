import { useState } from "react";
import { useEffect } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";
import { getCurrency, formatMoney, type Currency } from "../config/regional";

export const SystemSettings = () => {


  const [logo,setLogo] = useState<string | null>(
    localStorage.getItem("system-logo")
  );


  const handleLogoUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    if(e.target.files?.[0]){

      const url = URL.createObjectURL(
        e.target.files[0]
      );

      setLogo(url);

      localStorage.setItem(
        "system-logo",
        url
      );

    }

  };


  const [settings,setSettings] = useState({

    systemName:"Peak Lenders",
    language:"English",
    timezone:"Africa/Kampala",
    currency: getCurrency(),
    dateFormat:"DD/MM/YYYY",
    loanApproval:true,
    notifications:true,
    auditLogging:true

  });



  const saveSettings = () => {

    localStorage.setItem(
      "system-settings",
      JSON.stringify(settings)
    );

    alert("Settings saved successfully");

  };


  return (

    <div className="flex h-screen bg-slate-50">


      <Sidebar />


      <main className="flex-1 p-8 overflow-y-auto">



        <div className="flex justify-between items-center mb-8">


          <div>

            <h1 className="text-4xl font-black">
              System Settings
            </h1>

            <p className="text-slate-500">
              Configure application behaviour and preferences
            </p>

          </div>



          <button
            onClick={saveSettings}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
          >

            <Lucide.Save size={18}/>

            Save Settings

          </button>


        </div>






        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white border rounded-3xl p-6">


            <div className="flex items-center gap-3 mb-5">

              <Lucide.Image className="text-blue-600"/>

              <h2 className="text-xl font-black">
                Institution Logo
              </h2>

            </div>


            <label className="cursor-pointer">

              <div className="w-32 h-32 rounded-3xl border flex items-center justify-center overflow-hidden bg-slate-50">

                {logo ? (

                  <img
                    src={logo}
                    className="w-full h-full object-cover"
                  />

                ) : (

                  <Lucide.Building2
                    size={40}
                    className="text-slate-400"
                  />

                )}

              </div>


              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleLogoUpload}
              />


              <p className="mt-4 text-blue-600 font-bold">
                Upload Logo
              </p>


            </label>


          </div>




          <div className="bg-white border rounded-3xl p-6">


            <div className="flex items-center gap-3 mb-5">

              <Lucide.Settings className="text-blue-600"/>

              <h2 className="text-xl font-black">
                General
              </h2>

            </div>



            <label className="text-sm font-bold">
              System Name
            </label>


            <input
              className="border rounded-xl p-3 w-full mt-2 mb-4"
              value={settings.systemName}
              onChange={e=>setSettings({
                ...settings,
                systemName:e.target.value
              })}
            />



            <label className="text-sm font-bold">
              Language
            </label>


            <select
              className="border rounded-xl p-3 w-full mt-2"
              value={settings.language}
              onChange={e=>setSettings({
                ...settings,
                language:e.target.value
              })}
            >

              <option>English</option>
              <option>French</option>
              <option>Swahili</option>

            </select>


          </div>







          <div className="bg-white border rounded-3xl p-6">


            <div className="flex items-center gap-3 mb-5">

              <Lucide.Globe className="text-green-600"/>

              <h2 className="text-xl font-black">
                Regional
              </h2>

            </div>




            <label className="text-sm font-bold">
              Timezone
            </label>


            <select
              className="border rounded-xl p-3 w-full mt-2 mb-4"
              value={settings.timezone}
              onChange={e=>setSettings({
                ...settings,
                timezone:e.target.value
              })}
            >

              <option value="Africa/Kampala">
                Uganda - Kampala (EAT UTC+3)
              </option>

              <option value="Africa/Nairobi">
                Kenya - Nairobi (EAT UTC+3)
              </option>

              <option value="Africa/Dar_es_Salaam">
                Tanzania - Dar es Salaam (EAT UTC+3)
              </option>

              <option value="Africa/Addis_Ababa">
                Ethiopia - Addis Ababa (EAT UTC+3)
              </option>

              <option value="Africa/Mogadishu">
                Somalia - Mogadishu (EAT UTC+3)
              </option>

              <option value="Africa/Kigali">
                Rwanda - Kigali (CAT UTC+2)
              </option>

              <option value="Africa/Bujumbura">
                Burundi - Bujumbura (CAT UTC+2)
              </option>

              <option value="Africa/Johannesburg">
                South Africa - Johannesburg (SAST UTC+2)
              </option>

            </select>




            <label className="text-sm font-bold">
              Currency
            </label>


            <select
              className="border rounded-xl p-3 w-full mt-2"
              value={settings.currency}
              onChange={e=>setSettings({
                ...settings,
                currency:e.target.value as Currency
              })}
            >

              <option value="UGX">
                Uganda Shilling (UGX)
              </option>

              <option value="KES">
                Kenyan Shilling (KES)
              </option>

              <option value="TZS">
                Tanzanian Shilling (TZS)
              </option>

              <option value="RWF">
                Rwandan Franc (RWF)
              </option>

              <option value="BIF">
                Burundian Franc (BIF)
              </option>

              <option value="SSP">
                South Sudanese Pound (SSP)
              </option>

              <option value="ETB">
                Ethiopian Birr (ETB)
              </option>

              <option value="SOS">
                Somali Shilling (SOS)
              </option>

              <option value="ZAR">
                South African Rand (ZAR)
              </option>

              <option value="USD">
                US Dollar (USD)
              </option>

            </select>


          </div>








          <div className="bg-white border rounded-3xl p-6">


            <div className="flex items-center gap-3 mb-5">

              <Lucide.ShieldCheck className="text-purple-600"/>

              <h2 className="text-xl font-black">
                Security
              </h2>

            </div>





            <div className="flex justify-between items-center mb-5">

              <span>
                Loan Approval Workflow
              </span>

              <input
                type="checkbox"
                checked={settings.loanApproval}
                onChange={e=>setSettings({
                  ...settings,
                  loanApproval:e.target.checked
                })}
              />

            </div>





            <div className="flex justify-between items-center mb-5">

              <span>
                Notifications
              </span>

              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={e=>setSettings({
                  ...settings,
                  notifications:e.target.checked
                })}
              />

            </div>





            <div className="flex justify-between items-center">

              <span>
                Audit Logging
              </span>

              <input
                type="checkbox"
                checked={settings.auditLogging}
                onChange={e=>setSettings({
                  ...settings,
                  auditLogging:e.target.checked
                })}
              />

            </div>



          </div>



        </div>






        <div className="bg-white border rounded-3xl p-8 mt-8">


          <h2 className="text-2xl font-black mb-5">
            System Information
          </h2>


          <div className="grid grid-cols-4 gap-5">


            <div>
              <p className="text-sm text-slate-500">
                Version
              </p>

              <p className="font-black">
                1.0.0
              </p>
            </div>



            <div>
              <p className="text-sm text-slate-500">
                Database
              </p>

              <p className="font-black">
                PostgreSQL
              </p>
            </div>



            <div>
              <p className="text-sm text-slate-500">
                Environment
              </p>

              <p className="font-black">
                Production Ready
              </p>
            </div>



            <div>
              <p className="text-sm text-slate-500">
                Status
              </p>

              <p className="font-black text-green-600">
                Operational
              </p>
            </div>


          </div>


        </div>



      </main>


    </div>

  );

};
