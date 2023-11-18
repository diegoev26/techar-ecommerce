import { useState } from "react";
import { Modal, Table, Form } from "react-bootstrap";
import TitleModal from "../helpers/TitleModal";
import FooterModal from "../helpers/FooterModal";
import ErrForm from "../helpers/ErrForm";
import Loader from "../helpers/LoaderModal";
import { countJsonKeys } from "../../../../functions/main";
import { saleConfirm } from "../../../../apis/ecomm";
import Swal from "sweetalert2";

export default function Step06({
  showStep06,
  handleHideValidation,
  clientName,
  actualStep,
  clientId,
  setChange,
  change,
  confirmData,
}) {
  const [CP, setCP] = useState(false);
  const [errorForm, setErrorForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setErrorForm(false);
    if (!e.target.checked) {
      setCP(false);
      return;
    }
    setCP(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!CP) {
      setErrorForm(true);
      return;
    }
    setLoading(true);
    const { code, response, error } = await saleConfirm({ identi: clientId });
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
    handleClose();
    setLoading(false);
  };

  const handleClose = () => {
    setLoading(false);
    setErrorForm(false);
    setCP(false);
    handleHideValidation();
  };

  return (
    <Modal
      show={showStep06}
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
            <Table striped bordered hover size="sm">
              {countJsonKeys(confirmData) > 0 ? (
                <tbody>
                  <tr className="text-wrap mw-100">
                    <td className="text-center">Número Pedido</td>
                    <td className="text-center">
                      <strong>{confirmData["Número Pedido"]}</strong>
                    </td>
                  </tr>
                  <tr className="text-wrap mw-100">
                    <td className="text-center">Nombre Cliente</td>
                    <td className="text-center">
                      <strong>{confirmData["Nombre Cliente"]}</strong>
                    </td>
                  </tr>
                  <tr className="text-wrap mw-100">
                    <td className="text-center">Código Cliente</td>
                    <td className="text-center">
                      <strong>{confirmData["Código Cliente"]}</strong>
                    </td>
                  </tr>
                  <tr className="text-wrap mw-100">
                    <td className="text-center">Cond. IVA Cliente</td>
                    <td className="text-center">
                      <strong>{confirmData["Cond. IVA Cliente"]}</strong>
                    </td>
                  </tr>
                  <tr className="text-wrap mw-100">
                    <td className="text-center">Comprobante Interno</td>
                    <td className="text-center">
                      <strong>{confirmData["Comprobante Interno"]}</strong>
                    </td>
                  </tr>
                  <tr className="text-wrap mw-100">
                    <td className="text-center">Importe</td>
                    <td className="text-center">
                      <strong>{confirmData["Importe"]}</strong>
                    </td>
                  </tr>
                  <tr className="text-wrap mw-100">
                    <td className="text-center">Percepciones</td>
                    <td className="text-center">
                      <strong>{confirmData["Percepciones"]}</strong>
                    </td>
                  </tr>
                  <tr className="text-wrap mw-100">
                    <td className="text-center">Comprobante de pago n°</td>
                    <td className="text-center">
                      <strong>{confirmData["Comprobante de pago n°"]}</strong>
                    </td>
                  </tr>
                  <tr className="text-wrap mw-100">
                    <td className="text-center">Dirección Entrega</td>
                    <td className="text-center">
                      <strong>{confirmData["Dirección Entrega"]}</strong>
                    </td>
                  </tr>
                </tbody>
              ) : (
                <label className="ms-1 mt-2 text-danger">
                  Hubo un error al cargar la información del pedido. Vuelva a
                  intentarlo
                </label>
              )}
            </Table>
            <Form onSubmit={(e) => handleSubmit(e)}>
              <Form.Group className="my-2 ms-2" controlId="infoOK">
                <Form.Check
                  type="checkbox"
                  label="La información se encuentra OK"
                  value="CP"
                  onChange={(e) => handleChange(e)}
                />
              </Form.Group>
            </Form>
            <ErrForm
              text="Debe confirmar la información del pedido"
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
