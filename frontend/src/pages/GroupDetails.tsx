import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";


export const GroupDetails = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [showModal,setShowModal]=useState(false);


  const [members,setMembers]=useState(()=>{

    const saved=localStorage.getItem(`members-${id}`);

    return saved ? JSON.parse(saved):[];

  });



  const [form,setForm]=useState({

    name:"",
    idNo:"",
    phone:"",
    loan:"",
    savings:""

  });



  useEffect(()=>{

    localStorage.setItem(
      `members-${id}`,
      JSON.stringify(members)
    );

  },[members,id]);



  const saveMember=()=>{


    if(!form.name || !form.idNo)
      return;


    setMembers([

      ...members,

      {
        ...form,
        uid:Date.now(),
        status:"Active"

      }

    ]);


    setForm({
      name:"",
      idNo:"",
      phone:"",
      loan:"",
      savings:""
    });


    setShowModal(false);

  };




return (

<div className="flex h-screen bg-slate-50">


<Sidebar />


<div className="flex-1 overflow-y-auto p-6">



{/* HEADER */}

<div className="flex justify-between items-center mb-8">


<div className="flex gap-4 items-center">


<button
onClick={()=>navigate(-1)}
className="bg-white p-3 rounded-xl shadow-sm hover:bg-slate-100"
>

<Lucide.ArrowLeft/>

</button>


<div>

<h1 className="text-3xl font-black text-slate-900">

Group Members

</h1>


<p className="text-slate-500">

Group ID: {id}

</p>


</div>


</div>



<button

onClick={()=>setShowModal(true)}

className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex gap-2 items-center"

>

<Lucide.UserPlus size={18}/>

Add Member

</button>



</div>





{/* SUMMARY */}


<div className="grid grid-cols-3 gap-5 mb-8">


<div className="bg-white rounded-3xl p-6 border">

<p className="text-sm text-slate-500">
Members
</p>

<h2 className="text-4xl font-black">
{members.length}
</h2>

</div>



<div className="bg-white rounded-3xl p-6 border">

<p className="text-sm text-slate-500">
Active Loans
</p>

<h2 className="text-4xl font-black text-blue-600">

{members.length}

</h2>

</div>




<div className="bg-white rounded-3xl p-6 border">

<p className="text-sm text-slate-500">
Group Exposure
</p>

<h2 className="text-4xl font-black">

KES 0

</h2>

</div>



</div>





{/* TABLE */}


<div className="bg-white rounded-3xl border overflow-hidden">


<table className="w-full">


<thead>

<tr className="text-xs uppercase text-slate-400 border-b">


<th className="p-5 text-left">
Member ID
</th>


<th className="p-5 text-left">
Name
</th>


<th className="p-5 text-left">
National ID
</th>


<th className="p-5 text-left">
Phone
</th>


<th className="p-5 text-left">
Loan
</th>


<th className="p-5 text-left">
Savings
</th>


</tr>

</thead>



<tbody>


{members.map((m:any)=>(


<tr key={m.uid}
className="border-b hover:bg-slate-50">


<td className="p-5 font-mono text-xs">

MBR-{m.uid}

</td>


<td className="p-5 font-bold text-blue-600">

{m.name}

</td>


<td className="p-5">

{m.idNo}

</td>


<td className="p-5">

{m.phone}

</td>


<td className="p-5 font-bold">

{m.loan || "No Loan"}

</td>


<td className="p-5">

{m.savings || "0"}

</td>


</tr>


))}



</tbody>


</table>


</div>



</div>







{/* MODAL */}


{showModal && (


<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">


<div className="bg-white rounded-3xl p-8 w-[500px]">


<h2 className="text-2xl font-black mb-6">

Add Group Member

</h2>


<div className="space-y-4">


<input
placeholder="Full Name"
className="input"
onChange={
e=>setForm({...form,name:e.target.value})
}
/>


<input
placeholder="National ID"
className="input"
onChange={
e=>setForm({...form,idNo:e.target.value})
}
/>



<input
placeholder="Phone"
className="input"
onChange={
e=>setForm({...form,phone:e.target.value})
}
/>



<input
placeholder="Loan Amount"
className="input"
onChange={
e=>setForm({...form,loan:e.target.value})
}
/>




<div className="flex gap-3">


<button

onClick={()=>setShowModal(false)}

className="flex-1 py-3 font-bold text-slate-500"

>

Cancel

</button>



<button

onClick={saveMember}

className="flex-1 bg-blue-600 text-white rounded-xl font-bold"

>

Save

</button>


</div>


</div>


</div>


</div>


)}



</div>


);

};
