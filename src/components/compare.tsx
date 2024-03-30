import axios from "axios";
import { useEffect, useState } from "react";
import { ICompareOption, ILevel, IMode, IPopulation, IProvider, ISubject, IYear } from "../interfaces";

interface Props {
    onChange?: (selectedOption:ICompareOption) => void;
}

export default function Compare({ onChange }: Props){

    const [years, setYears] = useState<IYear[]>([]);
    const [providers, setProviders] = useState<IProvider[]>([]);
    const [subjects, setSubjects] = useState<ISubject[]>([]);
    const [populations, setPopulations] = useState<IPopulation[]>([]);
    const [modes, setModes] = useState<IMode[]>([]);
    const [levels, setLevels] = useState<ILevel[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<ICompareOption>({
        year: 0,
        provider: "null",
        provider_id: "null",
        subject: "null",
        subject_id: "null",
        population: "null",
        mode: "null",
        level: "null"
    });
     
    const api = axios.create({
        baseURL: "https://w20003691.nuwebspace.co.uk/api/access",
    });

    useEffect(() => {
        const fetchYears = async () => {
            let response = await api.get<IYear[]>("?years");
            setYears(response.data);
            setSelectedOptions((prevState) => ({
                ...prevState,
                year: response.data[0].year
            }));
        };
        fetchYears();
    }, []);

    useEffect(() => {
        const fetchProviders = async () => {
            let response = await api.get<IProvider[]>("?providers&year="+selectedOptions.year);
            setProviders(response.data);
            setSelectedOptions((prevState) => ({
                ...prevState,
                provider: response.data[0].provider,
                provider_id: response.data[0].provider+"_"+selectedOptions.year
            }))
        }
        if(selectedOptions.year != 0)
        {
            fetchProviders();
        }
    },[selectedOptions.year])

    useEffect(() => {
        const fetchSubjects = async () => {
            let response = await api.get<ISubject[]>("?subjects&year="+selectedOptions.year+"&provider="+selectedOptions.provider)
            setSubjects(response.data);
            setSelectedOptions((prevState) => ({
                ...prevState,
                subject: response.data[0].subject,
                subject_id: response.data[0].subject+"_"+selectedOptions.provider+"_"+selectedOptions.year
            }))
        }
        if(selectedOptions.provider != "null")
        {
            fetchSubjects();
        }
    },[selectedOptions.provider_id])

    useEffect(() => {
        const fetchInfo = async () => {
            let population = await api.get<IPopulation[]>("?populations&year="+selectedOptions.year+"&provider="+selectedOptions.provider+"&subject="+selectedOptions.subject)
            setPopulations(population.data);

            let mode = await api.get<IMode[]>("?modes&year="+selectedOptions.year+"&provider="+selectedOptions.provider+"&subject="+selectedOptions.subject)
            setModes(mode.data);

            let level = await api.get<ILevel[]>("?levels&year="+selectedOptions.year+"&provider="+selectedOptions.provider+"&subject="+selectedOptions.subject)
            setLevels(level.data);
        }
        if(selectedOptions.subject != "null")
        {
            fetchInfo();
        }
        
    },[selectedOptions.subject_id])

    useEffect(() => {
        if (onChange) {
           onChange(selectedOptions);
        }
     }, [selectedOptions]);

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.target;
        setSelectedOptions((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        if(name === "provider")
        {
            setSelectedOptions((prevState) => ({
                ...prevState,
                provider_id: value+"_"+selectedOptions.year,
            }))
        }
        else if(name === "subject")
        {
            setSelectedOptions((prevState) => ({
                ...prevState,
                subject_id: value+"_"+selectedOptions.provider+"_"+selectedOptions.year,
            }))
            
        }
     };

    return (
        <div className="flex flex-col space-y-3 col-span-2">
            <div className="flex flex-col">
                <label className="text-slate-100 font-medium text-left">Year</label>
                <select
                    className="p-1 text-slate-950 font-normal rounded-sm"
                    name="year"
                    id="year"
                    onChange={handleSelectChange}
                >
                    {years.map((year) => (<option value={year.year}>{year.year}</option>))}
                </select>
            </div>
            <div className="flex flex-col">
                <label className="text-slate-100 font-medium text-left">University/College</label>
                <select
                    className="p-1 text-slate-950 font-normal rounded-sm"
                    name="provider"
                    id="provider"
                    onChange={handleSelectChange}
                >
                    {providers.map((provider) => (<option value={provider.provider}>{provider.provider}</option>))}
                </select>
            </div>
            <div className="flex flex-col">
                <label className="text-slate-100 font-medium text-left">Subject</label>
                <select
                    className="p-1 text-slate-950 font-normal rounded-sm"
                    name="subject"
                    id="subject"
                    onChange={handleSelectChange}
                >
                    {subjects.map((subject) => (<option value={subject.subject}>{subject.subject}</option>))}
                </select>
            </div>
            <div className="grid grid-cols-3 gap-5">
                <div className="flex flex-col">
                    <label className="text-slate-100 font-medium text-left">Population</label>
                    <select
                        className="p-1 text-slate-950 font-normal rounded-sm"
                        name="population"
                        id="population"
                        onChange={handleSelectChange}
                    >
                        {populations.map((population) => (<option value={population.population}>{population.population}</option>))}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="text-slate-100 font-medium text-left">Mode</label>
                    <select
                        className="p-1 text-slate-950 font-normal rounded-sm"
                        name="mode"
                        id="mode"
                        onChange={handleSelectChange}
                    >
                        {modes.map((mode) => (<option value={mode.mode}>{mode.mode}</option>))}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="text-slate-100 font-medium text-left">Level</label>
                    <select
                        className="p-1 text-slate-950 font-normal rounded-sm"
                        name="level"
                        id="level"
                        onChange={handleSelectChange}
                    >
                        {levels.map((level) => (<option value={level.level}>{level.level}</option>))}
                    </select>
                </div>
            </div>
        </div>
    )
}