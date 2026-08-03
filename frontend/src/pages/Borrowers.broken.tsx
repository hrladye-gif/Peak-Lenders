import { useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";

type Borrower = {
  id: string;
  name: string;
  phone: string;
  nationalId: string;
  status: string;
};

export const Borrowers = () => {

  const [showModal,setShowModal] = useState(false);
  const [step,setStep] = useState(1);

  const [borrowers,setBorrowers] = useState<Borrower[]>([]);

  const [form,setForm] = useState<any>({
    firstName:"",
    middleName:"",
    lastName:"",
    gender:"",
    dob:"",
    maritalStatus:"",
    nationality:"",
    phone:"",
    email:"",
    address:"",
    occupation:"",
    employer:"",
    income:"",
    nationalId:"",
    guarantorName:"",
    guarantorPhone:"",
    guarantorRelationship:"",
    nextOfKin:"",
    documents:[]
  });


  const updateForm=(key:string,value:any)=>{
    setForm({
      ...form,
      [key]:value
    });
  };


  const uploadDocument=(e:any)=>{
    const files=[...e.target.files];

    setForm({
      ...form,
      documents:[
        ...form.documents,
        ...files.map((file:any)=>({
          name:file.name,
          size:file.size
        }))
      ]
    });
  };


  const submitBorrower=()=>{

    const borrower={
      id:"BRW-"+Date.now(),
      name:
      `${form.firstName} ${form.lastName}`,
      phone:form.phone,
      nationalId:form.nationalId,
      status:"Active"
    };


    setBorrowers([
      ...borrowers,
      borrower
    ]);

    setShowModal(false);
    setStep(1);

  };



return (

<div className="flex h-screen bg-slate-50">

<Sidebar/>


<div className="flex-1 p-8 overflow-y-auto">


<header className="flex justify-between items-center mb-8">

<div>
<h1 className="text-3xl font-black text-slate-900">
Borrowers
</h1>

<p className="text-slate-500">
Manage borrower profiles and lending relationships
</p>

</div>


<button
onClick={()=>setShowModal(true)}
className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex gap-2 items-center"
>

<Lucide.Plus size={20}/>
New Borrower

</button>


</header>



<div className="grid grid-cols-4 gap-6 mb-8">


<div className="bg-white rounded-3xl p-6 shadow">
<p className="text-slate-500">
Total Borrowers
</p>

<h2 className="text-4xl font-black">
{borrowers.length}
</h2>

</div>



<div className="bg-white rounded-3xl p-6 shadow">
<p className="text-slate-500">
Active Loans
</p>

<h2 className="text-4xl font-black">
0
</h2>

</div>



<div className="bg-white rounded-3xl p-6 shadow">
<p className="text-slate-500">
Women Borrowers
</p>

<h2 className="text-4xl font-black">
0%
</h2>

</div>



<div className="bg-white rounded-3xl p-6 shadow">
<p className="text-slate-500">
Portfolio
</p>

<h2 className="text-4xl font-black">
0
</h2>

</div>


</div>




<div className="bg-white rounded-3xl shadow p-6 overflow-x-auto">

<table className="w-full text-sm">

<thead>

<tr className="text-left text-slate-400 uppercase text-xs">

<th className="pb-4">Name</th>
<th>Gender</th>
<th>DOB</th>
<th>Nationality</th>
<th>Phone</th>
<th>Email</th>
<th>National ID</th>
<th>Occupation</th>
<th>Employer</th>
<th>Income</th>
<th>Guarantor</th>
<th>Status</th>

</tr>

</thead>


<tbody>


{
borrowers.map((b:any)=>(

<tr key={b.id} className="border-t">


<td className="py-4 font-bold">
{b.name}
</td>


<td>
{b.gender || "-"}
</td>


<td>
{b.dob || "-"}
</td>


<td>
{b.nationality || "-"}
</td>


<td>
{b.phone}
</td>


<td>
{b.email || "-"}
</td>


<td>
{b.nationalId}
</td>


<td>
{b.occupation || "-"}
</td>


<td>
{b.employer || "-"}
</td>


<td>
{b.income || "-"}
</td>


<td>
{b.guarantorName || "-"}
</td>


<td>

<span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700">

{b.status}

</span>

</td>


</tr>

))

}


</tbody>

</table>

</div>


{showModal && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">


<div className="bg-white rounded-3xl w-[950px] max-h-[90vh] overflow-y-auto p-8">


<div className="flex justify-between items-center mb-6">

<button

onClick={()=>{
setShowModal(false);
setStep(1);
}}

className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700"

>

<Lucide.ArrowLeft size={22}/>

</button>


<h2 className="text-xl font-black text-slate-800">
New Borrower Registration
</h2>


<div></div>

</div>



<div className="flex justify-between mb-10">


{
[
"Personal Information",
"Documentation",
"Guarantor & Next of Kin",
"Preview"
].map((x,i)=>(


<div className="flex-1 text-center" key={x}>


<div
className={`
mx-auto w-12 h-12 rounded-full flex items-center justify-center font-bold
${step>=i+1?"bg-blue-600 text-white":"bg-slate-200"}
`}
>

{i+1}

</div>


<p className="text-xs mt-2">
{x}
</p>


</div>


))
}


</div>



<h2 className="text-2xl font-black mb-6">

{
step===1 &&
"Personal Information"
}

{
step===2 &&
"Upload Documentation"
}

{
step===3 &&
"Guarantor and Next of Kin"
}

{
step===4 &&
"Review and Submit"
}


</h2>



        {step===1 && (

        <div className="space-y-5">


        <div className="grid grid-cols-3 gap-4">

        <input
        className="p-3 border rounded-xl"
        placeholder="First Name"
        value={form.firstName}
        onChange={e=>updateForm("firstName",e.target.value)}
        />


        <input
        className="p-3 border rounded-xl"
        placeholder="Middle Name"
        value={form.middleName}
        onChange={e=>updateForm("middleName",e.target.value)}
        />


        <input
        className="p-3 border rounded-xl"
        placeholder="Last Name"
        value={form.lastName}
        onChange={e=>updateForm("lastName",e.target.value)}
        />

        </div>




        <div className="grid grid-cols-3 gap-4">


        <select
        className="p-3 border rounded-xl"
        onChange={e=>updateForm("gender",e.target.value)}
        >

        <option>
        Gender
        </option>

        <option>
        Male
        </option>

        <option>
        Female
        </option>

        </select>



        <input
        type="date"
        className="p-3 border rounded-xl"
        onChange={e=>updateForm("dob",e.target.value)}
        />



        <select
        className="p-3 border rounded-xl"
        onChange={e=>updateForm("maritalStatus",e.target.value)}
        >

        <option>
        Marital Status
        </option>

        <option>
        Single
        </option>

        <option>
        Married
        </option>

        <option>
        Divorced
        </option>

        <option>
        Widowed
        </option>


        </select>


        </div>




        <div className="grid grid-cols-2 gap-4">


        <select
        className="p-3 border rounded-xl"
        onChange={e=>updateForm("nationality",e.target.value)}
        >

        <option>
        Nationality
        </option>

        <option>
        Ugandan
        </option>

        <option>
        Kenyan
        </option>

        <option>
        Tanzanian
        </option>

        <option>
        Rwandan
        </option>

        <option>
        Burundian
        </option>


        </select>




        <input
        className="p-3 border rounded-xl"
        placeholder="National ID / Passport Number"
        value={form.nationalId}
        onChange={e=>updateForm("nationalId",e.target.value)}
        />


        </div>





        <div className="grid grid-cols-2 gap-4">


        <input
        className="p-3 border rounded-xl"
        placeholder="Phone Number"
        value={form.phone}
        onChange={e=>updateForm("phone",e.target.value)}
        />


        <input
        className="p-3 border rounded-xl"
        placeholder="Email Address"
        value={form.email}
        onChange={e=>updateForm("email",e.target.value)}
        />

        </div>




        <textarea

        className="w-full p-3 border rounded-xl"

        placeholder="Physical Address"

        value={form.address}

        onChange={e=>updateForm("address",e.target.value)}

        />






        <div className="border-t pt-5">


        <h3 className="font-bold text-lg mb-4">

        Employment Information

        </h3>



        <div className="grid grid-cols-2 gap-4">


        <input
        className="p-3 border rounded-xl"
        placeholder="Employer / Business Name"
        onChange={e=>updateForm("employer",e.target.value)}
        />



        <input
        className="p-3 border rounded-xl"
        placeholder="Occupation / Business Type"
        onChange={e=>updateForm("occupation",e.target.value)}
        />


        </div>



        <input
        className="w-full mt-4 p-3 border rounded-xl"
        placeholder="Monthly Income"
        onChange={e=>updateForm("income",e.target.value)}
        />



        </div>





        <button

        onClick={()=>setStep(2)}

        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold"

        >

        Continue To Documentation →

        </button>


        </div>

        )}






        {step===2 && (


        <div className="space-y-6">


        <div>

        <h3 className="font-bold text-lg">

        Borrower Documents

        </h3>


        <p className="text-sm text-slate-500">

        Upload National ID, passport, photos and supporting documents.

        </p>


        </div>





        <label

        className="border-2 border-dashed rounded-2xl p-8 flex flex-col items-center cursor-pointer hover:border-blue-600"

        >

        <Lucide.Upload size={40} className="text-blue-600"/>


        <p className="font-bold mt-3">

        Upload Documents

        </p>


        <p className="text-sm text-slate-500">

        PDF, JPG, PNG accepted

        </p>


        <input

        type="file"

        multiple

        className="hidden"

        onChange={uploadDocument}

        />

        </label>






        <div className="space-y-3">


        {
        form.documents.map((doc:any,index:number)=>(


        <div

        key={index}

        className="bg-slate-50 p-4 rounded-xl flex justify-between"

        >

        <span>

        {doc.name}

        </span>


        <Lucide.FileCheck
        className="text-green-600"
        />

        </div>


        ))
        }


        </div>





        <div className="flex justify-between">


        <button

        onClick={()=>setStep(1)}

        className="px-6 py-3 border rounded-xl"

        >

        ← Back

        </button>



        <button

        onClick={()=>setStep(3)}

        className="px-6 py-3 bg-blue-600 text-white rounded-xl"

        >

        Continue →

        </button>


        </div>



        </div>


        )}





        {step===3 && (


        <div className="space-y-6">


        <div>

        <h3 className="text-lg font-bold">

        Guarantor Information

        </h3>

        <p className="text-sm text-slate-500">

        Every borrower should have at least one guarantor.

        </p>

        </div>




        <div className="grid grid-cols-2 gap-4">


        <input

        className="p-3 border rounded-xl"

        placeholder="Guarantor Full Name"

        onChange={e=>updateForm("guarantorName",e.target.value)}

        />



        <input

        className="p-3 border rounded-xl"

        placeholder="Relationship"

        onChange={e=>updateForm("guarantorRelationship",e.target.value)}

        />


        </div>




        <div className="grid grid-cols-2 gap-4">


        <input

        className="p-3 border rounded-xl"

        placeholder="Guarantor Phone"

        onChange={e=>updateForm("guarantorPhone",e.target.value)}

        />



        <input

        className="p-3 border rounded-xl"

        placeholder="Guarantor National ID"

        />

        </div>





        <textarea

        className="w-full p-3 border rounded-xl"

        placeholder="Guarantor Address"

        />







        <div className="border-t pt-6">


        <h3 className="text-lg font-bold">

        Next Of Kin

        </h3>


        <p className="text-sm text-slate-500 mb-4">

        Emergency contact person.

        </p>




        <div className="grid grid-cols-2 gap-4">


        <input

        className="p-3 border rounded-xl"

        placeholder="Next Of Kin Name"

        onChange={e=>updateForm("nextOfKin",e.target.value)}

        />


        <input

        className="p-3 border rounded-xl"

        placeholder="Relationship"

        />


        </div>



        <input

        className="w-full mt-4 p-3 border rounded-xl"

        placeholder="Next Of Kin Phone"

        />



        </div>






        <div className="flex justify-between">


        <button

        onClick={()=>setStep(2)}

        className="px-6 py-3 border rounded-xl"

        >

        ← Back

        </button>




        <button

        onClick={()=>setStep(4)}

        className="px-6 py-3 bg-blue-600 text-white rounded-xl"

        >

        Preview →

        </button>


        </div>



        </div>


        )}









        {step===4 && (


        <div className="space-y-6">



        <div className="bg-slate-50 rounded-2xl p-6">


        <h3 className="font-black text-xl mb-4">

        Borrower Preview

        </h3>




        <div className="grid grid-cols-2 gap-4 text-sm">


        <p>
        <b>Name:</b>
        <br/>
        {form.firstName} {form.middleName} {form.lastName}
        </p>



        <p>
        <b>Gender:</b>
        <br/>
        {form.gender}
        </p>



        <p>
        <b>Phone:</b>
        <br/>
        {form.phone}
        </p>



        <p>
        <b>National ID:</b>
        <br/>
        {form.nationalId}
        </p>



        <p>
        <b>Employer:</b>
        <br/>
        {form.employer}
        </p>



        <p>
        <b>Income:</b>
        <br/>
        {form.income}
        </p>



        <p>
        <b>Guarantor:</b>
        <br/>
        {form.guarantorName}
        </p>



        <p>
        <b>Next Of Kin:</b>
        <br/>
        {form.nextOfKin}
        </p>


        </div>


        </div>







        <div className="bg-blue-50 rounded-2xl p-5">


        <h4 className="font-bold mb-3">

        Uploaded Documents

        </h4>



        {
        form.documents.map((doc:any,index:number)=>(


        <div

        key={index}

        className="flex items-center gap-3"

        >

        <Lucide.FileText size={18}/>

        {doc.name}


        </div>


        ))
        }



        </div>







        <div className="flex justify-between">


        <button

        onClick={()=>setStep(3)}

        className="px-6 py-3 border rounded-xl"

        >

        ← Back

        </button>





        <button

        onClick={submitBorrower}

        className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold"

        >

        Submit Borrower

        </button>


        </div>




        </div>


        )}





</div>

</div>




);

};

