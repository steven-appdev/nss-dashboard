import { useState } from "react";
import { Tooltip } from "react-tooltip";
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
            <div className="flex justify-end">
                <p className="w-fit quartile-ttip mx-10 mt-4 mb-1 text-right text-slate-500 hover:underline decoration-dashed underline-offset-[4px] decoration-slate-400">What does these colour mean?</p>
            </div>
            <Positive
                option={option}
                onClick={setQuestion}
            />
            <Tooltip anchorSelect=".quartile-ttip" place="left" className="!text-lg !w-[450px] !py-3">
                The colour code indicates the Quartile position:
                <br/>Q1 (Green) represents best performance
                <br/>Q2 (Yellow) represents good performance
                <br/>Q3 (Pink) represents bad performance 
                <br/>Q4 (Red) represents worst performance 
            </Tooltip>
        </div>
    )
}