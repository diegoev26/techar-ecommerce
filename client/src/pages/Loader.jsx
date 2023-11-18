import { Container, Spinner } from "react-bootstrap";

export default function Loader() {
  return (
    <Container fluid className="d-flex justify-content-center pt-4 mt-4">
      <Spinner animation="grow" variant="dark"></Spinner>
    </Container>
  );
}
