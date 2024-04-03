import { useState } from "react";
import CompareForm from "../components/compareform";
import CompareLine from "../components/compareline";
import Navbar from "../components/navbar";
import { ICompare } from "../interfaces";

export default function Comparative() {
   const [result, setResult] = useState<ICompare>({
      provider_x: "null",
      year_x: 0,
      provider_y: "null",
      year_y: 0,
      result: [],
   });

   return (
      <div className="App flex flex-col h-screen">
         <Navbar />
         <div className="flex flex-wrap bg-slate-600 pt-3 pb-6 justify-center">
            <CompareForm onResultUpdate={setResult} />
         </div>
         <div className="flex-1 overflow-hidden mx-5">
            <CompareLine comparison={result} />
         </div>
      </div>
   );
}
