import { Card, Col, Container, Row } from "react-bootstrap";

export default function Cards({ sales }) {
  return (
    <>
      <Container fluid>
        <Row>
          <Col md={6} lg={3} className="mb-3">
            <Card
              id="cardErrores"
              className={
                sales.Interface.length === 0
                  ? "border-danger text-danger mb-3 h-100"
                  : "text-white bg-danger mb-3 h-100"
              }
            >
              <Card.Body className="shadow">
                <Card.Title>
                  <h3> Ventas en interfaz</h3>
                </Card.Title>
                <Card.Text className="fs-4">
                  Cantidad: {sales.Interface.length}
                  <span id="cantErrores"></span>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3} className="mb-3">
            <Card
              id="cardValidacion"
              className={
                sales.Validation.length === 0
                  ? "border-warning text-warning mb-3 h-100"
                  : "text-white bg-warning mb-3 h-100"
              }
            >
              <Card.Body className="shadow">
                <Card.Title>
                  <h3>Ventas en validación</h3>
                </Card.Title>
                <Card.Text className="fs-4">
                  Cantidad: {sales.Validation.length}
                  <span id="cantValidacion"></span>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3} className="mb-3">
            <Card
              id="cardLogistica"
              className={
                sales.Logistic.length === 0
                  ? "border-info text-info mb-3 h-100"
                  : "text-white bg-info mb-3 h-100"
              }
            >
              <Card.Body className="shadow">
                <Card.Title>
                  <h3>Ventas en logística</h3>
                </Card.Title>
                <Card.Text className="fs-4">
                  Cantidad: {sales.Logistic.length}
                  <span id="cantLogistica"></span>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3} className="mb-3">
            <Card
              id="cardFinalizadas"
              className={
                sales.Finished.length === 0
                  ? "border-success text-success mb-3 h-100"
                  : "text-white bg-success mb-3 h-100"
              }
            >
              <Card.Body className="shadow">
                <Card.Title>
                  <h3>Ventas finalizadas</h3>
                </Card.Title>
                <Card.Text className="fs-4">
                  Cantidad: {sales.Finished.length}
                  <span id="cantFinalizadas"></span>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
