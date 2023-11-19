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
    console.log(id);
  };

  const handleShowInfo = async (data) => {
    await handleSetContactData(data.Identi);
    setClientName(data.NombreCliente);
    setClientId(data.Identi);
    setActualStep("Contacto de cliente");
    setShowInfo(true);
  };

  const handleSetConfirmData = async (id) => {
    console.log(id);
  };

  const handleSetPercepts = async (id) => {
    console.log(id);
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
