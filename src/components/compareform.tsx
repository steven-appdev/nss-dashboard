import axios from "axios";
import { useState } from "react";
import { ICompareOption } from "../interfaces";
import Compare from "./compare";

export default function CompareForm() {
   const api = axios.create({
      baseURL: "https://w20003691.nuwebspace.co.uk/api/access",
   });

   const [compareX, setCompareX] = useState<ICompareOption>();
   const [compareY, setCompareY] = useState<ICompareOption>();

   return (
      <div className="flex flex-col w-full px-10">
         <div className="grid grid-cols-5">
            <Compare onChange={setCompareX}/>
            <div className="flex items-center justify-center">
               <h1 className="text-slate-100 font-bold text-[36px]">
                  - against -
               </h1>
            </div>
            <Compare onChange={setCompareY}/>
         </div>
         <button
            className="mt-8 py-2 !bg-blue-500 hover:!bg-blue-600 transition-colors text-white font-bold rounded-sm shadow"
         >
            Start Compare
         </button>
      </div>
   );
}
