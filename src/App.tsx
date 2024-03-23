import React, { useState } from "react";
import "./App.css";
import "./tail.css";
import Options from "./components/options";
import Positive from "./components/positive";
import Difference from "./components/difference";
import Ratio from "./components/ratio";

export default function App() {

   const [option, setOption] = useState<{ [key: string]: string }>({
      qdrop: "all",
      popdrop: "registered",
      modedrop: "all",
      leveldrop: "all",
   });

   const [question, setQuestion] = useState<string>("Q01");

   return (
      <div className="App flex flex-col h-screen">
         <Options onChange={setOption} />
         <div className="mt-10 mx-10 h-[350px]">
            <div className="flex flex-row h-full">
               <div className="border rounded-md w-1/4 px-8 py-5 mr-1">
                  <Ratio />
               </div>
               <div className="border rounded-md w-3/4 px-10 py-5 ml-1">
                  <Difference 
                     question={question}
                     population={option["popdrop"]}
                     mode={option["modedrop"]}
                     level={option["leveldrop"]}
                  />
               </div>
            </div>
         </div>
         
         <Positive
            question={option["qdrop"]}
            population={option["popdrop"]}
            mode={option["modedrop"]}
            level={option["leveldrop"]}
            onClick={setQuestion}
         />
      </div>
   );
}
