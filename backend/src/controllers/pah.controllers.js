import config from "../config/config";
import { setLog } from "../functions/main.functions";
import {
  InsertOrdersOnPah,
  getData,
  getPendingOrderfromCloud,
  markAsSeen,
  uploadData,
} from "../functions/pah.functions";
const envUrl = config.env ? "url_baseProdu" : "url_basePrepro";

export const updateOnCloud = async (req, res) => {
  const { data } = req.body;
  const arrRes = [],
    arrErr = [];
  if (data === undefined || data.length === 0) {
    return res.status(400).send({
      code: 400,
      error: { message: `updateOnCloud - data required, get ${data}` },
    });
  }

  for (let i = 0; i < data.length; i++) {
    try {
      const el = data[i];
      const options = typeof el === "string" ? { table: el } : el;
      const dataToUpload = await getData(options);
      if (!dataToUpload.status) {
        delete dataToUpload.status;
        arrErr.push(dataToUpload);
      } else {
        if (
          dataToUpload.data === undefined ||
          dataToUpload.data.length === undefined ||
          dataToUpload.data.length === 0
        ) {
          delete dataToUpload.status;
          dataToUpload.message = "Sin información para actualizar";
          dataToUpload.reference = el;
          if (data.length === 1) {
            return res.status(201).send({ code: 201, response: dataToUpload });
          }
          arrRes.push(dataToUpload);
        } else {
          const errToMark = [];
          const uploaded = await uploadData(
            envUrl,
            dataToUpload.url,
            dataToUpload.data
          );
          if (uploaded.status) {
            if (uploaded.error !== undefined) {
              if (
                uploaded.error.length !== undefined &&
                uploaded.error.length > 0
              ) {
                for (let i = 0; i < uploaded.error.length; i++) {
                  const el = uploaded.error[i];
                  arrErr.push(el.errors === undefined ? el : el.errors);
                  errToMark.push(el.errors === undefined ? el : el.errors);
                }
              } else {
                arrErr.push(uploaded.error);
              }
            } else {
              arrRes.push({
                reference: options.table,
                message: uploaded.message,
              });
            }
          } else {
            delete uploaded.status;
            if (uploaded.reference === "PHP Fatal Error") {
              for (let i = 0; i < uploaded.error.length; i++) {
                const el = uploaded.error[i];
                errToMark.push(el);
              }
            }
            arrErr.push(uploaded);
          }
          await markAsSeen(dataToUpload.url, errToMark);
        }
      }
    } catch (error) {
      arrErr.push({ message: error.message });
    }
  }
  if (arrErr.length > 0) {
    return arrRes.length > 0
      ? res.status(207).send({ code: 207, response: arrRes, error: arrErr })
      : res.status(400).send({ code: 400, error: arrErr });
  }
  let emptyResponse = true;
  for (let i = 0; i < arrRes.length; i++) {
    const el = arrRes[i];
    if (
      (el.data === undefined ||
        el.data.length === undefined ||
        el.data.length === 0) &&
      emptyResponse
    ) {
      emptyResponse = false;
    }
  }
  const code = emptyResponse ? 201 : 200;
  return res.status(code).send({ code, response: arrRes });
};

export const retrieveOrdersFromClound = async (req, res) => {
  const table = "url_pedidos";
  const pendingOrders = await getPendingOrderfromCloud(envUrl, table);
  const orders = pendingOrders.message;
  const lastId = pendingOrders.lastId !== undefined ? pendingOrders.lastId : 0;
  if (!pendingOrders.status) {
    await setLog({
      status: false,
      message: `retrieveOrdersFromClound - ${pendingOrders.message}`,
    });
    return res.status(403).send({
      code: 403,
      error: {
        message: `retrieveOrdersFromClound - ${pendingOrders.message}`,
      },
    });
  } else {
    if (orders.length === 0) {
      return res.status(201).send({
        code: 201,
        response: {
          message: "No se encontraron registros para transmitir",
        },
      });
    } else {
      const insertOrders = await InsertOrdersOnPah(orders, lastId, envUrl);
      if (!insertOrders.status) {
        return res.status(400).send({
          code: 400,
          error: { message: `retrieveOrders - ${insertOrders.message}` },
        });
      }
      if (insertOrders.error !== undefined && insertOrders.error.length > 0) {
        return insertOrders.response.length > 0
          ? res.status(207).send({
              code: 207,
              response: {
                data: insertOrders.response,
                reference: { lastId: insertOrders.lastId },
              },
              error: { data: insertOrders.error },
            })
          : res.status(400).send({
              code: 400,
              error: {
                data: insertOrders.error,
                reference: { lastId: insertOrders.lastId },
              },
            });
      }
      return res.status(200).send({
        code: 200,
        response: {
          data: insertOrders.response,
          reference: { lastId: insertOrders.lastId },
        },
      });
    }
  }
};
