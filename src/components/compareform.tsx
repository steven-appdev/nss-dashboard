import axios from "axios";
import { useEffect, useState } from "react";
import { ICompareOption, ICompare } from "../interfaces";
import Compare from "./compare";

interface Props {
   onResultUpdate?: (compareResult: ICompare) => void;
   onUpdated?: (mode: string) => void;
}

export default function CompareForm({onResultUpdate, onUpdated}:Props) {
   const api = axios.create({
      baseURL: "https://w20003691.nuwebspace.co.uk/api/access",
   });

   const [compareX, setCompareX] = useState<ICompareOption>();
   const [compareY, setCompareY] = useState<ICompareOption>();
   const [selectedMode, setSelectedMode] = useState<string>("positivity");
   const [compareResult, setCompareResult] = useState<ICompare>({
      provider_x: "null",
      year_x: 0,
      provider_y: "null",
      year_y: 0,
      result: []
   });

   const handleOnClick = () => {
      const fetchCompare = async () => {
         let response = await api.get<ICompare>(
            "?compare&yearx=" +
            compareX?.year +
            "&providerx=" +
            compareX?.provider +
            "&subjectx=" +
            compareX?.subject +
            "&populationx=" +
            compareX?.population +
            "&modex=" +
            compareX?.mode +
            "&levelx=" +
            compareX?.level +
            "&yeary=" +
            compareY?.year +
            "&providery=" +
            compareY?.provider +
            "&subjecty=" +
            compareY?.subject +
            "&populationy=" +
            compareY?.population +
            "&modey=" +
            compareY?.mode +
            "&levely=" +
            compareY?.level
         );
         setCompareResult(response.data)
      };
      fetchCompare();
   };

   useEffect(() => {
      if(onResultUpdate && onUpdated)
      {
         onResultUpdate(compareResult)
         onUpdated(selectedMode)
      }
   }, [compareResult])

   const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedMode(event.target.value)
   }

   return (
      <div className="flex flex-col w-full px-10">
         <div className="grid grid-cols-5">
            <Compare onChange={setCompareX} />
            <div className="flex items-center justify-center">
               <h1 className="text-slate-100 font-bold text-[36px]">
                  - against -
               </h1>
            </div>
            <Compare onChange={setCompareY} />
         </div>
         <div className="flex flex-col mt-4">
            <label className="text-slate-100 font-medium text-left">
               What data are we comparing?
            </label>
            <select
               className="p-1 text-slate-950 font-normal rounded-sm"
               name="mode"
               id="mode"
               onChange={handleSelectChange}
            >
               <option value="positivity">Positivity Measure</option>
               <option value="benchmark">NSS Benchmark</option>
            </select>
         </div>
         <button
            className="mt-6 py-2 !bg-blue-500 hover:!bg-blue-600 transition-colors text-white font-bold rounded-sm shadow"
            onClick={handleOnClick}
         >
            Start Compare
         </button>
      </div>
   );
}
