import { useState } from "react";
import { Col, Container, Row, Form, Button } from "react-bootstrap";
import Title from "../components/Title";
import { massiveMailing } from "../apis/main";
import Swal from "sweetalert2";
import Loader from "./Loader";

export default function Mailing() {
  const [data, setData] = useState({
    maenfa: false,
    maenrc: false,
    maenpv: false,
    text: "",
  });
  const [err, setErr] = useState({ status: false, message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubject = (e) => {
    restoreErr();
    setData((old) => ({
      ...old,
      subject: e.target.value.trim() === "" ? undefined : e.target.value,
    }));
  };

  const handleSwitch = (e) => {
    restoreErr();
    setData((old) => ({ ...old, [e.target.id]: e.target.checked }));
  };

  const handleText = (e) => {
    restoreErr();
    setData((old) => ({ ...old, text: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    restoreErr();
    if (
      data.maenfa === undefined ||
      typeof data.maenfa !== "boolean" ||
      data.maenrc === undefined ||
      typeof data.maenrc !== "boolean" ||
      data.maenpv === undefined ||
      typeof data.maenpv !== "boolean" ||
      (!data.maenfa && !data.maenrc && !data.maenpv) ||
      data.text === undefined ||
      typeof data.text !== "string" ||
      data.text.trim() === ""
    ) {
      if (
        data.maenfa === undefined ||
        typeof data.maenfa !== "boolean" ||
        data.maenrc === undefined ||
        typeof data.maenrc !== "boolean" ||
        data.maenpv === undefined ||
        typeof data.maenpv !== "boolean" ||
        (!data.maenfa && !data.maenrc && !data.maenpv)
      ) {
        setErr({
          status: true,
          message: "Debe seleccionar al menos una opción de envío",
        });
      } else {
        setErr({ status: true, message: "El campo texto es obligatorio" });
      }
      return;
    }

    setLoading(true);
    const { code, response, error } = await massiveMailing(data);
    setData({
      maenfa: false,
      maenrc: false,
      maenpv: false,
      text: "",
    });

    switch (code) {
      case 200:
        Swal.fire({
          title: "Comunicación exitosa",
          text: response.message,
          icon: "success",
          timer: 3000,
          showCancelButton: false,
          showCloseButton: false,
          showConfirmButton: false,
          showDenyButton: false,
        });
        break;
      case 207:
        Swal.fire({
          title: "Comunicación incompleta",
          text: response.message,
          icon: "warning",
          timer: 3000,
          showCancelButton: false,
          showCloseButton: false,
          showConfirmButton: false,
          showDenyButton: false,
        });
        break;
      default:
        Swal.fire({
          title: "Error al enviar comunicación",
          text: error.message,
          icon: "error",
          timer: 3000,
          showCancelButton: false,
          showCloseButton: false,
          showConfirmButton: false,
          showDenyButton: false,
        });
        break;
    }
    setLoading(false);
  };

  const restoreErr = () => {
    setErr({ status: false, message: "" });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container fluid>
      <Title text="Centro de envío de mails a clientes y proveedores" />
      <Row className="w-100 d-flex justify-content-center mt-4">
        <Col
          xs={8}
          className="d-flex justify-content-evenly shadow rounded-pill py-2"
        >
          <Form.Check
            type="switch"
            id="maenfa"
            label="Clientes (facturas)"
            onChange={handleSwitch}
          />
          <Form.Check
            type="switch"
            id="maenrc"
            label="Clientes (recibos)"
            onChange={handleSwitch}
          />
          <Form.Check
            type="switch"
            id="maenpv"
            label="Proveedores"
            onChange={handleSwitch}
          />
        </Col>
      </Row>
      <Row className="w-100 d-flex justify-content-center align-items-center mt-3">
        <Col
          xs={4}
          className="d-flex justify-content-center align-items-center"
        >
          <Form.Label>
            <b>Asunto</b> (en caso de no ingresar, se usará el asunto por
            defecto):
          </Form.Label>
        </Col>
        <Col
          xs={4}
          className="d-flex justify-content-center align-items-center"
        >
          <Form.Control
            type="text"
            placeholder="Comunicación HAFELE"
            onChange={handleSubject}
          />
        </Col>
      </Row>
      <Row className="w-100 d-flex justify-content-center">
        <Form.Control
          as="textarea"
          placeholder="Ingrese el texto a enviar"
          className="mb-2 mt-4 w-75"
          style={{ height: 250 }}
          onChange={handleText}
        />
      </Row>
      <Row className={err.status ? "w-100" : "d-none"}>
        <Col xs={10}>
          <p className="text-danger fs-6 text-end">{err.message}</p>
        </Col>
      </Row>
      <Row>
        <Col xs={10} className="d-flex justify-content-end">
          <Button onClick={handleClick} variant="outline-success">
            Enviar
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
