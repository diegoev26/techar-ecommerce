import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/custom.css";
import Ecommerce from "./pages/Ecommerce";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Ecommerce />} />
      </Routes>
    </BrowserRouter>
  );
}
