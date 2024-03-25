import axios from "axios";
import { useEffect, useState } from "react";
import { IDataFilter, IPositive, IPositiveResult } from "../interfaces";
import "../tail.css";

export default function Positive({
   question,
   population,
   mode,
   level,
   onClick,
}: IDataFilter) {
   const api = axios.create({
      baseURL: "https://w20003691.nuwebspace.co.uk/api/access",
   });

   const [data, setData] = useState<IPositiveResult[]>();
   const [selectedQuestion, setSelectedQuestion] = useState<string>("Q01");

   useEffect(() => {
      const fetchPositives = async () => {
         let request =
            "?positives&population=" +
            population +
            "&mode=" +
            mode +
            "&level=" +
            level;
         let response = await api.get<IPositive>(request);
         setData(
            question === "all"
               ? response.data.results
               : question?.charAt(0) === "Q" ? response.data.results.filter((item) => item.qid === question) : response.data.results.filter((item) => item.tid === question)
               
         );
      };
      fetchPositives();
   }, [selectedQuestion, question, population, mode, level]);

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
   };

   return (
      <div className="flex-1 m-10 overflow-scroll overflow-x-hidden border rounded-md">
         <table className="text-md w-full">
            <thead>
               <tr className="bg-slate-300 sticky top-0">
                  <th className="border-b font-medium text-slate-700 py-4 w-[10%]">
                     Question ID
                  </th>
                  <th className="border-b font-medium text-slate-700 py-4">
                     Question
                  </th>
                  <th className="border-b font-medium text-slate-700 py-5 w-[15%]">
                     Number of Responses
                  </th>
                  <th className="border-b font-medium text-slate-700 py-4 w-[8%]">
                     Positivity Measure (%)
                  </th>
                  <th className="border-b font-medium text-slate-700 py-4 w-[8%]">
                     Rank
                  </th>
                  <th className="border-b font-medium text-slate-700 py-4 w-[8%]">
                     Rank (%)
                  </th>
               </tr>
            </thead>
            <tbody>
               {data?.map((item) => (
                  <tr
                     className="even:bg-slate-100 hover:bg-gray-200 transition-colors"
                     id={item.qid}
                     onClick={handleClick}
                  >
                     <td className="p-4 text-slate-600">{item.qid}</td>
                     <td className="p-4 text-slate-600">{item.qtext}</td>
                     <td className="p-4 text-slate-600">{item.resp_count}</td>
                     <td>
                        <span
                           className={`px-3 py-1 inline-block w-20 rounded-full ${getColorCode(
                              item.rank_percentage
                           )}`}
                        >
                           {item.positivity}
                        </span>
                     </td>
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
