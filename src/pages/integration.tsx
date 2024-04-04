import { useState } from "react";
import IntegrateForm from "../components/integrateform";
import IntegrateList from "../components/integratelist";
import Navbar from "../components/navbar";

export default function Integration() {

   const [seed, setSeed] = useState<number>(0)
   const [modalState, setModalState] = useState<number>(0)

   return (
      <div className="App flex flex-col h-screen">
         <Navbar />
         <div className="flex flex-wrap bg-slate-600 pt-4 pb-8 justify-center">
            <IntegrateForm seed={seed} modalState={modalState} onSuccess={setSeed}/>
         </div>
         <IntegrateList seed={seed} onModalClose={setModalState}/>
      </div>
   );
}
