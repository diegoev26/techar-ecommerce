import { useEffect, useState } from "react";
import Main from "../components/ecomm/Main";
import Sales from "../components/ecomm/Sales";
import Loader from "./Loader";
import { dataToChart, getData, getStatus } from "../apis/ecomm";
import Swal from "sweetalert2";
import Navigation from "../components/ecomm/Navigation";

export default function Ecommerce() {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sales, setSales] = useState({
    Interface: [],
    Validation: [],
    Logistic: [],
    Finished: [],
  });
  const [salesToChart, setSalesToChart] = useState({ sales$: [], salesQ: [] });
  const [change, setChange] = useState(false);
  const [table, setTable] = useState(0);
  const [initialStatus, setInitialStatus] = useState("");
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    setLoading(true);
    handleInitialStatus().finally(() => {
      setDataToChart().finally(() => {
        setData().finally(() => {
          setLoading(false);
        });
      });
    });
  }, [change]);

  if (window.location.pathname.slice(0, 10) === "/ecommerce") {
    let actualState = "";
    async function statusChange() {
      if (initialStatus !== "" && !alert && actualState !== initialStatus) {
        const { code, response } = await getStatus();
        if (
          code === 200 &&
          response !== undefined &&
          response.Monitoreo !== undefined &&
          typeof response.Monitoreo === "string" &&
          response.Monitoreo.trim() !== "" &&
          response.Monitoreo !== initialStatus
        ) {
          actualState = initialStatus;
          setAlert(true);
        }
      }
    }
    setInterval(statusChange, 30000);
  }

  const handleInitialStatus = async () => {
    setInitialStatus("");
    setAlert(false);
    const { code, response, error } = await getStatus();
    if (
      code === 200 &&
      response !== undefined &&
      response.Monitoreo !== undefined &&
      typeof response.Monitoreo === "string" &&
      response.Monitoreo.trim() !== ""
    ) {
      setInitialStatus(response.Monitoreo);
    } else {
      Swal.fire({
        title: "Error al obtener el estado de  las ventas",
        text: error.message,
        icon: "warning",
        timer: 2500,
        showConfirmButton: false,
        showDenyButton: false,
        showCloseButton: false,
      });
    }
  };

  const setData = async () => {
    const { code, response, error } = await getData();
    switch (code) {
      case 207:
        console.log(error);
        Swal.fire({
          title: "No se pudieron obtener todas las ventas",
          text: "Se visualizarán únicamente las que se cargaron correctamente",
          icon: "warning",
          timer: 2500,
          showConfirmButton: false,
          showDenyButton: false,
          showCloseButton: false,
        });
      case 200:
        setSales(response);
        break;
      default:
        console.log(error);
        Swal.fire({
          title: "Error al recuperar las ventas",
          icon: "error",
          timer: 2500,
          showConfirmButton: false,
          showDenyButton: false,
          showCloseButton: false,
        });
        break;
    }
    setTable(1);
  };

  const setDataToChart = async () => {
    const { code, response, error } = await dataToChart();
    switch (code) {
      case 207:
        console.log(error);
        Swal.fire({
          title: "No se pudo obtener la información de todos los períodos",
          icon: "warning",
          timer: 2500,
          showConfirmButton: false,
          showDenyButton: false,
          showCloseButton: false,
        });
      case 200:
        setSalesToChart({ sales$: response.sales$, salesQ: response.salesQ });
        break;
      default:
        console.log(error);
        Swal.fire({
          title: "Error al recuperar la información de los períodos",
          icon: "error",
          timer: 2500,
          showConfirmButton: false,
          showDenyButton: false,
          showCloseButton: false,
        });
        break;
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Navigation
        page={page}
        setPage={setPage}
        alert={alert}
        change={change}
        setChange={setChange}
      />
      {page === 1 ? (
        <Main
          sales={sales}
          setLoading={setLoading}
          salesToChart={salesToChart}
        />
      ) : null}
      {page === 2 ? (
        <Sales
          sales={sales}
          table={table}
          setTable={setTable}
          setChange={setChange}
          change={change}
          setLoading={setLoading}
        />
      ) : null}
    </>
  );
}
