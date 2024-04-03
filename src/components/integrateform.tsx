import axios from "axios";
import { useEffect, useState } from "react";
import { IYear } from "../interfaces";
import { upload } from "@testing-library/user-event/dist/upload";

export default function IntegrateForm() {
   const api = axios.create({
      baseURL: "https://w20003691.nuwebspace.co.uk/api/access",
   });

   const [status, setStatus] = useState<string>("hide");
   const [statusClass, setStatusClass] = useState<string>("hidden");
   const [statusMsg, setStatusMsg] = useState<string>("null");
   const [years, setYears] = useState<IYear[]>([]);
   const [uploadedFile, setUploadedFile] = useState<File>();
   const [selectedYear, setSelectedYear] = useState<string>();

   useEffect(() => {
      const fetchYears = async () => {
         let response = await api.get<IYear[]>("?years");
         setYears(response.data);
      };
      fetchYears();
   });

   useEffect(() => {
      switch (status) {
         case "success":
            return setStatusClass(
               "flex flex-row bg-green-600 px-5 py-2 rounded-sm text-slate-100 text-left font-semibold shadow-lg"
            );
         case "fail":
            return setStatusClass(
               "flex flex-row bg-red-700 px-5 py-2 rounded-sm text-slate-100 text-left font-semibold shadow-lg"
            );
         case "hide":
            return setStatusClass("hidden");
      }
   }, [status]);

   const handleCloseStatus = (event: React.MouseEvent<HTMLElement>) => {
      setStatus("hide")
   };

   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
         setUploadedFile(event.target.files[0]);
      }
   };

   const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedYear(event.target.value)
   }

   const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if(selectedYear || uploadedFile){
         if (uploadedFile) {
            if(uploadedFile.type !== "text/csv"){
               setStatusMsg("ERROR: The uploading file must be in CSV format!")
               setStatus("fail")
            }
            else
            {
               const data = new FormData();
               if(selectedYear && uploadedFile)
               {
                  data.append('file', uploadedFile)
               }

               const fetchYears = async () => {
                  let response = await axios.post("http://127.0.0.1/:5000/process",data);
                  console.log(response)
               }
               fetchYears();
            }
         }
      }else{
         setStatusMsg("ERROR: File upload cannot be blank!")
         setStatus("fail")
      }
      
   };

   return (
      <div className="flex flex-col w-full px-10">
         <form
            className="flex flex-col space-y-4 col-span-2"
            onSubmit={handleOnSubmit}
         >
            <div className="flex flex-col">
               <label className="text-slate-100 font-medium text-left pb-1">
                  Which year would you like to add your data into?
               </label>
               <select
                  className="p-[0.4rem] text-slate-950 font-normal rounded-sm text-md"
                  name="year"
                  onChange={handleOptionChange}
               >
                  <option value="new">Add into a new year...</option>
                  {years.map((year) => (
                     <option value={year.year}>{year.year}</option>
                  ))}
               </select>
            </div>
            <div className="flex flex-col">
               <label className="text-slate-100 font-medium text-left pb-1">
                  Upload your file here
               </label>
               <input
                  className="p-1 block w-full font-normal text-slate-950 rounded-sm cursor-pointer bg-gray-50"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
               />
               <p className="text-slate-100 text-left mt-1 text-sm">
                  Accept CSV format only (Max: 2MB)
               </p>
            </div>
            <div className={statusClass}>
               <div className="w-full">
                  <p>{statusMsg}</p>
               </div>
               <button type="button" onClick={handleCloseStatus}>x</button>
            </div>
            <button
               type="submit"
               className="mt-8 py-2 !bg-blue-500 hover:!bg-blue-600 transition-colors text-white font-bold rounded-sm shadow-lg"
            >
               Upload
            </button>
         </form>
      </div>
   );
}
