import { Col, Container, Form, Row } from "react-bootstrap";

export default function NotDelivered({
  option,
  setOption,
  setNewHR,
  setErrMsg,
}) {
  const handleChange = (e) => {
    setErrMsg("");
    setOption(e.target.value);
  };
  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
    >
      <Col>
        <Row>
          <Form.Select
            aria-label="Default select example"
            onSubmit={(e) => {
              e.preventDefault();
            }}
            onChange={(e) => handleChange(e)}
            defaultValue={0}
          >
            <option disabled value={0}>
              Elija opción
            </option>
            <option value="A">Anular</option>
            <option value="T">Transferir</option>
          </Form.Select>
        </Row>
        {option === "T" ? (
          <Row>
            <Form.Control
              type="number"
              placeholder="Ingrese nueva HR para el remito"
              className="mt-2"
              onChange={(e) => {
                setErrMsg("");
                setNewHR(e.target.value);
              }}
            />
          </Row>
        ) : null}
      </Col>
    </Container>
  );
}
