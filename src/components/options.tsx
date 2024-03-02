import axios from "axios";
import { useEffect, useState } from "react";
import { IQuestion } from "../interfaces";

interface Props{
    onChange?: (selectedOption: {[key: string]: string}) => void;
}

export default function Options({onChange}:Props){
    
    const api = axios.create({
        baseURL: "https://w20003691.nuwebspace.co.uk/api/access",
    });

    const [questions, setQuestions] = useState<IQuestion[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<{[key: string]: string}>({
        qdrop: "all",
        popdrop: "registered",
        modedrop: "all",
        leveldrop: "all"
    })

    useEffect(() => {
        const fetchQuestions = async () => {
            let response = await api.get<IQuestion[]>("?questions");
            setQuestions(response.data);
        };
        fetchQuestions();
    }, []);

    useEffect(() => {
        if(onChange){
            onChange(selectedOptions);
        }
    },[selectedOptions])

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = event.target;
        setSelectedOptions(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    
    return(
        <div className="flex flex-wrap bg-slate-600 py-5 justify-center">
            <label className="text-slate-100 mx-6 font-medium">
                Questions
                <select className="ml-3 p-2 text-slate-950 font-normal rounded-md" name='qdrop' id='qdrop' onChange={handleSelectChange}>
                    <option value="all">All Questions</option>
                    {questions.map((question) => (
                        <option value={question.id}>{question.id + ": " +question.question}</option>
                    ))}
                </select>
            </label>
            <label className="text-slate-100 mx-6 font-medium">
                Population
                <select className="ml-3 p-2 text-slate-950 font-normal rounded-md" name='popdrop' id='popdrop' onChange={handleSelectChange}>
                    <option value="registered">Registered</option>
                    <option value="taught">Taught</option>
                </select>
            </label>
            <label className="text-slate-100 mx-6 font-medium">
                Mode of Study
                <select className="ml-3 p-2 text-slate-950 font-normal rounded-md" name='modedrop' id='modedrop' onChange={handleSelectChange}>
                    <option value="all">All modes</option>
                    <option value="full">Full time</option>
                </select>
            </label>
            <label className="text-slate-100 mx-6 font-medium">
                Level of Study
                <select className="ml-3 p-2 text-slate-950 font-normal rounded-md" name='leveldrop' id='leveldrop' onChange={handleSelectChange}>
                    <option value="all">All undergraduates</option>
                    <option value="first">First degree</option>
                </select>
            </label>
        </div>
    );
}