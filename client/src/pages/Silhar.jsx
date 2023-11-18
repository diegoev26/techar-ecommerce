import { Button, Col, Container, Row } from "react-bootstrap";
import { useState, useEffect } from "react";
import { getDeliveryNotes } from "../apis/silhar";
import Swal from "sweetalert2";
import Loader from "./Loader";
import ModalPrintAgain from "../components/silhar/ModalPrintAgain";
import PrintTable from "../components/silhar/PrintTable";
import ModalPrint from "../components/silhar/ModalPrint";
import Title from "../components/Title";
import ModalReprocess from "../components/silhar/ModalReprocess";

export default function Silhar() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPrintAgain, setShowPrintAgain] = useState(false);
  const [dataModalSelect, setDataModalSelect] = useState([]);
  const [dataModal, setDataModal] = useState({});
  const [show, setShow] = useState(false);
  const [showReprocess, setShowReprocess] = useState(false);

  useEffect(() => {
    deliveryNotesToData();
  }, []);

  const handleReprocessClose = () => {
    setShowReprocess(false);
  };

  const handleReprocess = () => {
    setShowReprocess(true);
  };

  const handlePrintAgainClose = () => {
    setShowPrintAgain(false);
  };

  const handlePrintAgain = () => {
    setShowPrintAgain(true);
  };

  const dateToString = (date) => {
    return (
      date.getFullYear() +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      date.getDate().toString().padStart(2, "0")
    );
  };

  const deliveryNotesToData = async (
    stringDate = (parseInt(dateToString(new Date())) - 200).toString()
  ) => {
    setLoading(true);
    setData([]);
    const { error, response } = await getDeliveryNotes(stringDate);
    if (error !== undefined) {
      if (error.code === 201) {
        Swal.fire({
          title: error.message,
          icon: "warning",
          text: "Aguarde a que se generen nuevas etiquetas para imprimir",
          timer: 2500,
          showConfirmButton: false,
          showDenyButton: false,
          showCloseButton: false,
        });
      } else {
        Swal.fire({
          title: "El proceso no pudo ser completado",
          icon: "error",
          text: error.message,
          timer: 4000,
          showConfirmButton: false,
          showDenyButton: false,
          showCloseButton: false,
        });
      }
      setLoading(false);
      return;
    }
    setData(response);
    setLoading(false);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Container fluid className="shadow-sm pt-2 vh-100">
        <Row className="d-flex justify-content-evenly align-items-center px-2">
          <Col>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleReprocess}
            >
              Etiquetas Reproceso
            </Button>
          </Col>
          <Title text="SILHAR - Sistema integrado de logística" />
          <Col className="d-flex justify-content-end align-items-center me-4">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handlePrintAgain}
            >
              Reimprimir Remito
            </Button>
          </Col>
        </Row>
        <PrintTable
          data={data}
          setDataModal={setDataModal}
          setDataModalSelect={setDataModalSelect}
          setShow={setShow}
        />
      </Container>
      <ModalPrint
        setLoading={setLoading}
        deliveryNotesToData={deliveryNotesToData}
        dataModalSelect={dataModalSelect}
        setDataModalSelect={setDataModalSelect}
        dataModal={dataModal}
        setDataModal={setDataModal}
        show={show}
        setShow={setShow}
      />
      <ModalPrintAgain
        show={showPrintAgain}
        onHide={handlePrintAgainClose}
        setLoading={setLoading}
        deliveryNotesToData={deliveryNotesToData}
      />
      <ModalReprocess
        show={showReprocess}
        setLoading={setLoading}
        onHide={handleReprocessClose}
      />
    </>
  );
}
