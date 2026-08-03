import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";


export const Dashboard = () => {


return (

<div className="flex h-screen bg-slate-50">


<Sidebar />


<div className="flex-1 p-8 overflow-y-auto">



{/* HEADER */}

<div className="flex justify-between items-center mb-8">


<div>

<h1 className="text-3xl font-black text-slate-800">
Dashboard
</h1>

<p className="text-slate-500 mt-1">
Complete overview of your lending operations
</p>

</div>



<button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex gap-2 items-center">

<Lucide.Plus size={18}/>

New Loan

</button>


</div>





{/* KPI CARDS */}


<div className="grid grid-cols-4 gap-6 mb-8">


<div className="card p-6">

<div className="flex justify-between">

<div>

<p className="text-slate-500 text-sm">
Total Portfolio
</p>

<h2 className="text-3xl font-black mt-3">
UGX 2.4B
</h2>

</div>


<div className="bg-blue-100 p-3 rounded-xl">

<Lucide.Wallet className="text-blue-600"/>

</div>

</div>

<p className="text-green-600 text-sm mt-4">
↑ 12% this month
</p>


</div>





<div className="card p-6">


<div className="flex justify-between">


<div>

<p className="text-slate-500 text-sm">
Active Loans
</p>


<h2 className="text-3xl font-black mt-3">
1,248
</h2>


</div>


<div className="bg-indigo-100 p-3 rounded-xl">

<Lucide.FileText className="text-indigo-600"/>

</div>


</div>


<p className="text-green-600 text-sm mt-4">
94% performing
</p>


</div>






<div className="card p-6">


<div className="flex justify-between">


<div>

<p className="text-slate-500 text-sm">
Collection Rate
</p>


<h2 className="text-3xl font-black mt-3">
96.8%
</h2>


</div>


<div className="bg-green-100 p-3 rounded-xl">

<Lucide.CheckCircle className="text-green-600"/>

</div>


</div>


<p className="text-green-600 text-sm mt-4">
Excellent repayment
</p>


</div>







<div className="card p-6">


<div className="flex justify-between">


<div>

<p className="text-slate-500 text-sm">
Risk Level
</p>


<h2 className="text-3xl font-black mt-3">
Low
</h2>


</div>


<div className="bg-yellow-100 p-3 rounded-xl">

<Lucide.ShieldCheck className="text-yellow-600"/>

</div>


</div>


<p className="text-yellow-600 text-sm mt-4">
PAR 30: 2.1%
</p>


</div>


</div>






<div className="grid grid-cols-3 gap-6">





{/* PORTFOLIO */}

<div className="card p-6 col-span-2">


<div className="flex justify-between mb-6">

<h2 className="font-black text-xl">
Portfolio Performance
</h2>


<span className="text-blue-600 text-sm font-bold">
This Year
</span>


</div>



<div className="grid grid-cols-3 gap-5">


<div className="bg-blue-50 rounded-2xl p-5">

<p className="text-slate-500">
Disbursed
</p>

<h3 className="text-2xl font-black mt-2">
UGX 5.8B
</h3>

</div>




<div className="bg-green-50 rounded-2xl p-5">

<p className="text-slate-500">
Recovered
</p>

<h3 className="text-2xl font-black mt-2">
UGX 4.9B
</h3>

</div>




<div className="bg-red-50 rounded-2xl p-5">

<p className="text-slate-500">
Outstanding
</p>

<h3 className="text-2xl font-black mt-2">
UGX 900M
</h3>

</div>


</div>



</div>







{/* QUICK ACTIONS */}


<div className="card p-6">


<h2 className="font-black text-xl mb-5">
Quick Actions
</h2>



<div className="space-y-3">


<button className="w-full flex items-center gap-3 bg-blue-600 text-white p-4 rounded-xl font-bold">

<Lucide.UserPlus/>

Register Borrower

</button>



<button className="w-full flex items-center gap-3 border p-4 rounded-xl font-bold">

<Lucide.HandCoins/>

Create Loan

</button>



<button className="w-full flex items-center gap-3 border p-4 rounded-xl font-bold">

<Lucide.BarChart3/>

Reports

</button>


</div>


</div>




</div>







{/* BOTTOM SECTION */}


<div className="grid grid-cols-2 gap-6 mt-6">


<div className="card p-6">


<h2 className="font-black text-xl mb-5">
Branch Performance
</h2>


<div className="space-y-4">


{[
["Kampala Main","UGX 890M"],
["Ntinda","UGX 560M"],
["Mbarara","UGX 430M"]
].map((x)=>(

<div className="flex justify-between border-b pb-3" key={x[0]}>

<span>{x[0]}</span>

<strong>{x[1]}</strong>

</div>

))}


</div>


</div>






<div className="card p-6">


<h2 className="font-black text-xl mb-5">
Recent Activity
</h2>



<div className="space-y-4">


<p>
<span className="font-bold">
John Doe
</span>
 received a new loan
</p>


<p>
Loan repayment received from
<span className="font-bold">
 Sarah
</span>
</p>



<p>
New borrower registered
</p>


</div>


</div>



</div>




</div>


</div>

);


};
