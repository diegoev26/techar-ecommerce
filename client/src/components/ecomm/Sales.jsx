import SalesTable from "./SalesTable";
import Comments from "./modals/Comments";
import Validations from "./modals/Validations";
import Info from "./modals/Info";
import AddComment from "./modals/AddComment";
import { useState } from "react";
import Swal from "sweetalert2";
import { countJsonKeys } from "../../functions/main";

export default function Sales({
  sales,
  table,
  setTable,
  setChange,
  change,
  setLoading,
  handleDataChange,
}) {
  const [clientName, setClientName] = useState("");
  const [clientId, setClientId] = useState("");
  const [showError, setShowError] = useState(false);
  const [actualStep, setActualStep] = useState("");
  const [showStep01, setShowStep01] = useState(false);
  const [showStep04, setShowStep04] = useState(false);
  const [showStep05, setShowStep05] = useState(false);
  const [showStep06, setShowStep06] = useState(false);
  const [percepts, setPercepts] = useState("");
  const [confirmData, setConfirmData] = useState({});
  const [showInfo, setShowInfo] = useState(false);
  const [contactData, setContactData] = useState({ phone: "", mail: "" });
  const [showComments, setShowComments] = useState(false);
  const [showAddComment, setShowAddComment] = useState(false);
  const [comments, setComments] = useState([]);

  const handleShowComments = async (data) => {
    /*
    const { code, response, error } = await getComments({
      identi: data.Identi,
    });
    setComments(
      response !== undefined &&
        response.data !== undefined &&
        response.data.length !== undefined
        ? response.data
        : []
    );
    if (code !== 200) {
      Swal.fire({
        title: error.message,
        icon: "error",
        showCancelButton: false,
        showConfirmButton: false,
        showDenyButton: false,
        showCloseButton: true,
      });
    }
    */
    setClientName(data.NombreCliente);
    setShowComments(true);
  };

  const handleHideComments = () => {
    setComments([]);
    setShowComments(false);
    setClientName("");
  };

  const handleHideAddComment = () => {
    setClientName("");
    setClientId("");
    setActualStep("");
    setShowAddComment(false);
  };

  const handleShowAddComment = (data) => {
    setClientName(data.NombreCliente);
    setClientId(data.Identi);
    setActualStep("Agregar comentario");
    setShowAddComment(true);
  };

  const handleHideInfo = () => {
    setClientName("");
    setClientId("");
    setActualStep("");
    setContactData({ mail: "", phone: "" });
    setShowInfo(false);
  };

  const handleSetContactData = async (id) => {
    /*
    const { code, response, error } = await getContactData({ identi: id });
    switch (code) {
      case 200:
        if (response.mail === undefined || response.telefono === undefined) {
          Swal.fire({
            title:
              "Ocurrio un error al obtener los datos de contacto del cliente",
            text: "Intente nuevamente, en caso de que el error persistar comunicarse con IT",
            icon: "warning",
            showConfirmButton: false,
            showDenyButton: false,
            showCloseButton: true,
          });
        } else {
          setContactData({ phone: response.telefono, mail: response.mail });
        }
        break;
      default:
        Swal.fire({
          title: "Error obteniendo contacto de cliente",
          text: error.message,
          icon: "error",
          showConfirmButton: false,
          showDenyButton: false,
          showCloseButton: true,
        });
        return;
    }
    */
  };

  const handleShowInfo = async (data) => {
    await handleSetContactData(data.Identi);
    setClientName(data.NombreCliente);
    setClientId(data.Identi);
    setActualStep("Contacto de cliente");
    setShowInfo(true);
  };

  const handleSetConfirmData = async (id) => {
    /*
    const { code, response, error } = await getConfirmData({ identi: id });
    switch (code) {
      case 200:
        if (response.data === undefined || countJsonKeys(response.data) === 0) {
          Swal.fire({
            title: "Ocurrio un error al obtener la información del cliente",
            text: "Intente nuevamente, en caso de que el error persistar comunicarse con IT",
            icon: "warning",
            showConfirmButton: false,
            showDenyButton: false,
            showCloseButton: true,
          });
        } else {
          setConfirmData(response.data);
        }
        break;
      default:
        Swal.fire({
          title: "Error obteniendo información del cliente",
          text: error.message,
          icon: "error",
          showConfirmButton: false,
          showDenyButton: false,
          showCloseButton: true,
        });
        return;
    }
    */
  };

  const handleSetPercepts = async (id) => {
    /*
    const { code, response, error } = await getPercepts({ identi: id });
    switch (code) {
      case 200:
        if (
          response.Percepciones === undefined ||
          isNaN(response.Percepciones)
        ) {
          Swal.fire({
            title: "Ocurrio un error al obtener las percepciónes",
            text: "Intente nuevamente, en caso de que el error persistar comunicarse con IT",
            icon: "warning",
            showConfirmButton: false,
            showDenyButton: false,
            showCloseButton: true,
          });
        } else {
          setPercepts(response.Percepciones);
        }
        break;
      default:
        Swal.fire({
          title: "Error calculando percepciones",
          text: error.message,
          icon: "error",
          showConfirmButton: false,
          showDenyButton: false,
          showCloseButton: true,
        });
        return;
    }
    */
  };

  const handleHideValidation = () => {
    setShowError(false);
    setShowStep01(false);
    setShowStep04(false);
    setShowStep05(false);
    setShowStep06(false);
    setClientName("");
    setClientId("");
    setActualStep("");
    setPercepts("");
    setConfirmData({});
  };

  const handleShowValitadion = async (data) => {
    setClientName(data.NombreCliente);
    setClientId(data.Identi);
    setActualStep(data.PasoActual);

    switch (data.PasoActual) {
      case "Validar IVA":
        setShowStep01(true);
        break;
      case "Solicitar Percepciones":
        await handleSetPercepts(data.Identi);
        setShowStep04(true);
        break;
      case "Cobrar Percepciones":
        setShowStep05(true);
        break;
      case "Confirmar Pedido":
        await handleSetConfirmData(data.Identi);
        setShowStep06(true);
        break;
      case "Error":
        setShowError(true);
        break;
      default:
        return;
    }
  };

  return (
    <>
      <SalesTable
        sales={sales}
        table={table}
        setTable={setTable}
        handleShowValitadion={handleShowValitadion}
        setLoading={setLoading}
        handleShowComments={handleShowComments}
        handleShowInfo={handleShowInfo}
        handleShowAddComment={handleShowAddComment}
      />
      {/* Modales Inicio*/}
      <Comments
        showComments={showComments}
        comments={comments}
        handleHideComments={handleHideComments}
        clientName={clientName}
      />
      <Validations
        clientId={clientId}
        clientName={clientName}
        actualStep={actualStep}
        showStep01={showStep01}
        showStep04={showStep04}
        showStep05={showStep05}
        showStep06={showStep06}
        showError={showError}
        handleHideValidation={handleHideValidation}
        setChange={setChange}
        change={change}
        percepts={percepts}
        confirmData={confirmData}
        handleDataChange={handleDataChange}
      />
      <Info
        showInfo={showInfo}
        handleHideInfo={handleHideInfo}
        clientId={clientId}
        clientName={clientName}
        contactData={contactData}
        setContactData={setContactData}
        actualStep={actualStep}
      />
      <AddComment
        showAddComment={showAddComment}
        handleHideAddComment={handleHideAddComment}
        clientId={clientId}
        clientName={clientName}
        actualStep={actualStep}
      />
      {/* Modales Fin*/}
    </>
  );
}
