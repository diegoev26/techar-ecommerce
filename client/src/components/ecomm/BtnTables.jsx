import { ButtonGroup, Button, Col, Row } from "react-bootstrap";

export default function BtnTables({ setTable }) {
  return (
    <ButtonGroup className="w-100 d-flex justify-content-around ms-1">
      <Row xs={1} md={3} xl={5} className="w-100">
        <Col>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => setTable(2)}
            className="shadow w-100 my-1"
          >
            Ventas en Interfaz
          </Button>
        </Col>
        <Col>
          <Button
            variant="outline-warning"
            size="sm"
            onClick={() => setTable(3)}
            className="shadow w-100 my-1"
          >
            Ventas en Validación
          </Button>
        </Col>
        <Col>
          <Button
            variant="outline-info"
            size="sm"
            onClick={() => setTable(4)}
            className="shadow w-100 my-1"
          >
            Ventas en Logística
          </Button>
        </Col>
        <Col>
          <Button
            variant="outline-success"
            size="sm"
            onClick={() => setTable(5)}
            className="shadow w-100 my-1"
          >
            Ventas Terminadas
          </Button>
        </Col>
        <Col>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => setTable(6)}
            className="shadow w-100 my-1"
          >
            Tabla General
          </Button>
        </Col>
      </Row>
    </ButtonGroup>
  );
}
