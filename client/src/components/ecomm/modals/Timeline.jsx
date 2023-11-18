import { useState } from "react";
import { Modal, Container, Row, Col } from "react-bootstrap";
import { BsCheckLg } from "react-icons/bs";
import TitleModal from "./helpers/TitleModal";

export default function Timeline({
  showTimeline,
  steps,
  handleHideTimeline,
  clientName,
  actualStep,
}) {
  const [data, setData] = useState({
    tax: false,
    client: false,
    census: false,
    requestPercepts: false,
    perceptsPaid: false,
    confirm: false,
    picking: false,
    deliveryNote: false,
    invoice: false,
    delivered: false,
  });

  const handleShow = () => {
    setData((old) => ({
      ...old,
      tax: steps.substring(0, 1) === "S" ? true : false,
    }));
    setData((old) => ({
      ...old,
      client: steps.substring(1, 2) === "S" ? true : false,
    }));
    setData((old) => ({
      ...old,
      census: steps.substring(2, 3) === "S" ? true : false,
    }));
    setData((old) => ({
      ...old,
      requestPercepts: steps.substring(3, 4) === "S" ? true : false,
    }));
    setData((old) => ({
      ...old,
      perceptsPaid: steps.substring(4, 5) === "S" ? true : false,
    }));
    setData((old) => ({
      ...old,
      confirm: steps.substring(5, 6) === "S" ? true : false,
    }));
    setData((old) => ({
      ...old,
      picking: steps.substring(6, 7) === "S" ? true : false,
    }));
    setData((old) => ({
      ...old,
      deliveryNote: steps.substring(7, 8) === "S" ? true : false,
    }));
    setData((old) => ({
      ...old,
      invoice: steps.substring(8, 9) === "S" ? true : false,
    }));
    setData((old) => ({
      ...old,
      delivered: steps.substring(9, 10) === "S" ? true : false,
    }));
  };

  const handleClose = () => {
    setData({
      tax: false,
      client: false,
      census: false,
      requestPercepts: false,
      perceptsPaid: false,
      confirm: false,
      picking: false,
      deliveryNote: false,
      invoice: false,
      delivered: false,
    });
    handleHideTimeline();
  };

  return (
    <Modal
      show={showTimeline}
      onHide={() => handleClose()}
      onShow={() => handleShow()}
      aria-labelledby="Validacion"
      centered
      animation
      style={{ width: "107.5%" }}
      size="xl"
    >
      <Modal.Header closeButton>
        <Modal.Title
          id="modal-validacion"
          className="d-flex justify-content-center w-100"
        >
          <TitleModal clientName={clientName} actualStep={actualStep} />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid className="py-5">
          <Row>
            <Col lg={12}>
              <div className="horizontal-timeline">
                <ul className="list-inline items">
                  <li className="list-inline-item items-list">
                    <div className="px-4">
                      <div
                        className={`event-date badge bg-${
                          data.tax ? "success" : "secondary"
                        }`}
                      >
                        {data.tax ? <BsCheckLg /> : "X"}
                      </div>
                      <h5 className="pt-2">Validar IVA</h5>
                    </div>
                  </li>
                  <li className="list-inline-item items-list">
                    <div className="px-4">
                      <div
                        className={`event-date badge bg-${
                          data.client ? "success" : "secondary"
                        }`}
                      >
                        {data.client ? <BsCheckLg /> : "X"}
                      </div>
                      <h5 className="pt-2">Validar Cliente</h5>
                    </div>
                  </li>
                  <li className="list-inline-item items-list">
                    <div className="px-4">
                      <div
                        className={`event-date badge bg-${
                          data.census ? "success" : "secondary"
                        }`}
                      >
                        {data.census ? <BsCheckLg /> : "X"}
                      </div>
                      <h5 className="pt-2">Validar Padrón</h5>
                    </div>
                  </li>
                  <li className="list-inline-item items-list">
                    <div className="px-4">
                      <div
                        className={`event-date badge bg-${
                          data.requestPercepts ? "success" : "secondary"
                        }`}
                      >
                        {data.requestPercepts ? <BsCheckLg /> : "X"}
                      </div>
                      <h5 className="pt-2">Solicitar Percepciones</h5>
                    </div>
                  </li>
                  <li className="list-inline-item items-list">
                    <div className="px-4">
                      <div
                        className={`event-date badge bg-${
                          data.perceptsPaid ? "success" : "secondary"
                        }`}
                      >
                        {data.perceptsPaid ? <BsCheckLg /> : "X"}
                      </div>
                      <h5 className="pt-2">Cobrar Percepciones</h5>
                    </div>
                  </li>
                  <li className="list-inline-item items-list">
                    <div className="px-4">
                      <div
                        className={`event-date badge bg-${
                          data.confirm ? "success" : "secondary"
                        }`}
                      >
                        {data.confirm ? <BsCheckLg /> : "X"}
                      </div>
                      <h5 className="pt-2">Confirmar Pedido</h5>
                    </div>
                  </li>
                  <li className="list-inline-item items-list">
                    <div className="px-4">
                      <div
                        className={`event-date badge bg-${
                          data.picking ? "success" : "secondary"
                        }`}
                      >
                        {data.picking ? <BsCheckLg /> : "X"}
                      </div>
                      <h5 className="pt-2">Picking</h5>
                    </div>
                  </li>
                  <li className="list-inline-item items-list">
                    <div className="px-4">
                      <div
                        className={`event-date badge bg-${
                          data.deliveryNote ? "success" : "secondary"
                        }`}
                      >
                        {data.deliveryNote ? <BsCheckLg /> : "X"}
                      </div>
                      <h5 className="pt-2">Remito</h5>
                    </div>
                  </li>
                  <li className="list-inline-item items-list">
                    <div className="px-4">
                      <div
                        className={`event-date badge bg-${
                          data.invoice ? "success" : "secondary"
                        }`}
                      >
                        {data.invoice ? <BsCheckLg /> : "X"}
                      </div>
                      <h5 className="pt-2">Factura</h5>
                    </div>
                  </li>
                  <li className="list-inline-item items-list">
                    <div className="px-4">
                      <div
                        className={`event-date badge bg-${
                          data.delivered ? "success" : "secondary"
                        }`}
                      >
                        {data.delivered ? <BsCheckLg /> : "X"}
                      </div>
                      <h5 className="pt-2">Entregado</h5>
                    </div>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
}
