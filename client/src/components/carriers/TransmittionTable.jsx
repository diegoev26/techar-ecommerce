import { DataGrid } from "@mui/x-data-grid";

export default function TransmittionTable({ data, setDisabled, setSelection }) {
  const handleRowSelection = (rowsId) => {
    if (rowsId.length < 1) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
    setSelection(rowsId);
  };

  const columns = [
    {
      field: "codfor",
      headerName: "Tipo Comprobante",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "deliveryNoteNumber",
      headerName: "Numero",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "packageQuantity",
      headerName: "Cantidad Bultos",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "logisticOperator",
      headerName: "Transportista",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "clientName",
      headerName: "Cliente",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "addressL1",
      headerName: "Dirección Entrega",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "addressL2",
      headerName: "Ciudad",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
  ];
  return (
    <>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={100}
        rowsPerPageOptions={[10, 50, 100]}
        //autoPageSize
        density="compact"
        className="rounded bg-light shadow shadow-sm"
        getRowId={(row) => `${row.codfor}-${row.nrofor}`}
        autoHeight
        //hideFooter
        checkboxSelection
        onRowSelectionModelChange={(rowsId) => {
          handleRowSelection(rowsId);
        }}
      />
    </>
  );
}
