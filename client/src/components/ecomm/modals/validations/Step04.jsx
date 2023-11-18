import { useState } from "react";
import { Form, Modal } from "react-bootstrap";
import TitleModal from "../helpers/TitleModal";
import FooterModal from "../helpers/FooterModal";
import ErrForm from "../helpers/ErrForm";
import Swal from "sweetalert2";
import Loader from "../helpers/LoaderModal";

export default function Step04({
  showStep04,
  handleHideValidation,
  clientName,
  actualStep,
  clientId,
  percepts,
  handleDataChange,
}) {
  const [PS, setPS] = useState(false);
  const [errorForm, setErrorForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setErrorForm(false);
    if (!e.target.checked) {
      setPS(false);
      return;
    }
    setPS(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!PS) {
      setErrorForm(true);
      return;
    }
    setLoading(true);
    handleDataChange({ clientId, actualStep });
    handleClose();
  };

  const handleClose = () => {
    setLoading(false);
    setErrorForm(false);
    setPS(false);
    handleHideValidation();
  };

  return (
    <Modal
      show={showStep04}
      aria-labelledby="Validacion"
      size="lg"
      centered
      animation
      onHide={() => handleClose()}
    >
      <Modal.Header closeButton>
        <Modal.Title
          id="modal-validacion"
          className="d-flex justify-content-center w-100"
        >
          <TitleModal clientName={clientName} actualStep={actualStep} />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="">
        {loading ? (
          <Loader />
        ) : (
          <>
            <label className="d-flex justify-content-center w-100">
              <strong>
                Se deben solicitar <mark>$ {percepts}</mark> en concepto de
                percepciones
              </strong>
            </label>
            <Form
              className="d-flex justify-content-center w-100"
              onSubmit={(e) => handleSubmit(e)}
            >
              <Form.Group className="mt-3" controlId="PS">
                <Form.Check
                  type="checkbox"
                  label="Percepciones Solicitadas"
                  value="PS"
                  onChange={(e) => handleChange(e)}
                />
              </Form.Group>
            </Form>
            <ErrForm
              text="Debe marcar que solicitó las percepciones para avanzar"
              errorForm={errorForm}
            />
          </>
        )}
      </Modal.Body>
      <Modal.Footer className={loading ? "d-none" : ""}>
        <FooterModal
          onSubmit={(e) => handleSubmit(e)}
          onHide={() => handleClose()}
        />
      </Modal.Footer>
    </Modal>
  );
}
