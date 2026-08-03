import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";


const activities=[

{
id:1,
type:"Loan Approval",
user:"Andrew Forbist",
action:"approved a loan application",
target:"John Doe - UGX 5,000,000",
branch:"Kampala Main",
time:"10 minutes ago",
system:false
},


{
id:2,
type:"Repayment",
user:"System",
action:"processed automated repayment",
target:"Sarah Namusoke - UGX 850,000",
branch:"Ntinda Branch",
time:"1 hour ago",
system:true
},


{
id:3,
type:"Borrower",
user:"Grace Manager",
action:"registered new borrower",
target:"Peter Okello",
branch:"Mbarara Branch",
time:"3 hours ago",
system:false
},


{
id:4,
type:"Risk",
user:"Risk Engine",
action:"flagged repayment risk",
target:"12 overdue accounts",
branch:"All Branches",
time:"5 hours ago",
system:true
},


{
id:5,
type:"Disbursement",
user:"Finance Officer",
action:"released loan funds",
target:"UGX 45,000,000 portfolio",
branch:"Kampala Main",
time:"Yesterday",
system:false
}

];



export const ActivityFeed=()=>{


const system =
activities.filter(a=>a.system).length;


const users =
activities.length-system;



return (

<div className="flex h-screen bg-slate-50">


<Sidebar/>


<div className="flex-1 p-8 overflow-y-auto">



{/* HEADER */}

<div className="flex justify-between items-center mb-8">


<div>

<h1 className="text-3xl font-black text-slate-800">
Activity Feed
</h1>

<p className="text-slate-500">
Complete audit trail of lending operations
</p>

</div>



<button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex gap-2 items-center">

<Lucide.RefreshCw size={18}/>

Refresh

</button>


</div>







{/* SUMMARY */}


<div className="grid grid-cols-3 gap-6 mb-8">


<div className="card p-6">

<p className="text-slate-500 text-sm">
Total Events
</p>


<h2 className="text-3xl font-black mt-2">
{activities.length}
</h2>

</div>



<div className="card p-6">

<p className="text-slate-500 text-sm">
Staff Actions
</p>


<h2 className="text-3xl font-black text-blue-600 mt-2">
{users}
</h2>

</div>



<div className="card p-6">

<p className="text-slate-500 text-sm">
Automated Events
</p>


<h2 className="text-3xl font-black text-indigo-600 mt-2">
{system}
</h2>


</div>



</div>








{/* FILTER */}


<div className="card p-5 mb-6 flex justify-between">


<div className="flex gap-3">


<button className="bg-blue-600 text-white px-5 py-2 rounded-xl font-bold">
All
</button>


<button className="border px-5 py-2 rounded-xl">
Loans
</button>


<button className="border px-5 py-2 rounded-xl">
Payments
</button>


<button className="border px-5 py-2 rounded-xl">
Risk
</button>


</div>



<div className="border rounded-xl px-4 flex items-center gap-2">

<Lucide.Search size={18}/>

<input
placeholder="Search activity..."
className="outline-none"
/>

</div>


</div>









{/* TIMELINE */}


<div className="card overflow-hidden">


<div className="p-6 border-b">

<h2 className="text-xl font-black">
Institution Activity Timeline
</h2>

<p className="text-slate-500 text-sm">
Real-time operational events
</p>


</div>






<div className="divide-y">


{activities.map(a=>(


<div
key={a.id}
className="p-6 flex gap-5 hover:bg-slate-50"
>


<div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
a.system
?"bg-indigo-600"
:"bg-blue-600"
}`}>



{a.system?

<Lucide.Cpu className="text-white"/>

:

<Lucide.User className="text-white"/>

}


</div>







<div className="flex-1">


<div className="flex items-center gap-3">


<h3 className="font-black">

{a.user}

</h3>


<span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">

{a.type}

</span>


</div>




<p className="text-slate-600 mt-2">

{a.action}

{" "}

<strong className="text-blue-600">
{a.target}
</strong>


</p>




<div className="flex gap-5 mt-3 text-sm text-slate-500">


<span className="flex gap-1 items-center">

<Lucide.MapPin size={14}/>

{a.branch}

</span>


<span>
{a.time}
</span>


</div>


</div>



</div>


))}



</div>


</div>






);


};
