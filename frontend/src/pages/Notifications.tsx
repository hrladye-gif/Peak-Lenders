import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";


const notifications = [

{
id:1,
category:"Loan Approval",
title:"Loan application awaiting approval",
message:"John Doe submitted a UGX 5,000,000 business loan application.",
priority:"High",
branch:"Kampala Main",
time:"10 minutes ago",
read:false
},

{
id:2,
category:"Repayment",
title:"Large repayment received",
message:"Sarah Namusoke paid UGX 850,000 towards her active loan.",
priority:"Normal",
branch:"Ntinda",
time:"1 hour ago",
read:false
},

{
id:3,
category:"Risk Alert",
title:"Borrower repayment risk detected",
message:"3 borrowers have missed scheduled payments.",
priority:"Critical",
branch:"Mbarara",
time:"3 hours ago",
read:false
},


{
id:4,
category:"System",
title:"System maintenance scheduled",
message:"Core banking maintenance planned at 02:00 EAT.",
priority:"Low",
branch:"All Branches",
time:"Yesterday",
read:true
}

];



export const Notifications =()=>{


const unread =
notifications.filter(n=>!n.read).length;



return (

<div className="flex h-screen bg-slate-50">


<Sidebar/>


<div className="flex-1 p-8 overflow-y-auto">


{/* HEADER */}

<div className="flex justify-between items-center mb-8">


<div>

<h1 className="text-3xl font-black text-slate-800">
Notifications
</h1>


<p className="text-slate-500">
Monitor lending operations, risks and approvals
</p>

</div>


<button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold">

Mark all read

</button>


</div>





{/* SUMMARY */}


<div className="grid grid-cols-4 gap-6 mb-8">


<div className="card p-6">

<div className="flex justify-between">

<div>

<p className="text-slate-500 text-sm">
Total Alerts
</p>

<h2 className="text-3xl font-black mt-2">
{notifications.length}
</h2>

</div>


<div className="bg-blue-100 p-3 rounded-xl">

<Lucide.Bell className="text-blue-600"/>

</div>


</div>

</div>




<div className="card p-6">


<div className="flex justify-between">


<div>

<p className="text-slate-500 text-sm">
Unread
</p>

<h2 className="text-3xl font-black text-blue-600 mt-2">
{unread}
</h2>

</div>


<div className="bg-blue-600 p-3 rounded-xl">

<Lucide.AlertCircle className="text-white"/>

</div>


</div>


</div>






<div className="card p-6">


<p className="text-slate-500 text-sm">
Loan Approvals
</p>


<h2 className="text-3xl font-black mt-2">
24
</h2>


</div>






<div className="card p-6">


<p className="text-slate-500 text-sm">
Risk Alerts
</p>


<h2 className="text-3xl font-black text-red-600 mt-2">
3
</h2>


</div>


</div>







{/* FILTER BAR */}


<div className="card p-5 mb-6 flex justify-between">


<div className="flex gap-3">


<button className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold">
All
</button>


<button className="px-4 py-2 rounded-xl border">
Loans
</button>


<button className="px-4 py-2 rounded-xl border">
Risk
</button>


<button className="px-4 py-2 rounded-xl border">
System
</button>


</div>



<div className="flex items-center gap-2 border rounded-xl px-4">

<Lucide.Search size={18}/>

<input
placeholder="Search notifications..."
className="outline-none"
/>


</div>


</div>







{/* LIST */}


<div className="card overflow-hidden">


<div className="p-6 border-b">

<h2 className="text-xl font-black">
Latest Activity
</h2>


<p className="text-slate-500 text-sm">
Institution-wide notifications
</p>


</div>





<div className="divide-y">


{notifications.map(n=>(


<div
key={n.id}
className={`p-6 flex gap-5 hover:bg-slate-50 ${
!n.read?"bg-blue-50/40":""
}`}
>



<div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
n.priority==="Critical"
?"bg-red-600"
:n.priority==="High"
?"bg-blue-600"
:"bg-slate-500"
}`}>

<Lucide.Bell className="text-white"/>

</div>





<div className="flex-1">


<div className="flex gap-3 items-center">

<h3 className="font-black">
{n.title}
</h3>


<span className="text-xs bg-slate-100 px-3 py-1 rounded-full">
{n.category}
</span>


</div>



<p className="text-slate-600 mt-2">
{n.message}
</p>



<div className="flex gap-5 mt-3 text-sm text-slate-500">


<span className="flex gap-1 items-center">

<Lucide.MapPin size={14}/>

{n.branch}

</span>



<span>
{n.time}
</span>


</div>


</div>





<div>


<span className={`px-3 py-1 rounded-full text-xs font-bold ${
n.priority==="Critical"
?"bg-red-100 text-red-700"
:n.priority==="High"
?"bg-blue-100 text-blue-700"
:"bg-green-100 text-green-700"
}`}>

{n.priority}

</span>


</div>




</div>


))}


</div>


</div>



</div>


</div>


);

};
