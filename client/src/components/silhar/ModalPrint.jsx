import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { deliveryNotesPrinted, printDeliveryNote } from "../../apis/silhar";
import { useState } from "react";
import Swal from "sweetalert2";

export default function ModalPrint({
  setLoading,
  deliveryNotesToData,
  dataModalSelect,
  setDataModalSelect,
  dataModal,
  setDataModal,
  show,
  setShow,
}) {
  const printerId = 3;
  const labelId = 1;
  const [error, setError] = useState("");
  const [selectedLabel, setSelectedLabel] = useState(0);
  const [selectedRange, setSelectedRange] = useState({ init: 1, end: 1 });
  const [printOption, setPrintOption] = useState({ all: true });

  const handlePrintSuccess = async (data) => {
    const arrOut = [];
    let cont = 0;
    while (cont < data.length) {
      arrOut.push({
        modfor: "ST",
        codfor: `RX${data[cont].reference.split("-")[0]}`,
        nrofor: parseInt(data[cont].reference.split("-")[1]),
        packageNumber: parseInt(data[cont].reference.split("-")[2]),
      });
      cont++;
    }
    const { response, error } = await deliveryNotesPrinted(
      arrOut,
      data.length === dataModal.totalBultos,
      printerId,
      labelId
    );
    if (response === undefined) {
      Swal.fire({
        title: "Error al marcar los remitos como impresos",
        icon: "error",
        text: error.message,
        showConfirmButton: false,
        showDenyButton: false,
        showCloseButton: true,
      });
    }
  };

  const handlePrintOptionChange = (e) => {
    setError("");
    setPrintOption({ [e.target.value]: true });
  };

  const handleClose = () => {
    setSelectedLabel(0);
    setSelectedRange({ init: 0, end: 0 });
    setDataModalSelect([]);
    setDataModal({});
    setShow(false);
    setPrintOption({ all: true });
    setError("");
  };

  const handlePrint = async () => {
    setError("");
    setLoading(true);
    const labelArr = [];
    if (!printOption.all) {
      if (printOption.range) {
        if (selectedRange.init > selectedRange.end) {
          setLoading(false);
          setError("La etiqueta de inicio no puede ser mayor que la de fin");
          return;
        }
        for (let i = selectedRange.init; i <= selectedRange.end; i++) {
          labelArr.push(i);
        }
      }
      if (printOption.one) {
        labelArr.push(selectedLabel === 0 ? 1 : selectedLabel);
      }
    }
    const { response, error } = await printDeliveryNote({
      modfor: dataModal.modfor,
      codfor: dataModal.codfor,
      nrofor: dataModal.nrofor,
      idPrinter: printerId,
      idLabel: labelId,
      labels: labelArr.length > 0 ? labelArr : 0 || undefined || false,
    });

    if (response === undefined) {
      console.log(error);
      Swal.fire({
        title: "Impresión fallida",
        icon: "error",
        text: error.message,
        showConfirmButton: false,
        showDenyButton: false,
        showCloseButton: false,
        timer: 3000,
      });
      //log?
    }

    if (response !== undefined) {
      if (error !== undefined) {
        Swal.fire({
          title: "Impresión parcial",
          icon: "warning",
          text: error.message,
          showConfirmButton: false,
          showDenyButton: false,
          showCloseButton: false,
          timer: 3000,
        });
        //log?
      }

      if (error === undefined) {
        Swal.fire({
          title: response.message,
          icon: "success",
          showConfirmButton: false,
          showDenyButton: false,
          showCloseButton: false,
          timer: 3000,
        });
      }
      await handlePrintSuccess(response.data);
    }
    await deliveryNotesToData();
    setLoading(false);
    handleClose();
  };

  return (
    <Modal show={show} onHide={() => handleClose()}>
      <Modal.Header closeButton>
        <Modal.Title>
          Imprimir etiqueta remito {dataModal.numeroComprobanteCompleto}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col className="d-flex align-items-center">
            <span>Seleccione etiqueta a imprimir: </span>
          </Col>{" "}
          <Col className="d-flex align-items-center">
            <Form.Select
              aria-label="Default select example"
              onChange={handlePrintOptionChange}
            >
              <option value={"all"}>Todas</option>
              <option value={"one"} className="">
                Individual
              </option>
              <option value={"range"}>Por rango</option>
            </Form.Select>
          </Col>
        </Row>
        <Row
          className={
            printOption.one
              ? "d-flex align-items-center justify-content-end my-2"
              : "d-none"
          }
        >
          <Form.Select
            className="d-flex align-items-center justify-content-center w-50"
            onChange={(e) => setSelectedLabel(e.target.value)}
          >
            {dataModalSelect.map((data, key) => {
              return (
                <option value={data} key={key}>
                  {data}
                </option>
              );
            })}
          </Form.Select>
        </Row>
        <Row
          className={
            printOption.range
              ? "d-flex align-items-center justify-content-end my-2"
              : "d-none"
          }
        >
          <Col className="d-flex align-items-center justify-content-center w-25">
            <label className="me-2">Desde:</label>
            <Form.Select
              onChange={(e) =>
                setSelectedRange({
                  ...selectedRange,
                  init: parseInt(e.target.value),
                })
              }
            >
              {dataModalSelect.map((data, key) => {
                return (
                  <option value={data} key={key}>
                    {data}
                  </option>
                );
              })}
            </Form.Select>
          </Col>
          <Col className="d-flex align-items-center justify-content-center w-25">
            <label className="me-2">Hasta:</label>
            <Form.Select
              onChange={(e) =>
                setSelectedRange({
                  ...selectedRange,
                  end: parseInt(e.target.value),
                })
              }
            >
              {dataModalSelect.map((data, key) => {
                return (
                  <option value={data} key={key}>
                    {data}
                  </option>
                );
              })}
            </Form.Select>
          </Col>
          <Row className="mt-1 d-flex align-items-center justify-content-end fs-6">
            <label className="text-danger">
              {error.trim() === "" ? null : error}
            </label>
          </Row>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => handleClose()}
        >
          Cancelar
        </Button>
        <Button
          variant="outline-success"
          size="sm"
          onClick={() => handlePrint()}
        >
          Imprimir
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
