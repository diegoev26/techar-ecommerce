import { useState } from "react";
import { Modal, Form, FloatingLabel } from "react-bootstrap";
import TitleModal from "../helpers/TitleModal";
import FooterModal from "../helpers/FooterModal";
import ErrForm from "../helpers/ErrForm";
import Loader from "../helpers/LoaderModal";
import Swal from "sweetalert2";

export default function Step05({
  showStep05,
  handleHideValidation,
  clientName,
  actualStep,
  clientId,
  setChange,
  change,
}) {
  const [data, setData] = useState({ numPago: "", comments: "" });
  const [errorForm, setErrorForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const validInput = new RegExp("[0-9]");

  const handleChange = (e) => {
    setData({ ...data, numPago: e.target.value });
    setErrorForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.numPago.trim() === "") {
      setErrorForm(true);
      return;
    }
    setLoading(true);
    /*
    const { code, response, error } = await payPercepts({
      identi: clientId,
      paymentCode: data.numPago,
      paymentComments: data.comments,
    });
    switch (code) {
      case 200:
        Swal.fire({
          title: response.message,
          icon: "success",
          timer: 3000,
          showConfirmButton: false,
          showDenyButton: false,
          showCloseButton: false,
        }).then(() => {
          setChange(!change);
        });
        break;
      default:
        Swal.fire({
          title: error.message,
          text: "Intente nuevamente, en caso de que el error persistar comunicarse con IT",
          icon: "error",
          showConfirmButton: false,
          showDenyButton: false,
          showCloseButton: true,
        });
        break;
    }
    */
    handleClose();
  };

  const handleClose = () => {
    setLoading(false);
    setData({ numPago: "", comments: "" });
    setErrorForm(false);
    handleHideValidation();
  };

  const handlePress = (e) => {
    if (!validInput.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleComments = (e) => {
    setData({ ...data, comments: e.target.value });
  };

  return (
    <Modal
      show={showStep05}
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
      <Modal.Body>
        {loading ? (
          <Loader />
        ) : (
          <>
            <Form onSubmit={(e) => handleSubmit(e)}>
              <Form.Group>
                <FloatingLabel
                  controlId="inputPagoPercepciones"
                  label="Ingrese número de pago"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    placeholder="Numero de pago"
                    onKeyPress={(e) => handlePress(e)}
                    onChange={(e) => handleChange(e)}
                    autoComplete="off"
                  />
                </FloatingLabel>
                <FloatingLabel
                  controlId="floatingPassword"
                  label="Ingrese Comentarios (opcional)"
                >
                  <Form.Control
                    type="text"
                    placeholder="Comentarios"
                    onChange={(e) => handleComments(e)}
                    autoComplete="off"
                  />
                </FloatingLabel>
              </Form.Group>
            </Form>
            <ErrForm
              text="Debe completar el número de pago"
              errorForm={errorForm}
            />
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <FooterModal
          className={loading ? "d-none" : ""}
          onSubmit={(e) => handleSubmit(e)}
          onHide={() => handleClose()}
        />
      </Modal.Footer>
    </Modal>
  );
}
