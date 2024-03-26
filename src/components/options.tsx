import axios from "axios";
import { useEffect, useState } from "react";
import { IQuestion, ISubject, IYear } from "../interfaces";

interface Props {
   onChange?: (selectedOption: { [key: string]: string }) => void;
}

export default function Options({ onChange }: Props) {
   const api = axios.create({
      baseURL: "https://w20003691.nuwebspace.co.uk/api/access",
   });

   const [questions, setQuestions] = useState<IQuestion[]>([]);
   const [years, setYears] = useState<IYear[]>([]);
   const [selectedYear, setSelectedYear] = useState<String>("2023");
   const [subjects, setSubjects] = useState<ISubject[]>([]);
   const [selectedOptions, setSelectedOptions] = useState<{
      [key: string]: string;
   }>({
      qdrop: "all",
      popdrop: "registered",
      modedrop: "all",
      leveldrop: "all",
      yeardrop: "2023",
      subdrop: "Computer science"
   });

   useEffect(() => {
      const fetchQuestions = async () => {
         let response = await api.get<IQuestion[]>("?questions");
         setQuestions(response.data);
      };
      fetchQuestions();

      const fetchYears = async () => {
         let response = await api.get<IYear[]>("?years");
         setYears(response.data);
      };
      fetchYears();
   }, []);

   useEffect(() => {
      const fetchSubjects = async () => {
         let response = await api.get<ISubject[]>("?subjects&year="+selectedYear);
         setSubjects(response.data);
         
         setSelectedOptions((prevState) => ({
            ...prevState,
            subdrop: response.data[0].subject,
            yeardrop: ""+selectedYear
         }));
      };
      fetchSubjects();
   }, [selectedYear])

   useEffect(() => {
      if (onChange) {
         onChange(selectedOptions);
      }
   }, [selectedOptions]);

   const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = event.target;
      if(name === "yeardrop")
      {
         setSelectedYear(value)
      }
      else
      {
         setSelectedOptions((prevState) => ({
            ...prevState,
            [name]: value,
         }));
      }
   };

   return (
      <div className="flex flex-col w-full px-10">
         <div className="grid grid-cols-4 gap-6 pb-3">
            <div className="flex flex-col">
               <label className="text-slate-100 font-medium text-left">Year</label>
               <select
                  className="p-1 text-slate-950 font-normal rounded-sm"
                  name="yeardrop"
                  id="yeardrop"
                  onChange={handleSelectChange}
               >
                  {years.map((year) =>(
                     <option value={year.year}>{year.year}</option>
                  ))}
               </select>
            </div>
            <div className="flex flex-col">
               <label className="text-slate-100 font-medium text-left">Population</label>
               <select
                  className="p-1 text-slate-950 font-normal rounded-sm"
                  name="popdrop"
                  id="popdrop"
                  onChange={handleSelectChange}
               >
                  <option value="registered">Registered</option>
                  <option value="taught">Taught</option>
               </select>
            </div>
            <div className="flex flex-col">
               <label className="text-slate-100 font-medium text-left">Mode</label>
               <select
                  className="p-1 text-slate-950 font-normal rounded-sm"
                  name="modedrop"
                  id="modedrop"
                  onChange={handleSelectChange}
               >
                  <option value="all">All modes</option>
                  <option value="full">Full time</option>
               </select>
            </div>
            <div className="flex flex-col">
               <label className="text-slate-100 font-medium text-left">Level</label>
               <select
                  className="p-1 text-slate-950 font-normal rounded-sm"
                  name="leveldrop"
                  id="leveldrop"
                  onChange={handleSelectChange}
               >
                  <option value="all">All undergraduates</option>
                  <option value="first">First degree</option>
               </select>
            </div>
         </div>
         <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col">
               <label className="text-slate-100 font-medium text-left">Subject</label>
               <select
                  className="p-1 text-slate-950 font-normal rounded-sm"
                  name="subdrop"
                  id="subdrop"
                  onChange={handleSelectChange}
               >
                  {subjects.map((subject, index) =>(
                     <option value={subject.subject} selected={index === 0}>{subject.subject}</option>
                  ))}
               </select>
            </div>
            <div className="flex flex-col col-span-2">
               <label className="text-slate-100 font-medium text-left">
                  Questions
               </label>
               <select
                  className="p-1 text-slate-950 font-normal rounded-sm"
                  name="qdrop"
                  id="qdrop"
                  onChange={handleSelectChange}
               >
                  <option value="all">--- All Questions ---</option>
                  {questions.map((question) => (
                     <option value={question.id}>
                        {question.question}
                     </option>
                  ))}
               </select>
            </div>
         </div>
         
      </div>
   );
}
