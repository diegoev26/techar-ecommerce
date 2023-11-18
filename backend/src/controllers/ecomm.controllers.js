import { ecommQuerys, getConnection, sqlHafele } from "../database";
import { validarIdenti } from "../functions/ecomm.functions";
import { countJsonKeys } from "../functions/main.functions";

export const getData = async (req, res) => {
  const jsonOut = { Interface: [], Validation: [], Logistic: [], Finished: [] },
    arrErr = [];
  try {
    const pool = await getConnection(),
      { recordset } = await pool.query(ecommQuerys.getData);
    for (let i = 0; i < recordset.length; i++) {
      const sale = recordset[i];
      switch (true) {
        case sale.Estado === "Pend.Ingreso":
          jsonOut.Interface.push(sale);
          break;
        case sale.Estado === "Pend.Validacion":
          jsonOut.Validation.push(sale);
          break;
        case sale.Estado === "Importado" && sale.PasoActual !== "Finalizado":
          jsonOut.Logistic.push(sale);
          break;
        case sale.Estado === "Importado" && sale.PasoActual === "Finalizado":
          jsonOut.Finished.push(sale);
          break;
        default:
          arrErr.push({ message: "No se reconoce el estado", reference: sale });
          break;
      }
    }
  } catch (error) {
    return res.status(400).send({ code: 400, message: error.message });
  }
  if (arrErr.length > 0) {
    return jsonOut.Interface.length === 0 &&
      jsonOut.Validation.length === 0 &&
      jsonOut.Logistic.length === 0 &&
      jsonOut.Finished.length === 0
      ? res.status(400).send({ code: 400, error: arrErr })
      : res.status(207).send({ code: 207, response: jsonOut, error: arrErr });
  }
  return res.status(200).send({ code: 200, response: jsonOut });
};

export const getDataToChart = async (req, res) => {
  const jsonOut = { salesQ: [], sales$: [] },
    arrErr = [];
  try {
    const pool = await getConnection(),
      { recordsets } = await pool.request().query(ecommQuerys.getSalesToCharts);
    for (let i = 0; i < recordsets.length; i++) {
      const sales = recordsets[i];
      for (let i = 0; i < sales.length; i++) {
        const sale = sales[i];
        if (sale.Periodo !== undefined) {
          Object.keys(sale).forEach(function (key) {
            if (key !== "Periodo") {
              switch (key) {
                case "ImporteVentasSinImpuestos":
                  jsonOut.sales$.push(sale);
                  break;
                case "CantidadVentas":
                  jsonOut.salesQ.push(sale);
                  break;
                default:
                  arrErr.push({
                    message: "Error al identificar el dato",
                    reference: sale,
                  });
                  break;
              }
            }
          });
        } else {
          arrErr.push({
            message: "Error al identificar el dato",
            reference: sale,
          });
        }
      }
    }
  } catch (error) {
    return res
      .status(400)
      .send({ code: 400, error: { message: error.message } });
  }
  if (arrErr.length > 0) {
    return jsonOut.sales$.length === 0 && jsonOut.salesQ.length === 0
      ? res.status(400).send({ code: 400, error: arrErr })
      : res.status(207).send({ code: 207, response: jsonOut, error: arrErr });
  }
  return res.status(200).send({ code: 200, response: jsonOut });
};

export const getStatus = async (req, res) => {
  try {
    const pool = await getConnection(),
      { recordset } = await pool.request().query(ecommQuerys.getStatus);
    return res.status(200).send({ code: 200, response: recordset[0] });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

export const taxConfirm = async (req, res) => {
  const { data } = req.body;
  if (
    data === undefined ||
    data.identi === undefined ||
    !validarIdenti(data.identi).status ||
    data.taxCondition === undefined ||
    typeof data.taxCondition !== "string" ||
    data.taxCondition.trim() === "" ||
    (data.taxCondition !== "AR9995" &&
      data.taxCondition !== "AR9994" &&
      data.taxCondition !== "AR9993" &&
      data.taxCondition !== "AR9992")
  ) {
    return res.status(400).send({
      code: 400,
      error: {
        message: "Error con los datos recibidos",
        reference: data,
      },
    });
  }
  try {
    const pool = await getConnection(),
      { recordset } = await pool
        .request()
        .input("identi", sqlHafele.VarChar, data.identi.toString())
        .query(ecommQuerys.previousTax);
    if (
      recordset === undefined ||
      recordset.length === undefined ||
      recordset.length < 1 ||
      recordset[0].NROCTA === undefined
    ) {
      return res.status(502).send({
        code: 502,
        error: {
          message: "Error recuperando condición de IVA del cliente",
          reference: recordset,
        },
      });
    }
    if (recordset[0].NROCTA !== data.taxCondition) {
      try {
        const pool = await getConnection();
        await pool
          .request()
          .input("identi", sqlHafele.VarChar, data.identi.toString())
          .input("nroCtaIn", sqlHafele.VarChar, data.taxCondition)
          .execute(ecommQuerys.switchClientTax);

        return res.status(200).send({
          code: 200,
          response: {
            message: "Condición de IVA del cliente cambiada",
            reference: data,
          },
        });
      } catch (error) {
        console.log(error);
        return res.status(400).send({
          code: 400,
          error: {
            message: "SwitchCliente - " + error.message,
            reference: data,
          },
        });
      }
    } else {
      try {
        const pool = await getConnection();
        switch (data.taxCondition) {
          case "AR9995": //RI
            await pool
              .request()
              .input("identi", sqlHafele.VarChar, data.identi.toString())
              .execute(ecommQuerys.insertRI);
            break;
          case "AR9994": //MT
            return res.status(400).send({
              code: 400,
              error: {
                message: "No hay acción definida para el cliente MT",
                reference: data,
              },
            });
          case "AR9993": //CF
            await pool
              .request()
              .input("identi", sqlHafele.VarChar, data.identi.toString())
              .execute(ecommQuerys.insertCF);
            break;
          case "AR9992": //RIM
            return res.status(400).send({
              code: 400,
              error: {
                message: "No hay acción definida para el cliente RIM",
                reference: data,
              },
            });
          default:
            return res.status(400).send({
              code: 400,
              error: {
                message: "No se reconoce el tipo de cliente",
                reference: data,
              },
            });
        }
      } catch (error) {
        return res.status(400).send({
          code: 400,
          error: {
            message:
              "Confirmar IVA - " +
              (error.precedingErrors !== undefined &&
              error.precedingErrors.length !== undefined &&
              error.precedingErrors.length > 0 &&
              error.precedingErrors[0].message !== undefined
                ? error.precedingErrors[0].message
                : error.message),
            reference: data,
          },
        });
      }
    }
  } catch (error) {
    return res.status(400).send({
      code: 400,
      error: { message: error.message, reference: data },
    });
  }
  return res.status(200).send({
    code: 200,
    response: { message: "IVA del cliente confirmado", reference: data },
  });
};

export const getPercepts = async (req, res) => {
  const { data } = req.body;
  let jsonOut = {};
  if (!validarIdenti(data.identi).status) {
    return res.status(400).send({
      code: 400,
      error: { message: "Error con los datos recibidos", reference: data },
    });
  }

  try {
    const pool = await getConnection(),
      { recordset } = await pool
        .request()
        .input("identi", sqlHafele.VarChar, data.identi)
        .query(ecommQuerys.getPercepts);
    jsonOut = recordset[0];
  } catch (error) {
    return res.status(400).send({
      code: 400,
      message: {
        message:
          "Obtener percepciones - " +
          (error.precedingErrors[0].message || error.message),
        reference: data,
      },
    });
  }

  if (jsonOut.Percepciones === undefined) {
    return res.status(400).send({
      code: 400,
      error: {
        message: "Ocurrió un error al obtener percepciones",
        reference: data,
      },
    });
  }
  return res.status(200).send({ code: 200, response: jsonOut });
};

export const setPercepts = async (req, res) => {
  const { data } = req.body;
  if (!validarIdenti(data.identi).status) {
    return res.status(400).send({
      code: 400,
      error: { message: "Error con los datos recibidos", reference: data },
    });
  }

  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("IDENTI", sqlHafele.VarChar, data.identi)
      .execute(ecommQuerys.setPercepts);
  } catch (error) {
    return res.status(400).send({
      code: 400,
      error: {
        message:
          "Insertar percepciones - " +
          (error.precedingErrors !== undefined &&
          error.precedingErrors.length !== undefined &&
          error.precedingErrors.length > 0 &&
          error.precedingErrors[0].message !== undefined
            ? error.precedingErrors[0].message
            : error.message),
        reference: data,
      },
    });
  }

  return res.status(200).send({
    code: 200,
    response: { message: "Percepciones cargadas", reference: data },
  });
};

export const payPercepts = async (req, res) => {
  const { data } = req.body;
  if (data === undefined) {
    return res.status(400).send({
      code: 400,
      error: { message: "Objeto 'data' necesario" },
    });
  }
  const { identi, paymentCode, paymentComments } = data;
  if (
    !validarIdenti(identi).status ||
    paymentCode === undefined ||
    isNaN(paymentCode) ||
    paymentComments !== undefined
      ? typeof paymentComments !== "string"
      : false
  ) {
    return res.status(400).send({
      code: 400,
      error: { message: "Error con los datos recibidos", reference: data },
    });
  }
  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("identi", sqlHafele.VarChar, identi)
      .input("codpag", sqlHafele.VarChar, paymentCode)
      .input(
        "descrp",
        sqlHafele.VarChar,
        paymentComments === undefined ? "" : paymentComments
      )
      .execute(ecommQuerys.payPercepts);
  } catch (error) {
    return res.status(400).send({
      code: 400,
      error: {
        message:
          "Insertar pago percepciones - " +
          (error.precedingErrors !== undefined &&
          error.precedingErrors.length !== undefined &&
          error.precedingErrors.length > 0 &&
          error.precedingErrors[0].message !== undefined
            ? error.precedingErrors[0].message
            : error.message),
        reference: data,
      },
    });
  }

  return res.status(200).send({
    code: 200,
    response: { message: "Pago ingresado correctamente", reference: data },
  });
};

export const getConfirmData = async (req, res) => {
  const { data } = req.body;
  if (data === undefined) {
    return res.status(400).send({
      code: 400,
      error: { message: "Objeto 'data' necesario" },
    });
  }
  const { identi } = data;
  if (!validarIdenti(identi).status) {
    return res.status(400).send({
      code: 400,
      error: { message: "Error con los datos recibidos", reference: data },
    });
  }
  let jsonOut = {};
  try {
    const pool = await getConnection(),
      { recordset } = await pool
        .request()
        .input("identi", sqlHafele.VarChar, identi)
        .query(ecommQuerys.confirmSaleData);
    if (
      recordset !== undefined &&
      recordset.length !== undefined &&
      recordset.length > 0
    ) {
      jsonOut = recordset[0];
    }
  } catch (error) {
    return res.status(400).send({
      code: 400,
      error: {
        message:
          "Obtener datos para confirmación - " +
          (error.precedingErrors !== undefined &&
          error.precedingErrors.length !== undefined &&
          error.precedingErrors.length > 0 &&
          error.precedingErrors[0].message !== undefined
            ? error.precedingErrors[0].message
            : error.message),
        reference: data,
      },
    });
  }
  return countJsonKeys(jsonOut) > 0
    ? res.status(200).send({
        code: 200,
        response: {
          message: "Información recibida",
          data: jsonOut,
          reference: data,
        },
      })
    : res.status(400).send({
        code: 400,
        error: { message: "No se pudieron obtener datos", reference: data },
      });
};

export const saleConfirm = async (req, res) => {
  const { data } = req.body;
  if (data === undefined) {
    return res.status(400).send({
      code: 400,
      error: { message: "Objeto 'data' necesario" },
    });
  }
  const { identi } = data;
  if (!validarIdenti(identi).status) {
    return res.status(400).send({
      code: 400,
      error: { message: "Error con los datos recibidos", reference: data },
    });
  }
  try {
    const pool = await getConnection(),
      { rowsAffected } = await pool
        .request()
        .input("identi", sqlHafele.VarChar, identi)
        .query(ecommQuerys.saleConfirm);
    if (
      typeof rowsAffected === "object" &&
      rowsAffected.length !== undefined &&
      rowsAffected.length > 0
    ) {
      return res.status(200).send({
        code: 200,
        response: { message: "Venta confirmada", reference: data },
      });
    } else {
      return res.status(400).send({
        code: 400,
        error: { message: "No se pudo confirmar la venta", reference: data },
      });
    }
  } catch (error) {
    return res.status(400).send({
      code: 400,
      error: {
        message:
          "Obtener datos para confirmación - " +
          (error.precedingErrors !== undefined &&
          error.precedingErrors.length !== undefined &&
          error.precedingErrors.length > 0 &&
          error.precedingErrors[0].message !== undefined
            ? error.precedingErrors[0].message
            : error.message),
        reference: data,
      },
    });
  }
};

export const actualStep = async (req, res) => {
  const { data } = req.body;
  if (!validarIdenti(data.identi).status) {
    return res.status(400).send({
      code: 400,
      error: { message: "Error con los datos recibidos", reference: data },
    });
  }

  try {
    const pool = await getConnection(),
      { recordset } = await pool
        .request()
        .input("identi", sqlHafele.VarChar, data.identi)
        .query(ecommQuerys.actualStep);
    return res.status(200).send({ code: 200, response: recordset[0] });
  } catch (error) {
    return res.status(400).send({
      code: 400,
      error: {
        message:
          "Obtener paso actual - " +
          (error.precedingErrors !== undefined &&
          error.precedingErrors.length !== undefined &&
          error.precedingErrors.length > 0 &&
          error.precedingErrors[0].message !== undefined
            ? error.precedingErrors[0].message
            : error.message),
        reference: data,
      },
    });
  }
};

export const getContactData = async (req, res) => {
  const { data } = req.body;
  if (!validarIdenti(data.identi).status) {
    return res.status(400).send({
      code: 400,
      error: { message: "Error con los datos recibidos", reference: data },
    });
  }
  try {
    const pool = await getConnection(),
      { recordset } = await pool
        .request()
        .input("identi", sqlHafele.VarChar, data.identi)
        .query(ecommQuerys.contactData);
    return res.status(200).send({ code: 200, response: recordset[0] });
  } catch (error) {
    return res.status(400).send({
      code: 400,
      error: {
        message:
          "Obtener datos de contacto - " +
          (error.precedingErrors !== undefined &&
          error.precedingErrors.length !== undefined &&
          error.precedingErrors.length > 0 &&
          error.precedingErrors[0].message !== undefined
            ? error.precedingErrors[0].message
            : error.message),
        reference: data,
      },
    });
  }
};

export const addContactData = async (req, res) => {
  const { data } = req.body;
  if (data === undefined) {
    return res.status(400).send({
      code: 400,
      error: { message: "Objeto 'data' necesario" },
    });
  }
  const { identi, mail, phone } = data,
    validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (
    !validarIdenti(identi).status ||
    ((mail === undefined || mail.trim() === "") &&
      (phone === undefined || phone.toString().trim() === "")) ||
    (mail !== undefined ? typeof mail !== "string" : false) ||
    (phone !== undefined ? isNaN(phone) : false) ||
    (mail !== undefined && mail.trim() !== ""
      ? mail.match(validRegex) === null
      : false)
  ) {
    return res.status(400).send({
      code: 400,
      error: { message: "Error con los datos recibidos", reference: data },
    });
  }

  try {
    let query = "UPDATE SAR_FCRMVH SET";
    mail !== undefined && mail.trim() !== ""
      ? (query = `${query} SAR_FCRMVH_DIREML = '${mail}'`)
      : null;
    mail === undefined &&
    mail.trim() === "" &&
    phone === undefined &&
    phone.toString().trim() !== ""
      ? (query = `${query},`)
      : null;
    phone !== undefined && phone.toString().trim() !== ""
      ? (query = `${query} SAR_FCRMVH_TELEFN = '${phone}'`)
      : null;
    query = `${query} WHERE SAR_FCRMVH_IDENTI = '${identi}';`;

    const pool = await getConnection(),
      { rowsAffected } = await pool.request().query(query);

    return rowsAffected !== undefined &&
      rowsAffected.length !== undefined &&
      rowsAffected.length > 0
      ? res.status(200).send({
          code: 200,
          response: {
            message: "Se acutalizó la información del cliente",
            reference: data,
          },
        })
      : res.status(400).send({
          code: 400,
          error: {
            message: "No se pudo actualizar la información del cliente",
            reference: data,
          },
        });
  } catch (error) {
    return res.status(400).send({
      code: 400,
      error: {
        message:
          "Actualizar info de cliente - " +
          (error.precedingErrors !== undefined &&
          error.precedingErrors.length !== undefined &&
          error.precedingErrors.length > 0 &&
          error.precedingErrors[0].message !== undefined
            ? error.precedingErrors[0].message
            : error.message),
        reference: data,
      },
    });
  }
};

export const deleteContactData = async (req, res) => {
  const { data } = req.body;
  if (data === undefined) {
    return res.status(400).send({
      code: 400,
      error: { message: "Objeto 'data' necesario" },
    });
  }
  const { identi, mail, phone } = data;

  if (
    !validarIdenti(identi).status ||
    (mail === undefined && phone === undefined) ||
    (mail !== undefined ? typeof mail !== "boolean" : false) ||
    (phone !== undefined ? typeof phone !== "boolean" : false) ||
    (!mail && !phone)
  ) {
    return res.status(400).send({
      code: 400,
      error: { message: "Error con los datos recibidos", reference: data },
    });
  }
  try {
    let query = "UPDATE SAR_FCRMVH SET";
    mail ? (query = `${query} SAR_FCRMVH_DIREML = NULL`) : null;
    mail && phone ? (query = query + `, `) : null;
    phone ? (query = `${query} SAR_FCRMVH_TELEFN = NULL`) : null;
    query = `${query} WHERE SAR_FCRMVH_IDENTI = '${identi}';`;

    const pool = await getConnection(),
      { rowsAffected } = await pool.request().query(query);
    return rowsAffected !== undefined &&
      rowsAffected.length !== undefined &&
      rowsAffected.length > 0
      ? res.status(200).send({
          code: 200,
          response: { message: "Datos eliminados", reference: data },
        })
      : res.status(400).send({
          code: 400,
          error: {
            message: "No pudieron eliminarse los datos solicitados",
            reference: data,
          },
        });
  } catch (error) {
    return res.status(400).send({
      code: 400,
      error: {
        message:
          "Borrar info de cliente - " +
          (error.precedingErrors !== undefined &&
          error.precedingErrors.length !== undefined &&
          error.precedingErrors.length > 0 &&
          error.precedingErrors[0].message !== undefined
            ? error.precedingErrors[0].message
            : error.message),
        reference: data,
      },
    });
  }
};

export const deleteSwitchOrder = async (req, res) => {
  const { data } = req.body;
  if (data === undefined) {
    return res.status(400).send({
      code: 400,
      error: { message: "Objeto 'data' necesario" },
    });
  }
  const { identi, action } = data;
  if (
    !validarIdenti(identi).status ||
    action === undefined ||
    typeof action !== "string" ||
    (action.trim().toLocaleLowerCase() !== "reset" &&
      action.trim().toLocaleLowerCase() !== "borrar")
  ) {
    return res.status(400).send({
      code: 400,
      error: { message: "Error con los datos recibidos", reference: data },
    });
  }
  let store, message;
  switch (action) {
    case "reset":
      store = ecommQuerys.resetOrder;
      break;
    case "borrar":
      //store = ecommQuerys.deleteOrder;
      break;

    default:
      return res.status(400).send({
        code: 400,
        error: {
          message: "Error en la acción elegida",
          reference: data.action,
        },
      });
  }
  if (store === undefined || typeof store !== "string" || store.trim() === "") {
    return res.status(400).send({
      code: 400,
      error: {
        message: "Error al asignar ejecución",
        reference: data,
      },
    });
  }
  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("IDENTI", sqlHafele.VarChar, identi)
      .execute(store);
    message =
      action === "reset" ? "Reseteo de pedido OK" : "Borrado de pedido OK";
  } catch (error) {
    return res.status(400).send({
      code: 400,
      error: {
        message:
          "Borrado de pedido - " +
          (error.precedingErrors !== undefined &&
          error.precedingErrors.length !== undefined &&
          error.precedingErrors.length > 0 &&
          error.precedingErrors[0].message !== undefined
            ? error.precedingErrors[0].message
            : error.message),
        reference: data,
      },
    });
  }
  return res
    .status(200)
    .send({ code: 200, response: { message, reference: data } });
};

export const addComment = async (req, res) => {
  const { data } = req.body;
  if (data === undefined) {
    return res.status(400).send({
      code: 400,
      error: { message: "Objeto 'data' necesario" },
    });
  }
  const { identi, comment } = data;
  if (
    !validarIdenti(identi).status ||
    comment === undefined ||
    typeof comment !== "string" ||
    comment.trim().toLocaleLowerCase() === ""
  ) {
    return res.status(400).send({
      code: 400,
      error: { message: "Error con los datos recibidos", reference: data },
    });
  }
  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("identi", sqlHafele.VarChar, identi)
      .input("usrint", sqlHafele.VarChar, "ADMIN")
      .input("desint", sqlHafele.VarChar, comment)
      .input("mailfr", sqlHafele.VarChar, null)
      .input("mailto", sqlHafele.VarChar, null)
      .execute(ecommQuerys.addComment);
  } catch (error) {
    return res.status(400).send({
      code: 400,
      error: {
        message:
          "Agregar comentario - " +
          (error.precedingErrors !== undefined &&
          error.precedingErrors.length !== undefined &&
          error.precedingErrors.length > 0 &&
          error.precedingErrors[0].message !== undefined
            ? error.precedingErrors[0].message
            : error.message),
        reference: data,
      },
    });
  }
  return res.status(200).send({
    code: 200,
    response: { message: "Comentario agregado", reference: data },
  });
};

export const getComments = async (req, res) => {
  const { data } = req.body;
  if (data === undefined) {
    return res.status(400).send({
      code: 400,
      error: { message: "Objeto 'data' necesario" },
    });
  }
  const { identi } = data;
  if (!validarIdenti(identi).status) {
    return res.status(400).send({
      code: 400,
      error: { message: "Error con los datos recibidos", reference: data },
    });
  }
  let comments;
  try {
    const pool = await getConnection(),
      { recordset } = await pool
        .request()
        .input("identi", sqlHafele.VarChar, identi)
        .query(ecommQuerys.getComments);
    comments = recordset;
  } catch (error) {
    return res.status(400).send({
      code: 400,
      error: {
        message:
          "Obtener comentarios - " +
          (error.precedingErrors !== undefined &&
          error.precedingErrors.length !== undefined &&
          error.precedingErrors.length > 0 &&
          error.precedingErrors[0].message !== undefined
            ? error.precedingErrors[0].message
            : error.message),
        reference: data,
      },
    });
  }
  return res.status(200).send({
    code: 200,
    response: { message: "OK", data: comments, reference: data },
  });
};
