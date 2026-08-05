import { useState, useEffect } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";


export const Applications = () => {


  const [showModal,setShowModal] = useState(false);


  const [applications,setApplications] = useState(()=>{

    const saved = localStorage.getItem("loan-applications");

    return saved ? JSON.parse(saved) : [
      {
        id:"APP-001",
        borrower:"John Doe",
        phone:"+256700000000",
        type:"Individual",
        amount:"500000",
        purpose:"Business Expansion",
        term:"12 Months",
        score:720,
        status:"Pending",
        date:"03 Aug 2026"
      }
    ];

  });



  useEffect(()=>{

    localStorage.setItem(
      "loan-applications",
      JSON.stringify(applications)
    );

  },[applications]);




  const [form,setForm]=useState({

    borrower:"",
    phone:"",
    type:"Individual",
    amount:"",
    purpose:"",
    term:"",
    frequency:"Monthly",
    currency:""

  });



  const pending = applications.filter(
    (a:any)=>a.status==="Pending"
  ).length;



  const approved = applications.filter(
    (a:any)=>a.status==="Approved"
  ).length;



  const rejected = applications.filter(
    (a:any)=>a.status==="Rejected"
  ).length;

  const [borrowers,setBorrowers] = useState<any[]>([]);
  const [borrowerSearch,setBorrowerSearch] = useState("");
  const [selectedBorrower,setSelectedBorrower] = useState<any>(null);


  useEffect(()=>{

    const saved = localStorage.getItem("borrowers");

    if(saved){
      setBorrowers(JSON.parse(saved));
    }

  },[]);



  const filteredBorrowers = borrowers.filter((b:any)=>

  `${b.name} ${b.phone} ${b.idNo}`
  .toLowerCase()
  .includes(borrowerSearch.toLowerCase())

  );



  return (

<div className="flex h-screen bg-slate-50 text-slate-900">


<Sidebar />



<div className="flex-1 overflow-y-auto p-6">



{/* HEADER */}


<div className="flex justify-between items-center mb-8">


<div>

<h1 className="text-3xl font-black">
Loan Applications
</h1>


<p className="text-slate-500 mt-1">
Review, approve and manage borrower loan requests
</p>


</div>



<button

onClick={()=>setShowModal(true)}

className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg"

>

<Lucide.Plus size={18}/>

New Application

</button>


</div>





{/* SUMMARY CARDS */}


<div className="grid grid-cols-5 gap-5 mb-8">



<div className="bg-white rounded-3xl border p-5">

<p className="text-xs uppercase text-slate-500 font-bold">
Total Applications
</p>

<h2 className="text-4xl font-black mt-3">
{applications.length}
</h2>

</div>




<div className="bg-white rounded-3xl border p-5">

<p className="text-xs uppercase text-slate-500 font-bold">
Pending Review
</p>

<h2 className="text-4xl font-black mt-3 text-amber-500">
{pending}
</h2>

</div>





<div className="bg-white rounded-3xl border p-5">

<p className="text-xs uppercase text-slate-500 font-bold">
Approved
</p>

<h2 className="text-4xl font-black mt-3 text-green-600">
{approved}
</h2>

</div>





<div className="bg-white rounded-3xl border p-5">

<p className="text-xs uppercase text-slate-500 font-bold">
Rejected
</p>

<h2 className="text-4xl font-black mt-3 text-red-500">
{rejected}
</h2>

</div>





<div className="bg-white rounded-3xl border p-5">

<p className="text-xs uppercase text-slate-500 font-bold">
Requested Amount
</p>

<h2 className="text-3xl font-black mt-3 text-blue-600">
0
</h2>

</div>



</div>





{/* APPLICATION TABLE */}


<div className="bg-white rounded-3xl border shadow-sm overflow-hidden">


<div className="px-6 py-5 border-b flex items-center justify-between">


<div>

<h2 className="text-xl font-black">
Loan Applications
</h2>

<p className="text-sm text-slate-500">
Manage borrower requests and approval workflow
</p>

</div>


<Lucide.FileText className="text-blue-600"/>


</div>




<table className="w-full">


<thead>


<tr className="text-xs uppercase text-slate-400 border-b">


<th className="p-5 text-left">
Application ID
</th>


<th className="p-5 text-left">
Borrower
</th>


<th className="p-5 text-left">
Type
</th>


<th className="p-5 text-left">
Amount
</th>


<th className="p-5 text-left">
Purpose
</th>


<th className="p-5 text-left">
Credit Score
</th>


<th className="p-5 text-left">
Status
</th>


<th className="p-5 text-left">
Action
</th>


</tr>


</thead>



<tbody>


{applications.map((app:any)=>(


<tr
key={app.id}
className="border-b hover:bg-slate-50 transition"
>


<td className="p-5 font-mono text-sm">
{app.id}
</td>



<td className="p-5">


<div className="font-bold text-blue-600">
{app.borrower}
</div>


<div className="text-xs text-slate-500">
{app.phone}
</div>


</td>




<td className="p-5">
{app.type}
</td>



<td className="p-5 font-bold">

{app.amount}

</td>




<td className="p-5">
{app.purpose}
</td>




<td className="p-5">


<span className="font-bold text-green-600">

{app.score}

</span>


</td>




<td className="p-5">


<span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">

{app.status}

</span>


</td>




<td className="p-5">


<button

className="text-blue-600 font-bold text-sm flex items-center gap-1"

>

<Lucide.Eye size={16}/>

Review

</button>


</td>



</tr>


))}



</tbody>


</table>



</div>


{showModal && (

<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">


<div className="bg-white rounded-3xl w-[650px] p-8 shadow-2xl">


<div className="flex justify-between items-center mb-6">


<div>

<h2 className="text-2xl font-black">
New Loan Application
</h2>

<p className="text-sm text-slate-500">
Create borrower loan request
</p>

</div>


<button
onClick={()=>setShowModal(false)}
className="p-2 hover:bg-slate-100 rounded-full"
>

<Lucide.X/>

</button>


</div>




{/* STEPPER */}

<div className="flex justify-between mb-8">


{[
"Borrower",
"Loan Details",
"Repayment",
"Documents",
"Review"
].map((step,index)=>(


<div key={step} className="flex flex-col items-center">


<div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">

{index+1}

</div>


<span className="text-xs mt-2 text-slate-500">

{step}

</span>


</div>


))}


</div>





{/* STEP 1 */}

<div className="space-y-4">


<h3 className="font-black text-lg">
Borrower Information
</h3>



<div className="relative">

<input

value={borrowerSearch}

placeholder="Search borrower name, phone or ID"

className="input"

onChange={(e)=>{

setBorrowerSearch(e.target.value);

setSelectedBorrower(null);

}}

/>


{borrowerSearch && !selectedBorrower && (

<div className="absolute z-50 w-full bg-white border rounded-xl shadow-xl mt-2 max-h-60 overflow-y-auto">


{
filteredBorrowers.length > 0 ? (

filteredBorrowers.map((b:any)=>(


<button

key={b.id}

type="button"

onClick={()=>{

setSelectedBorrower(b);

setBorrowerSearch(b.name);

setForm({

...form,

borrower:b.name,

phone:b.phone

});

}}

className="w-full text-left p-4 hover:bg-blue-50 border-b"

>


<p className="font-bold text-slate-900">

{b.name}

</p>


<p className="text-sm text-slate-500">

{b.phone} • {b.idNo}

</p>


</button>


))

):(


<div className="p-4 text-slate-500">

No borrower found

</div>


)

}


</div>

)}


</div>



<input

placeholder="Phone Number"

className="input"

onChange={
e=>setForm({
...form,
phone:e.target.value
})
}

/>



</div>





<div className="flex justify-end gap-3 mt-8">


<button

onClick={()=>setShowModal(false)}

className="px-6 py-3 rounded-xl font-bold text-slate-500"

>

Cancel

</button>



<button

className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold"

>

Next

</button>


</div>



</div>


</div>

)}

</div>

</div>

);
}

