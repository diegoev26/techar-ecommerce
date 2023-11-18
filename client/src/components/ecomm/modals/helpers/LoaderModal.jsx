import { Col, Spinner } from "react-bootstrap";

export default function loaderModal() {
  return (
    <Col className="d-flex justify-content-center align-items-center my-4">
      <Spinner animation="grow" className="text-dark" />
    </Col>
  );
}
