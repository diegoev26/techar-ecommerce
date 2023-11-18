import { useState } from "react";
import { Modal, Button, Col, Form, FloatingLabel } from "react-bootstrap";
import Swal from "sweetalert2";
import Loader from "./helpers/LoaderModal";
import { deleteSwitchOrder } from "../../../apis/ecomm";

export default function Delete({
  clientName,
  showDelete,
  handleHideDelete,
  clientId,
  setChange,
  change,
}) {
  const [option, setOption] = useState(false);
  const [errorForm, setErrorForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setErrorForm(false);
    setOption(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: `Estas seguro de <b>${
        option === "reset" ? "RESETEAR" : "ELIMINAR"
      }</b> el <b>PEDIDO</b> del cliente <b>${clientName}</b>?<br><br> Este proceso es <b>irreversible</b>`,
      showDenyButton: true,
      showCancelButton: true,
      showConfirmButton: false,
      focusCancel: true,
      denyButtonText: `${option === "reset" ? "Resetear" : "Eliminar"}`,
      cancelButtonText: `Cancelar`,
    }).then(async (result) => {
      if (result.isDenied) {
        setLoading(true);
        const { code, response, error } = await deleteSwitchOrder({
          identi: clientId,
          action: option,
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
        setLoading(false);
      }
    });
    handleClose();
  };

  const handleClose = () => {
    setLoading(false);
    setErrorForm(false);
    setOption(false);
    handleHideDelete();
  };

  return (
    <Modal
      show={showDelete}
      aria-labelledby="Delete"
      size="lg"
      centered
      animation
      onHide={() => handleClose()}
    >
      <Modal.Header closeButton>
        <Modal.Title
          id="modal-delete"
          className="d-flex justify-content-center w-100"
        >
          Borrado de pedido - {clientName}
        </Modal.Title>
      </Modal.Header>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Modal.Body>
            <Col className="d-flex justify-content-center w-100">
              <label className="">
                Si desea resetar el pedido escriba <strong>reset</strong>, en
                caso de que quiera eliminar escriba <strong>borrar</strong>
              </label>
            </Col>
            <Form onSubmit={(e) => handleSubmit(e)}>
              <Form.Group className="mt-3">
                <FloatingLabel
                  controlId="inputPagoPercepciones"
                  label="Ingrese 'reset' para resetear, 'borrar' para eliminar (sin comillas)"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    placeholder="Delete pedido"
                    onChange={(e) => handleChange(e)}
                    autoComplete="off"
                  />
                </FloatingLabel>
              </Form.Group>
            </Form>
            <label className={!errorForm ? "d-none" : "ms-1 mt-2 text-danger"}>
              {option
                ? "Opción incorrecta"
                : "Debe completar el campo para poder continuar"}
            </label>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-danger"
              type="submit"
              onClick={(e) => handleSubmit(e)}
            >
              Borrar / Resetear
            </Button>
            <Button variant="outline-secondary" onClick={() => handleClose()}>
              Cerrar
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
}
