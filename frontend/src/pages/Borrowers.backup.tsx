import { useEffect, useState } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import * as Lucide from 'lucide-react';

type Borrower = {
  id: string;
  name: string;
  phone: string;
  occupation: string;
  employer: string;
  loan: string;
  savings: string;
  risk: string;
  status: string;
};

export const Borrowers = () => {

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');

  const [borrowers, setBorrowers] = useState<Borrower[]>(() => {
    const data = localStorage.getItem('borrowers');
    return data ? JSON.parse(data) : [];
  });

  const [form, setForm] = useState({
    name:'',
    phone:'',
    occupation:'',
    employer:'',
    loan:'',
    savings:''
  });


  useEffect(() => {
    localStorage.setItem(
      'borrowers',
      JSON.stringify(borrowers)
    );
  },[borrowers]);


  const registerBorrower = () => {

    const borrower = {
      id:`BRW-${Date.now()}`,
      name:form.name,
      phone:form.phone,
      occupation:form.occupation,
      employer:form.employer,
      loan:form.loan,
      savings:form.savings,
      risk:'Low',
      status:'Active'
    };

    setBorrowers([
      ...borrowers,
      borrower
    ]);

    setShowModal(false);

    setForm({
      name:'',
      phone:'',
      occupation:'',
      employer:'',
      loan:'',
      savings:''
    });
  };


  const removeBorrower = (id:string)=>{
    setBorrowers(
      borrowers.filter(
        b=>b.id!==id
      )
    );
  };


  const filtered = borrowers.filter(
    b =>
      b.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );


return (

<div className="flex h-screen bg-slate-50">

<Sidebar />


<div className="flex-1 p-8 overflow-y-auto">


<header className="flex justify-between items-center mb-8">

<div>
<h1 className="text-3xl font-black">
Borrowers
</h1>

<p className="text-slate-500">
Complete borrower management center
</p>
</div>


<button
onClick={()=>setShowModal(true)}
className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex gap-2"
>
<Lucide.Plus size={20}/>
New Borrower
</button>

</header>



<div className="grid grid-cols-4 gap-5 mb-8">


<div className="card p-6">
<p className="text-slate-500">
Total Borrowers
</p>
<h2 className="text-3xl font-black">
{borrowers.length}
</h2>
</div>


<div className="card p-6">
<p className="text-slate-500">
Active Loans
</p>
<h2 className="text-3xl font-black">
{borrowers.length}
</h2>
</div>


<div className="card p-6">
<p className="text-slate-500">
Low Risk
</p>
<h2 className="text-3xl font-black text-green-600">
{borrowers.length}
</h2>
</div>


<div className="card p-6">
<p className="text-slate-500">
Portfolio Value
</p>
<h2 className="text-3xl font-black">
KES 0
</h2>
</div>


</div>



<div className="card p-6">


<div className="flex justify-between mb-6">


<div className="relative">

<Lucide.Search
className="absolute left-3 top-3 text-slate-400"
size={18}
/>

<input
placeholder="Search borrower..."
value={search}
onChange={e=>setSearch(e.target.value)}
className="pl-10 p-3 border rounded-xl w-80"
/>

</div>


</div>



<table className="w-full">

<thead>

<tr className="text-left text-slate-400 text-sm">

<th>Name</th>
<th>Contact</th>
<th>Employment</th>
<th>Loan</th>
<th>Savings</th>
<th>Risk</th>
<th>Action</th>

</tr>

</thead>


<tbody>

{filtered.map(b=>(

<tr
key={b.id}
className="border-t"
>

<td className="py-4 font-bold">
{b.name}
</td>

<td>
{b.phone}
</td>

<td>
{b.employer}
<br/>
<span className="text-xs text-slate-500">
{b.occupation}
</span>
</td>

<td>
KES {b.loan}
</td>

<td>
KES {b.savings}
</td>


<td>
<span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs">
{b.risk}
</span>
</td>


<td>

<button
onClick={()=>removeBorrower(b.id)}
className="text-red-500"
>
<Lucide.Trash2 size={18}/>
</button>

</td>


</tr>

))}

</tbody>


</table>


</div>



</div>



{showModal && (

<div className="fixed inset-0 bg-black/50 flex items-center justify-center">


<div className="bg-white rounded-3xl p-8 w-[600px]">


<h2 className="text-2xl font-black mb-6">
Register Borrower
</h2>


<div className="space-y-4">


{[
'name',
'phone',
'employer',
'occupation',
'loan',
'savings'
].map(field=>(

<input
key={field}
placeholder={field}
className="w-full p-3 border rounded-xl"
value={(form as any)[field]}
onChange={
e=>setForm({
...form,
[field]:e.target.value
})
}
/>

))}


<button
onClick={registerBorrower}
className="w-full bg-primary text-white py-3 rounded-xl font-bold"
>
Save Borrower
</button>


<button
onClick={()=>setShowModal(false)}
className="w-full border py-3 rounded-xl"
>
Cancel
</button>


</div>


</div>


</div>

)}


</div>

);

};
