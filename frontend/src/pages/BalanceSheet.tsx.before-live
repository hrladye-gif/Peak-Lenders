import { Sidebar } from "../components/layout/Sidebar";
import * as Lucide from "lucide-react";

export const BalanceSheet = () => {


  const assets = [
    {
      name:"Cash",
      amount:3500000
    },
    {
      name:"Bank Account",
      amount:8500000
    },
    {
      name:"Loans Receivable",
      amount:25000000
    },
    {
      name:"Office Equipment",
      amount:3000000
    }
  ];



  const liabilities = [
    {
      name:"Customer Savings",
      amount:15250000
    },
    {
      name:"Supplier Payables",
      amount:1000000
    },
    {
      name:"Other Liabilities",
      amount:500000
    }
  ];



  const equity = [
    {
      name:"Share Capital",
      amount:10000000
    },
    {
      name:"Retained Earnings",
      amount:13300000
    }
  ];



  const totalAssets = assets.reduce(
    (a,b)=>a+b.amount,0
  );


  const totalLiabilities = liabilities.reduce(
    (a,b)=>a+b.amount,0
  );


  const totalEquity = equity.reduce(
    (a,b)=>a+b.amount,0
  );


  const totalLiabilityEquity =
    totalLiabilities + totalEquity;



  return (

    <div className="flex h-screen bg-slate-50">

      <Sidebar />


      <main className="flex-1 p-8 overflow-y-auto">


        <div className="flex justify-between items-center mb-8">


          <div>

            <h1 className="text-4xl font-black">
              Balance Sheet
            </h1>

            <p className="text-slate-500">
              Financial position showing assets, liabilities and equity
            </p>

          </div>



          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
          >

            <Lucide.Download size={18}/>

            Export Report

          </button>


        </div>





        <div className="grid grid-cols-3 gap-5 mb-8">


          <div className="bg-white border rounded-2xl p-6">

            <p className="text-sm text-slate-500">
              Total Assets
            </p>

            <h2 className="text-4xl font-black text-blue-600">
              {totalAssets.toLocaleString()}
            </h2>

          </div>



          <div className="bg-white border rounded-2xl p-6">

            <p className="text-sm text-slate-500">
              Liabilities
            </p>

            <h2 className="text-4xl font-black text-red-600">
              {totalLiabilities.toLocaleString()}
            </h2>

          </div>




          <div className="bg-white border rounded-2xl p-6">

            <p className="text-sm text-slate-500">
              Equity
            </p>

            <h2 className="text-4xl font-black text-green-600">
              {totalEquity.toLocaleString()}
            </h2>

          </div>


        </div>






        <div className="grid grid-cols-2 gap-8">


          <div className="bg-white border rounded-2xl overflow-hidden">


            <div className="p-5 bg-blue-50 border-b">

              <h2 className="text-xl font-black">
                Assets
              </h2>

            </div>




            <table className="w-full">


              <tbody>


              {assets.map(asset=>(

                <tr
                  key={asset.name}
                  className="border-t"
                >

                  <td className="p-4 font-bold">
                    {asset.name}
                  </td>


                  <td className="p-4 text-right font-bold">
                    {asset.amount.toLocaleString()}
                  </td>

                </tr>

              ))}



              <tr className="border-t bg-slate-50 font-black">

                <td className="p-4">
                  Total Assets
                </td>


                <td className="p-4 text-right">
                  {totalAssets.toLocaleString()}
                </td>


              </tr>


              </tbody>


            </table>


          </div>







          <div className="bg-white border rounded-2xl overflow-hidden">


            <div className="p-5 bg-red-50 border-b">

              <h2 className="text-xl font-black">
                Liabilities & Equity
              </h2>

            </div>





            <table className="w-full">


              <tbody>


              {liabilities.map(item=>(

                <tr
                  key={item.name}
                  className="border-t"
                >

                  <td className="p-4 font-bold">
                    {item.name}
                  </td>


                  <td className="p-4 text-right font-bold">
                    {item.amount.toLocaleString()}
                  </td>

                </tr>

              ))}



              {equity.map(item=>(

                <tr
                  key={item.name}
                  className="border-t"
                >

                  <td className="p-4 font-bold">
                    {item.name}
                  </td>


                  <td className="p-4 text-right font-bold text-green-600">
                    {item.amount.toLocaleString()}
                  </td>

                </tr>

              ))}



              <tr className="border-t bg-slate-50 font-black">

                <td className="p-4">
                  Total Liabilities + Equity
                </td>


                <td className="p-4 text-right">
                  {totalLiabilityEquity.toLocaleString()}
                </td>

              </tr>


              </tbody>


            </table>


          </div>


        </div>






        <div className="mt-8 bg-white border rounded-3xl p-8">


          <h2 className="text-2xl font-black mb-3">
            Balance Check
          </h2>


          <p className={`text-xl font-black ${
            totalAssets === totalLiabilityEquity
            ? "text-green-600"
            : "text-red-600"
          }`}>

            {totalAssets === totalLiabilityEquity
            ? "✓ Balance Sheet Balanced"
            : "⚠ Balance Sheet Difference Detected"}

          </p>


        </div>



      </main>

    </div>

  );

};
