import config from "../config/config";
import { getConnection, mainQuerys, sqlInterfaces } from "../database";
import {
  getMailingContact,
  getMsgToSend,
  getParameters,
  readThisFile,
  sendMail,
} from "../functions/main.functions";
import { writeFileXLSX, utils } from "xlsx";

export const sendPendingMessage = async (req, res) => {
  const data = await getMsgToSend(),
    arrOut = [],
    arrErr = [];
  if (!data.status) {
    return res.status(400).send({ code: 400, message: data.message });
  }
  if (
    data.response === undefined ||
    data.response.length === undefined ||
    data.response.length === 0
  ) {
    return res
      .status(201)
      .send({ code: 201, response: { message: "Sin archivos que enviar" } });
  }
  if (
    data.response !== undefined &&
    data.response.length !== undefined &&
    data.response.length > 0
  ) {
    for (let i = 0; i < data.response.length; i++) {
      const msg = data.response[i];
      if (msg.header.msgTo !== undefined) {
        if (msg.header.msgTo.mail !== undefined) {
          const mail = await sendMail(msg);
          if (!mail.status) {
            delete mail.status;
            arrErr.push(mail);
          } else {
            delete mail.status;
            if (mail.reference.data.length > 0) {
              delete msg.status;
              arrOut.push({
                reference: mail.reference.data,
                data: msg,
              });
            }
            if (mail.reference.error.length > 0) {
              arrOut.push({
                data: mail.reference.error,
                message: mail.message,
              });
            }
          }
        }
      }
    }
  }

  for (let i = 0; i < arrOut.length; i++) {
    const idMsg = arrOut[i].data.header.idmsg;
    try {
      const pool = await getConnection("interfaces");
      await pool
        .request()
        .input("idmsg", sqlInterfaces.Int, idMsg)
        .query(mainQuerys.setMsgSended);
    } catch (error) {
      arrErr.push({
        message: `setMsgSended - ${error.message}`,
        reference: idMsg,
        data: arrOut[i].data,
      });
    }
  }

  if (arrErr.length > 0) {
    return arrOut.length === 0
      ? res.status(400).send({ code: 400, error: arrErr })
      : res.status(207).send({ code: 207, response: arrOut, error: arrErr });
  }
  return res.status(200).send({ code: 200, response: arrOut });
};

export const getParams = async (req, res) => {
  const { idInterface } = req.body;
  const params = await getParameters({ idInterface });
  if (!params.status) {
    return res.status(400).send({ code: 400, error: { data: params.data } });
  }
  return Object.keys(params.data).length > 1
    ? res.status(200).send({ code: 200, response: { data: params.data } })
    : res.status(201).send({
        code: 201,
        response: {
          reference: params.data,
          message: "No se encontraron parámetros para la interfaz",
        },
      });
};

export const sendSql = async (req, res) => {
  const { data } = req.body;
  if (data === undefined || data.length === undefined || data.length === 0) {
    return res.status(400).send({
      code: 400,
      error: { message: "Faltan datos necesarios", reference: data },
    });
  }
  /*
  data => [{}]:
    db -> string - base de datos para conexión - opcional, por defecto 'Hafele'
    query -> string - query a ejecutar - es obligatorio si no existe file
    file -> string - archivo .sql con query a ejecutar - es obligatorio si no existe query
    to -> array - direcciones de correo a las cuales enviar - obligatorio
    subject -> string - asunto del mail a enviar - opcional
    message -> string - mensaje para cuerpo de mail - opcional
    filename -> string - nombre del archivo de salida - opcional, por defecto 'query.xslx'
  */

  const arrErr = [],
    arrOut = [];
  for (let i = 0; i < data.length; i++) {
    const sql = data[i];
    if (
      sql.to === undefined ||
      sql.to.length === undefined ||
      sql.to.length === 0 ||
      (sql.query === undefined && sql.file === undefined) ||
      (sql.query !== undefined
        ? typeof sql.query !== "string" || sql.query.trim() === ""
        : typeof sql.file !== "string" || sql.file.trim() === "") ||
      (sql.message !== undefined ? typeof sql.message !== "string" : false) ||
      (sql.db !== undefined
        ? typeof sql.db !== "string" || sql.db.trim() === ""
        : false) ||
      (sql.filename !== undefined
        ? typeof sql.filename !== "string" || sql.filename.trim() === ""
        : false) ||
      (sql.subject !== undefined
        ? typeof sql.subject !== "string" || sql.subject.trim() === ""
        : false)
    ) {
      arrErr.push({ message: "Error en la consulta", reference: sql });
    } else {
      let query;
      if (sql.query !== undefined) {
        query = sql.query;
      } else {
        if (sql.file.search(".sql") > 0) {
          const file = await readThisFile(sql.file),
            status = file.status;
          delete file.status;
          status ? (query = file.data) : arrErr.push(file);
        } else {
          arrErr.push({
            message: "Error leyendo consulta",
            reference: { query: sql.query, file: sql.file },
          });
        }
      }
      if (query !== undefined) {
        const path =
            "C:/hafele-app/backend/" +
            (config.env ? "dist" : "src") +
            "/helpers/",
          filename = `${
            sql.filename !== undefined ? sql.filename : "query"
          }.xlsx`;
        try {
          const pool = await getConnection(sql.db),
            { recordset } = await pool.request().query(query),
            ws = utils.json_to_sheet(recordset, { type: "base64" }),
            wb = utils.book_new();
          utils.book_append_sheet(wb, ws, "Sheet1");
          writeFileXLSX(wb, path + filename);

          const header = {},
            body = {},
            attachments = [];

          header.msgTo = { mail: sql.to };
          header.msgSubject =
            sql.subject !== undefined
              ? sql.subject
              : "Envío de consulta automático";
          body.msgText =
            sql.message !== undefined
              ? sql.message
              : "Se envía reporte adjunto en formato xlsx";
          attachments.push({ path, filename });

          const mail = await sendMail({ header, body, attachments }),
            status = mail.status;
          delete mail.status;

          status ? arrOut.push(mail) : arrErr.push(mail);
        } catch (error) {
          arrErr.push({
            message: "Error enviando query - " + error.message,
            reference: sql,
          });
        }
      }
    }
  }

  if (arrErr.length > 0) {
    return arrOut.length === 0
      ? res.status(400).send({ code: 400, error: arrErr })
      : res.status(207).send({ code: 207, error: arrErr, response: arrOut });
  }
  return arrOut.length > 0
    ? res.status(200).send({ code: 200, response: arrOut })
    : res
        .status(201)
        .send({ code: 201, response: { message: "No se registraron envíos" } });
};

export const massiveMailing = async (req, res) => {
  /*
  maenfa -> boolean - mail de clientes para envío de facturas - obligatorio si no existen o son falsos maenrc y maenpv
  maenrc -> boolean - mail de clientes para envío de recibos - obligatorio si no existen o son falsos maenfa y maenpv
  maenpv -> boolean - mail de proveedores - obligatorio si no existen o son falsos maenrc y maenfa
  subject -> string - asunto del mail - opcional, por defecto Comunicación HAFELE
  text -> string - asunto del mail - obligatorio si no existe attachments, por defecto Envío de documentación adjunta.
  attachments -> json con file y path del archivo - documentos adjuntos - obligatorio, si no existe text
  */
  const { maenfa, maenrc, maenpv, subject, text, attachments } = req.body,
    arrOut = [],
    arrErr = [];
  if (
    (maenfa !== undefined ? typeof maenfa !== "boolean" : false) ||
    (maenrc !== undefined ? typeof maenrc !== "boolean" : false) ||
    (maenpv !== undefined ? typeof maenpv !== "boolean" : false) ||
    ((maenfa === undefined || !maenfa) &&
      (maenrc === undefined || !maenrc) &&
      (maenpv === undefined || !maenpv)) ||
    (text !== undefined
      ? typeof text !== "string" || text.trim() === ""
      : false) ||
    (subject !== undefined
      ? typeof subject !== "string" || subject.trim() === ""
      : false) ||
    (text === undefined &&
      (attachments === undefined ||
        attachments.length === undefined ||
        attachments.length < 1))
  ) {
    let message = "",
      reference = {};

    switch (true) {
      case (maenfa === undefined || maenfa === false) &&
        (maenrc === undefined || maenrc === false) &&
        (maenpv === undefined || maenpv === false):
      case maenfa !== undefined ? typeof maenfa !== "boolean" : false:
      case maenrc !== undefined ? typeof maenrc !== "boolean" : false:
      case maenpv !== undefined ? typeof maenpv !== "boolean" : false:
        message = "No se recibieron mails o tipo de dato inválido";
        reference = { maenfa: "boolean", maenrc: "boolean", maenpv: "boolean" };
        break;

      case text !== undefined
        ? typeof text !== "string" || text.trim() === ""
        : false:
      case subject !== undefined
        ? typeof subject !== "string" || subject.trim() === ""
        : false:
        message = "Error al recibir texto o asunto";
        reference = { text: "string", subject: "string" };
        break;

      case text === undefined &&
        (attachments === undefined ||
          attachments.length === undefined ||
          attachments.length < 1):
        message = "El texto es obligatorio si no hay asuntos";
        reference = {
          text: "string",
          attachments: [{ filename: "string", path: "string" }],
        };
        break;

      default:
        message = "Error desconocido, verifique la información enviada";
        reference = {
          text: "string",
          subject: "string",
          maenfa: "boolean",
          maenrc: "boolean",
          maenpv: "boolean",
          attachments: [{ filename: "string", path: "string" }],
        };
        break;
    }

    return res.status(400).send({
      code: 400,
      error: { message, reference },
    });
  }

  const mails = await getMailingContact({ maenfa, maenrc, maenpv });
  if (
    !mails.status ||
    mails.data === undefined ||
    mails.data.length === undefined ||
    mails.data.length === 0
  ) {
    delete mails.status;
    return res.status(400).send({
      code: 400,
      error: {
        message: "No se pudieron obtener los contactos de los clientes",
        reference: mails,
      },
    });
  }

  try {
    const header = {
        msgTo: { mail: ["Hafele Argentina <noreply@hafeleargentina.com.ar>"] },
      },
      body = {};
    header.msgSubject = subject !== undefined ? subject : "Comunicación HAFELE";
    body.type = "text";
    body.msgText =
      text !== undefined ? text : "Envío de documentación adjunta.";

    const q = 100;
    if (
      mails !== undefined &&
      mails.data !== undefined &&
      mails.data.length !== undefined
    ) {
      while (mails.data.length > 0) {
        const cco = [];
        for (let i = 0; i < q; i++) {
          const el = mails.data[0];
          if (el !== undefined) {
            cco.push(el);
            mails.data.splice(0, 1);
          }
        }

        header.msgCCo = cco;
        console.log({
          header,
          body,
          attachments: attachments !== undefined ? attachments : [],
        });
        const mail = await sendMail({
          header,
          body,
          attachments: attachments !== undefined ? attachments : [],
        });
        if (!mail.status) {
          delete mail.status;
          arrErr.push(mail);
        } else {
          if (
            mail.reference !== undefined &&
            mail.reference.data !== undefined &&
            mail.reference.data.length !== undefined &&
            mail.reference.data.length > 0
          ) {
            arrOut.push(mail.reference.data);
          }
          if (
            mail.reference !== undefined &&
            mail.reference.error !== undefined &&
            mail.reference.error.length !== undefined &&
            mail.reference.error.length > 0
          ) {
            arrErr.push(mail.reference.error);
          }
        }
      }
    }
  } catch (error) {
    return res
      .status(400)
      .send({ code: 400, error: { message: error.message, data: arrErr } });
  }

  if (arrErr.length > 0) {
    return arrOut.length === 0
      ? res.status(400).send({
          code: 400,
          error: {
            message: "No se pudo enviar la comunicación",
            data: arrErr,
          },
        })
      : res.status(207).send({
          code: 207,
          response: { message: "Envío incompleto", data: arrOut },
          error: { data: arrErr, message: "Envío incompleto" },
        });
  }
  return res
    .status(200)
    .send({ code: 200, response: { message: "Envío completo", data: arrOut } });
};
