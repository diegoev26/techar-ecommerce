import { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { printReprocessLabel } from "../../apis/silhar";
import Swal from "sweetalert2";

export default function ModalReprocess({ show, onHide, setLoading }) {
  const printerId = 2,
    tippro = "RV";
  const [artcod, setArtcod] = useState("");
  const [impEAN, setImpEAN] = useState(true);
  const [impQR, setImpQR] = useState(true);
  const [impPACK, setImpPACK] = useState(true);
  const [q, setQ] = useState(0);
  const [errMsg, setErrMsg] = useState("");

  const handleArtcodChange = (e) => {
    setErrMsg("");
    setArtcod(e.target.value);
  };

  const handleQChange = (e) => {
    setErrMsg("");
    setQ(
      typeof e.target.value !== "number"
        ? parseInt(e.target.value)
        : e.target.value
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handlePrint();
  };

  const handleClose = () => {
    setArtcod("");
    setImpEAN(true);
    setImpQR(true);
    setImpPACK(true);
    setQ(0);
    setErrMsg("");
    onHide();
  };

  const handlePrint = async () => {
    setLoading(true);

    if (
      tippro === undefined ||
      tippro.trim() === "" ||
      artcod === undefined ||
      artcod.trim() === ""
    ) {
      setErrMsg("Tipo y código de productos son obligatorios");
      setLoading(false);
      return;
    }
    if (q === undefined || isNaN(q) || q < 1) {
      setErrMsg("La cantidad de etiquetas a imprimir no puede ser menor a 1");
      setLoading(false);
      return;
    }

    const { code, response, error } = await printReprocessLabel([
      {
        tippro,
        artcod,
        impEAN,
        impQR,
        impPACK,
        q,
        printerId,
      },
    ]);

    setLoading(false);
    switch (code) {
      case 200:
        Swal.fire({
          title: response.message,
          icon: "success",
          showConfirmButton: false,
          showDenyButton: false,
          showCloseButton: false,
          timer: 2000,
        });
        break;
      case 207:
        Swal.fire({
          title: response.message,
          icon: "warning",
          showConfirmButton: false,
          showDenyButton: false,
          showCloseButton: false,
          timer: 2000,
        });
        break;

      default:
        Swal.fire({
          title: error.message,
          icon: "error",
          showConfirmButton: false,
          showDenyButton: false,
          showCloseButton: false,
          timer: 2000,
        });
        break;
    }
    handleClose();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header className="d-flex justify-content-center">
        <Modal.Title>Etiquetas de Producto para Reproceso</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="d-flex align-items-center">
            <Col className="d-flex justify-content-center">
              <Form.Label>Tipo Producto</Form.Label>
            </Col>
            <Col xs={8} className="d-flex justify-content-start">
              <Form.Label>RV</Form.Label>
            </Col>
          </Row>
          <Row className="d-flex align-items-center mt-1">
            <Col className="d-flex justify-content-center">
              <Form.Label>Codigo Artículo</Form.Label>
            </Col>
            <Col xs={8} className="d-flex justify-content-center">
              <Form.Control
                type="text"
                value={artcod}
                onChange={handleArtcodChange}
              />
            </Col>
          </Row>

          <Row className="d-flex align-items-center">
            <Col className="d-flex justify-content-evenly mt-3">
              <Form.Check
                type="switch"
                label="EAN"
                checked={impEAN}
                onChange={() => {
                  setImpEAN(!impEAN);
                }}
              />
              <Form.Check
                type="switch"
                label="QR"
                checked={impQR}
                onChange={() => {
                  setImpQR(!impQR);
                }}
              />
              <Form.Check
                type="switch"
                label="PACK"
                checked={impPACK}
                onChange={() => {
                  setImpPACK(!impPACK);
                }}
              />
            </Col>
          </Row>
          <Row className="d-flex align-items-center mt-2">
            <Col className="d-flex justify-content-center">
              <Form.Label>Cantidad de etiquetas a imprimir</Form.Label>
            </Col>
            <Col xs={3} className="d-flex justify-content-center">
              <Form.Control type="number" value={q} onChange={handleQChange} />
            </Col>
          </Row>
        </Form>
        {errMsg.trim() === "" ? null : (
          <Col className="w-100 d-flex justify-content-end align-items-end mt-1 pe-2">
            <span className="text-danger fs-6">{errMsg}</span>
          </Col>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" size="sm" onClick={handleClose}>
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
