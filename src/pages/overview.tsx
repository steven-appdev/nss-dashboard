import { useState } from "react";
import Options from "../components/options";
import RespRate from "../components/resprate";
import Difference from "../components/difference";
import Positive from "../components/positive";
import Navbar from "../components/navbar";
import History from "../components/history";

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
            <div className="mt-5 mx-10 h-[340px]">
                <div className="flex flex-row h-full">
                <div className="border rounded-md w-[26%] py-[0.6rem] mr-2">
                    <RespRate 
                        question={question}
                        option={option}
                    />
                </div>
                <div className="border rounded-md w-[37%] pl-5 pr-10 mr-2">
                    <History 
                        question={question}
                        option={option}
                    />
                </div>
                <div className="border rounded-md w-[37%] px-5">
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