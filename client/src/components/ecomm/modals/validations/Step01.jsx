import TitleModal from "../helpers/TitleModal";
import FooterModal from "../helpers/FooterModal";
import { useState } from "react";
import { Modal, Form } from "react-bootstrap";
import ErrForm from "../helpers/ErrForm";
import Swal from "sweetalert2";
import Loader from "../helpers/LoaderModal";

export default function Step01({
  showStep01,
  handleHideValidation,
  clientId,
  clientName,
  actualStep,
  setChange,
  change,
}) {
  const [IVA, setIVA] = useState(null);
  const [errorForm, setErrorForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (IVA === null) {
      setErrorForm(true);
    } else {
      setLoading(true);
      /*
      const { code, response, error } = await taxConfirm({
        identi: clientId,
        taxCondition: IVA,
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
    }
  };

  const handleChange = (e) => {
    setErrorForm(false);
    setIVA(e.target.value);
  };

  const handleClose = () => {
    setLoading(false);
    setErrorForm(false);
    setIVA(null);
    handleHideValidation();
  };

  return (
    <Modal
      show={showStep01}
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
            <Form
              onSubmit={(e) => handleSubmit(e)}
              onChange={(e) => handleChange(e)}
            >
              <Form.Check
                label="Consumidor Final"
                name="IVA"
                type="radio"
                value="AR9993"
              />
              <Form.Check
                label="Responsable Inscripto"
                name="IVA"
                type="radio"
                value="AR9995"
              />
            </Form>
            <ErrForm
              text="Debe seleccionar al menos una opción"
              errorForm={errorForm}
            />
          </>
        )}
      </Modal.Body>
      <Modal.Footer className="">
        <FooterModal
          className={loading ? "d-none" : ""}
          onSubmit={(e) => handleSubmit(e)}
          onHide={() => handleClose()}
        />
      </Modal.Footer>
    </Modal>
  );
}
