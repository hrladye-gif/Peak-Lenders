import { useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";

export const RolesPermissions = () => {


  const [showModal,setShowModal] = useState(false);


  const [roles,setRoles] = useState([
    {
      id:"ROLE-001",
      name:"Administrator",
      users:2,
      permissions:[
        "Full Access",
        "Users",
        "Accounting",
        "Reports"
      ],
      status:"Active"
    },
    {
      id:"ROLE-002",
      name:"Branch Manager",
      users:5,
      permissions:[
        "Loans",
        "Repayments",
        "Collections",
        "Borrowers"
      ],
      status:"Active"
    },
    {
      id:"ROLE-003",
      name:"Loan Officer",
      users:15,
      permissions:[
        "Borrowers",
        "Applications",
        "Repayments"
      ],
      status:"Active"
    }
  ]);



  const [form,setForm]=useState({
    name:"",
    permissions:""
  });



  const addRole=()=>{

    setRoles([
      {
        id:`ROLE-${String(roles.length+1).padStart(3,"0")}`,
        name:form.name,
        users:0,
        permissions:form.permissions
          .split(",")
          .map(p=>p.trim()),
        status:"Active"
      },
      ...roles
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
              Roles & Permissions
            </h1>

            <p className="text-slate-500">
              Control user access and system privileges
            </p>

          </div>



          <button
            onClick={()=>setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
          >

            <Lucide.ShieldPlus size={18}/>

            New Role

          </button>


        </div>





        <div className="grid grid-cols-3 gap-5 mb-8">


          <div className="bg-white border rounded-2xl p-6">

            <p className="text-sm text-slate-500">
              Total Roles
            </p>

            <h2 className="text-4xl font-black">
              {roles.length}
            </h2>

          </div>



          <div className="bg-white border rounded-2xl p-6">

            <p className="text-sm text-slate-500">
              Assigned Users
            </p>

            <h2 className="text-4xl font-black text-blue-600">
              {roles.reduce((a,b)=>a+b.users,0)}
            </h2>

          </div>




          <div className="bg-white border rounded-2xl p-6">

            <p className="text-sm text-slate-500">
              Permissions
            </p>

            <h2 className="text-4xl font-black text-green-600">
              {new Set(
                roles.flatMap(r=>r.permissions)
              ).size}
            </h2>

          </div>


        </div>







        <div className="grid grid-cols-3 gap-6">


        {roles.map(role=>(

          <div
            key={role.id}
            className="bg-white border rounded-3xl p-6"
          >


            <div className="flex justify-between items-center mb-4">


              <div>

                <h2 className="text-xl font-black">
                  {role.name}
                </h2>

                <p className="text-sm text-slate-500">
                  {role.id}
                </p>

              </div>


              <Lucide.ShieldCheck
                className="text-blue-600"
              />


            </div>




            <div className="mb-4">

              <p className="text-sm text-slate-500">
                Users Assigned
              </p>

              <p className="text-3xl font-black">
                {role.users}
              </p>

            </div>




            <p className="font-bold mb-3">
              Permissions
            </p>


            <div className="space-y-2">


            {role.permissions.map(permission=>(

              <div
                key={permission}
                className="bg-slate-100 rounded-xl px-3 py-2 text-sm"
              >

                {permission}

              </div>

            ))}


            </div>




            <span className="inline-block mt-5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">

              {role.status}

            </span>



          </div>

        ))}


        </div>







        {showModal && (

          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">


            <div className="bg-white rounded-3xl p-8 w-[600px]">


              <h2 className="text-2xl font-black mb-6">
                Create Role
              </h2>




              <div className="space-y-4">


                <input
                className="border rounded-xl p-3 w-full"
                placeholder="Role Name"
                onChange={
                  e=>setForm({
                    ...form,
                    name:e.target.value
                  })
                }
                />



                <textarea
                className="border rounded-xl p-3 w-full h-32"
                placeholder="Permissions separated by commas"
                onChange={
                  e=>setForm({
                    ...form,
                    permissions:e.target.value
                  })
                }
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
                onClick={addRole}
                className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold"
                >
                  Save Role
                </button>


              </div>


            </div>


          </div>

        )}



      </main>


    </div>

  );

};
