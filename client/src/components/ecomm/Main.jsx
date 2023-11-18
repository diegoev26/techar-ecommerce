import Cards from "./Cards";
import Sales$ from "./Sales$";
import SalesQ from "./SalesQ";
import { Col, Container, Row } from "react-bootstrap";

export default function Main({ sales, salesToChart }) {
  return (
    <Container fluid className="h-100">
      <Row className="my-3">
        <Cards sales={sales} />
      </Row>
      <Row className="d-flex justify-content-evenly mt-3">
        <Col xs={11} md={10} lg={8} xl={9} xxl={5} className="shadow">
          <Sales$ sales={salesToChart.sales$} />
        </Col>
        <Col
          xs={11}
          md={10}
          lg={8}
          xl={9}
          xxl={5}
          className="shadow mt-4 mt-xxl-0"
        >
          <SalesQ sales={salesToChart.salesQ} />
        </Col>
      </Row>
    </Container>
  );
}
