import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";
import { useState } from "react";
import { getCurrency, formatMoney, type Currency } from "../config/regional";
export const Institution = () => {


  const [institution,setInstitution] = useState({
    name:"Peak Lenders",
    type:"Microfinance Institution",
    country:"Uganda",
    currency: getCurrency(),
    phone:"+256700000000",
    email:"info@peaklenders.com",
    address:"Kampala, Uganda"
  });


  return (

    <div className="flex h-screen bg-slate-50">

      <Sidebar />


      <main className="flex-1 p-8 overflow-y-auto">


        <div className="flex justify-between items-center mb-8">


          <div>

            <h1 className="text-4xl font-black">
              Institution
            </h1>

            <p className="text-slate-500">
              Manage organization information and settings
            </p>

          </div>


          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
          >

            <Lucide.Save size={18}/>

            Save Changes

          </button>


        </div>





        <div className="bg-white border rounded-3xl p-8">


          <h2 className="text-2xl font-black mb-6">
            Institution Profile
          </h2>



          <div className="grid grid-cols-2 gap-6">


            <div>

              <label className="text-sm font-bold">
                Institution Name
              </label>

              <input
                className="border rounded-xl p-3 w-full mt-2"
                value={institution.name}
                onChange={e=>setInstitution({
                  ...institution,
                  name:e.target.value
                })}
              />

            </div>



            <div>

              <label className="text-sm font-bold">
                Institution Type
              </label>

              <input
                className="border rounded-xl p-3 w-full mt-2"
                value={institution.type}
                onChange={e=>setInstitution({
                  ...institution,
                  type:e.target.value
                })}
              />

            </div>




            <div>

              <label className="text-sm font-bold">
                Country
              </label>

              <input
                className="border rounded-xl p-3 w-full mt-2"
                value={institution.country}
                onChange={e=>setInstitution({
                  ...institution,
                  country:e.target.value
                })}
              />

            </div>




            <div>

              <label className="text-sm font-bold">
                Currency
              </label>

              <input
                className="border rounded-xl p-3 w-full mt-2"
                value={institution.currency}
                onChange={e=>setInstitution({
                  ...institution,
                  currency:e.target.value as Currency
                })}
              />

            </div>




            <div>

              <label className="text-sm font-bold">
                Phone
              </label>

              <input
                className="border rounded-xl p-3 w-full mt-2"
                value={institution.phone}
                onChange={e=>setInstitution({
                  ...institution,
                  phone:e.target.value
                })}
              />

            </div>




            <div>

              <label className="text-sm font-bold">
                Email
              </label>

              <input
                className="border rounded-xl p-3 w-full mt-2"
                value={institution.email}
                onChange={e=>setInstitution({
                  ...institution,
                  email:e.target.value
                })}
              />

            </div>



            <div className="col-span-2">

              <label className="text-sm font-bold">
                Address
              </label>

              <textarea
                className="border rounded-xl p-3 w-full mt-2"
                value={institution.address}
                onChange={e=>setInstitution({
                  ...institution,
                  address:e.target.value
                })}
              />

            </div>


          </div>


        </div>





        <div className="grid grid-cols-3 gap-5 mt-8">


          <div className="bg-white border rounded-2xl p-6">

            <Lucide.Building2 className="text-blue-600 mb-3"/>

            <h3 className="font-black">
              Institution Setup
            </h3>

            <p className="text-slate-500 text-sm">
              Configure organization details.
            </p>

          </div>



          <div className="bg-white border rounded-2xl p-6">

            <Lucide.Globe className="text-green-600 mb-3"/>

            <h3 className="font-black">
              Regional Settings
            </h3>

            <p className="text-slate-500 text-sm">
              Manage country and currency settings.
            </p>

          </div>




          <div className="bg-white border rounded-2xl p-6">

            <Lucide.Settings className="text-purple-600 mb-3"/>

            <h3 className="font-black">
              Configuration
            </h3>

            <p className="text-slate-500 text-sm">
              Control institution preferences.
            </p>

          </div>


        </div>



      </main>

    </div>

  );

};
