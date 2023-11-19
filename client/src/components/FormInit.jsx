import { Form, Col, Row, Button, Container, Spinner } from "react-bootstrap";

export default function FormInit({
  buttonText,
  userChange,
  passChange,
  submit,
  errorForm,
  text,
  loading,
}) {
  return (
    <Container className="mt-4 pt-4">
      <Container fluid className="d-flex justify-content-center">
        <Col xs={12} lg={10} xxl={8}>
          <Form
            className="shadow border border-secondary rounded rounded-4 mx-auto mt-2"
            onSubmit={(e) => submit(e)}
          >
            <Form.Group
              className="mx-auto px-2 pt-2 mt-2 mb-3 w-75"
              controlId="user"
            >
              <Form.Label>Usuario</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese usuario"
                onChange={(e) => userChange(e)}
                autoComplete="off"
              />
            </Form.Group>
            <Form.Group
              className="mx-auto px-2 pt-2 mb-3 w-75"
              controlId="pass"
            >
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingrese contraseña"
                onChange={(e) => passChange(e)}
                autoComplete="off"
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Row className="d-flex align-items-center mb-2">
                <Col
                  xs={6}
                  md={3}
                  className="d-flex justify-content-center justify-content-md-end mt-2 mb-4"
                >
                  {loading ? (
                    <Spinner animation="border" variant="success" />
                  ) : (
                    <Button
                      variant="outline-success"
                      type="submit"
                      onClick={(e) => submit(e)}
                    >
                      {buttonText}
                    </Button>
                  )}
                </Col>
                <Col />
              </Row>
              <Row
                className={
                  !errorForm
                    ? "d-none"
                    : "d-flex align-items-start justify-content-center w-100"
                }
              >
                <Col xs={10} lg={9} className="">
                  <label className="text-danger">{text}</label>
                </Col>
              </Row>
            </Form.Group>
          </Form>
        </Col>
      </Container>
    </Container>
  );
}
