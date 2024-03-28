import { useState } from "react";
import Options from "../components/options";
import RespRate from "../components/resprate";
import Difference from "../components/difference";
import Positive from "../components/positive";
import Navbar from "../components/navbar";
import Gauge from "../components/gauge";

export default function Overview(){
    const [option, setOption] = useState<{ [key: string]: string }>({
        qdrop: "all",
        popdrop: "registered",
        modedrop: "all",
        leveldrop: "all",
        yeardrop: "2023",
        subdrop: "Computer science"
     });
    const [question, setQuestion] = useState<string>("Q01");
    return(
        <div className="App flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-wrap bg-slate-600 pt-3 pb-6 justify-center">
                <Options onChange={setOption} />
            </div>
            <div className="mt-5 mx-10 h-[350px]">
                <div className="flex flex-row h-full">
                <div className="border rounded-md w-[25%] py-2 mr-2">
                    <RespRate 
                        question={question}
                        option={option}
                    />
                </div>
                <div className="w-[25%] mr-2">
                    <Gauge 
                        question={question}
                        option={option}
                    />
                </div>
                <div className="border rounded-md w-[50%] px-10 py-2">
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
    )
}