import { useEffect, useState } from "react";

interface Props{
   display: string
   message: string
   onClose?:(status:string) => void
}

export default function Error({display, message, onClose}:Props) {
   const [statusClass, setStatusClass] = useState<string>("hidden");

   useEffect(() => {
      switch (display) {
         case "success":
            return setStatusClass(
               "flex flex-row bg-green-600 px-5 py-2 rounded-sm text-slate-100 text-left font-semibold shadow-lg"
            );
         case "fail":
            return setStatusClass(
               "flex flex-row bg-red-700 px-5 py-2 rounded-sm text-slate-100 text-left font-semibold shadow-lg"
            );
         case "hide":
            return setStatusClass("hidden");
      }
   }, [display]);

   const handleCloseStatus = () => {
      if(onClose){
         onClose("hide")
      }
   };

   return (
      <div className={statusClass}>
         <div className="w-full">
            <p>{message}</p>
         </div>
         <button type="button" onClick={handleCloseStatus}>
            x
         </button>
      </div>
   );
}
