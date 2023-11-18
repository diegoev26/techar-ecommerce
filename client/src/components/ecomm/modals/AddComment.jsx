import { useState } from "react";
import { Form, Modal, Row } from "react-bootstrap";
import FooterModal from "./helpers/FooterModal";
import ErrForm from "./helpers/ErrForm";
import TitleModal from "./helpers/TitleModal";
import Loader from "./helpers/LoaderModal";
import Swal from "sweetalert2";

export default function AddComment({
  showAddComment,
  handleHideAddComment,
  clientId,
  clientName,
  actualStep,
}) {
  const [errorForm, setErrorForm] = useState(false);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setErrorForm(false);
    setComment(e.target.value);
    if (e.target.value.length < 1 || e.target.value.length > 255) {
      setErrorForm(true);
      return;
    }
  };

  const handleClose = () => {
    setErrorForm(false);
    setLoading(false);
    setComment("");
    handleHideAddComment();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment === "") {
      setErrorForm(true);
      return;
    }
    if (!errorForm) {
      setLoading(true);
      /*
      const { code, response, error } = await addComment({
        identi: clientId,
        comment,
      });
      switch (code) {
        case 200:
          Swal.fire({
            title: response.message,
            icon: "success",
            showCancelButton: false,
            showConfirmButton: false,
            showDenyButton: false,
            showCloseButton: false,
            timer: 3000,
          });
          break;
        default:
          Swal.fire({
            title: error.message,
            icon: "error",
            showCancelButton: false,
            showConfirmButton: false,
            showDenyButton: false,
            showCloseButton: true,
          });
          break;
      }
      */
      setLoading(false);
    }
  };

  return (
    <Modal
      show={showAddComment}
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
      {loading ? (
        <Loader />
      ) : (
        <>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Row className="mb-4">
                  <label>Ingrese sus comentarios:</label>
                </Row>
                <Row className="mx-auto" style={{ width: "95%" }}>
                  <textarea
                    className="p-2"
                    rows={4}
                    onChange={(e) => handleChange(e)}
                  />
                </Row>
              </Form.Group>
            </Form>
          </Modal.Body>
          <ErrForm
            text={
              "Debe ingresar un comentario de entre 1 y 255 caracteres (usados " +
              comment.length +
              "/255)"
            }
            errorForm={errorForm}
          />
        </>
      )}

      <Modal.Footer className={loading ? "d-none" : ""}>
        <FooterModal
          onSubmit={(e) => handleSubmit(e)}
          onHide={() => handleClose()}
        />
      </Modal.Footer>
    </Modal>
  );
}
