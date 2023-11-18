import { Modal } from "react-bootstrap";
import TitleModal from "../helpers/TitleModal";

export default function Step03({
  showStep03,
  handleHideValidation,
  clientName,
  actualStep,
}) {
  return (
    <Modal
      show={showStep03}
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
          Espere mientras se valida el padron
        </label>
      </Modal.Body>
    </Modal>
  );
}
