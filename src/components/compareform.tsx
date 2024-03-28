import axios from "axios";
import { useState } from "react";
import { ICompareOption } from "../interfaces";

export default function CompareForm(){
    const api = axios.create({
        baseURL: "https://w20003691.nuwebspace.co.uk/api/access",
    });

    const [compareA, setCompareA] = useState<ICompareOption>();
    const [compareB, setCompareB] = useState<ICompareOption>();

    return (
        <form className="flex flex-col w-full px-10" id="compare">
            <div className="grid grid-cols-5">
                <div className="flex flex-col space-y-3 col-span-2">
                    <div className="flex flex-col">
                        <label className="text-slate-100 font-medium text-left">Year</label>
                        <select
                            className="p-1 text-slate-950 font-normal rounded-sm"
                            name="yeardrop"
                            id="yeardrop"
                        >
                            <option>Year</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-slate-100 font-medium text-left">University/College</label>
                        <select
                            className="p-1 text-slate-950 font-normal rounded-sm"
                            name="unidrop"
                            id="unidrop"
                        >
                            <option>University Name</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-3 gap-5">
                        <div className="flex flex-col">
                            <label className="text-slate-100 font-medium text-left">Population</label>
                            <select
                                className="p-1 text-slate-950 font-normal rounded-sm"
                                name="popdrop"
                                id="popdrop"
                            >
                                <option>Population Drop</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-slate-100 font-medium text-left">Mode</label>
                            <select
                                className="p-1 text-slate-950 font-normal rounded-sm"
                                name="modedrop"
                                id="modedrop"
                            >
                                <option>Mode Drop</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-slate-100 font-medium text-left">Level</label>
                            <select
                                className="p-1 text-slate-950 font-normal rounded-sm"
                                name="leveldrop"
                                id="leveldrop"
                            >
                                <option>Level Drop</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center">
                    <h1 className="text-slate-100 font-bold text-[36px]">- against -</h1>
                </div>
                <div className="flex flex-col space-y-3 col-span-2">
                    <div className="flex flex-col">
                        <label className="text-slate-100 font-medium text-left">Year</label>
                        <select
                            className="p-1 text-slate-950 font-normal rounded-sm"
                            name="yeardrop"
                            id="yeardrop"
                        >
                            <option>Year</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-slate-100 font-medium text-left">University/College</label>
                        <select
                            className="p-1 text-slate-950 font-normal rounded-sm"
                            name="unidrop"
                            id="unidrop"
                        >
                            <option>University Name</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-3 gap-5">
                        <div className="flex flex-col">
                            <label className="text-slate-100 font-medium text-left">Population</label>
                            <select
                                className="p-1 text-slate-950 font-normal rounded-sm"
                                name="popdrop"
                                id="popdrop"
                            >
                                <option>Population Drop</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-slate-100 font-medium text-left">Mode</label>
                            <select
                                className="p-1 text-slate-950 font-normal rounded-sm"
                                name="modedrop"
                                id="modedrop"
                            >
                                <option>Mode Drop</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-slate-100 font-medium text-left">Level</label>
                            <select
                                className="p-1 text-slate-950 font-normal rounded-sm"
                                name="leveldrop"
                                id="leveldrop"
                            >
                                <option>Level Drop</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <button type="submit" form="compare" className="mt-8 py-2 !bg-blue-500 hover:!bg-blue-600 transition-colors text-white font-bold rounded-sm shadow">Start Compare</button>
        </form>
    )
}