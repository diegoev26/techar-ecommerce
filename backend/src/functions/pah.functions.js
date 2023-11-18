import fetch from "node-fetch";
import { getConnection, pahQuerys } from "../database";
import config from "../config/config";

export async function getData({ id, table }) {
  let query,
    url,
    key = "codigo",
    filter = "";
  if (table === undefined || !table || typeof table !== "string") {
    return {
      status: false,
      message: `getData - Error en los datos recibidos`,
      reference: { id, table },
    };
  }
  switch (table.toLowerCase().trim()) {
    case "clientes":
      query = pahQuerys.getAllClients;
      url = "url_clientes";
      break;
    case "stock":
      query = pahQuerys.getAllStocks;
      key = "codigoProducto";
      url = "url_stocks";
      break;
    case "familia":
      query = pahQuerys.getAllFamilies;
      url = "url_familias";
      break;
    case "familiacombobonificacion":
      query = pahQuerys.getAllCombos;
      key = "codigoCombo";
      url = "url_combos";
      break;
    case "bonificaciongrupo":
      query = pahQuerys.getAllDiscountGroup;
      key = "codigoBG";
      url = "url_bonificacionGrupo";
      break;
    case "productos":
      query = pahQuerys.getAllProducts;
      url = "url_productos";
      break;
    case "listasdeprecios":
      query = pahQuerys.getAllPriceLists;
      key = "codigoLista";
      url = "url_listas";
      break;
    case "bonificacionesclientes": //SIN ACTUALIZAR
      query = pahQuerys.getAllDiscountCustomer;
      url = "url_bonificacionClientes";
      break;
    case "precio":
      query = pahQuerys.getAllPrices;
      key = "producto";
      url = "url_precios";
      break;
    case "ultimascompras":
      query = pahQuerys.getAllLastPurchases;
      url = "url_ultimasCompras";
      break;
    case "vendedores":
      query = pahQuerys.getAllSellers;
      key = "codigoVendedor";
      url = "url_vendedores";
      break;
    case "vendedoresclientes":
      query = pahQuerys.getAllSellersCustomers;
      url = "url_vendedoresclientes";
      break;
    case "lugarentrega":
      query = pahQuerys.getAllDeliveryPoints;
      key = "cliente";
      url = "url_lugares";
      break;
    case "condiciondepago":
      query = pahQuerys.getAllPaymentConditions;
      url = "url_condicion_pago";
      break;
    case "transportistas":
      query = pahQuerys.getAllTransporters;
      url = "url_transportistas";
      break;
    case "zona":
      query = pahQuerys.getAllZones;
      url = "url_zonas";
      break;
    case "pedidos":
      query = pahQuerys.getStatusOrders;
      filter = "idCodigoPedido = 'NW' and ";
      key = "idPedido";
      url = "url_actualizarpedidos";
      break;
    case "items":
      query = pahQuerys.getStatusItems;
      filter = "idCodigoPedido = 'NW' and ";
      key = "idPedido";
      url = "url_items";
      break;
    case "pendientesentrega":
      query = pahQuerys.getPendingToDelivery;
      url = "url_itemsPendientes";
      break;
    default:
      return {
        status: false,
        message: `getData - Tabla inválida`,
        reference: { id, table },
      };
  }
  if (
    table.toLowerCase() !== "pendientesentrega" &&
    table.toLowerCase() !== "vendedoresclientes"
  ) {
    if (id !== undefined && id.length !== 0 && id.trim() !== "") {
      query = `${query} where ${filter}isnull(${key},'')='${id}' `;
    } else {
      if (
        table.toLowerCase().trim() !== "items" &&
        table.toLowerCase().trim() !== "pedidos"
      ) {
        query = `${query} where novedad=1 `;
      } else {
        query = `${query} where novedad='S' `;
      }
    }
  }
  try {
    const pool = await getConnection("PAH");
    const { recordset } = await pool.request().query(query);
    return { status: true, data: recordset, url };
  } catch (error) {
    return { status: false, message: error.message };
  }
}

export async function uploadData(dbPah, urlTable, data) {
  try {
    const keyResponse = config.urlPAH[`${urlTable}`].keyUpdate;
    const url =
      config.urlPAH[`${dbPah}`].link + config.urlPAH[`${urlTable}`].link;
    const configFetch = {
      method: "POST",
      headers: {},
      body: JSON.stringify({ [keyResponse]: data }),
    };
    const updateOnCloud = await fetch(url, configFetch);
    const response = await updateOnCloud.json();
    response.group !== undefined ? delete response.group : null;
    response.code !== undefined ? delete response.code : null;
    const arrErr = [];
    if (response.name !== undefined && response.name === "PHP Fatal Error") {
      for (let i = 0; i < data.length; i++) {
        const el = data[i];
        switch (urlTable) {
          case "url_actualizarpedidos":
          case "url_items":
            //itemsToMark[h][`${pk1}`]
            break;
          case "url_precios":
            arrErr.push({ reference: [el.producto, el.lista] });
            break;
          default:
            //itemsToMark[h].reference
            break;
        }
      }
      return {
        status: false,
        reference: response.name,
        message: response.message,
        error: arrErr,
      };
    }
    if (response.status !== undefined && response.status === "ERROR") {
      for (let i = 0; i < response.data.length; i++) {
        const err = response.data[i];
        const reference = {};
        err[config.urlPAH[`${urlTable}`].pk1Table] !== undefined
          ? (reference[config.urlPAH[`${urlTable}`].pk1Table] =
              err[config.urlPAH[`${urlTable}`].pk1Table])
          : null;
        err[config.urlPAH[`${urlTable}`].pk2Table] !== undefined
          ? (reference[config.urlPAH[`${urlTable}`].pk2Table] =
              err[config.urlPAH[`${urlTable}`].pk2Table])
          : null;
        err.errors[0][config.urlPAH[`${urlTable}`].pk1Table] !== undefined
          ? (reference[config.urlPAH[`${urlTable}`].pk1Table] =
              err.errors[0][config.urlPAH[`${urlTable}`].pk1Table])
          : null;
        err.errors[0][config.urlPAH[`${urlTable}`].pk2Table] !== undefined
          ? (reference[config.urlPAH[`${urlTable}`].pk2Table] =
              err.errors[0][config.urlPAH[`${urlTable}`].pk2Table])
          : null;
        arrErr.push({
          message: err.error !== undefined ? err.error : err.errors[0].error,
          reference,
        });
      }
      if (response.data.length !== data.length || response.data.length !== 0) {
        return { status: true, error: arrErr };
      }
      if (response.data.length === data.length) {
        return { status: false, error: arrErr };
      }
    }
    return { status: true, message: response, reference: data };
  } catch (error) {
    return { status: false, message: error.message };
  }
}

export async function markAsSeen(urlTable, itemsToMark) {
  const tableName = config.urlPAH[`${urlTable}`].tableName;
  const pk1 = config.urlPAH[`${urlTable}`].pk1Table;
  const pk2 =
    config.urlPAH[`${urlTable}`].pk2Table === undefined
      ? null
      : config.urlPAH[`${urlTable}`].pk2Table;

  let sql,
    sqlWhere = "",
    notValues = "",
    sqlWhereline = "";
  if (itemsToMark !== undefined && itemsToMark.length !== 0) {
    if (
      urlTable === "url_actualizarpedidos" ||
      urlTable === "url_items" ||
      urlTable === "url_lugares"
    ) {
      sqlWhere = "WHERE";
      for (var h = 0; h < itemsToMark.length; h++) {
        if (h !== 0) {
          sqlWhere = sqlWhere + " OR ";
        }
        if (pk2 === null) {
          sqlWhereline =
            `(${pk1} = ` + itemsToMark[h][`${pk1}`].toString() + ")";
        } else {
          sqlWhereline =
            "(" +
            `${pk1} = ` +
            itemsToMark[h][`${pk1}`].toString() +
            ` and ${pk2} = ` +
            itemsToMark[h][`${pk2}`].toString() +
            ")";
        }
        sqlWhere = sqlWhere + sqlWhereline;
      }
    } else if (urlTable === "url_precios") {
      for (var h = 0; h < itemsToMark.length; h++) {
        if (h !== 0) {
          notValues = notValues + ",";
        }
        notValues = notValues + `'${itemsToMark[h].reference[0]}'`;
      }
      sqlWhere = `WHERE ${pk2} not in (${notValues})`;
    } else {
      for (var h = 0; h < itemsToMark.length; h++) {
        if (h !== 0) {
          notValues = notValues + ",";
        }
        notValues = notValues + `'${itemsToMark[h].reference}'`;
      }
      sqlWhere = `WHERE ${pk1} not in (${notValues})`;
    }
  }
  const value =
    urlTable === "url_actualizarpedidos" || urlTable === "url_items"
      ? "'N'"
      : 0;
  sql = `update ${tableName} set novedad = ${value} ${sqlWhere} `;
  try {
    const pool = await getConnection("PAH");
    const { recordset } = await pool.request().query(sql);
    return { status: true, data: recordset };
  } catch (error) {
    return { status: false, message: error.message };
  }
}

async function getLastIdOrdersfromPAHDb() {
  try {
    const pool = await getConnection("PAH");
    const { recordset } = await pool.request().query(pahQuerys.getLastIdOrders);
    return { status: true, data: recordset[0] };
  } catch (error) {
    return { status: false, message: error.message };
  }
}

export async function getPendingOrderfromCloud(dbPah, urlTable) {
  try {
    const lastId = await getLastIdOrdersfromPAHDb();
    const url =
      config.urlPAH[`${dbPah}`].link +
      config.urlPAH[`${urlTable}`].link +
      "/" +
      lastId.data.lastId.toString();
    const configFetch = {
      method: "GET",
      headers: { "Content-type": "application/json" },
    };
    const updateOnCloud = await fetch(url, configFetch);
    const response = await updateOnCloud.json();
    return {
      status: updateOnCloud.ok,
      message: response,
      lastId: lastId.data.lastId,
    };
  } catch (error) {
    return { status: false, message: error.message };
  }
}

async function setOrderPendingToReceive(dbPah, urlTable, lastID) {
  try {
    const url =
      config.urlPAH[`${dbPah}`].link +
      config.urlPAH[`${urlTable}`].link +
      "/" +
      lastID.toString();
    const configFetch = {
      method: "GET",
      headers: {},
    };
    const updateOnCloud = await fetch(url, configFetch);
    const response = await updateOnCloud.json();
    return { status: updateOnCloud.ok, message: response };
  } catch (error) {
    return { status: false, message: error.message };
  }
}

async function InsertOrderOnPah(orders) {
  let ssqlhe = "",
    ssqlhvalues = "";
  const ordernumber = orders.idPedido;
  let OrderHeader = orders,
    items = orders.items;
  let counter = 0;

  for (const [key, value] of Object.entries(OrderHeader)) {
    if (`${key}` !== "items") {
      if (counter !== 0) {
        ssqlhe = ssqlhe + ",";
        ssqlhvalues = ssqlhvalues + ",";
      }
      ssqlhe = ssqlhe + `${key}`;
      if (
        `${key}` === "idPedido" ||
        `${key}` === "descuentoGlobal" ||
        `${value}` === "null"
      ) {
        ssqlhvalues = ssqlhvalues + `${value}`;
      } else {
        ssqlhvalues = ssqlhvalues + `'${value}'`;
      }
    }
    counter++;
  }
  let ssqlHeader = `insert into pedidos(idcodigoPedido,${ssqlhe}) select 'NW',${ssqlhvalues} `;
  let ssqlItems = "";
  let ssqlitmvalues = "";
  let ssqlitm = "";

  let nroitm = 1;
  /* Inserto ahora los  items*/
  counter = 0;
  for (var h = 0; h < items.length; h++) {
    ssqlitmvalues = "";
    ssqlitm = "";
    for (const [key, value] of Object.entries(items[h])) {
      ssqlitm = ssqlitm + `,${key}`;
      if (
        `${key}` === "idItem" ||
        `${key}` === "cantidadPedida" ||
        `${key}` === "precio" ||
        `${key}` === "bonificacion1" ||
        `${key}` === "bonificacion2" ||
        `${key}` === "cantidadEnviada" ||
        `${value}` === "null"
      ) {
        ssqlitmvalues = ssqlitmvalues + `,${value}`;
      } else {
        ssqlitmvalues = ssqlitmvalues + `,'${value}'`;
      }
      counter++;
    }
    ssqlItems =
      ssqlItems +
      `insert into items(idcodigoPedido, idpedido ,iditm ${ssqlitm}) select 'NW', ${ordernumber},${nroitm} ${ssqlitmvalues}  `;
    nroitm++;
  }
  let sqlOut = `declare @ResultadoTXT varchar(max), @resultado int
  BEGIN
    BEGIN TRANSACTION
        BEGIN TRY
        ${ssqlHeader}

        ${ssqlItems}
  
        SELECT @resultado = 1,@ResultadoTXT='Ok'
        END TRY
  
        BEGIN CATCH
        SELECT @resultado = 0, @ResultadoTXT='Error para  el registro' + ERROR_MESSAGE()
        END CATCH
  
    IF @resultado=1
    BEGIN
    COMMIT TRANSACTION
    SELECT @resultado as status, @ResultadoTXT as message
    END
    ELSE
    BEGIN
    ROLLBACK TRANSACTION
    SELECT @resultado as status, @ResultadoTXT as message
  
    END
  
  END`;
  try {
    const pool = await getConnection("PAH");
    const { recordset } = await pool.request().query(sqlOut);
    return recordset[0];
  } catch (error) {
    const pathSave = "LogErrorsOrders";
    const nameFile =
      "FC-NW-" + ordernumber.toString() + "_" + datetimeToString() + ".TXT";
    const pathFile = config.pahPath[`${pathSave}`];
    const filesaved = await saveFile(pathFile, sqlOut, nameFile);
    console.log(filesaved);
  }
}

export async function InsertOrdersOnPah(orders, lastId, url) {
  let ok = [],
    errores = [];
  let order, items;
  for (var i = 0; i < orders.length; i++) {
    order = orders[i];
    items = orders[i].items;
    if (items === 0) {
      return {
        status: false,
        message: `Pedido  NW ${key} sin items, no pudo ser ingresado`,
      };
    } else {
      const insertOrder = await InsertOrderOnPah(order);
      if (insertOrder.status) {
        ok.push({
          message: insertOrder.message,
          modfor: "FC",
          codfor: "NW",
          nrofor: order.idPedido,
        });
      } else {
        errores.push({
          message: insertOrder.message,
          modfor: "FC",
          codfor: "NW",
          nrofor: order.idPedido,
        });
      }
    }
  }
  /*aca setear los pedidos bajados*/
  const setOrder = await setOrderPendingToReceive(
    url,
    "url_enviadotorecibido",
    lastId
  );
  return setOrder.status
    ? { status: true, response: ok, error: errores, reference: { lastId } }
    : { status: false, message: setOrder.message };
}
