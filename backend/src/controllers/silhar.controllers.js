import { sqlInterfaces, getConnection, warehouseQuerys } from "../database";
import { setLog } from "../functions/main.functions";
import {
  getPrinter,
  insertDeliveryNotes,
  getDeliveryNotesHeaders,
  getDeliveryNotesItems,
  getJsonToPrinter,
  getZplJson,
  getZplString,
  sendPrintToZebra,
  getLabel,
} from "../functions/silhar.functions";

export const getDeliveryNotes = async (req, res) => {
  const { dateInit } = req.body;
  try {
    const pool = await getConnection("interfaces");
    const result = await pool
      .request()
      .input("dateInit", sqlInterfaces.VarChar, dateInit)
      .query(warehouseQuerys.deliveryNotesToPrint);
    if (result.recordset.length < 1) {
      return res
        .status(201)
        .send({ error: { message: "No se encontraron remitos", code: 201 } });
    }
    return res.status(200).send({ response: result.recordset });
  } catch (error) {
    await setLog({
      status: false,
      message: `getDeliveryNotes - ${error.message}`,
    });
    return res.status(400).send({
      error: { message: "Error desconocido," + error.message, code: 400 },
    });
  }
};

export const deliveryNoteToZebra = async (req, res) => {
  const { modfor, codfor, nrofor, idPrinter, idLabel, labels } = req.body,
    zplJsonArr = [],
    zplJsonErr = [],
    zplStrErr = [],
    errOut = [],
    arrOut = [];
  let cont = 0;

  try {
    const printerSet = await getPrinter(idPrinter);
    if (!printerSet.status) {
      await setLog({
        status: printerSet.status,
        message: `getPrinter - ${printerSet.message}`,
      });
      return res.status(400).send({
        error: {
          message: printerSet.message,
          code: 400,
        },
      });
    }

    const insert = await insertDeliveryNotes({ modfor, codfor, nrofor });
    if (!insert.status) {
      await setLog({
        status: insert.status,
        message: `insertDeliveryNotes - ${insert.message}`,
      });
      return res.status(401).send({
        error: {
          message: insert.message,
          code: 401,
        },
      });
    }

    const headers = await getDeliveryNotesHeaders({ modfor, codfor, nrofor });
    if (!headers.status) {
      await setLog({
        status: headers.status,
        message: `getDeliveryNotesHeaders - ${headers.message}`,
      });
      return res.status(401).send({
        error: {
          message: headers.message,
          reference: headers.reference,
          code: 401,
        },
      });
    }

    const items = await getDeliveryNotesItems({
      modfor,
      codfor,
      nrofor,
      labels,
    });
    if (!items.status) {
      await setLog({
        status: items.status,
        message: `getDeliveryNotesItems - ${items.message}`,
      });
      return res.status(401).send({
        error: {
          message: items.message,
          reference: items.reference,
          code: 401,
        },
      });
    }

    const jsonToPrinter = await getJsonToPrinter(
      headers.data,
      items.data,
      idLabel
    );
    if (!jsonToPrinter.status) {
      await setLog({
        status: jsonToPrinter.status,
        message: `getJsonToPrinter - ${jsonToPrinter.message}`,
      });
      return res
        .status(400)
        .send({ error: { message: jsonToPrinter.message, code: 400 } });
    }

    while (cont < jsonToPrinter.data.deliveryNotes.length) {
      const zplJson = await getZplJson(jsonToPrinter.data.deliveryNotes[cont]);
      !zplJson.status
        ? zplJsonErr.push(zplJson.data)
        : zplJsonArr.push(zplJson.data);
      cont++;
    }
    if (zplJsonArr[0].length === 0) {
      return res.status(201).send({
        error: { message: "Sin datos para enviar a imprimir", code: 201 },
      });
    }

    cont = 0;
    while (cont < zplJsonArr[0].length) {
      const zplStr = await getZplString(zplJsonArr[0][cont], idLabel);
      if (!zplStr.status) {
        await setLog({
          status: zplStr.status,
          message: `getZplString - ${zplStr.message}`,
        });
        zplStrErr.push({
          message: zplStr.message,
          reference: zplStr.reference,
        });
      } else {
        const printResult = await sendPrintToZebra(
          printerSet.data,
          zplStr.data,
          zplStr.reference
        );
        printResult.status
          ? arrOut.push({
              message: printResult.message,
              reference: printResult.reference,
            })
          : errOut.push({
              message: printResult.message,
              reference: printResult.reference,
            });
        if (!printResult.status) {
          await setLog({
            status: printResult.status,
            message: `sendPrintToZebra - ${printResult.message} ${printResult.reference}`,
          });
        }
      }
      cont++;
    }

    if (zplStrErr.length > 0 || zplJsonErr.length > 0) {
      if (zplStrErr.length > 0) {
        cont = 0;
        while (cont < zplStrErr.length) {
          errOut.push({
            message: zplStrErr[cont].message,
            reference: zplStrErr[cont].reference,
          });
          cont++;
        }
      }
      if (zplJsonErr.length > 0) {
        cont = 0;
        while (cont < zplJsonErr.length) {
          errOut.push({
            message: zplJsonErr[cont].message,
            reference: zplJsonErr[cont].reference,
          });
          cont++;
        }
      }
    }
    if (arrOut.length === 0) {
      return res.status(400).send({
        error: {
          message: "No se imprimieron las etiquetas",
          data: errOut,
          code: 400,
        },
      });
    }
    if (errOut.length > 0 && arrOut.length > 0) {
      const message = "Las etiquetas se imprimieron de manera parcial";
      return res.status(207).send({
        response: { message, data: arrOut },
        error: { message, data: errOut },
        code: 207,
      });
    }
  } catch (error) {
    return res
      .status(400)
      .send({ error: { message: error.message, code: 400 } });
  }

  return res
    .status(200)
    .send({ response: { message: "Etiquetas impresas", data: arrOut } });
};

export const updateDeliveryNotesPrinted = async (req, res) => {
  const { data, all, printerId, labelId } = req.body;
  try {
    const pool = await getConnection("interfaces");
    let result,
      cont = 0;
    if (all) {
      result = await pool
        .request()
        .input("modfor", sqlInterfaces.VarChar, data[0].modfor)
        .input("codfor", sqlInterfaces.VarChar, data[0].codfor)
        .input("nrofor", sqlInterfaces.Int, data[0].nrofor)
        .input("idLabel", sqlInterfaces.Int, labelId)
        .input("idPrinter", sqlInterfaces.Int, printerId)
        .execute(warehouseQuerys.insertPrinterTransactionAll);
    } else {
      result = [];
      while (cont < data.length) {
        const response = await pool
          .request()
          .input("modfor", sqlInterfaces.VarChar, data[cont].modfor)
          .input("codfor", sqlInterfaces.VarChar, data[cont].codfor)
          .input("nrofor", sqlInterfaces.Int, data[cont].nrofor)
          .input("nrobulto", sqlInterfaces.Int, data[cont].packageNumber)
          .input("idLabel", sqlInterfaces.Int, labelId)
          .input("idPrinter", sqlInterfaces.Int, printerId)
          .execute(warehouseQuerys.insertPrinterTransaction);
        result.push(response);
        cont++;
      }
    }
    return res.status(200).send({
      response: { message: "Remitos marcados como impresos", data: result },
    });
  } catch (error) {
    await setLog({
      status: false,
      message: `updateDeliveryNotesPrinted - ${error.message}`,
    });
    return res
      .status(400)
      .send({ error: { message: error.message, code: 400 } });
  }
};

export const deliveryNotePrintAgain = async (req, res) => {
  const { modfor, codfor, nrofor } = req.body;
  try {
    const pool = await getConnection("interfaces");
    const result = await pool
      .request()
      .input("modfor", sqlInterfaces.VarChar, modfor)
      .input("codfor", sqlInterfaces.VarChar, codfor)
      .input("nrofor", sqlInterfaces.Int, nrofor)
      .execute(warehouseQuerys.silharPrintAgain);

    return result.rowsAffected.length > 0
      ? res.status(200).send({
          response: {
            message: `Se reingreso el comprobante para imprimir`,
            code: 200,
            reference: `${modfor}-${codfor}-${nrofor}`,
          },
        })
      : res.status(201).send({
          response: {
            message: "No se encontró comprobante",
            code: 201,
            reference: `${modfor}-${codfor}-${nrofor}`,
          },
        });
  } catch (error) {
    await setLog({
      status: false,
      message: `deliveryNotePrintAgain - ${error.message}`,
    });
    return res.status(400).send({
      error: { message: "Error desconocido," + error.message, code: 400 },
    });
  }
};

export const printReprocessLabel = async (req, res) => {
  const { data } = req.body;
  if (data === undefined || data.length === undefined || data.length < 1) {
    return res.status(400).send({
      code: 400,
      error: { message: "No se recibieron datos para la consulta" },
    });
  }
  const arrErr = [],
    arrOut = [];
  for (let i = 0; i < data.length; i++) {
    const el = data[i],
      jsonOut = {};
    if (
      el.tippro === undefined ||
      typeof el.tippro !== "string" ||
      el.tippro.trim() === "" ||
      el.artcod === undefined ||
      typeof el.artcod !== "string" ||
      el.artcod.trim() === "" ||
      el.impEAN === undefined ||
      typeof el.impEAN !== "boolean" ||
      el.impQR === undefined ||
      typeof el.impQR !== "boolean" ||
      el.impPACK === undefined ||
      typeof el.impPACK !== "boolean" ||
      el.q === undefined ||
      isNaN(el.q) ||
      el.printerId === undefined ||
      isNaN(el.printerId)
    ) {
      arrErr.push({
        message: "Faltan datos necesarios o error en tipo de dato",
        reference: el,
      });
    } else {
      try {
        const printerSet = await getPrinter(el.printerId);
        if (!printerSet.status) {
          delete printerSet.status;
          arrErr.push(printerSet);
        } else {
          const zpl = await getLabel(2, el);
          if (!zpl.status) {
            delete zpl.status;
            arrErr.push(zpl);
          } else {
            const index = typeof el.q === "number" ? el.q : parseInt(el.q),
              printErr = [];
            for (let i = 0; i < index; i++) {
              const print = await sendPrintToZebra(
                printerSet.data,
                zpl.zplCode,
                el
              );
              if (!print.status) {
                delete print.status;
                printErr.push(print);
              }
            }
            if (printErr.length > 0) {
              const message =
                printErr.length === index
                  ? "No se pudo imprimir ninguna etiqueta"
                  : "Hay etiquetas sin imprimir";
              arrErr.push({ message, data: printErr });
            }
            if (printErr.length !== index) {
              jsonOut.message =
                printErr.length > 0
                  ? "Hay etiquetas sin imprimir"
                  : "Etiquetas impresas";
              jsonOut.reference = el;
              arrOut.push(jsonOut);
            }
          }
        }
      } catch (error) {
        arrErr.push({ message: error.message, reference: el });
      }
    }
  }
  if (arrErr.length > 0) {
    let logStr,
      arrStr = [];
    for (let i = 0; i < arrErr.length; i++) {
      const el = arrErr[i];
      if (i === 0) {
        logStr = el.message;
      }
      if (
        el.data !== undefined &&
        el.data.length !== undefined &&
        el.data.length > 0
      ) {
        for (let i = 0; i < el.data.length; i++) {
          const err = el.data[i];
          if (
            err.error !== undefined &&
            err.error.code !== undefined &&
            err.error.event !== undefined &&
            err.error.printerIp !== undefined
          ) {
            if (arrStr.length === 0) {
              arrStr.push(err.error.code);
              arrStr.push(err.error.event);
              arrStr.push(err.error.printerIp);
            } else {
              const code = arrStr.find((el) => el === err.error.code),
                event = arrStr.find((el) => el === err.error.event),
                printerIp = arrStr.find((el) => el === err.error.printerIp);
              code !== undefined ? null : arrStr.push(code);
              event !== undefined ? null : arrStr.push(event);
              printerIp !== undefined ? null : arrStr.push(printerIp);
            }
          }
        }
      }
    }
    if (arrStr.length !== undefined && arrStr.length > 0) {
      logStr = logStr + " - ";
      for (let i = 0; i < arrStr.length; i++) {
        const el = arrStr[i];
        logStr = logStr + (i === 0 ? el : `;${el}`);
      }
    }
    await setLog({ status: false, message: `printReprocessLabel - ${logStr}` });

    return arrOut.length === 0
      ? res
          .status(400)
          .send({ code: 400, error: arrErr.length > 1 ? arrErr : arrErr[0] })
      : res.status(207).send({
          code: 207,
          response: arrOut.length > 1 ? arrOut : arrOut[0],
          error: arrErr.length > 1 ? arrErr : arrErr[0],
        });
  }
  return res.status(200).send({
    code: 200,
    message: "Etiquetas impresas",
    response: arrOut.length > 1 ? arrOut : arrOut[0],
  });
};
