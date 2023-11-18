import { schedule } from "node-cron";
import {
  getBNAExchange,
  setLog,
  setMsgToSend,
} from "../functions/main.functions";
import { getConnection, mainQuerys, sqlHafele } from "../database";

//upload exchange
schedule("0 16 * * *", async () => {
  const times = 2;
  let cont = 0,
    response = false,
    exchange;
  try {
    do {
      exchange = await getBNAExchange();
      response = exchange.status;
      cont++;
    } while (cont <= times && !response);

    if (cont > times && !response) {
      await setLog({ status: false, message: exchange.message });
      return;
    }
    if (exchange.data === undefined || exchange.data.length === 0) {
      await setLog({ status: false, message: "Tipo de cambio vacío" });
      return;
    }

    cont = 0;
    while (cont < exchange.data.length) {
      if (
        exchange.data[cont].currency === "USD" ||
        exchange.data[cont].currency === "EUR"
      ) {
        const upload = await insertExchange(exchange.data[cont]);
        if (!upload.status) {
          await setLog({ status: upload.status, message: upload.message });
        }
      }
      cont++;
    }
  } catch (error) {
    await setLog({ status: false, message: error.message });
  }
});

//send exchange uploaded
schedule("4 16 * * *", async () => {
  let bodyMessage =
    "<p>La cotización pertenece del <b>Banco Nación Argentina</b> del tipo <b>DIVISA</b>.<br /> <br />";
  const to = `{"mail":["haradministration@hafele.com.ar"]}`,
    subject = "Carga automática de Cotización de Monedas",
    type = "html";
  try {
    const pool = await getConnection();
    const { recordset } = await pool
      .request()
      .query(mainQuerys.getExchangeToSend);
    if (recordset.length === undefined || recordset.length < 1) {
      const body =
          "<p style='color: red;'>La cotización <b>no pudo ser cargada</b>.</p> <p>Por favor, comunicarse con el área de sistemas.<br /> Muchas Gracias<br /><br /> Código de informe: GR00003</p>",
        message = await setMsgToSend({
          to,
          subject,
          type,
          body,
        });
      if (!message.status) {
        await setLog({ status: message.status, message: message.message });
      }
      return;
    }
    for (let i = 0; i < recordset.length; i++) {
      const exchange = recordset[i],
        fecha =
          exchange.GRTVAL_FECCAL.slice(6) +
          "/" +
          exchange.GRTVAL_FECCAL.slice(4, 6) +
          "/" +
          exchange.GRTVAL_FECCAL.slice(0, 4);

      bodyMessage = `${bodyMessage} Moneda: <b>${
        exchange.GRTVAL_CODCOF
      }</b>, Fecha: <b>${fecha}</b>, Coef: <b>Comprador: ${exchange.GRTVAL_VALCOM.toString()}</b> / <b>Vendedor: ${exchange.GRTVAL_VALORI.toString()}</b>. <br />`;
    }
    bodyMessage =
      bodyMessage +
      "<br /><br /> Muchas Gracias<br /><br /> Código de informe: GR00003</p>";
  } catch (error) {
    await setLog({ status: false, message: error.message });
  }
  const message = await setMsgToSend({
    to,
    subject,
    type,
    body: bodyMessage,
  });

  if (!message.status) {
    await setLog({ status: message.status, message: message.message });
  }
});

async function insertExchange({ fecha, currency, comprador, vendedor }) {
  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("CODCOF", sqlHafele.VarChar, currency)
      .input("FECCAL", sqlHafele.VarChar, fecha.toString())
      .input(
        "VALCOM_IN",
        sqlHafele.VarChar,
        comprador.toString().replace(",", ".")
      )
      .input(
        "VALVEN_IN",
        sqlHafele.VarChar,
        vendedor.toString().replace(",", ".")
      )
      .input("USERID", sqlHafele.VarChar, "ADMIN")
      .execute(mainQuerys.uploadExchange);
    return { status: true };
  } catch (error) {
    return { status: false, message: error.message };
  }
}
