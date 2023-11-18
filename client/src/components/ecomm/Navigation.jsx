import { Nav } from "react-bootstrap";

export default function Navigation({ page, setPage }) {
  return (
    <>
      <Nav
        variant="tabs"
        defaultActiveKey={page.toString()}
        className="bg-dark px-1 mb-1 border-bottom-0"
      >
        <Nav.Item>
          <Nav.Link
            className={page === 1 ? "text-dark mx-2" : "text-white"}
            href="#"
            eventKey="1"
            onClick={(e) => {
              setPage(1);
            }}
          >
            Dashboard
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            className={page === 2 ? "text-dark mx-2" : "text-white"}
            href="#"
            eventKey="2"
            onClick={() => {
              setPage(2);
            }}
          >
            Ventas
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </>
  );
}
