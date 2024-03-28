import "./App.css";
import "./tail.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import Overview from "./pages/overview";

export default function App() {
   return (
      <HashRouter>
         <Routes>
            <Route path="/" element={<Overview/>}/>
         </Routes>
      </HashRouter>
   );
}
