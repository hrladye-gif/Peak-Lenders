import { useState, useEffect } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";
import { Link } from "react-router-dom";


export const Groups = () => {

const [showModal,setShowModal] = useState(false);


const [groups,setGroups] = useState(()=>{

const saved = localStorage.getItem("groups");

return saved ? JSON.parse(saved) : [

{
id:"GRP-001",
name:"Kampala Market Traders",
leader:"Sarah Namusoke",
phone:"+256700000000",
branch:"Kampala Branch",
members:12,
loans:8,
portfolio:"UGX 45,000,000",
status:"Active"
}

];

});


useEffect(()=>{

localStorage.setItem(
"groups",
JSON.stringify(groups)
);

},[groups]);



const [form,setForm]=useState({

name:"",
leader:"",
phone:"",
branch:"",
members:""

});



const registerGroup=()=>{


const newGroup={

id:"GRP-"+Math.floor(Math.random()*9000),

name:form.name,

leader:form.leader,

phone:form.phone,

branch:form.branch,

members:Number(form.members),

loans:0,

portfolio:"0",

status:"Active"

};


setGroups([
...groups,
newGroup
]);


setShowModal(false);


setForm({

name:"",
leader:"",
phone:"",
branch:"",
members:""

});


};



return (

<div className="flex h-screen bg-slate-50 text-slate-800">


<Sidebar />



<div className="flex-1 overflow-y-auto">


<header className="bg-white border-b px-8 py-6 flex justify-between items-center">


<div>

<h1 className="text-3xl font-black text-slate-900">
Groups
</h1>

<p className="text-slate-500">
Manage group borrowers and collective lending operations
</p>

</div>



<button

onClick={()=>setShowModal(true)}

className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex gap-2 items-center"

>

<Lucide.Plus size={18}/>

Create Group

</button>


</header>



<main className="p-8">



<div className="grid grid-cols-3 gap-6 mb-8">


<div className="bg-white rounded-3xl border p-6">

<p className="text-xs uppercase font-bold text-slate-400">
Total Groups
</p>

<h2 className="text-4xl font-black mt-3">
{groups.length}
</h2>

</div>



<div className="bg-white rounded-3xl border p-6">

<p className="text-xs uppercase font-bold text-slate-400">
Total Members
</p>

<h2 className="text-4xl font-black mt-3 text-blue-600">

{groups.reduce(
(sum: number, g: { membersCount: number }) => sum + g.membersCount,
0
)}

</h2>

</div>




<div className="bg-white rounded-3xl border p-6">

<p className="text-xs uppercase font-bold text-slate-400">
Active Loans
</p>

<h2 className="text-4xl font-black mt-3 text-indigo-600">

{groups.reduce(
(sum: number, g: { totalGroupLoans: string }) =>
  sum + Number(g.totalGroupLoans.replace(/[^0-9.-]+/g, "")),
0
)}

</h2>

</div>



</div>





<div className="bg-white rounded-3xl border shadow-sm overflow-hidden">


<div className="px-8 py-6 border-b">

<h2 className="font-black text-xl">
Group Register
</h2>

<p className="text-sm text-slate-500">
All registered borrower groups
</p>

</div>



<table className="w-full">


<thead className="bg-slate-50 text-xs uppercase text-slate-400">

<tr>

<th className="p-5 text-left">ID</th>
<th className="p-5 text-left">Group</th>
<th className="p-5 text-left">Leader</th>
<th className="p-5 text-left">Branch</th>
<th className="p-5 text-left">Members</th>
<th className="p-5 text-left">Portfolio</th>
<th className="p-5 text-left">Status</th>


</tr>

</thead>


<tbody>


{groups.map((g:any)=>(


<tr key={g.id} className="border-t hover:bg-slate-50">


<td className="p-5 font-mono text-xs">
{g.id}
</td>



<td className="p-5">

<Link
to={`/groups/${g.id}`}
className="font-bold text-blue-600"
>

{g.name}

</Link>

</td>


<td className="p-5">
{g.leader}
</td>


<td className="p-5">
{g.branch}
</td>


<td className="p-5">
{g.members}
</td>


<td className="p-5 font-bold">
{g.portfolio}
</td>



<td className="p-5">

<span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">

{g.status}

</span>

</td>


</tr>


))}



</tbody>


</table>



</div>


</main>


</div>





{showModal && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">


<div className="bg-white rounded-3xl p-8 w-[500px] shadow-2xl">


<h2 className="text-2xl font-black mb-6">
Create Borrower Group
</h2>



<div className="space-y-4">


<input
placeholder="Group Name"
className="w-full p-3 border rounded-xl"
onChange={
e=>setForm({...form,name:e.target.value})
}
/>



<input
placeholder="Group Leader"
className="w-full p-3 border rounded-xl"
onChange={
e=>setForm({...form,leader:e.target.value})
}
/>



<input
placeholder="Phone Number"
className="w-full p-3 border rounded-xl"
onChange={
e=>setForm({...form,phone:e.target.value})
}
/>



<input
placeholder="Branch"
className="w-full p-3 border rounded-xl"
onChange={
e=>setForm({...form,branch:e.target.value})
}
/>



<input
placeholder="Number of Members"
type="number"
className="w-full p-3 border rounded-xl"
onChange={
e=>setForm({...form,members:e.target.value})
}
/>



<div className="flex gap-3 mt-6">


<button
onClick={()=>setShowModal(false)}
className="flex-1 py-3 rounded-xl font-bold text-slate-500"
>
Cancel
</button>



<button

onClick={registerGroup}

className="flex-1 bg-blue-600 text-white rounded-xl font-bold"

>

Create Group

</button>


</div>


</div>


</div>


</div>

)}



</div>

);

};
