import axios, { AxiosError } from "axios"
import { useEffect, useState } from "react"
import { IAvailable, IErrorResponse } from "../interfaces"
import Error from "./error"
import loading from "../images/loading-buffering.gif"

interface Props {
    display: boolean
    selectedYear?: string
    onClose?: (modalState:boolean) => void
}

export default function IntegrateModal({display = false, selectedYear = "", onClose}:Props){
    const api = axios.create({
        baseURL: "https://w20003691.nuwebspace.co.uk/api/access",
    });

    const [status, setStatus] = useState<string>("hide")
    const [statusMsg, setStatusMsg] = useState<string>("null")
    const [available, setAvailable] = useState<IAvailable[]>([])
    const [isLoading, setLoading] = useState<boolean>(false)
    const [seed, setSeed] = useState<number>(0)

    const onCloseClick = () => {
        if(onClose){
            onClose(false)
        }
    }

    const onDeleteClick = (event:React.MouseEvent<HTMLElement>) => {
        if(window.confirm(`Are you sure you want to delete '${event.currentTarget.id}'?`)){
            const fetchAvailable = async () => {
                try{
                    await api.get<IAvailable[]>("?delete&year="+selectedYear+"&subject="+event.currentTarget.id)
                    setStatusMsg("Subject deleted!")
                    setStatus("success")
                    setSeed(Math.random())
                }catch(e){
                    const err = (e as AxiosError).response?.data as IErrorResponse 
                    setStatusMsg(err.message)
                    setStatus("fail")
                }
            }
            fetchAvailable()
        }
    }

    useEffect(() => {
        setLoading(true)
        if(display){
            const fetchAvailable = async () => {
                let response = await api.get<IAvailable[]>("?available&year="+selectedYear)
                console.log(response.data)
                if(response.data)
                {
                    setAvailable(response.data)
                    setStatus("hide")
                }else{
                    if(onClose){
                        onClose(false)
                    }
                }
                setLoading(false)
            }
            fetchAvailable()
        }
    },[display, seed])

    return(
        <div className={`fixed inset-0 z-10 p-8 bg-slate-800/80 ${display?"block":"hidden"}`}>
            <div className={`relative w-[80%] h-[90%] mx-auto mt-8`}>
                <div className="overflow-hidden bg-white rounded shadow-xl h-full flex flex-col">
                    <div className="bg-slate-900 h-[60px] text-slate-300 flex flex-row items-center justify-center">
                        <div className="w-full ml-[54px]">
                            <p className="font-semibold text-xl">All Available Subjects for {selectedYear}</p>
                        </div>
                        <button type="button" className="px-5 text-xl h-full hover:!bg-slate-700 transition-colors rounded-tr-lg" onClick={onCloseClick}>x</button>
                    </div>
                    <div className={`mx-10 mt-5 ${(status === "hide")?"hidden":"block"}`}>
                        <Error display={status} message={statusMsg} onClose={setStatus}/>
                    </div>
                    <div className={`h-[50%] w-full py-10 items-center justify-center ${isLoading?"flex":"hidden"}`}>
                        <img className="w-[100px] h-[100px]" src={loading} />
                    </div>
                    <div className={`${isLoading?"hidden":"flex-1"} mx-10 mt-5 mb-6 overflow-scroll overflow-x-hidden border border-slate-300 rounded-md shadow-md`}>
                        <table className="text-md w-full">
                            <thead>
                            <tr className="bg-slate-300 sticky top-0">
                                <th className="border-b font-medium text-slate-800 py-3 w-[40%]">
                                    Subject Name (CAH Name)
                                </th>
                                <th className="border-b font-medium text-slate-800 py-3">
                                    Number of Available Data (Rows)
                                </th>
                                <th className="border-b font-medium text-slate-800 py-3 w-[40%]">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                                {
                                    (available)?available.map((item) => (
                                        <tr className="even:bg-slate-100 transition-colors">
                                            <td className="p-4 text-slate-800">{item.subject}</td>
                                            <td className="p-4 text-slate-800">{item.available}</td>
                                            <td>
                                            <button
                                                type="button"
                                                name={String(item.subject)}
                                                id={String(item.subject)}
                                                className="w-[50%] py-1 !bg-red-500 hover:!bg-red-600 transition-colors text-white font-semibold rounded-sm"
                                                onClick={onDeleteClick}
                                            >
                                                Delete
                                            </button>
                                            </td>
                                        </tr>
                                    )):<></>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}