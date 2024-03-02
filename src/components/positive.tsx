import axios from "axios";
import { useEffect, useState } from "react";
import { IPositive, IQuestion } from "../interfaces";
import '../tail.css';

interface PositiveProps{
    currentQuestion?: string;
    currentLevel?: string;
}

export default function Positive({currentLevel}:PositiveProps){

    const api = axios.create({
        baseURL: "https://w20003691.nuwebspace.co.uk/api/access",
    });

    const [measures, setMeasures] = useState<number[]>([]);
    const [questions, setQuestions] = useState<IQuestion[]>([]);

    useEffect(() => {
        const fetchPositives = async () => {
            let request = "?positives&population=taught&mode=full&level="+currentLevel
            let response = await api.get<IPositive>(request);
            setMeasures(response.data.percentage);
        };
        fetchPositives();
        console.log(measures);
    }, [currentLevel]);

    useEffect(() => {
        const fetchQuestions = async () => {
            let response = await api.get<IQuestion[]>("?questions");
            setQuestions(response.data);
        };
        fetchQuestions(); 
    }, [])

    return(
        <div className="my-5">
            <table className="border-collapse table-auto w-full text-sm">
                <thead>
                    <tr>
                        <th className="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-700 dark:text-slate-200">Question Number</th>
                        <th className="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-700 dark:text-slate-200">Positivity Measure (%)</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800">
                    {questions.map((question, idx) =>(
                        <tr>
                            <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-600 dark:text-slate-400">{question.id}</td>
                            <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-600 dark:text-slate-400">{measures[idx]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        
    )
}