import {
  getConnection,
  warehouseQuerys,
  sqlInterfaces,
  sqlHafele,
} from "../database";

export async function labelList() {
  const labels = [
    {
      labelId: 1,
      description: "Etiqueta Login",
      zplCode: `
^XA
^CI28
^FX Area de Encabezado
^CF0,60
^FO100,40^FDHAFELE ARGENTINA S.A.^FS
^FO15,15^FR^GB775,100,100^FS
^CF0,30
^FO150,125^FDRuta Panamericana 28047 - B1611GFG^FS
^FO125,165^FDDon Torcuato - Buenos Aires - Argentina^FS
^FO115,205^FDTE: +54 11 2206 9200 - info@hafele.com.ar^FS
^FX Area de Cliente
^FO50,235^GB700,3,3^FS
^CF0,45
^FO50,250^FDCliente:^FS
^FO200,250^FD@codigoCliente^FS
^FO50,300^FD@nombreCliente^FS
^CF0,35
^FO50,350^FD@direccionL1^FS
^FO50,390^FD@direccionL2^FS
^FO50,430^FD@direccionL3^FS
^FX Guia
^FO50,470^GB700,3,3^FS
^CF0,65
^FO245,495^FD@numeroGuia^FS
^FO15,485^FR^GB775,70,70^FS
^FX Operador
^CF0,35
^FO240,565^FDOPERADOR LOGISTICO^FS
^CF0,65
^FO30,606^FD@operador^FS
^FO15,597^FR^GB775,70,70^FS
^FX Transportista
^CF0,35
^FO270,675^FDTRANSPORTISTA^FS
^CF0,65
^FO30,717^FD@transportista^FS
^FO15,707^FR^GB775,70,70^FS
^FX Datos Remito
^CF0,60
^FO50,790^FDRemito:^FS
^FO250,790^FD@numeroRemito^FS
^FO50,850^FDFecha:^FS
^FO245,850^FD@fechaRemito^FS
^FX Bultos
^CF0,60
^FO90,925^FDBULTOS:^FS
^CF0,100
^FO360,916^FD@numeroBulto/@cantidadBultos^FS
^FO315,906^FR^GB315,100,100^FS
^FX Código de Barras
^FO50,1015^GB700,3,3^FS
^BY3,3,130
^FO100,1025^BC^FD@codigoBarras^FS
^XZ
  `,
    },
    {
      labelId: 2,
      description: "Etiqueta Reproceso",
      zplCode: null,
    },
  ];
  return labels;
}

export async function getLabel(labelId, options) {
  const labels = await labelList();
  const resultado = labels.find((label) => label.labelId === labelId);
  resultado.status = true;
  if (labelId === 2) {
    if (options === undefined) {
      return {
        status: false,
        message: "Faltan datos obligatorios",
        reference: { labelId, options },
      };
    }
    try {
      const pool = await getConnection();
      const { recordset } = await pool
        .request()
        .input("TIPPRO", sqlHafele.VarChar, options.tippro)
        .input("ARTCOD", sqlHafele.VarChar, options.artcod.replaceAll(".", ""))
        .input("impEAN", sqlHafele.VarChar, options.impEAN ? "S" : "N")
        .input("impQR", sqlHafele.VarChar, options.impQR ? "S" : "N")
        .input("impPACK", sqlHafele.VarChar, options.impPACK ? "S" : "N")
        .query(warehouseQuerys.getReprocessZpl);

      if (recordset[0].zpl === null) {
        resultado.status = false;
        resultado.message = "No se pudo obtener el código zpl";
      }
      resultado.zplCode = recordset[0].zpl;
    } catch (error) {
      resultado.message = error.message;
      resultado.status = false;
    }
  }
  resultado.reference = { labelId, options };
  return resultado;
}

export async function getPrinter(printerId) {
  let printers;
  if (printerId === undefined) {
    return { status: false, message: "Sin referencia de impresora" };
  }
  try {
    const pool = await getConnection("Interfaces");
    const { recordset } = await pool
      .request()
      .query(warehouseQuerys.getPrinterList);
    printers = recordset;
  } catch (error) {
    return { status: false, message: error.message };
  }
  const response = printers.find((print) => print.printerId === printerId);
  if (response === undefined) {
    return {
      status: false,
      message: "No se pudo obtener la impresora",
      reference: { printerId },
    };
  }
  return { status: true, data: response };
}

export async function insertDeliveryNotes({ modfor, codfor, nrofor }) {
  try {
    const pool = await getConnection("Interfaces");
    await pool
      .request()
      .input("modfor", sqlInterfaces.VarChar, modfor)
      .input("codfor", sqlInterfaces.VarChar, codfor)
      .input("nrofor", sqlInterfaces.Int, nrofor)
      .execute(warehouseQuerys.insertDeliveryNotes);
    return {
      status: true,
      message: `Remito ingresado OK`,
      reference: `${modfor}-${codfor}-${nrofor}`,
    };
  } catch (error) {
    return {
      status: false,
      message: error.message || "No se pudo insertar el remito",
    };
  }
}

export async function getDeliveryNotesHeaders({ modfor, codfor, nrofor }) {
  try {
    const pool = await getConnection("Interfaces");
    const { recordset } = await pool
      .request()
      .input("modfor", sqlInterfaces.VarChar, modfor)
      .input("codfor", sqlInterfaces.VarChar, codfor)
      .input("nrofor", sqlInterfaces.Int, nrofor)
      .query(warehouseQuerys.deliveryNotesHeadersToPrint);
    if (recordset.length < 1) {
      return { status: false, message: "No se encontraron remitos" };
    }
    return { status: true, data: recordset[0] };
  } catch (error) {
    return { status: false, message: error.message };
  }
}

export async function getDeliveryNotesItems({
  modfor,
  codfor,
  nrofor,
  labels,
}) {
  let sqlQuery = warehouseQuerys.deliveryNotesItemsByForm;

  if (labels !== undefined && labels.length > 0 && labels) {
    sqlQuery = `${sqlQuery} and packageNumber in (`;
    let cont = 0;
    while (cont < labels.length) {
      if (cont + 1 === labels.length) {
        sqlQuery = `${sqlQuery}${labels[cont]})`;
      } else {
        sqlQuery = `${sqlQuery}${labels[cont]},`;
      }
      cont++;
    }
  }
  try {
    const pool = await getConnection("Interfaces");
    const result = await pool
      .request()
      .input("modfor", sqlInterfaces.VarChar, modfor)
      .input("codfor", sqlInterfaces.VarChar, codfor)
      .input("nrofor", sqlInterfaces.Int, nrofor)
      .query(sqlQuery);

    if (result.recordset < 1) {
      return {
        status: false,
        message: "No se pudo obtener ninguna etiqueta",
        reference: `${modfor}-${codfor}-${nrofor}`,
      };
    }
    return { status: true, data: result.recordset };
  } catch (error) {
    return { status: false, message: error.message };
  }
}

export async function getJsonToPrinter(headers, items, idLabel) {
  try {
    const jsonOut = {
      labelId: idLabel,
      deliveryNotes: [
        {
          modfor: headers.modfor,
          codfor: headers.codfor,
          nrofor: headers.nrofor,
          codigoCliente: headers.codigoCliente,
          nombreCliente: headers.nombreCliente,
          direccionL1: `${headers.calleEntrega} ${headers.numeroCalleEntrega}`,
          direccionL2: `${headers.localidadEntrega} - ${headers.provinciaEntrega}`,
          direccionL3: headers.telefonoCliente,
          numeroGuia:
            "G" + headers.numeroComprobanteCompleto.split("-")[1].toString(),
          operador: headers.operadorLogistico,
          transportista: headers.nombreTransportista,
          fechaRemito: headers.fechaComprobante,
          cantidadBultos: headers.totalBultos,
          numeroRemito: headers.numeroComprobanteCompleto,
        },
      ],
    };
    jsonOut.deliveryNotes[0].bultos = items;
    for (let i = 0; i < jsonOut.deliveryNotes[0].bultos.length; i++) {
      jsonOut.deliveryNotes[0].bultos[i].numeroBulto = items[i].packageNumber;
    }
    return { status: true, data: jsonOut };
  } catch (error) {
    return { status: false, message: error.message };
  }
}

export async function getZplJson(jsonIn) {
  const arrOut = [];
  let cont = 0;
  if (jsonIn === undefined || jsonIn.bultos.length === 0) {
    return {
      status: false,
      message: "Error generando la información para la etiqueta",
      reference: jsonIn.numeroRemito,
    };
  }
  try {
    while (cont < jsonIn.bultos.length) {
      const resultado = Object.assign({}, jsonIn);
      delete resultado.cantidadBultos;
      delete resultado.bultos;
      const newDate = [
        jsonIn.fechaRemito.slice(0, 4),
        jsonIn.fechaRemito.slice(4, 6),
        jsonIn.fechaRemito.slice(6, 8),
      ];
      const deliveryNoteDate = `${newDate[2]}/${newDate[1]}/${newDate[0]}`;

      resultado.numeroBulto = jsonIn.bultos[cont].numeroBulto
        .toString()
        .padStart(2, "0");
      resultado.cantidadBultos = jsonIn.cantidadBultos
        .toString()
        .padStart(2, "0");
      resultado.fechaRemito = deliveryNoteDate;
      resultado.numeroRemito = jsonIn.numeroRemito;
      resultado.codigoBarras = jsonIn.bultos[cont].barcode;
      resultado.pesoKg = jsonIn.bultos[cont].weightKg;
      resultado.volumenM3 = jsonIn.bultos[cont].volumeM3;
      resultado.importeDeclarado = jsonIn.bultos[cont].amount;
      resultado.cantidadProductos = jsonIn.bultos[cont].productsQuantity;
      resultado.largo = jsonIn.bultos[cont].length;
      resultado.ancho = jsonIn.bultos[cont].width;
      resultado.alto = jsonIn.bultos[cont].height;
      arrOut.push(resultado);
      cont++;
    }
    return { status: true, data: arrOut };
  } catch (error) {
    return {
      status: false,
      message: error.message,
      reference: jsonIn.numeroRemito,
    };
  }
}

export async function getZplString(deliveryNote, labelId) {
  const labelSet = await getLabel(labelId);
  let label = labelSet.zplCode;

  if (deliveryNote === undefined || label === undefined) {
    return {
      status: false,
      message: "Error generando etiqueta",
      reference: `${deliveryNote.numeroRemito}-${deliveryNote.numeroBulto}`,
    };
  }
  try {
    if (deliveryNote !== undefined && label !== undefined) {
      label = label.replace("@codigoCliente", deliveryNote.codigoCliente);
      label = label.replace("@nombreCliente", deliveryNote.nombreCliente);
      label = label.replace("@direccionL1", deliveryNote.direccionL1);
      label = label.replace("@direccionL2", deliveryNote.direccionL2);
      label = label.replace("@direccionL3", deliveryNote.direccionL3);
      label = label.replace("@numeroGuia", deliveryNote.numeroGuia);
      label = label.replace("@operador", deliveryNote.operador);
      label = label.replace("@transportista", deliveryNote.transportista);
      label = label.replace("@numeroRemito", deliveryNote.numeroRemito);
      label = label.replace("@fechaRemito", deliveryNote.fechaRemito);
      label = label.replace("@numeroBulto", deliveryNote.numeroBulto);
      label = label.replace("@cantidadBultos", deliveryNote.cantidadBultos);
      label = label.replace("@alto", deliveryNote.alto);
      label = label.replace("@largo", deliveryNote.largo);
      label = label.replace("@ancho", deliveryNote.ancho);
      label = label.replace("@pesoKg", deliveryNote.pesoKg);
      label = label.replace("@volumenM3", deliveryNote.volumenM3);
      label = label.replace("@importeDeclarado", deliveryNote.importeDeclarado);
      label = label.replace(
        "@cantidadProductos",
        deliveryNote.cantidadProductos
      );
      label = label.replace("@codigoBarras", deliveryNote.codigoBarras);

      return {
        status: true,
        data: label,
        reference: `${deliveryNote.numeroRemito}-${deliveryNote.numeroBulto}`,
      };
    }
  } catch (error) {
    return {
      status: false,
      message: error.message,
      reference: `${deliveryNote.numeroRemito}-${deliveryNote.numeroBulto}`,
    };
  }
}

export async function sendPrintToZebra(printerSet, zpl, reference) {
  const net = require("node:net"),
    delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    host = printerSet.printerHost,
    port = printerSet.port,
    socket = new net.Socket();
  let result = {};
  socket.setTimeout(2000);
  socket
    .connect(port, host)
    .on("ready", () => {
      socket.write(zpl, () => {
        socket.destroy();
      });
    })
    .on("timeout", () => socket.end())
    .on("error", (error) => {
      result.error = {
        code: error.code,
        event: error.syscall,
        printerIp: error.address,
      };
      result.status = false;
      socket.destroy();
    })
    .on("end", (e) => {
      console.log("end", e);
    })
    .on("close", (close) => {
      result.status = !close;
      result.message = "Error al imprimir";
      result.reference = reference;
      return;
    });

  await delay(2000);
  return result.status !== undefined
    ? result
    : { status: false, message: "Error al imprimir", reference };
}
