import CompareForm from "../components/compareform";
import Navbar from "../components/navbar";

export default function Comparative(){
    return(
        <div className="App flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-wrap bg-slate-600 pt-3 pb-6 justify-center">
                <CompareForm />
            </div>
        </div>
    )
}