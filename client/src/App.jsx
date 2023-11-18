import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/custom.css";
import SLA from "./pages/SLA";
import Silhar from "./pages/Silhar";
import Carriers from "./pages/Carriers";
import Ecommerce from "./pages/Ecommerce";
import Mailing from "./pages/Mailing";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sla" element={<SLA />} />
        <Route path="/silhar" element={<Silhar />} />
        <Route path="/carriers" element={<Carriers />} />
        <Route path="/ecommerce" element={<Ecommerce />} />
        <Route path="/mailing" element={<Mailing />} />
      </Routes>
    </BrowserRouter>
  );
}
