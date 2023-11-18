import { Modal } from "react-bootstrap";
import TitleModal from "../helpers/TitleModal";

export default function Error({
  showError,
  handleHideValidation,
  clientName,
  actualStep,
}) {
  return (
    <Modal
      show={showError}
      aria-labelledby="Validacion"
      size="lg"
      centered
      animation
      onHide={() => handleHideValidation()}
    >
      <Modal.Header closeButton>
        <Modal.Title
          id="modal-validacion"
          className="d-flex justify-content-center w-100"
        >
          <TitleModal clientName={clientName} actualStep={actualStep} />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <label className="d-flex justify-content-center w-100">
          Ocurrio un error en el ingreso del pedido, ver con IT
        </label>
      </Modal.Body>
    </Modal>
  );
}
