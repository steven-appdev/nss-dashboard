import React, { useState } from "react";
import "./App.css";
import "./tail.css";
import Options from "./components/options";
import Positive from "./components/positive";
import Difference from "./components/difference";
import RespRate from "./components/resprate";

export default function App() {

   const [option, setOption] = useState<{ [key: string]: string }>({
      qdrop: "all",
      popdrop: "registered",
      modedrop: "all",
      leveldrop: "all",
      yeardrop: "2023",
      subdrop: "Computer science"
   });

   const [question, setQuestion] = useState<string>("Q01");

   return (
      <div className="App flex flex-col h-screen">
         <div className="flex flex-wrap bg-slate-600 pt-2 pb-6 justify-center">
            <Options onChange={setOption} />
         </div>
         <div className="mt-10 mx-10 h-[300px]">
            <div className="flex flex-row h-full">
               <div className="border rounded-md w-[30%] px-8 py-2 mr-1">
                  <RespRate 
                     question={question}
                     option={option}
                  />
               </div>
               <div className="border rounded-md w-[70%] px-10 py-2 ml-1">
                  <Difference 
                     question={question}
                     option={option}
                  />
               </div>
            </div>
         </div>
         <Positive
            option={option}
            onClick={setQuestion}
         />
      </div>
   );
}
