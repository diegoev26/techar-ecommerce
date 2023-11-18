import { useState } from "react";
import Main from "../components/ecomm/Main";
import Sales from "../components/ecomm/Sales";
import Loader from "./Loader";
import Navigation from "../components/ecomm/Navigation";

export default function Ecommerce() {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sales, setSales] = useState({
    Interface: [
      {
        Estado: "Pend.Ingreso",
        Identi: "20000067429507",
        CodigoCliente: "AR9993",
        TipoCliente: "Consumidor Final",
        NombreCliente: "Sanguinetti, Norberto",
        FechaVenta: "2023-11-23T00:00:00.000Z",
        CantidadProductos: 1,
        Importe: 69128.95,
        ComprobanteERP: "MELI-008",
        ImporteTrasporte: 0,
        PasoActual: "Esperando Interfaz",
      },
    ],
    Validation: [
      {
        Estado: "Pend.Validacion",
        Identi: "20000067429506",
        CodigoCliente: "AR9995",
        TipoCliente: "Responsable Inscripto",
        NombreCliente: "Gimenez, Veronica",
        FechaVenta: "2023-11-20T00:00:00.000Z",
        CantidadProductos: 1,
        Importe: 23444.12,
        ComprobanteERP: "MELI-007",
        ImporteTrasporte: 0,
        PasoActual: "Validar IVA",
      },
      {
        Estado: "Pend.Validacion",
        Identi: "20000067429505",
        CodigoCliente: "AR9993",
        TipoCliente: "Consumidor Final",
        NombreCliente: "Ferran, Javier Osvaldo",
        FechaVenta: "2023-11-18T00:00:00.000Z",
        CantidadProductos: 1,
        Importe: 48106.35,
        ComprobanteERP: "MELI-006",
        ImporteTrasporte: 0,
        PasoActual: "Validar IVA",
      },
    ],
    Logistic: [
      {
        Estado: "Importado",
        Identi: "20000067429504",
        CodigoCliente: "AR9993",
        TipoCliente: "Consumidor Final",
        NombreCliente: "Lainz, Julieta",
        FechaVenta: "2023-11-08T00:00:00.000Z",
        CantidadProductos: 1,
        Importe: 36781.1,
        ComprobanteERP: "MELI-005",
        ImporteTrasporte: 0,
        PasoActual: "Picking",
      },
    ],
    Finished: [
      {
        Estado: "Importado",
        Identi: "20000067429503",
        CodigoCliente: "AR9993",
        TipoCliente: "Consumidor Final",
        NombreCliente: "Gimenez, Pablo",
        FechaVenta: "2023-10-22T00:00:00.000Z",
        CantidadProductos: 1,
        Importe: 78138.46,
        ComprobanteERP: "MELI-004",
        ImporteTrasporte: 0,
        PasoActual: "Finalizado",
      },
      {
        Estado: "Importado",
        Identi: "20000067429502",
        CodigoCliente: "AR9995",
        TipoCliente: "Rensponsable Inscripto",
        NombreCliente: "Juárez, Antonia",
        FechaVenta: "2023-10-16T00:00:00.000Z",
        CantidadProductos: 1,
        Importe: 59156.1,
        ComprobanteERP: "MELI-003",
        ImporteTrasporte: 0,
        PasoActual: "Finalizado",
      },
      {
        Estado: "Importado",
        Identi: "20000067429501",
        CodigoCliente: "AR9993",
        TipoCliente: "Consumidor Final",
        NombreCliente: "Perez, Roberto",
        FechaVenta: "2023-10-08T00:00:00.000Z",
        CantidadProductos: 1,
        Importe: 67439.15,
        ComprobanteERP: "MELI-002",
        ImporteTrasporte: 1378.15,
        PasoActual: "Finalizado",
      },
      {
        Estado: "Importado",
        Identi: "20000067429500",
        CodigoCliente: "AR9993",
        TipoCliente: "Consumidor Final",
        NombreCliente: "Loyola, Juan Carlos",
        FechaVenta: "2023-09-27T00:00:00.000Z",
        CantidadProductos: 1,
        Importe: 58137.32,
        ComprobanteERP: "MELI-001",
        ImporteTrasporte: 0,
        PasoActual: "Finalizado",
      },
    ],
  });

  const [salesToChart, setSalesToChart] = useState({
    sales$: [
      {
        Periodo: 202309,
        ImporteVentasSinImpuestos: 58137.32,
      },
      {
        Periodo: 202310,
        ImporteVentasSinImpuestos: 218903.78,
      },
      {
        Periodo: 202311,
        ImporteVentasSinImpuestos: 150988.66,
      },
    ],
    salesQ: [
      {
        Periodo: 202309,
        CantidadVentas: 1,
      },
      {
        Periodo: 202310,
        CantidadVentas: 3,
      },
      {
        Periodo: 202311,
        CantidadVentas: 4,
      },
    ],
  });
  const [change, setChange] = useState(false);
  const [table, setTable] = useState(0);
  const [alert, setAlert] = useState(false);

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
