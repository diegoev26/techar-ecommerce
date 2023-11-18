import { Col, Container, Form, Row } from "react-bootstrap";

export default function FormSearchSLA({ form, setForm, setData }) {
  const handleCodforChange = (e) => {
    setData([]);
    setForm({
      modfor: e.target.value === "HR" ? "FC" : "ST",
      codfor: e.target.value,
      nrofor: "",
    });
  };
  const handleNroforChange = (e) => {
    setData([]);
    e.target.value.trim() !== ""
      ? setForm({ ...form, nrofor: parseInt(e.target.value.trim()) })
      : setForm({ ...form, nrofor: "" });
  };

  return (
    <Container fluid className="mt-3">
      <Row className="d-flex justify-content-center">
        <Col xs={4} className="d-flex justify-content-start align-items-center">
          <Form.Label>Seleccione comprobante:</Form.Label>
        </Col>
        <Col xs={4} className="d-flex justify-content-start align-items-center">
          <Form.Select
            size="sm"
            onChange={handleCodforChange}
            defaultValue={false}
          >
            <option disabled value={false}>
              Elija una opción
            </option>
            <option value="HR">HR</option>
            <option value="RX0011">RX0011</option>
            <option value="RX0012" disabled>
              RX0012
            </option>
          </Form.Select>
        </Col>
      </Row>
      <Row className="d-flex justify-content-center mt-1">
        <Col xs={4} className="d-flex justify-content-start align-items-center">
          <Form.Label>Ingrese número:</Form.Label>
        </Col>
        <Col xs={4} className="d-flex justify-content-start align-items-center">
          <Form.Control
            value={form.nrofor}
            size="sm"
            type="number"
            onChange={handleNroforChange}
          />
        </Col>
      </Row>
    </Container>
  );
}
