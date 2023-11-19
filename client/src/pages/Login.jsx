import FormInit from "../components/FormInit";
import { useState } from "react";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function Login() {
  const [data, setData] = useState({ user: "", pass: "" });
  const [errForm, setErrForm] = useState(false);
  const [errInput, setErrInput] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleUserChange(e) {
    setErrForm(false);
    setErrInput(false);
    setData({ ...data, user: e.target.value });
  }
  function handlePassChange(e) {
    setErrForm(false);
    setErrInput(false);
    setData({ ...data, pass: e.target.value });
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (
      data.user === undefined ||
      data.pass === undefined ||
      typeof data.user !== "string" ||
      data.user.trim() === "" ||
      typeof data.pass !== "string" ||
      data.pass.trim() === ""
    ) {
      setErrInput(true);
      setErrForm(true);
      return;
    } else if (data.user.trim() !== "admin" || data.pass.trim() !== "123456") {
      setErrInput(false);
      setErrForm(true);
      return;
    }
    setLoading(true);
    cookies.set("username", data.user, {
      path: "/",
      maxAge: 30 * 60,
    });
    window.location.href = "/";
  }
  return (
    <FormInit
      buttonText="Entrar"
      userChange={handleUserChange}
      passChange={handlePassChange}
      submit={handleSubmit}
      text={
        errInput
          ? "Los campos usuario y contraseña son obligatorios"
          : "Credenciales inválidas (usuario y/o contraseña)"
      }
      errorForm={errForm}
      loading={loading}
    />
  );
}
