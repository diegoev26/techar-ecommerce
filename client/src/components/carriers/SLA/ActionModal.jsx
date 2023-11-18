import { Button, Col, Container, Modal } from "react-bootstrap";
import Delivered from "./bodyModal/Delivered";
import NotDelivered from "./bodyModal/NotDelivered";
import { useState } from "react";
import Swal from "sweetalert2";
import Loader from "../../../pages/Loader";
import { updateDeliveryNotes } from "../../../apis/carriers";

export default function ActionModal({
  data,
  show,
  setShow,
  setData,
  action,
  setAction,
  handleData,
}) {
  const [date, setDate] = useState(new Date());
  const [option, setOption] = useState("");
  const [newHR, setNewHR] = useState(0);
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendData = async () => {
    setLoading(true);
    const status = option.trim() === "" ? "R" : option,
      jsonOut = {};

    jsonOut.modforRX = data.modforRX;
    jsonOut.codforRX = data.codforRX;
    jsonOut.nroforRX = data.nroforRX;
    jsonOut.status = status;
    switch (status) {
      case "R":
        jsonOut.date = handleDate(date);
        break;
      case "T":
      case "A":
        jsonOut.modforHR = data.modforHR;
        jsonOut.codforHR = data.codforHR;
        jsonOut.nroforHR = status === "T" ? newHR : data.nroforHR;
        break;
      default:
        setLoading(false);
        Swal.fire({
          title: "No se pudo ejecutar la acción",
          icon: "warning",
          timer: 2000,
          showCancelButton: false,
          showCloseButton: false,
          showConfirmButton: false,
          showDenyButton: false,
        });
        return;
    }

    const { code, response, error } = await updateDeliveryNotes([jsonOut]);
    switch (code) {
      case 200:
      case 201:
        await handleData();
        Swal.fire({
          title: response.message,
          text: `${response.reference.modforRX}-${response.reference.codforRX}-${response.reference.nroforRX}`,
          icon: "success",
          timer: 2000,
          showCancelButton: false,
          showCloseButton: false,
          showConfirmButton: false,
          showDenyButton: false,
        });
        break;
      default:
        Swal.fire({
          title: error.message,
          text: `${error.reference.modforRX}-${error.reference.codforRX}-${error.reference.nroforRX}`,
          icon: "error",
          showCancelButton: false,
          showCloseButton: true,
          showConfirmButton: false,
          showDenyButton: false,
        });
        break;
    }
    setLoading(false);
  };

  const handleDate = (date) => {
    if (
      date.$y !== undefined &&
      date.$M !== undefined &&
      date.$D !== undefined
    ) {
      return `${date.$y.toString()}${(date.$M + 1)
        .toString()
        .padStart(2, "0")}${date.$D.toString().padStart(2, "0")}`;
    }
    return (
      date.getFullYear() +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      date.getDate().toString().padStart(2, "0")
    );
  };

  const handleClose = () => {
    setShow(false);
    setAction(false);
    setData(undefined);
    setDate(new Date());
    setOption("");
    setNewHR(0);
    setErrMsg("");
  };

  const handleSubmit = () => {
    let title = "";
    if (action.match(/rendir/i)) {
      title = action;
    } else if (action.match(/anular/i)) {
      switch (option) {
        case "A":
          title = "Anular";
          break;
        case "T":
          if (newHR === 0) {
            setErrMsg(
              "Debe ingresar un número de HR para poder transferir el remito"
            );
            return;
          } else {
            title = "Transferir";
          }
          break;
        default:
          setErrMsg("Acción inválida");
          return;
      }
    }

    Swal.fire({
      title: `Está seguro de ${title.toLowerCase()} el remito ${
        data.modforRX
      }-${data.codforRX}-${data.nroforRX}?`,
      html: "<p>En caso de <b>continuar</b>, la acción es <b>irreversible</b></p>",
      showCancelButton: true,
      showDenyButton: false,
      showConfirmButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Continuar",
      customClass: {
        cancelButton: "bg-secondary",
        confirmButton: "bg-success",
      },
      focusCancel: true,
    }).then((res) => {
      if (res.isConfirmed) {
        let newTitle = "",
          dataToConfirm = "",
          body = "";
        switch (title.toLocaleLowerCase()) {
          case "anular":
            newTitle = `Confirmar anulación de remito ${data.modforRX}-${data.codforRX}-${data.nroforRX}`;
            break;
          case "transferir":
            newTitle = "Confirmar transferencia de remito";
            body = `El remito ${data.modforRX}-${data.codforRX}-${data.nroforRX} pasará a la HR ${newHR}`;
            break;
          default:
            const dateStr = handleDate(date);
            dataToConfirm =
              dateStr.slice(6) +
              "/" +
              dateStr.slice(4, 6) +
              "/" +
              dateStr.slice(0, 4);
            newTitle = "Confirmar fecha de rendición";
            body = `Remito ${data.modforRX}-${data.codforRX}-${data.nroforRX} tendrá fecha de rendido el ${dataToConfirm}`;
            break;
        }
        Swal.fire({
          title: newTitle,
          text: body,
          showCancelButton: true,
          showDenyButton: false,
          showConfirmButton: true,
          cancelButtonText: "Cancelar",
          confirmButtonText: "Terminar",
          customClass: {
            cancelButton: "bg-secondary",
            confirmButton: "bg-success",
          },
          focusCancel: true,
        }).then(async (res) => {
          if (res.isConfirmed) {
            handleSendData();
          }
        });
      }
    });

    handleClose();
  };

  return (
    <Modal show={show} keyboard={true} backdrop={true} onHide={handleClose}>
      <Modal.Header className="d-flex justify-content-center">
        <Modal.Title>
          {!action ? null : action}{" "}
          {data !== undefined && data.codforRX !== undefined
            ? data.codforRX
            : null}
          -
          {data !== undefined && data.nroforRX !== undefined
            ? data.nroforRX
            : null}
        </Modal.Title>
      </Modal.Header>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Modal.Body>
            {data === undefined || !action ? null : action.match(/rendir/i) ? (
              <Delivered date={date} setDate={setDate} />
            ) : (
              <NotDelivered
                option={option}
                setOption={setOption}
                setNewHR={setNewHR}
                errMsg={errMsg}
                setErrMsg={setErrMsg}
              />
            )}
            {errMsg.trim() !== "" ? (
              <Container fluid>
                <Col className="d-flex justify-content-end w-100">
                  <span className="text-danger fs-6 mt-2">{errMsg}</span>
                </Col>
              </Container>
            ) : null}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={handleClose}>
              Salir
            </Button>
            <Button variant="outline-success" onClick={handleSubmit}>
              Continuar
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
}
