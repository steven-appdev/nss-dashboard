import "./App.css";
import "./tail.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import Overview from "./pages/overview";
import Comparative from "./pages/comparative";

export default function App() {
   return (
      <HashRouter>
         <Routes>
            <Route path="/" element={<Overview/>}/>
            <Route path="compare" element={<Comparative />}/>
         </Routes>
      </HashRouter>
   );
}
