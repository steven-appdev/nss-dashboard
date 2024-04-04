import axios from "axios";
import { useEffect, useState } from "react";
import { ICurrentData } from "../interfaces";
import IntegrateModal from "./integratemodal";

interface Props {
   seed: number
   onModalClose?:(isClosed:number) => void
}

export default function IntegrateList({seed, onModalClose}:Props) {
   
   const api = axios.create({
      baseURL: "https://w20003691.nuwebspace.co.uk/api/access",
   });

   const [current, setCurrent] = useState<ICurrentData[]>([]);
   const [selectedYear, setSelectedYear] = useState<string>("");
   const [showModale, setShowModale] = useState<boolean>(false);

   useEffect(() => {
      if(!showModale){
         const fetchCurrent = async () => {
            let response = await api.get<ICurrentData[]>("?current");
            setCurrent(response.data);
         };
         fetchCurrent();
         if(onModalClose){
            onModalClose(Math.random());
         }
      }
   }, [seed, showModale]);

   const handleOnViewClick = (event: React.MouseEvent<HTMLElement>) => {
      setSelectedYear(event.currentTarget.id)
      setShowModale(true)
   };

   return (
      <div className="flex-1 mx-10 mt-5 mb-6 overflow-scroll overflow-x-hidden border rounded-md">
         <table className="text-md w-full">
            <thead>
               <tr className="bg-slate-300 sticky top-0">
                  <th className="border-b font-medium text-slate-800 py-3 w-[25%]">
                     Year
                  </th>
                  <th className="border-b font-medium text-slate-800 py-3">
                     Number of Available Data (Rows)
                  </th>
                  <th className="border-b font-medium text-slate-800 py-3 w-[25%]">
                     Number of Subjects Available
                  </th>
                  <th className="border-b font-medium text-slate-800 py-3 w-[25%]">
                     Actions
                  </th>
               </tr>
            </thead>
            <tbody>
               {current?.map((item) => (
                  <tr className="even:bg-slate-100 transition-colors">
                     <td className="p-4 text-slate-800">{item.year}</td>
                     <td className="p-4 text-slate-800">{item.available}</td>
                     <td className="p-4 text-slate-800">{item.subject}</td>
                     <td>
                        <button
                           type="button"
                           name={String(item.year)}
                           id={String(item.year)}
                           className="w-[50%] py-1 !bg-blue-500 hover:!bg-blue-600 transition-colors text-white font-semibold rounded-sm"
                           onClick={handleOnViewClick}
                        >
                           Manage
                        </button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
         <IntegrateModal display={showModale} onClose={setShowModale} selectedYear={selectedYear}/>
      </div>
   );
}
