import { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import FooterModal from "./helpers/FooterModal";
import ErrForm from "./helpers/ErrForm";
import TitleModal from "./helpers/TitleModal";
import Swal from "sweetalert2";
import Loader from "./helpers/LoaderModal";

export default function Info({
  showInfo,
  handleHideInfo,
  clientId,
  clientName,
  contactData,
  actualStep,
  setContactData,
}) {
  const [errorForm, setErrorForm] = useState(false);
  const [update, setUpdate] = useState({ mail: false, tel: false });
  const [info, setInfo] = useState({ mail: "", tel: "" });
  const [loading, setLoading] = useState(false);
  const validInput = new RegExp("[0-9]");
  const [textErr, setTextErr] = useState("");

  const handleDeleteMail = async (e) => {
    setTextErr("");
    setErrorForm(false);
    e.preventDefault();
    /*
    if (contactData.mail !== "") {
      Swal.fire({
        title: `Estas seguro de <b>ELIMINAR</b> el <b>MAIL</b> del cliente <b>${clientName}</b>?`,
        showDenyButton: true,
        showCancelButton: true,
        showConfirmButton: false,
        focusCancel: true,
        denyButtonText: `Eliminar`,
        cancelButtonText: `Cancelar`,
      }).then((result) => {
        if (result.isDenied) {
          setLoading(true);
          deleteContactData({ identi: clientId, mail: true })
            .then(setContactData((old) => ({ ...old, mail: "" })))
            .then(
              Swal.fire({
                title: "Mail eliminado!",
                icon: "success",
                showCancelButton: false,
                showConfirmButton: false,
                showDenyButton: false,
                showCloseButton: false,
                timer: 3000,
              })
            )
            .catch((error) => {
              Swal.fire({
                title: error.message,
                icon: "error",
                showCancelButton: false,
                showConfirmButton: false,
                showDenyButton: false,
                showCloseButton: true,
              });
            })
            .finally(() => {
              setLoading(false);
            });
          }
        });
      } else {
        setTextErr("No hay mail para eliminar");
        setErrorForm(true);
        return;
      }
      */
  };

  const handleDeletePhone = async (e) => {
    setTextErr("");
    setErrorForm(false);
    e.preventDefault();
    /*
    if (contactData.phone !== "") {
      Swal.fire({
        title: `Estas seguro de <b>ELIMINAR</b> el <b>TELÉFONO</b> del cliente <b>${clientName}</b>?`,
        showDenyButton: true,
        showCancelButton: true,
        showConfirmButton: false,
        focusCancel: true,
        denyButtonText: `Eliminar`,
        cancelButtonText: `Cancelar`,
      }).then((result) => {
        if (result.isDenied) {
          setLoading(true);
          deleteContactData({ identi: clientId, phone: true })
            .then(setContactData((old) => ({ ...old, phone: "" })))
            .then(
              Swal.fire({
                title: "Teléfono eliminado!",
                icon: "success",
                showCancelButton: false,
                showConfirmButton: false,
                showDenyButton: false,
                showCloseButton: false,
                timer: 3000,
              })
            )
            .catch(({ error }) => {
              Swal.fire({
                title: error.message,
                icon: "error",
                showCancelButton: false,
                showConfirmButton: false,
                showDenyButton: false,
                showCloseButton: true,
              });
            })
            .finally(() => {
              setLoading(false);
            });
        }
      });
    } else {
      setTextErr("No hay teléfono para eliminar");
      setErrorForm(true);
      return;
    }
    */
  };

  const sendInfo = async () => {
    if (!update.mail) {
      info.mail = "";
    }
    if (!update.tel) {
      info.tel = "";
    }
    setLoading(true);
    /*
    const { code, response, error } = await addContactData({
      identi: clientId,
      mail: info.mail,
      phone: info.tel,
    });
    setUpdate({ mail: false, tel: false });
    switch (code) {
      case 200:
        if (
          response.reference.mail !== undefined &&
          response.reference.mail.trim() !== ""
        ) {
          setContactData((old) => ({ ...old, mail: response.reference.mail }));
        }
        if (
          response.reference.phone !== undefined &&
          response.reference.phone.toString().trim() !== ""
        ) {
          setContactData((old) => ({
            ...old,
            phone: response.reference.phone,
          }));
        }
        Swal.fire({
          title: response.message,
          icon: "success",
          timer: 3000,
          showConfirmButton: false,
          showDenyButton: false,
          showCloseButton: false,
        });
        break;
      default:
        Swal.fire({
          title: error.message,
          text: "Intente nuevamente, en caso de que el error continúe comunicarse con IT",
          icon: "error",
          showConfirmButton: false,
          showDenyButton: false,
          showCloseButton: true,
        });
        break;
    }
    */
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!update.mail && !update.tel) {
      setTextErr("No hay campo a actualizar");
      setErrorForm(true);
      return;
    } else if (update.mail && update.tel) {
      if (info.mail === "" && info.tel === "") {
        setTextErr("Debe completar ambos campos");
        setErrorForm(true);
        return;
      } else if (info.tel === "") {
        setTextErr("Debe completar el teléfono");
        setErrorForm(true);
        return;
      } else if (info.mail === "") {
        setTextErr("Debe completar el mail");
        setErrorForm(true);
        return;
      } else if (info.mail.match(validRegex) === null) {
        setTextErr("El mail es inválido");
        setErrorForm(true);
        return;
      }
      await sendInfo();
    } else if (update.tel) {
      if (info.tel === "") {
        setTextErr("Debe completar el teléfono");
        setErrorForm(true);
        return;
      }
      await sendInfo();
    } else if (update.mail) {
      if (info.mail === "") {
        setTextErr("Debe completar el mail");
        setErrorForm(true);
        return;
      } else if (info.mail.match(validRegex) === null) {
        setTextErr("El mail es inválido");
        setErrorForm(true);
        return;
      }
      await sendInfo();
    }
  };

  const handlePhoneChange = (e) => {
    setErrorForm(false);
    setTextErr("");
    setInfo({ ...info, tel: e.target.value.trim() });
  };

  const handleMailChange = (e) => {
    setErrorForm(false);
    setTextErr("");
    setInfo({ ...info, mail: e.target.value.trim() });
  };

  const handlePress = (e) => {
    if (!validInput.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleCheckMailChange = (e) => {
    setErrorForm(false);
    setTextErr("");
    if (!e.target.checked) {
      setUpdate({ ...update, mail: false });
      return;
    }
    setUpdate({ ...update, mail: true });
  };

  const handleCheckPhoneChange = (e) => {
    setErrorForm(false);
    setTextErr("");
    if (!e.target.checked) {
      setUpdate({ ...update, tel: false });
      return;
    }
    setUpdate({ ...update, tel: true });
  };

  const handleClose = () => {
    setUpdate({ mail: false, tel: false });
    setInfo({ mail: "", tel: "" });
    setLoading(false);
    setTextErr("");
    handleHideInfo();
  };

  return (
    <Modal
      show={showInfo}
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
                <Row className="d-flex justify-content-between align-items-center">
                  <Col>
                    <label>
                      Mail actual: <b>{contactData.mail}</b>
                    </label>
                  </Col>
                  <Col className="d-flex justify-content-end">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={(e) => handleDeleteMail(e)}
                    >
                      Eliminar Mail
                    </Button>
                  </Col>
                </Row>
                <Form.Check
                  type="checkbox"
                  label="Actualizar mail"
                  onChange={(e) => handleCheckMailChange(e)}
                />
                <Row className="d-flex justify-content-center">
                  <Form.Control
                    type="email"
                    placeholder="Para actualizar ingrese nuevo mail del cliente"
                    className={!update.mail ? "d-none" : "mt-2"}
                    style={{ width: "95%" }}
                    onChange={(e) => handleMailChange(e)}
                  />
                </Row>
              </Form.Group>
              <Form.Group className="mt-4">
                <Row className="d-flex justify-content-between align-items-center">
                  <Col>
                    <label>
                      Teléfono actual: <b>{contactData.phone}</b>
                    </label>
                  </Col>
                  <Col className="d-flex justify-content-end">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={(e) => handleDeletePhone(e)}
                    >
                      Eliminar Teléfono
                    </Button>
                  </Col>
                </Row>

                <Form.Check
                  type="checkbox"
                  label="Actualizar teléfono"
                  onChange={(e) => handleCheckPhoneChange(e)}
                />
                <Row className="d-flex justify-content-center">
                  <Form.Control
                    type="text"
                    placeholder="Para actualizar ingrese nuevo teléfono del cliente"
                    className={!update.tel ? "d-none" : "mt-2"}
                    style={{ width: "95%" }}
                    onKeyPress={(e) => handlePress(e)}
                    onChange={(e) => handlePhoneChange(e)}
                  />
                </Row>
              </Form.Group>
            </Form>
            <ErrForm text={textErr} errorForm={errorForm} />
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
