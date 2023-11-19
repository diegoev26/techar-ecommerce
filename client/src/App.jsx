import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/custom.css";
import Ecommerce from "./pages/Ecommerce";
import Login from "./pages/Login";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function App() {
  if (
    window.location.pathname === "/" &&
    (cookies.get("username") === undefined ||
      cookies.get("username") !== "admin")
  ) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      </BrowserRouter>
    );
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Ecommerce />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
