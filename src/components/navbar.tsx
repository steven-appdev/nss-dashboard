import { NavLink } from "react-router-dom";
import logo from "../images/logo-removebg-preview.png";

export default function Navbar() {
   return (
      <nav className="flex flex-wrap bg-slate-900 h-[60px]">
         <div className="h-full object-contain flex flex-row mx-10">
            <img className="h-full object-contain px-3 py-3 mr-5" src={logo} />
            <div className="grid grid-cols-4 gap-6 items-center">
               <NavLink
                  to="/"
                  className="text-slate-300 hover:text-slate-50 transition-colors font-semibold"
               >
                  Data Overview
               </NavLink>
               <NavLink
                  to="compare"
                  className="text-slate-300 hover:text-slate-50 transition-colors font-semibold"
               >
                  Comparative View
               </NavLink>
               <NavLink
                  to="integrate"
                  className="text-slate-300 hover:text-slate-50 transition-colors font-semibold"
               >
                  Integrate Data
               </NavLink>
            </div>
         </div>
      </nav>
   );
}
