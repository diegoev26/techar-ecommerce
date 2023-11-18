import axios from "axios";
import {
  sqlInterfaces,
  getConnection,
  warehouseQuerys,
  sqlHafele,
} from "../database";
import {
  carrierOrderToFile,
  loginConvertJson2Txt,
  loginGetJson,
  setTransmitted,
  translogGetSaadisJson,
  translogGetToken,
  translogNewOrder,
  loginSynchronizeFTP,
  handleDateStr,
  cancelDeliveryNote,
  setDeliveryNoteRender,
  transferDeliveryNote,
} from "../functions/carriers.functions";
import { setDbLog, setLog } from "../functions/main.functions";
import config from "../config/config";

export const getDeliveryNotesToTransmit = async (req, res) => {
  const { idCarrier } = req.body;
  try {
    const pool = await getConnection("interfaces");
    const { recordset } = await pool
      .request()
      .input("idCarrier", sqlInterfaces.Int, idCarrier)
      .query(warehouseQuerys.devlieryNotesToTransmit);
    if (recordset.length === 0) {
      return res.status(201).send({
        code: 201,
        response: {
          data: recordset,
          message: "No se encontraron remitos para transmitir",
        },
      });
    }

    return res.status(200).send({ code: 200, response: { data: recordset } });
  } catch (error) {
    await setLog({
      status: false,
      message: `getDeliveryNotesToTransmit - ${error.message}`,
    });
    return res.status(400).send({
      code: 400,
      error: {
        message: error.message,
      },
    });
  }
};

export const carrierNewOrder = async (req, res) => {
  const { data } = req.body;
  let orderStatus = false,
    carrierJson,
    response = {},
    carrierStr,
    newOrder,
    fileExt;
  const idCarrier = data[0].idCarrier;

  try {
    switch (idCarrier) {
      case 1:
        carrierJson = await translogGetSaadisJson(data);
        response = carrierJson.response;
        (carrierStr = "translog"), (fileExt = "json");
        newOrder = await translogNewOrder(response.data);
        orderStatus =
          typeof newOrder.status === "boolean" ? newOrder.status : false;
        if (orderStatus && newOrder.data !== undefined) {
          await setDbLog({ data: newOrder.data, model: carrierStr });
        }
        break;
      case 2:
        carrierJson = await loginGetJson(data);
        if (carrierJson.response.length > 0) {
          response = await loginConvertJson2Txt(carrierJson.response);
        }
        (carrierStr = "login"), (fileExt = "txt");
        break;
      default:
        await setLog({
          status: false,
          message: `carrierNewOrder - Transportista no identificado - ${data[0].idCarrier}`,
        });
        return res.status(400).send({
          code: 400,
          error: {
            message: "Transportista no identificado",
            reference: data[0].idCarrier,
          },
        });
    }
    response.idCarrier = idCarrier;

    if (carrierJson.error.length > 0) {
      await setDbLog({
        data: carrierJson.error,
        model: "hafele",
      });
      if (response.length === 0) {
        return res.status(400).send({
          code: 400,
          error: {
            message: "No se transmitieron los remitos",
            data: carrierJson.error,
          },
        });
      }
    }
    if (!orderStatus || idCarrier === 2) {
      if (response.data.length === undefined || response.data.length < 1) {
        return res.status(400).send({
          code: 400,
          error: {
            message:
              "No hay información para generar el archivo de transmisión",
          },
        });
      }
      const file = await carrierOrderToFile(fileExt, carrierStr, response.data);
      if (!file.status) {
        await setLog({
          status: file.status,
          message: `carrierOrderToFile - ${file.message}`,
        });
        return res.status(400).send({
          error: {
            message: `Error al generar archivo de transmisión - ${file.message}`,
            data: carrierJson.error,
          },
          code: 400,
        });
      }
      if (idCarrier === 2) {
        newOrder = await loginSynchronizeFTP(file.path, [file.filename]);
        orderStatus =
          typeof newOrder.status === "boolean" ? newOrder.status : false;
        if (!orderStatus) {
          await setDbLog({ data: newOrder, model: "hafele" });
        }
      }
    }

    const transmitted = await setTransmitted(response.reference);
    if (!transmitted.status) {
      await setLog({
        status: transmitted.status,
        message: `setTransmitted - ${transmitted.message}`,
      });
      return res.status(400).send({
        error: {
          message: transmitted.message,
          data: transmitted.data,
        },
        code: 400,
      });
    }
    if (carrierJson.error.length > 0 && response.length > 0) {
      return res.status(207).send({
        response: { response },
        error: {
          message: "Transmisión de remitos parcial",
          data: carrierJson.error,
        },
        code: 207,
      });
    }
    if (!orderStatus) {
      return res.status(201).send({
        code: 201,
        error: {
          message:
            "Transmisión fallida. Se generó el archivo con la info a transmitir",
          data: carrierJson.error,
        },
        response,
      });
    }
    return res.status(200).send({ response, code: 200 });
  } catch (error) {
    await setLog({
      status: false,
      message: `carrierNewOrder - ${error.message}`,
    });
    return res.status(400).send({
      error: {
        message: error.message,
        reference: data[0].idCarrier,
      },
      code: 400,
    });
  }
};

export const carrierTracking = async (req, res) => {
  const { data } = req.body;
  if (data === undefined || data.length === undefined || data.length === 0) {
    return res.status(400).send({
      code: 400,
      error: { message: "Faltan datos obligatorios" },
    });
  }

  let sqlWhere = "WHERE ";
  for (let i = 0; i < data.length; i++) {
    const el = data[i];
    if (
      el.modfor !== undefined &&
      el.codfor !== undefined &&
      el.nrofor !== undefined
    ) {
      const keyModfor =
          el.modfor === "FC" ? "USR_HRRMVI_HRRMVH_MODFOR" : "USR_HRRMVI_MODOST",
        keyCodfor =
          el.modfor === "FC" ? "USR_HRRMVI_HRRMVH_CODFOR" : "USR_HRRMVI_CODOST",
        keyNrofor =
          el.modfor === "FC" ? "USR_HRRMVI_HRRMVH_NROFOR" : "USR_HRRMVI_NROOST";
      if (i !== 0) {
        sqlWhere = sqlWhere + "OR ";
      }
      sqlWhere = `${sqlWhere}(${keyModfor} = '${el.modfor}' AND ${keyCodfor} = '${el.codfor}' AND ${keyNrofor} = ${el.nrofor}) `;
    }
  }
  const query = `${warehouseQuerys.getSLAData} ${sqlWhere}`;
  try {
    const pool = await getConnection("hafele");
    const { recordset } = await pool.request().query(query);
    return recordset.length === 0
      ? res.status(200).send({
          code: 201,
          response: { message: "No se encontraron remitos" },
        })
      : res.status(200).send({ code: 200, response: { data: recordset } });
  } catch (error) {
    await setLog({
      status: false,
      message: "carrierTracking - " + error.message,
    });
    return res
      .status(400)
      .send({ code: 400, error: { message: error.message } });
  }
};

export const carrierGetSla = async (req, res) => {
  const arrOut = [],
    arrErr = [];
  try {
    const pool = await getConnection("hafele");
    const { recordset } = await pool
      .request()
      .query(warehouseQuerys.getDeliveryNotesNotDelivered);
    const { data } = await axios({
      method: "post",
      url: config.urlApiInterface + "/carriers/tracking",
      headers: {
        "Content-type": "application/json",
      },
      data: { data: recordset },
    });
    for (let i = 0; i < data.response.length; i++) {
      const rx = data.response[i];
      let fechaEntrega;
      if (rx !== undefined && rx.data !== undefined) {
        if (rx.data.length !== undefined && rx.data.length > 0) {
          for (let i = 0; i < rx.data.length; i++) {
            const el = rx.data[i];
            el.Letra === "R" ? (fechaEntrega = el.FechaEntrega) : null;
          }
        } else {
          fechaEntrega =
            rx.data.FechaEntrega || rx.data.fechaEntrega || undefined;
        }
      }
      if (fechaEntrega !== undefined) {
        try {
          const pool = await getConnection("hafele");
          const { rowsAffected } = await pool
            .request()
            .input("modfor", sqlHafele.VarChar, rx.reference.modfor)
            .input("codfor", sqlHafele.VarChar, rx.reference.codfor)
            .input("nrofor", sqlHafele.Int, rx.reference.nrofor)
            .input("strDate", sqlHafele.VarChar, handleDateStr(fechaEntrega))
            .query(warehouseQuerys.setDeliveryNoteDelivered);
          rowsAffected.length > 0 ? arrOut.push(rx.reference) : null;
        } catch (error) {
          arrErr.push({ message: error.message, reference: rx.reference });
        }
      }
    }
  } catch (error) {
    await setLog({ status: false, message: "slaTask - " + error.message });
    return res
      .status(400)
      .send({ code: 400, error: { message: error.message } });
  }
  if (arrErr.length > 0) {
    return arrOut.length > 0
      ? res.status(207).send({
          code: 207,
          response: {
            message: `Se marcaron ${arrOut.length} registros`,
            data: arrOut.length === 1 ? arrOut[0] : arrOut,
          },
          error: arrErr.length > 0 ? arrErr : arrErr[0],
        })
      : res.status(400).send({
          code: 400,
          error: {
            message:
              "Ocurrio un error recuperando los datos de los remitos en tránsito",
            data: arrErr.length > 0 ? arrErr : arrErr[0],
          },
        });
  }
  return res.status(200).send({
    code: 200,
    response: {
      message: `Se marcaron ${arrOut.length} registros`,
      data: arrOut.length === 1 ? arrOut[0] : arrOut,
    },
  });
};

export const translogCheckStock = async (req, res) => {
  try {
    const { status, token, message } = await translogGetToken();
    if (!status) {
      return res.status(400).send({
        code: 400,
        error: {
          message,
        },
      });
    }

    const { data } = await axios({
      method: "post",
      url: config.translogApi.route + config.translogApi.checkStock,
      headers: {
        Authorization: "bearer " + token,
        "Content-type": "application/json",
      },
      data: {},
    });
    return res.status(200).send({
      code: 200,
      response: {
        data,
        message: "Stock de translog recibido OK",
      },
    });
  } catch (error) {
    return res.status(400).send({
      code: 400,
      error: {
        message: "Error stock translog - " + error.message,
      },
    });
  }
};

export const updateDeliveryNotes = async (req, res) => {
  const { data } = req.body;
  if (data === undefined || data.length === undefined || data.length === 0) {
    return res.status(400).send({
      code: 400,
      error: { message: "Faltan datos necesarios", reference: data },
    });
  }

  const arrErr = [],
    arrOut = [];
  for (let i = 0; i < data.length; i++) {
    const el = data[i];
    if (
      el.modforRX === undefined ||
      el.codforRX === undefined ||
      el.nroforRX === undefined ||
      el.status === undefined
    ) {
      arrErr.push({ message: "Faltan datos necesarios", reference: el });
    } else {
      let result;
      switch (el.status.trim().toLowerCase()) {
        case "a":
          result = await cancelDeliveryNote(el);
          break;
        case "t":
          result = await transferDeliveryNote(el);
          break;
        case "r":
          result = await setDeliveryNoteRender(el);
          break;
        default:
          result = {
            status: false,
            message: "Estado a actualizar no reconocido",
          };
          break;
      }
      if (result !== undefined && result.status !== undefined) {
        result.reference = el;
        if (!result.status) {
          delete result.status;
          arrErr.push(result);
        } else {
          delete result.status;
          arrOut.push(result);
        }
      }
    }
  }
  if (arrOut.length === 0 && arrErr.length > 0) {
    return res
      .status(400)
      .send({ code: 400, error: arrErr.length === 1 ? arrErr[0] : arrErr });
  }
  if (arrOut.length === 0 && arrErr.length === 0) {
    return res.status(201).send({
      code: 201,
      message: "La ejecución no reconoció ningún registro",
    });
  }
  return arrErr.length > 0
    ? res.status(207).send({
        code: 207,
        response: arrOut.length === 1 ? arrOut[0] : arrOut,
        error: arrErr.length === 1 ? arrErr[0] : arrErr,
      })
    : res.status(200).send({
        code: 200,
        response: arrOut.length === 1 ? arrOut[0] : arrOut,
      });
};
