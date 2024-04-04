import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { IErrorResponse, IYear } from "../interfaces";
import Error from "./error";

interface Props {
   seed:number
   modalState:number
   onSuccess?:(seed:number) => void
}

export default function IntegrateForm({seed, modalState, onSuccess}:Props) {
   const api = axios.create({
      baseURL: "https://w20003691.nuwebspace.co.uk/api/access",
   });

   const [status, setStatus] = useState<string>("hide");
   const [statusMsg, setStatusMsg] = useState<string>("null");
   const [years, setYears] = useState<IYear[]>([]);
   const [lastAvailableYear, setLastAvailableYear] = useState<number>(0);
   const [uploadedFile, setUploadedFile] = useState<File>();
   const [selectedYear, setSelectedYear] = useState<string>();
   const [buttonEnabled, setButtonEnabled] = useState<boolean>(false);

   useEffect(() => {
      const fetchYears = async () => {
         let response = await api.get<IYear[]>("?years");
         setYears(response.data)
         const poppedYear = response.data.slice(-1)[0].year
         if(poppedYear){
            setLastAvailableYear(poppedYear+1)
            setSelectedYear(String(poppedYear+1))
         }
      };
      fetchYears();
   }, [seed, modalState]);

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
      setButtonEnabled(true)
      setStatus("hide")
      if(selectedYear || uploadedFile){
         if (uploadedFile) {
            if(uploadedFile.type !== "text/csv"){
               setStatusMsg("Opps! The uploading file must be in CSV format!")
               setStatus("fail")
               setButtonEnabled(false)
            }
            else
            {
               const data = new FormData();
               if(uploadedFile){
                  data.append('year', String(selectedYear))
                  data.append('file', uploadedFile)
               }

               const fetchYears = async () => {
                  try{
                     await axios.post("http://127.0.0.1:5000/process",data, {
                        headers: {
                           "Content-Type": "multipart/form-data",
                        },
                     })
                     setStatusMsg("File uploaded successfully!")
                     setStatus("success")
                     if(onSuccess){
                        onSuccess(Math.random())
                     }
                  }catch(e){
                     const err = (e as AxiosError).response?.data as IErrorResponse 
                     setStatusMsg(err.message)
                     setStatus("fail")
                  }finally{
                     setButtonEnabled(false)
                  }
               }
               fetchYears();
            }
         }
      }else{
         setStatusMsg("Opps! File upload cannot be blank!")
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
                  <option value={lastAvailableYear}>Add into a new year...</option>
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
            <Error display={status} message={statusMsg} onClose={setStatus}/>
            <button
               type="submit"
               className="mt-8 py-2 !bg-blue-500 hover:!bg-blue-600 transition-colors text-white font-bold rounded-sm shadow-lg disabled:!bg-slate-500"
               disabled={buttonEnabled}
            >
               Upload
            </button>
         </form>
      </div>
   );
}
