import { Button } from "react-bootstrap";

export default function FooterModal(props) {
  return (
    <>
      <Button
        {...props}
        variant="outline-success"
        type="submit"
        onClick={props.onSubmit}
      >
        Guardar
      </Button>
      <Button variant="outline-secondary" onClick={props.onHide}>
        Cerrar
      </Button>
    </>
  );
}
