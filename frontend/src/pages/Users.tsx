import { useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";

export const Users = () => {


  const [showModal,setShowModal] = useState(false);


  const [users,setUsers] = useState([
    {
      id:"USR-001",
      name:"Admin User",
      email:"admin@peaklenders.com",
      role:"Administrator",
      branch:"Head Office",
      phone:"+256700000001",
      status:"Active"
    },
    {
      id:"USR-002",
      name:"Sarah Nakato",
      email:"sarah@peaklenders.com",
      role:"Loan Officer",
      branch:"Kampala Branch",
      phone:"+256700000002",
      status:"Active"
    },
    {
      id:"USR-003",
      name:"David Okello",
      email:"david@peaklenders.com",
      role:"Branch Manager",
      branch:"Entebbe Branch",
      phone:"+256700000003",
      status:"Inactive"
    }
  ]);



  const [form,setForm]=useState({
    name:"",
    email:"",
    role:"",
    branch:"",
    phone:""
  });



  const addUser=()=>{

    setUsers([
      {
        id:`USR-${String(users.length+1).padStart(3,"0")}`,
        ...form,
        status:"Active"
      },
      ...users
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
              Users
            </h1>

            <p className="text-slate-500">
              Manage system users and access accounts
            </p>

          </div>


          <button
            onClick={()=>setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
          >

            <Lucide.UserPlus size={18}/>

            New User

          </button>


        </div>






        <div className="grid grid-cols-4 gap-5 mb-8">


          <div className="bg-white border rounded-2xl p-6">

            <p className="text-sm text-slate-500">
              Total Users
            </p>

            <h2 className="text-4xl font-black">
              {users.length}
            </h2>

          </div>




          <div className="bg-white border rounded-2xl p-6">

            <p className="text-sm text-slate-500">
              Active Users
            </p>

            <h2 className="text-4xl font-black text-green-600">
              {users.filter(u=>u.status==="Active").length}
            </h2>

          </div>




          <div className="bg-white border rounded-2xl p-6">

            <p className="text-sm text-slate-500">
              Roles
            </p>

            <h2 className="text-4xl font-black text-blue-600">
              {new Set(users.map(u=>u.role)).size}
            </h2>

          </div>




          <div className="bg-white border rounded-2xl p-6">

            <p className="text-sm text-slate-500">
              Branch Access
            </p>

            <h2 className="text-4xl font-black">
              {new Set(users.map(u=>u.branch)).size}
            </h2>

          </div>


        </div>







        <div className="bg-white border rounded-2xl overflow-hidden">


          <table className="w-full">


            <thead className="bg-slate-100">


              <tr>

                <th className="p-4 text-left">
                  ID
                </th>

                <th className="p-4 text-left">
                  User
                </th>

                <th className="p-4 text-left">
                  Email
                </th>

                <th className="p-4 text-left">
                  Role
                </th>

                <th className="p-4 text-left">
                  Branch
                </th>

                <th className="p-4 text-left">
                  Phone
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

              </tr>


            </thead>




            <tbody>


            {users.map(user=>(

              <tr
                key={user.id}
                className="border-t"
              >


                <td className="p-4 font-bold">
                  {user.id}
                </td>


                <td className="p-4 font-bold text-blue-700">
                  {user.name}
                </td>


                <td className="p-4">
                  {user.email}
                </td>


                <td className="p-4">
                  {user.role}
                </td>


                <td className="p-4">
                  {user.branch}
                </td>


                <td className="p-4">
                  {user.phone}
                </td>


                <td className="p-4">

                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    user.status==="Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                  }`}>

                    {user.status}

                  </span>

                </td>


              </tr>

            ))}


            </tbody>


          </table>


        </div>







        {showModal && (

          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">


            <div className="bg-white rounded-3xl p-8 w-[650px]">


              <h2 className="text-2xl font-black mb-6">
                New User
              </h2>




              <div className="space-y-4">


                <input
                className="border rounded-xl p-3 w-full"
                placeholder="Full Name"
                onChange={e=>setForm({...form,name:e.target.value})}
                />


                <input
                className="border rounded-xl p-3 w-full"
                placeholder="Email"
                onChange={e=>setForm({...form,email:e.target.value})}
                />


                <input
                className="border rounded-xl p-3 w-full"
                placeholder="Role"
                onChange={e=>setForm({...form,role:e.target.value})}
                />


                <input
                className="border rounded-xl p-3 w-full"
                placeholder="Branch"
                onChange={e=>setForm({...form,branch:e.target.value})}
                />


                <input
                className="border rounded-xl p-3 w-full"
                placeholder="Phone"
                onChange={e=>setForm({...form,phone:e.target.value})}
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
                onClick={addUser}
                className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold"
                >
                  Save User
                </button>


              </div>


            </div>


          </div>

        )}


      </main>


    </div>

  );

};
