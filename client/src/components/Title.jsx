import { Col } from "react-bootstrap";

export default function Title({ text }) {
  return (
    <Col className="w-100 mx-auto d-flex justify-content-center align-items-center py-2 mb-2 bg-dark rounded shadow shadow-sm">
      <span className="text-white">
        <b>{text}</b>
      </span>
    </Col>
  );
}
