import BtnTables from "./BtnTables";
import { useEffect, useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { GridActionsCellItem } from "@mui/x-data-grid-pro";
import {
  CheckBox,
  Comment,
  Close,
  ContactPage,
  AddComment,
  Timeline,
} from "@mui/icons-material";
import moment from "moment";

export default function SalesTable({
  sales,
  table,
  setTable,
  handleShowValitadion,
  handleShowDelete,
  handleShowInfo,
  handleShowTimeline,
  handleShowComments,
  handleShowAddComment,
}) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    dataToRow(table);
  }, [table]);

  const dataToRow = (op) => {
    switch (op) {
      case 0:
        setRows([]);
        break;
      case 1:
        if (sales.Interface.length > 0) {
          setRows(sales.Interface);
        } else if (sales.Validation.length > 0) {
          setRows(sales.Validation);
        } else if (sales.Logistic.length > 0) {
          setRows(sales.Logistic);
        } else {
          setRows(sales.Finished);
        }
        break;
      case 2:
        setRows(sales.Interface);
        break;
      case 3:
        setRows(sales.Validation);
        break;
      case 4:
        setRows(sales.Logistic);
        break;
      case 5:
        setRows(sales.Finished);
        break;
      default:
        const arrRows = [];
        for (const key in sales) {
          if (Object.hasOwnProperty.call(sales, key)) {
            const arr = sales[key];
            for (let i = 0; i < arr.length; i++) {
              const sale = arr[i];
              arrRows.push(sale);
            }
          }
        }
        setRows(arrRows);
        break;
    }
  };

  const columns = [
    {
      field: "Estado",
      headerName: "Estado",
      align: "center",
      headerAlign: "center",
      flex: 0.5,
    },
    {
      field: "Identi",
      headerName: "Identi",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "TipoCliente",
      headerName: "Tipo Cliente",
      flex: 0.75,
      align: "center",
      valueGetter: ({ value }) => value.slice(9),
      headerAlign: "center",
    },
    {
      field: "NombreCliente",
      headerName: "Nombre Cliente",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "FechaVenta",
      headerName: "Fecha",
      flex: 0.5,
      type: "date",
      align: "center",
      valueFormatter: (params) => moment(params?.value).format("DD/MM/YYYY"),
      headerAlign: "center",
    },
    {
      field: "CantidadProductos",
      headerName: "Q",
      type: "number",
      flex: 0.25,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Importe",
      headerName: "Importe",
      type: "number",
      valueGetter: ({ value }) => "$ " + value,
      flex: 0.5,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "ComprobanteERP",
      headerName: "Comp ERP",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "ImporteTrasporte",
      headerName: "Transporte $",
      flex: 0.5,
      type: "number",
      valueGetter: ({ value }) => "$ " + value,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "PasoActual",
      headerName: "Paso Actual",
      flex: 0.8,
      align: "center",
      headerAlign: "center",
    },
    {
      headerName: "Acciones",
      field: "actions",
      type: "actions",
      flex: 1.5,
      align: "center",
      headerAlign: "center",
      getActions: (data) => [
        <GridActionsCellItem
          icon={<CheckBox />}
          label="Validar"
          onClick={() => {
            handleShowValitadion(data.row);
          }}
          className={
            data.row.Estado === "Importado" ||
            data.row.Estado === "Pend.Ingreso"
              ? "d-none"
              : ""
          }
        />,
        <GridActionsCellItem
          icon={<Timeline />}
          label="Timeline"
          onClick={() => {
            handleShowTimeline(data.row);
          }}
        />,
        <GridActionsCellItem
          icon={<ContactPage />}
          label="Contacto"
          onClick={() => {
            handleShowInfo(data.row);
          }}
        />,
        <GridActionsCellItem
          icon={<AddComment />}
          label="Agregar Comentario"
          onClick={() => {
            handleShowAddComment(data.row);
          }}
        />,
        <GridActionsCellItem
          icon={<Comment />}
          label="Comentarios"
          onClick={() => {
            handleShowComments(data.row);
          }}
        />,
        <GridActionsCellItem
          icon={<Close />}
          label="Delete"
          onClick={() => {
            handleShowDelete(data.row);
          }}
          className={data.row.Estado === "Importado" ? "d-none" : ""}
        />,
      ],
    },
  ];

  return (
    <>
      <Container fluid>
        <Row className="mt-2 w-100 " style={{ margin: 0, padding: 0 }}>
          <Col className="d-flex align-items-center mb-3">
            <BtnTables setTable={setTable} />
          </Col>
        </Row>
        <Row>
          <Col className="w-100">
            <DataGrid
              className="shadow-sm bg-light"
              rows={rows}
              columns={columns}
              key={(row) => row.Identi}
              getRowId={(row) => row.Identi}
              page={page}
              onPageChange={(newPage) => setPage(newPage)}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              rowsPerPageOptions={[5, 10, 25, 50]}
              pagination
              density="compact"
              autoHeight={true}
              disableColumnPinning
              disableSelectionOnClick
              initialState={{
                sorting: {
                  sortModel: [{ field: "FechaVenta", sort: "desc" }],
                },
              }}
              components={{
                Toolbar: GridToolbar,
              }}
              getRowClassName={(params) => {
                if (
                  params.row.Estado === "Pend.Validacion" ||
                  params.row.Estado === "Error"
                ) {
                  return "text-warning";
                } else if (params.row.Estado === "Pend.Ingreso") {
                  return "text-danger";
                } else if (params.row.PasoActual !== "Finalizado") {
                  return "text-info";
                } else {
                  return "";
                }
              }}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}
