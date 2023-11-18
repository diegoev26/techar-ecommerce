import config from "../config/config";
import {
  sqlInterfaces,
  getConnection,
  warehouseQuerys,
  sqlHafele,
} from "../database";
import { date112ToString, datetimeToString, saveFile } from "./main.functions";
import { renameSync } from "fs";
import axios from "axios";

export async function translogGetSaadisJson(data) {
  const arrErr = [],
    arrOut = [],
    arrRef = [];

  const promise = await data.map(async (el) => {
    try {
      const pool = await getConnection("interfaces");
      const { recordset } = await pool
        .request()
        .input("modfor", sqlInterfaces.VarChar, el.modfor)
        .input("codfor", sqlInterfaces.VarChar, el.codfor)
        .input("nrofor", sqlInterfaces.Numeric, el.nrofor)
        .input("idTransportista", sqlInterfaces.Int, el.idCarrier)
        .query(warehouseQuerys.deliveryNotesHeadersToTransmit);

      const jsonToArr = {
        modfor: el.modfor,
        codfor: el.codfor,
        nrofor: el.nrofor,
        puntoDeVentaComprobante: recordset[0].puntoDeVentaComprobante
          .toString()
          .substring(0, 4),
        numeroComprobante: recordset[0].numeroComprobante
          .toString()
          .substring(0, 8),
        letraComprobante: recordset[0].letraComprobante
          .toString()
          .substring(0, 1),
        fechaComprobante: date112ToString(recordset[0].fechaComprobante, "-"),
        numeroRemito: recordset[0].nrofor.toString().substring(0, 15),
        bultos: recordset[0].totalBultos,
        kilosNetos: recordset[0].PesoKg,
        kilosAforados: recordset[0].PesoKg,
        metrosCubicos: recordset[0].volM3,
        nombreRemitente: recordset[0].companyName.substring(0, 30),
        localidadRemitente: recordset[0].location.substring(0, 30),
        nombreDestinatario: recordset[0].nombreCliente.substring(0, 30),
        domicilioDestinatario: recordset[0].calleEntrega.substring(0, 30),
        numeroCalleDestinatario: recordset[0].numeroCalleEntrega
          .toString()
          .substring(0, 5),
        pisoDeptoDestinatario: recordset[0].departamentoEntrega
          .toString()
          .substring(0, 5),
        localidadDestinatario: recordset[0].localidadEntrega.substring(0, 20),
        codigoPostalDestinatario: recordset[0].codigoPostalEntrega
          .toString()
          .substring(0, 10),
        valorDeclarado: recordset[0].ImportePesos,
        importeContrareembolso: 0,
        tipoIvaRemitente: recordset[0].taxesConditionCode
          .toString()
          .substring(0, 1),
        cuitRemitente: recordset[0].cuitSender
          .replaceAll("-", "")
          .toString()
          .substring(0, 13),
        numeroClienteDestino: recordset[0].codigoCliente
          .toString()
          .substring(0, 10),
        observacionEnvio: "".substring(0, 30),
        cantidadPallets: recordset[0].Pallets,
        cantidadUnidades: 0,
        fechaPosibleEntrega: date112ToString(
          recordset[0].fechaComprobante,
          "-"
        ),
        observacionEnvio_2: "".substring(0, 33),
        tipoIvasDestino: recordset[0].cndIvaDestino.toString().substring(0, 1),
        cuitDestino: recordset[0].cuitDestinatario.toString().substring(0, 13),
        observacionAdicionalEnvio: "".substring(0, 60),
      };

      arrOut.push(jsonToArr);
      arrRef.push({ modfor: el.modfor, codfor: el.codfor, nrofor: el.nrofor });
    } catch (error) {
      arrErr.push({
        message:
          "Error al obtener encabezados para transmitir - " + error.message,
        reference: `${el.modfor}-${el.codfor}-${el.nrofor}`,
      });
    }
  });
  await Promise.all(promise);

  return { response: { data: arrOut, reference: arrRef }, error: arrErr };
}

//Obtiene el token generando la conexión con translog.
export async function translogGetToken() {
  try {
    const { data } = await axios.post(
      config.translogApi.route + config.translogApi.auth,
      {
        cliente: config.translogApi.client,
        usuario: config.translogApi.user,
        password: config.translogApi.pass,
      }
    );
    return {
      status: true,
      token: data.auth_token,
      refresh_token: data.refresh_token,
    };
  } catch (error) {
    return {
      status: false,
      message: "No se pudo generar el token - " + error.message,
    };
  }
}

//Recibe el json a enviar, genera el token y envía la info
export async function translogNewOrder(data) {
  if (data.length === 0) {
    return { status: false, message: "No hay información a transmitir", data };
  }
  try {
    const { token, error } = await translogGetToken();
    if (token === undefined) {
      return {
        status: false,
        message: error.message,
      };
    }
    const response = await axios({
      method: "post",
      url: config.translogApi.route + config.translogApi.newOrder,
      headers: {
        Authorization: "bearer " + token,
        "Content-type": "application/json",
      },
      data,
    });
    return {
      status: true,
      message: "Orden en Translog generada",
      data: response.data,
    };
  } catch (error) {
    return {
      status: false,
      message: "Error new order Translog - " + error.message,
      data: error.response.data,
    };
  }
}

//Checkea el estado de un remito en translog
export async function translogTracking({ modfor, codfor, nrofor }) {
  if (modfor === undefined || codfor === undefined || nrofor === undefined) {
    return {
      status: false,
      message: "Error en los campos recibidos",
      reference: { modfor, codfor, nrofor },
    };
  }
  const { status, token, message } = await translogGetToken();
  if (!status) {
    return { status, message, reference: { modfor, codfor, nrofor } };
  }
  const centroEmisor = codfor !== undefined ? codfor.split("RX")[1] : false,
    nroComprobante =
      nrofor !== undefined ? nrofor.toString().padStart(8, "0") : false,
    letraComprobante = codfor !== undefined ? codfor.slice(0, 1) : false;
  if (!centroEmisor || !nroComprobante || !letraComprobante) {
    return {
      status: false,
      message: "Error al obtener campos",
      reference: { modfor, codfor, nrofor },
    };
  }
  try {
    const { data } = await axios({
      method: "post",
      url: config.translogApi.route + config.translogApi.checkStatus,
      headers: {
        Authorization: "bearer " + token,
        "Content-type": "application/json",
      },
      data: {
        centroEmisor,
        nroComprobante,
        letraComprobante,
      },
    });
    return {
      status: true,
      data: data.length === 1 ? data[0] : data,
      reference: { modfor, codfor, nrofor },
    };
  } catch (error) {
    return {
      status: false,
      message: error.message,
      reference: { modfor, codfor, nrofor },
    };
  }
}

export async function loginGetJson(data) {
  const arrErr = [],
    arrOut = [];

  const promise = await data.map(async (el) => {
    try {
      const pool = await getConnection("interfaces");
      const { recordset } = await pool
        .request()
        .input("modfor", sqlInterfaces.VarChar, el.modfor)
        .input("codfor", sqlInterfaces.VarChar, el.codfor)
        .input("nrofor", sqlInterfaces.Numeric, el.nrofor)
        .input("idTransportista", sqlInterfaces.Int, el.idCarrier)
        .query(warehouseQuerys.deliveryNotesHeadersToTransmit);

      const jsonToArr = {
        modfor: recordset[0].modfor,
        codfor: recordset[0].codfor,
        nrofor: recordset[0].nrofor,
        nombreCliente: recordset[0].nombreCliente,
        nombreTransportista: recordset[0].nombreTransportista,
        numeroCalleEntrega: recordset[0].numeroCalleEntrega,
        numeroCalleTransportista: recordset[0].numeroCalleTransportista,
        calleEntrega: recordset[0].calleEntrega,
        calleTransportista: recordset[0].calleTransportista,
        codigoPostalEntrega: recordset[0].codigoPostalEntrega,
        codigoPostalTransportista: recordset[0].codigoPostalTransportista,
        localidadEntrega: recordset[0].localidadEntrega,
        localidadTransportista: recordset[0].localidadTransportista,
        codigoDgiProvinciaEntrega: recordset[0].codigoNorma3166ProvinciaEntrega,
        codigoDgiProvinciaTransportista:
          recordset[0].codigoNorma3166ProvinciaTransportista,
        entregaEnTransportista: recordset[0].entregaEnTransportista,
        fechaComprobante: recordset[0].fechaComprobante,
        totalBultos: recordset[0].totalBultos,
        PesoKg: recordset[0].PesoKg,
        volM3: recordset[0].volM3,
        ImportePesos: recordset[0].ImportePesos,
        letraComprobante: recordset[0].letraComprobante,
        puntoDeVentaComprobante: recordset[0].puntoDeVentaComprobante,
      };

      arrOut.push(jsonToArr);
    } catch (error) {
      arrErr.push({
        message:
          "Error al obtener encabezados para transmitir - " + error.message,
        reference: `${el.modfor}-${el.codfor}-${el.nrofor}`,
      });
    }
  });
  await Promise.all(promise);

  return { response: arrOut, error: arrErr };
}

export async function loginConvertJson2Txt(Injson) {
  let formulariosMarcados = [],
    txtOut = "",
    jsonIn,
    textoLetraG = "",
    textoLetraR = "",
    textoLetraB = "";
  const textoLetraz = "Z";
  const terminal = "2926";

  for (var j = 0; j < Injson.length; j++) {
    if (j != 0) {
      txtOut = txtOut + "\r\n";
    }
    jsonIn = Injson[j];
    (textoLetraG = ""), (textoLetraR = ""), (textoLetraB = "");
    const weigth =
      jsonIn.PesoKg === 0 || jsonIn.PesoKg === undefined
        ? (0.01).toString()
        : jsonIn.PesoKg.toString();
    const nombreCliente =
      jsonIn.entregaEnTransportista === "N"
        ? jsonIn.nombreCliente
        : jsonIn.nombreTransportista;
    const numeroEntrega =
      jsonIn.entregaEnTransportista === "N"
        ? jsonIn.numeroCalleEntrega
        : jsonIn.numeroCalleTransportista;
    const direccionEntrega =
      jsonIn.entregaEnTransportista === "N"
        ? jsonIn.calleEntrega
        : jsonIn.calleTransportista;
    const codigoPostalEntrega =
      jsonIn.entregaEnTransportista === "N"
        ? jsonIn.codigoPostalEntrega
        : jsonIn.codigoPostalTransportista;
    const localidadEntrega =
      jsonIn.entregaEnTransportista === "N"
        ? jsonIn.localidadEntrega
        : jsonIn.localidadTransportista;
    const codigoProvinciaEntrega =
      jsonIn.entregaEnTransportista === "N"
        ? jsonIn.codigoDgiProvinciaEntrega
        : jsonIn.codigoDgiProvinciaTransportista;

    textoLetraG =
      "G" +
      "|" +
      terminal +
      "|" +
      jsonIn.nrofor.toString().padStart(8, "0") +
      "|" +
      jsonIn.fechaComprobante +
      "|" +
      nombreCliente +
      "|" +
      "0".padStart(13, "0") +
      "|" +
      numeroEntrega +
      "|" +
      direccionEntrega.substring(0, 30) +
      "|" +
      codigoPostalEntrega.toString() +
      "|" +
      localidadEntrega +
      "|" +
      codigoProvinciaEntrega +
      "|1" +
      "|" +
      jsonIn.totalBultos.toString() +
      "|" +
      weigth +
      "|" +
      jsonIn.volM3.toString() +
      "|N" +
      "|" +
      jsonIn.ImportePesos.toString();
    textoLetraG = textoLetraG + "\r\n";

    textoLetraR =
      "R" +
      "|" +
      terminal +
      "|" +
      jsonIn.nrofor.toString().padStart(8, "0") +
      "|" +
      jsonIn.letraComprobante +
      "-" +
      jsonIn.puntoDeVentaComprobante.toString().padStart(4, "0") +
      "-" +
      jsonIn.nrofor.toString().padStart(8, "0") +
      "|" +
      jsonIn.totalBultos.toString() +
      "|" +
      weigth +
      "|" +
      jsonIn.volM3.toString() +
      "|N" +
      "|" +
      jsonIn.ImportePesos.toString();
    textoLetraR = textoLetraR + "\r\n";

    for (var i = 1; i <= jsonIn.totalBultos; i++) {
      if (i == 1) {
        textoLetraB =
          textoLetraB +
          "B" +
          "|" +
          terminal +
          "|" +
          jsonIn.nrofor.toString().padStart(8, "0") +
          "|" +
          i.toString().padStart(2, "0") +
          "|" +
          weigth +
          "|" +
          jsonIn.volM3.toString() +
          "|N" +
          "|" +
          jsonIn.ImportePesos.toString();
      } else {
        textoLetraB =
          textoLetraB +
          "B" +
          "|" +
          terminal +
          "|" +
          jsonIn.nrofor.toString().padStart(8, "0") +
          "|" +
          i.toString().padStart(2, "0") +
          "|0|0|N|0";
      }
      textoLetraB = textoLetraB + "\r\n";
    }
    txtOut =
      j === Injson.length - 1
        ? txtOut + textoLetraG + textoLetraR + textoLetraB + textoLetraz
        : txtOut + textoLetraG + textoLetraR + textoLetraB;
    formulariosMarcados.push({
      modfor: jsonIn.modfor,
      codfor: jsonIn.codfor,
      nrofor: jsonIn.nrofor,
    });
  }
  return { data: txtOut, reference: formulariosMarcados };
}

//Sincroniza el directorio con el FTP de login
export async function loginSynchronizeFTP(path, files) {
  const ftp = require("basic-ftp"),
    client = new ftp.Client(),
    arrSucces = [],
    arrErr = [],
    options = config.login.ftp;

  try {
    await client.access(options);
    for (let i = 0; i < files.length; i++) {
      const upload = await client.uploadFrom(
        path + files[i],
        "/Pedidos/" + files[i]
      );
      if (upload.code < 200 || upload.code > 299) {
        arrErr.push(files[i]);
      } else {
        const newFilename = `${files[i].split(".")[0]}_ok.${
          files[i].split(".")[1]
        }`;
        renameSync(
          path + files[i],
          path.replace("Enviar", "Enviados") + newFilename
        );
        arrSucces.push(files[i]);
      }
    }
    client.close();
  } catch (err) {
    return {
      status: false,
      message: err.message,
    };
  }

  if (arrSucces.length === 0) {
    return {
      status: false,
      message:
        "Error en la conexión FTP. Los archivos no pudieron ser sincronizados",
      data: arrErr,
    };
  }

  if (arrErr.length > 0 && arrSucces.length > 0) {
    return {
      status: false,
      message: "Error en la conexión FTP. Sincronización parcial",
      data: { error: arrErr, success: arrSucces },
    };
  }

  if (arrErr.length === 0) {
    return { status: true, message: "Conexión FTP OK", data: arrSucces };
  }
}

//Checkea el estado de un remito en login
export async function loginTracking({ modfor, codfor, nrofor }) {
  if (modfor === undefined || codfor === undefined || nrofor === undefined) {
    return {
      status: false,
      message: "Error en los campos recibidos",
      reference: { modfor, codfor, nrofor },
    };
  }
  const Convenio = config.login.api.companyId || false,
    Tipo = "1" || false,
    Referencia =
      codfor !== undefined && nrofor !== undefined
        ? codfor.split("RX")[1] + nrofor.toString().padStart(8, "0")
        : false;
  if (!Convenio || !Tipo || !Referencia) {
    return {
      status: false,
      message: "Error al obtener campos",
      reference: { modfor, codfor, nrofor },
    };
  }
  try {
    const { data } = await axios({
      method: "post",
      url: config.login.api.route + config.login.api.tracking,
      headers: {
        "Content-type": "application/json",
        apiKey: config.login.api.key,
      },
      data: {
        Convenio,
        Tipo,
        Referencia,
      },
    });
    if (data.status.codigo !== 0) {
      return {
        status: false,
        message: data.status.mensaje,
        reference: { modfor, codfor, nrofor },
      };
    }
    return {
      status: true,
      data:
        data.datos.Guias.length === 1 ? data.datos.Guias[0] : data.datos.Guias,
      reference: { modfor, codfor, nrofor },
    };
  } catch (error) {
    return {
      status: false,
      message: error.message,
      reference: { modfor, codfor, nrofor },
    };
  }
}

export async function carrierOrderToFile(fileExt, carrierStr, data) {
  const fileName = `${datetimeToString()}.${fileExt}`;
  const path = `C:\\transportistas\\${carrierStr}\\Enviar\\`;
  const dataToFile = typeof data !== "string" ? JSON.stringify(data) : data;
  return await saveFile(path, dataToFile, fileName);
}

export async function setTransmitted(data) {
  const arrOut = [],
    arrErr = [];
  if (data.length === 0 || data === undefined || !data) {
    return {
      status: false,
      message: "No se definieron remitos a marcar como transmitidos",
      reference: data,
    };
  }
  const promise = await data.map(async (el) => {
    try {
      const pool = await getConnection("interfaces");
      const { rowsAffected } = await pool
        .request()
        .input("modfor", sqlInterfaces.VarChar, el.modfor)
        .input("codfor", sqlInterfaces.VarChar, el.codfor)
        .input("nrofor", sqlInterfaces.Int, el.nrofor)
        .execute(warehouseQuerys.deliveryNotesTransmitted);
      rowsAffected === 0
        ? arrErr.push({
            message: "Remito no pudo ser marcado",
            reference: `${el.modfor}-${el.codfor}-${el.nrofor}`,
          })
        : arrOut.push({
            message: "Remito marcado OK",
            reference: `${el.modfor}-${el.codfor}-${el.nrofor}`,
          });
    } catch (error) {
      console.log(error.message);
      arrErr.push({
        message: error.message,
        reference: `${el.modfor}-${el.codfor}-${el.nrofor}`,
      });
    }
  });
  await Promise.all(promise);

  if (arrOut.length === 0) {
    return {
      status: false,
      message: "No se pudieron marcar los remitos como transmitidos",
      data: arrErr,
    };
  }
  return {
    status: true,
    message:
      arrErr.length > 0
        ? "Remitos marcados de manera parcial"
        : "Remitos marcados OK",
    data: arrOut,
    error: arrErr,
  };
}

export function handleDateStr(date) {
  let dateOut = date.replaceAll("/", "");
  return dateOut.indexOf("-") > 0
    ? dateOut.replaceAll("-", "")
    : dateOut.substring(4) + dateOut.substring(2, 4) + dateOut.substring(0, 2);
}

export async function cancelDeliveryNote({
  modforRX,
  codforRX,
  nroforRX,
  modforHR,
  codforHR,
  nroforHR,
}) {
  if (
    modforRX === undefined ||
    codforRX === undefined ||
    nroforRX === undefined ||
    modforHR === undefined ||
    codforHR === undefined ||
    nroforHR === undefined
  ) {
    return {
      status: false,
      message: "Faltan datos necesarios para anular el remito",
    };
  }

  try {
    const pool = await getConnection();
    const { rowsAffected } = await pool
      .request()
      .input("modforRX", sqlHafele.VarChar, modforRX)
      .input("codforRX", sqlHafele.VarChar, codforRX)
      .input(
        "nroforRX",
        sqlHafele.Int,
        typeof nroforRX !== "number" ? parseInt(nroforRX) : nroforRX
      )
      .input("modforHR", sqlHafele.VarChar, modforHR)
      .input("codforHR", sqlHafele.VarChar, codforHR)
      .input(
        "nroforHR",
        sqlHafele.Int,
        typeof nroforHR !== "number" ? parseInt(nroforHR) : nroforHR
      )
      .query(warehouseQuerys.cancelDeliveryNote);
    const message =
      rowsAffected[1] === 0
        ? "No se encontro remito para anular"
        : "Remito anulado";
    return { status: true, message };
  } catch (error) {
    return { status: false, message: error.message };
  }
}

export async function setDeliveryNoteRender({
  modforRX,
  codforRX,
  nroforRX,
  date,
}) {
  if (
    modforRX === undefined ||
    codforRX === undefined ||
    nroforRX === undefined ||
    date === undefined
  ) {
    return {
      status: false,
      message: "Faltan datos necesarios para anular el remito",
    };
  }

  try {
    const pool = await getConnection();
    const { recordset } = await pool
      .request()
      .input("modforRX", sqlHafele.VarChar, modforRX)
      .input("codforRX", sqlHafele.VarChar, codforRX)
      .input(
        "nroforRX",
        sqlHafele.Int,
        typeof nroforRX !== "number" ? parseInt(nroforRX) : nroforRX
      )
      .input("date", sqlHafele.VarChar, date)
      .execute(warehouseQuerys.renderDeliveryNote);

    const message =
        recordset !== undefined ? recordset[0].message : "Remito rendido",
      status = recordset !== undefined ? false : true;

    return { status, message };
  } catch (error) {
    return { status: false, message: error.message };
  }
}

export async function transferDeliveryNote({
  modforRX,
  codforRX,
  nroforRX,
  modforHR,
  codforHR,
  nroforHR,
}) {
  if (
    modforRX === undefined ||
    codforRX === undefined ||
    nroforRX === undefined ||
    modforHR === undefined ||
    codforHR === undefined ||
    nroforHR === undefined
  ) {
    return {
      status: false,
      message: "Faltan datos necesarios para anular el remito",
    };
  }

  try {
    const pool = await getConnection();
    const { recordset } = await pool
      .request()
      .input("modforRX", sqlHafele.VarChar, modforRX)
      .input("codforRX", sqlHafele.VarChar, codforRX)
      .input(
        "nroforRX",
        sqlHafele.Int,
        typeof nroforRX !== "number" ? parseInt(nroforRX) : nroforRX
      )
      .input("modforHR", sqlHafele.VarChar, modforHR)
      .input("codforHR", sqlHafele.VarChar, codforHR)
      .input(
        "nroforHR",
        sqlHafele.Int,
        typeof nroforHR !== "number" ? parseInt(nroforHR) : nroforHR
      )
      .execute(warehouseQuerys.transferDeliveryNote);

    const message =
        recordset !== undefined ? recordset[0].message : "Remito transferido",
      status = recordset !== undefined ? false : true;

    return { status, message };
  } catch (error) {
    return { status: false, message: error.message };
  }
}
