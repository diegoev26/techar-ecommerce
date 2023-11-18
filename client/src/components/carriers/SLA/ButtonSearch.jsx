import { Button, Col } from "react-bootstrap";

export default function ButtonSearch({ handleSubmit }) {
  return (
    <Col className="d-flex justify-content-end w-100">
      <Button onClick={handleSubmit} variant="outline-success" size="sm">
        Enviar
      </Button>
    </Col>
  );
}
