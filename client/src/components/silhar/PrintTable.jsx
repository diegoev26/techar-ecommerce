import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { BsPrinterFill } from "react-icons/bs";

export default function PrintTable({
  data,
  setDataModal,
  setDataModalSelect,
  setShow,
}) {
  const handleShow = (row) => {
    setDataModal(row);
    for (let i = 1; i <= row.totalBultos; i++) {
      setDataModalSelect((dataModalSelect) => [...dataModalSelect, i]);
    }
    setShow(true);
  };

  const columns = [
    {
      field: "numeroComprobanteCompleto",
      headerName: "Remito",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "totalBultos",
      headerName: "Cantidad Bultos",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "nombreCliente",
      headerName: "Cliente",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "operadorLogistico",
      headerName: "Transportista",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "dirEnt",
      headerName: "Dirección Entrega",
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueGetter: ({ row }) => {
        return `${row.calleEntrega} ${row.numeroCalleEntrega}`;
      },
    },
    {
      field: "ciudadProvinciaEntrega",
      headerName: "Ciudad",
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueGetter: ({ row }) => {
        return `${row.localidadEntrega} - ${row.provinciaEntrega}`;
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Imprimir",
      flex: 0.4,
      headerAlign: "center",
      getActions: ({ row }) => [
        <GridActionsCellItem
          icon={<BsPrinterFill />}
          label="Imprimir"
          onClick={() => handleShow(row)}
        />,
      ],
    },
  ];

  return (
    <>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={50}
        rowsPerPageOptions={[10, 50, 100]}
        density="compact"
        className="rounded bg-light shadow shadow-sm"
        getRowId={(row) => row.numeroComprobanteCompleto}
        autoHeight
      />
    </>
  );
}
