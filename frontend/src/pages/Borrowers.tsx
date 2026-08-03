import { useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";


export const Borrowers = () => {

  const [showModal,setShowModal] = useState(false);
  const [step,setStep] = useState(1);

  const [borrowers,setBorrowers] = useState<any[]>([]);

  const [form,setForm] = useState<any>({
    firstName:"",
    middleName:"",
    lastName:"",
    gender:"",
    dob:"",
    phone:"",
    email:"",
    idNo:"",
    address:"",
    employer:"",
    occupation:"",
    income:"",
    guarantorName:"",
    guarantorPhone:"",
    guarantorRelationship:"",
    nextOfKin:"",
    documents:[]
  });


  const update = (key:string,value:any)=>{
    setForm({...form,[key]:value});
  };


  const saveBorrower = ()=>{

    setBorrowers([
      ...borrowers,
      {
        ...form,
        id:"BRW-"+Date.now(),
        status:"Active"
      }
    ]);

    setShowModal(false);
    setStep(1);

  };


return (

<div className="flex h-screen bg-slate-50">

<Sidebar/>


<div className="flex-1 p-8 overflow-y-auto">


<div className="flex justify-between items-center mb-8">

<div>
<h1 className="text-3xl font-black text-slate-800">
Borrowers
</h1>

<p className="text-slate-500">
Manage borrower profiles and lending relationships
</p>

</div>


<button
onClick={()=>setShowModal(true)}
className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex gap-2 items-center"
>
<Lucide.Plus size={18}/>
New Borrower
</button>


</div>



<div className="bg-white rounded-3xl shadow p-6">

<table className="w-full">

<thead>

<tr className="text-left text-xs text-slate-400 uppercase">

<th>Name</th>
<th>Gender</th>
<th>Phone</th>
<th>ID Number</th>
<th>Employer</th>
<th>Income</th>
<th>Guarantor</th>
<th>Status</th>

</tr>

</thead>


<tbody>


{borrowers.map((b)=>(

<tr key={b.id} className="border-t">

<td className="py-4">
{b.firstName} {b.lastName}
</td>

<td>{b.gender}</td>

<td>{b.phone}</td>

<td>{b.idNo}</td>

<td>{b.employer}</td>

<td>{b.income}</td>

<td>{b.guarantorName}</td>

<td>

<span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">

{b.status}

</span>

</td>


</tr>

))}


</tbody>


</table>

</div>





{showModal && (

<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">


<div className="bg-white w-[900px] max-h-[90vh] overflow-y-auto rounded-3xl p-8">


<div className="flex justify-between mb-8">

<button
onClick={()=>{
setShowModal(false);
setStep(1)
}}
className="text-white bg-blue-600 rounded-full p-2"
>

<Lucide.ArrowLeft size={20}/>

</button>


<h2 className="text-2xl font-black">
New Borrower Registration
</h2>


</div>




<div className="flex justify-between mb-8">

{[
"Personal Information",
"Documentation",
"Guarantor & Next Kin",
"Preview"
].map((x,i)=>(

<div className="text-center flex-1" key={x}>

<div className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center ${
step>=i+1?"bg-blue-600 text-white":"bg-slate-200"
}`}>

{i+1}

</div>

<p className="text-xs mt-2">
{x}
</p>

</div>

))}


</div>





{step===1 && (

<div className="space-y-4">


<div className="grid grid-cols-3 gap-4">

<input className="input" placeholder="First Name"
onChange={e=>update("firstName",e.target.value)}
/>

<input className="input" placeholder="Middle Name"
/>

<input className="input" placeholder="Last Name"
onChange={e=>update("lastName",e.target.value)}
/>

</div>


<div className="grid grid-cols-2 gap-4">

<input className="input" placeholder="Gender"
onChange={e=>update("gender",e.target.value)}
/>

<input className="input" placeholder="Date of Birth"
/>

</div>


<input className="input" placeholder="Phone"
onChange={e=>update("phone",e.target.value)}
/>


<input className="input" placeholder="National ID / Passport"
onChange={e=>update("idNo",e.target.value)}
/>


<input className="input" placeholder="Residential Address"
onChange={e=>update("address",e.target.value)}
/>


<hr/>


<h3 className="font-bold">
Employment Information
</h3>


<input className="input" placeholder="Employer"
onChange={e=>update("employer",e.target.value)}
/>


<input className="input" placeholder="Occupation"
onChange={e=>update("occupation",e.target.value)}
/>


<input className="input" placeholder="Monthly Income"
onChange={e=>update("income",e.target.value)}
/>



<button
onClick={()=>setStep(2)}
className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold"
>
Continue
</button>


</div>

)}




{step===2 && (

<div className="space-y-6">

<h3 className="font-bold">
Upload Documents
</h3>


<input
type="file"
multiple
className="border p-4 rounded-xl w-full"
/>



<button
onClick={()=>setStep(3)}
className="bg-blue-600 text-white px-6 py-3 rounded-xl"
>
Continue
</button>


</div>

)}




{step===3 && (

<div className="space-y-4">


<input className="input"
placeholder="Guarantor Name"
onChange={e=>update("guarantorName",e.target.value)}
/>


<input className="input"
placeholder="Guarantor Phone"
onChange={e=>update("guarantorPhone",e.target.value)}
/>


<input className="input"
placeholder="Relationship"
onChange={e=>update("guarantorRelationship",e.target.value)}
/>


<input className="input"
placeholder="Next of Kin"
/>



<button
onClick={()=>setStep(4)}
className="bg-blue-600 text-white px-6 py-3 rounded-xl"
>
Preview
</button>


</div>

)}




{step===4 && (

<div>


<div className="bg-slate-50 rounded-2xl p-6 space-y-3">

<p>Name: {form.firstName} {form.lastName}</p>
<p>Phone: {form.phone}</p>
<p>ID: {form.idNo}</p>
<p>Employer: {form.employer}</p>
<p>Guarantor: {form.guarantorName}</p>


</div>



<button

onClick={saveBorrower}

className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-bold"

>

Submit Borrower

</button>


</div>

)}



</div>


</div>

)}


</div>

</div>


);

};
