import { Button, Form, Modal, Row } from "react-bootstrap";
import { useState } from "react";
import { deliveryNotePrintAgain } from "../../apis/silhar";
import Swal from "sweetalert2";

export default function ModalPrintAgain({
  show,
  onHide,
  deliveryNotesToData,
  setLoading,
}) {
  const [codfor, setCodfor] = useState("RX0011");
  const [nrofor, setNrofor] = useState(0);
  const validInput = new RegExp("[0-9]");

  const handleCodforChange = (e) => {
    setCodfor(e.target.value);
  };

  const handleNroforChange = (e) => {
    setNrofor(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      return;
    }
    if (!validInput.test(e.key)) {
      e.preventDefault();
    }
  };

  const handlePrintAgain = async (e) => {
    setLoading(true);
    const { response, error } = await deliveryNotePrintAgain({
      modfor: "ST",
      codfor,
      nrofor,
    });

    response !== undefined
      ? Swal.fire({
          title: response.message,
          timer: 3000,
          icon: "success",
          showCancelButton: false,
          showCloseButton: false,
          showConfirmButton: false,
          showDenyButton: false,
        })
      : Swal.fire({
          title: error.message,
          timer: 3000,
          icon: "error",
          showCancelButton: false,
          showCloseButton: false,
          showConfirmButton: false,
          showDenyButton: false,
        });

    await deliveryNotesToData();
    setLoading(false);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <b>Reimprimir Remito</b>
      </Modal.Header>
      <Modal.Body className="m-1">
        <Form className="d-block" onSubmit={handlePrintAgain}>
          <Row className="d-flex align-items-center justify-content-center mb-2">
            <label className="w-50">Tipo de comprobante:</label>
            <Form.Select onChange={handleCodforChange} className="w-50">
              <option value="RX0011">RX0011</option>
              <option value="RX0012" className="d-none">
                RX0012
              </option>
            </Form.Select>
          </Row>
          <Row className="d-flex align-items-center justify-content-center">
            <label className="w-50">Número:</label>
            <Form.Control
              onKeyDown={handleKeyPress}
              onChange={handleNroforChange}
              className="w-50"
            />
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-success"
          size="sm"
          type="submit"
          onClick={handlePrintAgain}
        >
          Reimprimir
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
