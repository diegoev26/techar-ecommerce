import fetch from "node-fetch";
import htmlTableToJson from "html-table-to-json";
import { existsSync, readFileSync, writeFile } from "fs";
import HafeleLog from "../models/HafeleLog";
import TranslogLog from "../models/TranslogLog";
import { getConnection, mainQuerys, sqlInterfaces } from "../database";
import transporter from "../config/mailer";
const logger = require("../config/logger").default;

export async function setDbLog({ data, model }) {
  if (typeof data.length === "number") {
    for (let i = 0; i < data.length; i++) {
      const el = data[i];
      el.date = dateToString();
      el.time = timeToString();
    }
  } else {
    data.date = dateToString();
    data.time = timeToString();
  }
  try {
    switch (model.toLowerCase()) {
      case "hafele":
        await HafeleLog.insertMany(data);
        break;
      case "translog":
        await TranslogLog.insertMany(data);
        break;
      default:
        await setLog({
          status: false,
          message: `setDbLog - Modelo no encontrado ${model}`,
        });
        break;
    }
  } catch (error) {
    await setLog({
      status: false,
      message: `setDbLog - ${error.message}`,
    });
  }
}

export async function setLog({ status, message }) {
  try {
    const datetime = datetimeToString(new Date(), "|").split("|"),
      year = datetime[0],
      month = datetime[1],
      day = datetime[2],
      hour = datetime[3],
      minutes = datetime[4],
      seconds = datetime[5],
      msgToLog = `${day}/${month}/${year} ${hour}:${minutes}:${seconds} - ${message}`,
      level = status ? "info" : "error";

    logger.log(level, msgToLog);
  } catch (error) {
    console.error(error.message);
  }
}

export function dateToString(date = new Date(), separator = "") {
  return (
    date.getFullYear() +
    separator +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    separator +
    date.getDate().toString().padStart(2, "0")
  );
}

export function date112ToString(date = new Date(), separator = "") {
  return (
    date.slice(0, 4) + separator + date.slice(4, 6) + separator + date.slice(6)
  );
}

export function datetimeToString(date = new Date(), separator = "") {
  return (
    date.getFullYear() +
    separator +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    separator +
    date.getDate().toString().padStart(2, "0") +
    separator +
    date.getHours().toString().padStart(2, "0") +
    separator +
    date.getMinutes().toString().padStart(2, "0") +
    separator +
    date.getSeconds().toString().padStart(2, "0")
  );
}

export function timeToString(date = new Date(), separator = "") {
  return (
    date.getHours().toString().padStart(2, "0") +
    separator +
    date.getMinutes().toString().padStart(2, "0") +
    separator +
    date.getSeconds().toString().padStart(2, "0")
  );
}

export async function saveFile(path, dataIn, filename) {
  try {
    writeFile(path + filename, dataIn, (err) => {
      if (err) return { status: false, message: err.message };
    });
    return { status: true, path, filename };
  } catch (error) {
    return { status: false, message: error.message };
  }
}

export async function getBNAExchange() {
  try {
    let bodyOut = [];
    let recOut = {};
    const response = await fetch("https://www.bna.com.ar/Personas");
    const body = await response.text();
    let paso1 =
      body !== undefined
        ? body.split('<div class="tab-pane fade" id="divisas"')[1]
        : undefined;
    let paso2 =
      paso1 !== undefined
        ? paso1.split('<table class="table cotizacion">')[1]
        : undefined;
    let paso3 = paso2 !== undefined ? paso2.split(" </table>")[0] : undefined;
    let encabezado1 =
      paso3 !== undefined ? paso3.split('<th class="fechaCot">')[1] : undefined;
    let encabezado2 =
      encabezado1 !== undefined ? encabezado1.split("</th>")[0] : undefined;
    paso3 =
      paso3 !== undefined ? paso3.replace(encabezado2, "moneda") : undefined;
    let tableIn = "<table>" + paso3 + "</table>";
    let dia = parseInt(encabezado2.split("/")[0]);
    let mes = parseInt(encabezado2.split("/")[1].split("/")[0]);
    let anio = parseInt(encabezado2.split("/")[2].split("/")[0]);
    let fecha = anio * 10000 + mes * 100 + dia;
    let jsonTables = htmlTableToJson.parse(tableIn)._results[0];
    let monedaNormalizada;
    let factor;
    for (var i = 0; i < jsonTables.length; i++) {
      factor = jsonTables[i]["moneda"].includes("*") ? 100 : 1;
      switch (jsonTables[i]["moneda"]) {
        case "Dolar U.S.A":
          monedaNormalizada = "USD";
          break;
        case "Libra Esterlina":
          monedaNormalizada = "GBP";
          break;
        case "Euro":
          monedaNormalizada = "EUR";
          break;
        case "Franco Suizos *":
          monedaNormalizada = "CHF";
          break;
        case "YENES *":
          monedaNormalizada = "JPY";
          break;
        case "Dolares Canadienses *":
          monedaNormalizada = "CAD";
          break;
        case "Coronas Danesas *":
          monedaNormalizada = "DKK";
          break;
        case "Coronas Noruegas *":
          monedaNormalizada = "NOK";
          break;
        case "Coronas Suecas *":
          monedaNormalizada = "SEK";
          break;
      }
      recOut = {
        codigoBCRA: "00011",
        descripcion: "Banco Nación Argentina",
        tipo: "divisa",
        fecha: fecha,
        currency: monedaNormalizada,
        comprador: jsonTables[i]["Compra"] * factor,
        vendedor: jsonTables[i]["Venta"] * factor,
      };
      bodyOut.push(recOut);
    }
    return { status: true, data: bodyOut };
  } catch (error) {
    return { status: false, message: error.message };
  }
}

export async function getMsgToSend() {
  const arrErr = [],
    arrOut = [];
  try {
    const pool = await getConnection("interfaces");
    const { recordset } = await pool.request().query(mainQuerys.getMsgToSend);
    for (let i = 0; i < recordset.length; i++) {
      const message = {},
        el = recordset[i];
      if (el.msgTo === undefined || el.msgTo === null) {
        arrErr.push({
          message: "Faltan datos para enviar",
          data: el,
          reference: el.idmsg,
        });
      } else {
        delete el.msgSended;
        delete el.msgCreatedDate;
        delete el.msgSendedDate;
        if (el.msgTo !== undefined && typeof el.msgTo === "string") {
          const to = JSON.parse(el.msgTo);
          delete el.msgTo;
          el.msgTo = to;
        }
        el.msgCc === null ? delete el.msgCc : null;
        if (el.msgCc !== undefined && typeof el.msgCc === "string") {
          const cc = JSON.parse(el.msgCc);
          delete el.msgCc;
          el.msgCc = cc;
        }
        el.msgCCo === null ? delete el.msgCCo : null;
        if (el.msgCCo !== undefined && typeof el.msgCCo === "string") {
          const bcc = JSON.parse(el.msgCCo);
          delete el.msgCCo;
          el.msgCCo = bcc;
        }
        el.msgFrom === null ? delete el.msgFrom : null;
        if (el.msgFrom !== undefined && typeof el.msgFrom === "string") {
          const from = JSON.parse(el.msgFrom);
          delete el.msgFrom;
          el.msgFrom = from;
        }
        message.header = el;
        try {
          const pool = await getConnection("interfaces");
          const { recordset } = await pool
            .request()
            .input("idmsg", sqlInterfaces.Int, el.idmsg)
            .query(mainQuerys.getMsgBody);
          delete recordset[0].idmsg;
          delete recordset[0].itmmsg;
          message.body = recordset[0];
        } catch (error) {
          arrErr.push({
            message: error.message,
            data: el,
            reference: el.idmsg,
          });
        }
        if (message.body === undefined) {
          arrErr.push({
            message: "No se pudo definir el cuerpo del mensaje",
            data: message,
            reference: el.idmsg,
          });
        } else {
          try {
            const pool = await getConnection("interfaces");
            const { recordset } = await pool
              .request()
              .input("idmsg", sqlInterfaces.Int, el.idmsg)
              .query(mainQuerys.getMsgAttachment);
            if (recordset.length > 0) {
              message.attachments = [];
              for (let i = 0; i < recordset.length; i++) {
                const attachment = recordset[i];
                delete attachment.idmsg;
                delete attachment.itmmsg;
                message.attachments.push(attachment);
              }
            }
            if (
              recordset.length > 0 &&
              recordset.length !== message.attachments.length
            ) {
              arrErr.push({
                message: "No se adjuntaron todos los archivos",
                data: [recordset, message],
                reference: el.idmsg,
              });
            } else {
              arrOut.push(message);
            }
          } catch (error) {
            arrErr.push({
              message: error.message,
              data: recordset,
              reference: el.idmsg,
            });
          }
        }
      }
    }
  } catch (error) {
    return { status: false, message: `getDataToSend - ${error.message}` };
  }
  const status = arrErr.length > 0 && arrOut.length === 0 ? false : true;
  return { status, response: arrOut, error: arrErr };
}

export async function sendMail({ header, body, attachments }) {
  const arrErr = [],
    to = header.msgTo.mail,
    subject = header.msgSubject,
    textKey = body.type === "html" ? body.type : "text";

  const mailSettings = {
    from: "Hafele Argentina <noreply@hafeleargentina.com.ar>",
    to,
    subject,
  };
  header.msgCc !== undefined ? (mailSettings.cc = header.msgCc.mail) : null;
  header.msgCCo !== undefined ? (mailSettings.bcc = header.msgCCo) : null;
  textKey === "html"
    ? (mailSettings.html = body.msgText)
    : (mailSettings.text = body.msgText);

  if (
    attachments !== undefined &&
    attachments.length !== undefined &&
    attachments.length > 0
  ) {
    mailSettings.attachments = [];
    for (let i = 0; i < attachments.length; i++) {
      const attachment = attachments[i];
      const path = `${attachment.path}${attachment.filename}`;
      if (existsSync(path)) {
        mailSettings.attachments.push({ path, filename: attachment.filename });
      } else {
        arrErr.push({
          message: "No se encontró el archivo adjunto",
          data: attachment,
          reference: header.idmsg,
        });
      }
    }
  }
  if (arrErr.length > 0) {
    return { status: false, error: arrErr };
  }
  try {
    const mail = await transporter.sendMail(mailSettings),
      mailQ =
        to.length +
        (mailSettings.cc !== undefined ? mailSettings.cc.length : 0) +
        (mailSettings.bcc !== undefined ? mailSettings.bcc.length : 0);
    return {
      status: true,
      reference: { data: mail.accepted, error: mail.rejected },
      message:
        mail.accepted.length === mailQ
          ? "Mensaje enviado ok"
          : "No se pudo enviar a todos los remitentes",
    };
  } catch (error) {
    const log = { status: false, message: `sendMail - ${error.message}` };
    await setLog(log);
    return log;
  }
}

export async function setMsgToSend({ to, subject, body, type }) {
  try {
    const pool = await getConnection("interfaces");
    const { rowsAffected } = await pool
      .request()
      .input("DIRENT", sqlInterfaces.VarChar, to)
      .input("SUBJECT", sqlInterfaces.VarChar, subject)
      .input("bodyMessage", sqlInterfaces.VarChar, body)
      .input("type", sqlInterfaces.VarChar, type)
      .execute(mainQuerys.setMessage);
    return { status: true, reference: rowsAffected };
  } catch (error) {
    return { status: false, message: error.message };
  }
}

export async function getParameters({ idInterface }) {
  if (idInterface === undefined) {
    return { status: false, message: "idInterface undefined" };
  }

  const jsonOut = { idInterface };
  try {
    const pool = await getConnection("interfaces");
    const { recordset } = await pool
      .request()
      .input("idInterface", sqlInterfaces.Int, idInterface)
      .query(mainQuerys.getParams);
    for (let i = 0; i < recordset.length; i++) {
      const el = recordset[i];
      let index;
      for (const key in el) {
        if (Object.hasOwnProperty.call(el, key)) {
          const item = el[key];
          if (item !== null && key !== "idInterface") {
            if (key === "parameterName") {
              jsonOut[item] = {};
              index = item;
            } else {
              key === "parameterValue" &&
              (el.descripcion === undefined ||
                el.descripcion === null ||
                el.descripcion === "") &&
              (el.keyValue === undefined ||
                el.keyValue === null ||
                el.keyValue === "") &&
              (el.tableName === undefined ||
                el.tableName === null ||
                el.tableName === "") &&
              (el.pk1 === undefined || el.pk1 === null || el.pk1 === "") &&
              (el.pk2 === undefined || el.pk2 === null || el.pk2 === "") &&
              (el.pk3 === undefined || el.pk3 === null || el.pk3 === "") &&
              (el.pk4 === undefined || el.pk4 === null || el.pk4 === "") &&
              (el.pk5 === undefined || el.pk5 === null || el.pk5 === "")
                ? (jsonOut[index] = item)
                : (jsonOut[index][key] = item);
            }
          }
        }
      }
    }

    return { status: true, data: jsonOut };
  } catch (error) {
    return { status: false, message: error.message };
  }
}

export async function readThisFile(filePath) {
  let message;
  try {
    const data = readFileSync(filePath);
    return { status: true, data: data.toString(), reference: filePath };
  } catch (error) {
    message = `Got an error trying to read the file ${filePath} - ${error.message}`;
    setLog({
      status: "error",
      message,
    });
  }
  return { status: false, reference: filePath, message };
}

export async function getMailingContact({ maenfa, maenrc, maenpv }) {
  //MAENFA -> USR_VTMCLH_MADIE1
  //MAENRC -> USR_VTMCLH_MADIRC
  //MAENPV -> USR_PVMPRH_MADIRT
  if (maenfa === undefined && maenrc === undefined && maenpv === undefined) {
    return {
      status: false,
      reference: { maenfa, maenrc, maenpv },
      message: "Faltan datos necesarios",
    };
  }

  const arrResponse = [],
    arrOut = [],
    arrErr = [];

  if ((maenfa !== undefined && maenfa) || (maenrc !== undefined && maenrc)) {
    let query = "select ";
    maenfa === undefined || !maenfa
      ? null
      : (query = query + "isnull(USR_VTMCLH_MADIE1,'') maenfa ");
    maenfa === undefined || !maenfa || maenrc === undefined || !maenrc
      ? null
      : (query = query + ", ");
    maenrc === undefined || !maenrc
      ? null
      : (query = query + "isnull(USR_VTMCLH_MADIRC,'') maenrc ");

    query = query + "from vtmclh where ";

    maenfa === undefined || !maenfa
      ? null
      : (query =
          query +
          "(isnull(USR_VTMCLH_MADIE1,'') <> '' and isnull(USR_VTMCLH_MADIE1,'NO') <> 'NO') ");
    maenfa === undefined || !maenfa || maenrc === undefined || !maenrc
      ? null
      : (query = query + "or ");
    maenrc === undefined || !maenrc
      ? null
      : (query =
          query +
          "(isnull(USR_VTMCLH_MADIRC,'') <> '' and isnull(USR_VTMCLH_MADIRC,'NO') <> 'NO') ");
    query = query + "and ISNULL(VTMCLH_DEBAJA,'S') = 'N'; ";

    try {
      const pool = await getConnection("hafele"),
        { recordset } = await pool.request().query(query);
      if (
        recordset === undefined ||
        recordset.length === undefined ||
        recordset.length === 0
      ) {
        arrErr.push({ message: "Error recuperando mails de clientes" });
      } else {
        for (let i = 0; i < recordset.length; i++) {
          const el = recordset[i];
          arrResponse.push(el);
        }
      }
    } catch (error) {
      arrOut.push({ message: error.message });
    }
  }

  if (maenpv !== undefined && maenpv) {
    let query =
      "select isnull(USR_PVMPRH_MADIRT,'') maenpv from PVMPRH where isnull(USR_PVMPRH_MADIRT,'') <> '' and isnull(USR_PVMPRH_MADIRT,'NO') <> 'NO' and ISNULL(PVMPRH_DEBAJA,'S') = 'N';";
    try {
      const pool = await getConnection("hafele"),
        { recordset } = await pool.request().query(query);
      if (
        recordset === undefined ||
        recordset.length === undefined ||
        recordset.length === 0
      ) {
        arrErr.push({ message: "Error recuperando mails de proveedores" });
      } else {
        for (let i = 0; i < recordset.length; i++) {
          const el = recordset[i];
          arrResponse.push(el);
        }
      }
    } catch (error) {
      arrOut.push({ message: error.message });
    }
  }

  for (let i = 0; i < arrResponse.length; i++) {
    const mails = arrResponse[i];
    try {
      for (const key in mails) {
        if (Object.hasOwnProperty.call(mails, key)) {
          const mail = mails[key];
          if (typeof mail === "string" && mail.trim() !== "") {
            if (mail.indexOf(";") > -1 || mail.indexOf(",") > -1) {
              switch (true) {
                case mail.indexOf(";") > -1:
                  for (let i = 0; i < mail.split(";").length; i++) {
                    const el = mail.split(";")[i];
                    if (
                      typeof el === "string" &&
                      el.trim() !== "" &&
                      arrOut.find(
                        (find) => find === el.trim().toLowerCase()
                      ) === undefined
                    ) {
                      arrOut.push(el.trim().toLowerCase());
                    }
                  }
                  break;
                case mail.indexOf(",") > -1:
                  for (let i = 0; i < mail.split(",").length; i++) {
                    const el = mail.split(",")[i];
                    if (
                      typeof el === "string" &&
                      el.trim() !== "" &&
                      arrOut.find(
                        (find) => find === el.trim().toLowerCase()
                      ) === undefined
                    ) {
                      arrOut.push(el.trim().toLowerCase());
                    }
                  }
                  break;
                default:
                  arrErr.push({
                    message: "Error recibiendo mail de cliente",
                    reference: mail,
                  });
                  break;
              }
            } else if (
              typeof mail === "string" &&
              mail.trim() !== "" &&
              arrOut.find((find) => find === mail.trim().toLowerCase()) ===
                undefined
            ) {
              arrOut.push(mail.trim().toLowerCase());
            }
          }
        }
      }
    } catch (error) {
      arrErr.push({ message: error.message, reference: mails });
    }
  }

  if (arrOut.length === 0) {
    return { status: false, error: arrErr };
  }

  return arrErr.length === 0
    ? { status: true, data: arrOut }
    : {
        status: true,
        data: arrOut,
        error: arrErr,
      };
}

export function countJsonKeys(jsonIn) {
  let count = 0;
  for (let prop in jsonIn) {
    if (jsonIn.hasOwnProperty(prop)) {
      ++count;
    }
  }
  return count;
}
