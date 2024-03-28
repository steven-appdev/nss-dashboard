import axios from "axios";
import { useEffect, useState } from "react";
import { IDataFilter, IOption, IPositive, IPositiveResult } from "../interfaces";
import "../tail.css";

export default function Positive({
   option,
   onClick,
}: IOption) {
   const api = axios.create({
      baseURL: "https://w20003691.nuwebspace.co.uk/api/access",
   });

   const [data, setData] = useState<IPositiveResult[]>();
   const [selectedQuestion, setSelectedQuestion] = useState<string>("Q01");

   useEffect(() => {
      const fetchPositives = async () => {
         let request =
         "?positives&population=" +
         option?.popdrop +
         "&mode=" +
         option?.modedrop +
         "&level=" +
         option?.leveldrop +
         "&year=" +
         option?.yeardrop +
         "&subject=" +
         option?.subdrop;
         let response = await api.get<IPositive>(request);
         if(response.data){
            setData(
               option?.qdrop === "all"
                  ? response.data.results
                  : option?.qdrop?.charAt(0) === "Q" ? response.data.results.filter((item) => item.qid ===  option?.qdrop) : response.data.results.filter((item) => item.tid === option?.qdrop)
            );
         }
         else{
            setData([]);
         }
      };
      fetchPositives();
   }, [selectedQuestion,  option]);

   useEffect(() => {
      if (onClick) {
         onClick(selectedQuestion);
      }
   }, [selectedQuestion]);

   function getColorCode(val: number) {
      if (val >= 75 && val <= 100) {
         return "bg-green-400 text-green-800";
      } else if (val >= 50 && val <= 74) {
         return "bg-yellow-300 text-yellow-700";
      } else if (val >= 24 && val <= 49) {
         return "bg-red-200 text-red-500";
      } else if (val >= 0 && val <= 23) {
         return "bg-red-400 text-red-800";
      }
   }

   const handleClick = (event: React.MouseEvent<HTMLTableRowElement>) => {
      setSelectedQuestion(event.currentTarget.id);
      console.log(event.currentTarget.id)
   };

   return (
      <div className="flex-1 mx-10 mt-5 mb-6 overflow-scroll overflow-x-hidden border rounded-md">
         <table className="text-md w-full">
            <thead>
               <tr className="bg-slate-300 sticky top-0">
                  <th className="border-b font-medium text-slate-800 py-3 w-[8%]">
                     QID
                  </th>
                  <th className="border-b font-medium text-slate-800 py-3">
                     Question
                  </th>
                  <th className="border-b font-medium text-slate-800 py-3 w-[10%]">
                     NSS Benchmark<br></br>(%)
                  </th>
                  <th className="border-b font-medium text-slate-800 py-3 w-[10%]">
                     Positivity Measure<br></br>(%)
                  </th>
                  <th className="border-b font-medium text-slate-800 py-3 w-[10%]">
                     Times Rank
                  </th>
                  <th className="border-b font-medium text-slate-800 py-3 w-[10%]">
                     Times Rank<br></br>(%)
                  </th>
               </tr>
            </thead>
            <tbody>
               {data?.map((item) => (
                  <tr
                     className="even:bg-slate-100 hover:bg-gray-200 transition-colors"
                     id={item.qid+"_"+option?.yeardrop+"_"+option?.subdrop+"_"+option?.popdrop+"_"+option?.modedrop+"_"+option?.leveldrop}
                     onClick={handleClick}
                  >
                     <td className="p-4 text-slate-800">{item.qid}</td>
                     <td className="p-4 text-slate-800">{item.qtext}</td>
                     <td className="p-4 text-slate-800">{item.benchmark}</td>
                     <td className="p-4 text-slate-800">{item.positivity}</td>
                     <td>
                        <span
                           className={`px-3 py-1 inline-block w-20 rounded-full ${getColorCode(
                              item.rank_percentage
                           )}`}
                        >
                           {item.rank}
                        </span>
                     </td>
                     <td>
                        <span
                           className={`px-3 py-1 inline-block w-20 rounded-full ${getColorCode(
                              item.rank_percentage
                           )}`}
                        >
                           {item.rank_percentage}
                        </span>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
}
