import axios from "axios";
import { useEffect, useState } from "react";
import { IPositive, IPositiveResult } from "../interfaces";
import '../tail.css';

interface PositiveProps{
    question?: string;
    level?: string;
    mode?: string;
    population?: string;
}

export default function Positive({question, population, mode, level}:PositiveProps){

    const api = axios.create({
        baseURL: "https://w20003691.nuwebspace.co.uk/api/access",
    });

    const [result, setResult] = useState<IPositive>()
    const [data, setData] = useState<IPositiveResult[]>()

    useEffect(() => {
        const fetchPositives = async () => {
            let request = "?positives&population="+population+"&mode="+mode+"&level="+level
            let response = await api.get<IPositive>(request);
            setResult(response.data);
            setData(question === "all" ? response.data.results : response.data.results.filter(item => item.qid === question));
        };
        fetchPositives();
    }, [question, population, mode, level]);

    function getColorCode(val: number){
         if(val >= 75 && val <= 100){
            return "bg-green-400";
         }else if(val >= 50 && val <= 74){
            return "bg-yellow-300";
         }else if(val >= 24 && val <= 49){
            return "bg-red-300";
         }else if(val >= 0 && val <= 23){
            return "bg-red-400";
         }
    }

    return(
        <div className="flex-1 m-10 overflow-scroll overflow-x-hidden border rounded-md">
            <table className="text-sm w-full">
                <thead>
                    <tr className="bg-slate-300 sticky top-0">
                        <th className="border-b font-medium text-slate-700 py-4 w-[10%]">Question ID</th>
                        <th className="border-b font-medium text-slate-700 py-4">Question</th>
                        <th className="border-b font-medium text-slate-700 py-4 w-[10%]">Positivity Measure (%)</th>
                        <th className="border-b font-medium text-slate-700 py-4 w-[10%]">Rank</th>
                        <th className="border-b font-medium text-slate-700 py-4 w-[10%]">Rank (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((item) =>(
                        <tr className="even:bg-slate-100">
                            <td className="p-4 text-slate-600">{item.qid}</td>
                            <td className="p-4 text-slate-600">{item.qtext}</td>
                            <td className={`border border-slate-100 p-4 ${getColorCode(item.rank_percentage)}`}>{item.positivity}</td>
                            <td className={`border border-slate-100 p-4 ${getColorCode(item.rank_percentage)}`}>{item.rank}</td>
                            <td className={`border border-slate-100 p-4 ${getColorCode(item.rank_percentage)}`}>{item.rank_percentage}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}