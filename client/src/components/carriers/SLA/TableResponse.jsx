import { useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import ActionModal from "./ActionModal";

export default function TableResponse({ data, form, handleData }) {
  const [isHover, setIsHover] = useState({ status: false, index: 0 });
  const [show, setShow] = useState(false);
  const [dataToModal, setDataToModal] = useState(undefined);
  const [action, setAction] = useState(false);

  const getStateStr = (status) => {
    let str;
    switch (status) {
      case "E":
        str = "Entregado";
        break;
      case "I":
        str = "En Tránsito";
        break;
      case "T":
        str = "Transferido a otra HR";
        break;
      case "R":
        str = "Reentrega por ausencia de destinatario";
        break;
      case "A":
        str = "Anulado";
        break;
      default:
        str = "Estado no reconocido";
        break;
    }
    return str;
  };

  const handleDateStr = (str) => {
    return isNaN(parseInt(str))
      ? str
      : `${str.substring(6, 8)}/${str.substring(4, 6)}/${str.substring(0, 4)}`;
  };

  const orderData = () => {
    return data.sort((a, b) => a.nroforRX - b.nroforRX);
  };

  const handleRowClass = (item) => {
    let classStr = "";
    switch (item.estado) {
      case "E":
        classStr =
          item.remitoRendido === "N"
            ? classStr + "text-success"
            : classStr + "";
        break;
      case "I":
      case "R":
        classStr = classStr + "text-warning";
        break;
      default:
        classStr = classStr + "text-secondary";
        break;
    }
    return classStr;
  };

  const handleHover = (e, index) => {
    setIsHover({ status: e.type === "mouseleave" ? false : true, index });
  };

  const handleActions = (data) => {
    let out = true;
    switch (data.estado) {
      case "E":
        isNaN(parseInt(data.FechaRendido))
          ? setAction("Rendir")
          : (out = false);
        break;
      case "I":
        setAction("Anular o Transferir");
        break;
      default:
        out = false;
        break;
    }
    return out;
  };

  const handleClick = (item) => {
    setDataToModal(item);
    handleActions(item) ? setShow(true) : setDataToModal(undefined);
  };

  return (
    <>
      <Row className="d-flex justify-content-center mb-2 sticky-top pt-2">
        <Col
          xs={3}
          className="d-flex justify-content-center align-items-center mb-1"
        >
          <span className="badge bg-secondary fs-5 shadow-sm">
            Comprobante: {form}
          </span>
        </Col>
      </Row>
      <Table
        bordered
        hover
        size="sm"
        className="shadow-sm rounded-3 text-center border border-3"
      >
        <thead>
          <tr className="bg-light border">
            <th>Remito</th>
            <th>HR</th>
            <th>Cliente</th>
            <th>Fecha salida</th>
            <th>Fecha entrega</th>
            <th>Fecha rendición</th>
            <th>Bultos</th>
            <th>Valor $</th>
            <th>Peso Kg</th>
            <th>Estado</th>
            <th>Transportista</th>
          </tr>
        </thead>
        <tbody>
          {orderData(data).map((item, index) => (
            <tr
              key={index}
              className={handleRowClass(item)}
              onMouseEnter={(e) => handleHover(e, index)}
              onMouseLeave={(e) => handleHover(e, index)}
              style={
                isHover.status && isHover.index === index
                  ? { cursor: "pointer" }
                  : null
              }
              onDoubleClick={(e) => handleClick(item)}
            >
              <td>{`${item.modforRX}-${item.codforRX}-${item.nroforRX}`}</td>
              <td>{`${item.nroforHR}`}</td>
              <td>{`${item.nroCliente} - ${item.nombreCliente}`}</td>
              <td>
                {item.estado === "T" || item.estado === "A"
                  ? ""
                  : handleDateStr(item.fechaSalida)}
              </td>
              <td>
                {item.estado === "T" || item.estado === "A"
                  ? ""
                  : handleDateStr(item.FechaEntregado)}
              </td>
              <td>
                {item.estado === "T" || item.estado === "A"
                  ? ""
                  : handleDateStr(item.FechaRendido)}
              </td>
              <td>{item.bultos}</td>
              <td>{item.valorPesos}</td>
              <td>{item.pesoKg}</td>
              <td>{getStateStr(item.estado)}</td>
              <td>{item.transportista}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ActionModal
        data={dataToModal}
        show={show}
        setShow={setShow}
        setData={setDataToModal}
        action={action}
        setAction={setAction}
        handleData={handleData}
      />
    </>
  );
}
