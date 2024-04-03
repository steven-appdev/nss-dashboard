import IntegrateForm from "../components/integrateform";
import Navbar from "../components/navbar";

export default function Integration(){
    return(
        <div className="App flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-wrap bg-slate-600 pt-4 pb-8 justify-center">
                <IntegrateForm />
            </div>
        </div>
    )
}