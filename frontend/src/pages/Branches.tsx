import { useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";

export const Branches = () => {


  const [showModal,setShowModal] = useState(false);


  const [branches,setBranches] = useState([
    {
      code:"BR-001",
      name:"Kampala Main Branch",
      manager:"Sarah Nakato",
      phone:"+256700000001",
      location:"Kampala",
      status:"Active"
    },
    {
      code:"BR-002",
      name:"Entebbe Branch",
      manager:"David Okello",
      phone:"+256700000002",
      location:"Entebbe",
      status:"Active"
    },
    {
      code:"BR-003",
      name:"Jinja Branch",
      manager:"Mary Achieng",
      phone:"+256700000003",
      location:"Jinja",
      status:"Inactive"
    }
  ]);



  const [form,setForm]=useState({
    name:"",
    manager:"",
    phone:"",
    location:""
  });



  const addBranch=()=>{

    setBranches([
      {
        code:`BR-${String(branches.length+1).padStart(3,"0")}`,
        ...form,
        status:"Active"
      },
      ...branches
    ]);

    setShowModal(false);

  };



  return (

    <div className="flex h-screen bg-slate-50">


      <Sidebar />


      <main className="flex-1 p-8 overflow-y-auto">



        <div className="flex justify-between items-center mb-8">


          <div>

            <h1 className="text-4xl font-black">
              Branches
            </h1>

            <p className="text-slate-500">
              Manage branches and operational locations
            </p>

          </div>



          <button
            onClick={()=>setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
          >

            <Lucide.Plus size={18}/>

            New Branch

          </button>


        </div>





        <div className="grid grid-cols-3 gap-5 mb-8">


          <div className="bg-white border rounded-2xl p-6">

            <p className="text-sm text-slate-500">
              Total Branches
            </p>

            <h2 className="text-4xl font-black">
              {branches.length}
            </h2>

          </div>




          <div className="bg-white border rounded-2xl p-6">

            <p className="text-sm text-slate-500">
              Active
            </p>

            <h2 className="text-4xl font-black text-green-600">
              {branches.filter(b=>b.status==="Active").length}
            </h2>

          </div>




          <div className="bg-white border rounded-2xl p-6">

            <p className="text-sm text-slate-500">
              Locations
            </p>

            <h2 className="text-4xl font-black text-blue-600">
              {new Set(branches.map(b=>b.location)).size}
            </h2>

          </div>


        </div>






        <div className="bg-white border rounded-2xl overflow-hidden">


          <table className="w-full">


            <thead className="bg-slate-100">


              <tr>

                <th className="p-4 text-left">
                  Code
                </th>

                <th className="p-4 text-left">
                  Branch Name
                </th>

                <th className="p-4 text-left">
                  Manager
                </th>

                <th className="p-4 text-left">
                  Phone
                </th>

                <th className="p-4 text-left">
                  Location
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

              </tr>


            </thead>




            <tbody>


            {branches.map(branch=>(

              <tr
                key={branch.code}
                className="border-t"
              >


                <td className="p-4 font-bold">
                  {branch.code}
                </td>


                <td className="p-4 font-bold text-blue-700">
                  {branch.name}
                </td>


                <td className="p-4">
                  {branch.manager}
                </td>


                <td className="p-4">
                  {branch.phone}
                </td>


                <td className="p-4">
                  {branch.location}
                </td>


                <td className="p-4">

                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    branch.status==="Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                  }`}>

                    {branch.status}

                  </span>

                </td>


              </tr>

            ))}


            </tbody>


          </table>


        </div>







        {showModal && (

          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">


            <div className="bg-white rounded-3xl p-8 w-[600px]">


              <h2 className="text-2xl font-black mb-6">
                New Branch
              </h2>



              <div className="space-y-4">


                <input
                className="border rounded-xl p-3 w-full"
                placeholder="Branch Name"
                onChange={e=>setForm({...form,name:e.target.value})}
                />


                <input
                className="border rounded-xl p-3 w-full"
                placeholder="Branch Manager"
                onChange={e=>setForm({...form,manager:e.target.value})}
                />


                <input
                className="border rounded-xl p-3 w-full"
                placeholder="Phone"
                onChange={e=>setForm({...form,phone:e.target.value})}
                />


                <input
                className="border rounded-xl p-3 w-full"
                placeholder="Location"
                onChange={e=>setForm({...form,location:e.target.value})}
                />


              </div>




              <div className="flex justify-end gap-3 mt-6">


                <button
                onClick={()=>setShowModal(false)}
                className="px-5 py-3"
                >
                  Cancel
                </button>


                <button
                onClick={addBranch}
                className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold"
                >
                  Save Branch
                </button>


              </div>


            </div>


          </div>

        )}


      </main>


    </div>

  );

};
