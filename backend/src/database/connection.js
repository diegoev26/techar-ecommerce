import config from "../config/config";
import sqlHafele from "mssql";
import sqlInterfaces from "mssql";
import sqlPAH from "mssql";
import sqlHAR_QV from "mssql";
import { setLog } from "../functions/main.functions";

const settingsHafele = {
  user: config.dbOptions.users.hafele,
  password: config.dbOptions.passwords.hafele,
  server: config.dbOptions.servers.hafele,
  database: config.dbOptions.names.hafele,
  options: {
    trustServerCertificate: true,
  },
};

const settingsInterfaces = {
  user: config.dbOptions.users.interfaces,
  password: config.dbOptions.passwords.interfaces,
  server: config.dbOptions.servers.interfaces,
  database: config.dbOptions.names.interfaces,
  options: {
    trustServerCertificate: true,
  },
};

const settingsPAH = {
  user: config.dbOptions.users.pah,
  password: config.dbOptions.passwords.pah,
  server: config.dbOptions.servers.pah,
  database: config.dbOptions.names.pah,
  options: {
    trustServerCertificate: true,
  },
};

const settingsHAR_QV = {
  user: config.dbOptions.users.har_qv,
  password: config.dbOptions.passwords.har_qv,
  server: config.dbOptions.servers.har_qv,
  database: config.dbOptions.names.har_qv,
  options: {
    trustServerCertificate: true,
  },
};

export async function getConnection(type = "Hafele") {
  let settings;
  let sql;
  switch (type.toString().toLowerCase()) {
    case "hafele":
      settings = settingsHafele;
      sql = sqlHafele;
      break;
    case "interfaces":
      settings = settingsInterfaces;
      sql = sqlInterfaces;
      break;
    case "pah":
      settings = settingsPAH;
      sql = sqlPAH;
      break;
    case "har_qv":
      settings = settingsHAR_QV;
      sql = sqlHAR_QV;
      break;
    default:
      return false;
  }
  try {
    const conn = await new sql.ConnectionPool(settings);
    const pool = await conn.connect();
    return pool;
  } catch (error) {
    await setLog({
      status: false,
      message: `${type}Connection - ${error.message}`,
    });
    return false;
  }
}

export { sqlHafele, sqlInterfaces, sqlPAH, sqlHAR_QV };
