import { schedule } from "node-cron";
import { readdirSync, renameSync, mkdirSync, existsSync } from "fs";
import { datetimeToString, setLog } from "../functions/main.functions";

schedule("* * * * *", async () => {
  let pathOut;
  const jsonPath = {
    COT: "C:/Interefaces/COT/Enviar/",
    CAE: "C:/Interefaces/CAE/Enviar/",
    CAE_EXPO: "C:/Interefaces/CAE_EXPO/Enviar/",
  };
  try {
    Object.entries(jsonPath).forEach(async ([key, value]) => {
      const folder = key.toString().trim(),
        path = value,
        files = getDirectoryFiles(path);

      if (files.length > 0) {
        switch (folder) {
          case "COT":
            pathOut = "/COT-0011/Enviar/";
            break;
          case "CAE":
            pathOut = "/CAE-0008/Enviar/";
            break;
          case "CAE_EXPO":
            pathOut = "/CAE-0009/Enviar/";
            break;
          default:
            pathOut = undefined;
            break;
        }
        const ftp = await synchronize(path, files, pathOut, folder);
        setLog(ftp);
      }
    });
  } catch (error) {
    try {
      setLog({ status: false, message: error.message });
    } catch (error) {
      console.log(error.message);
    }
  }
});

schedule("7 * * * *", async () => {
  let pathOut;
  const jsonPath = {
    TRANSLOG: "C:/transportistas/translog/Enviar/",
    LOGIN: "C:/transportistas/login/Enviar/",
  };
  try {
    Object.entries(jsonPath).forEach(async ([key, value]) => {
      const folder = key.toString().trim(),
        path = value,
        files = getDirectoryFiles(path);

      if (files.length > 0) {
        switch (folder) {
          case "TRANSLOG":
            pathOut = "/Transportistas/Translog/Enviar/";
            break;
          case "LOGIN":
            pathOut = "/Transportistas/Login/Enviar/";
            break;
          default:
            pathOut = undefined;
            break;
        }
        const ftp = await synchronize(path, files, pathOut, folder);
        setLog(ftp);
      }
    });
  } catch (error) {
    try {
      setLog({ status: false, message: error.message });
    } catch (error) {
      console.log(error.message);
    }
  }
});

function getDirectoryFiles(path) {
  const fileList = [];
  readdirSync(path).forEach((file) => {
    fileList.push(file);
  });
  return fileList;
}

async function synchronize(pathIn, files, pathOut, key) {
  const ftp = require("basic-ftp"),
    client = new ftp.Client(),
    arrSucces = [],
    arrErr = [],
    options = {
      host: "harbuecloud001",
      port: 14123,
      user: "cotUser",
      password: "H4f3l3.cot",
    };
  let newPath;

  if (key === "COT" || key === "CAE") {
    newPath = `${pathIn.replace("Enviar", "Enviados")}${datetimeToString(
      new Date()
    )}`;
  } else {
    newPath = pathIn.replace("Enviar", "Enviados");
  }

  try {
    await client.access(options);
    for (let i = 0; i < files.length; i++) {
      const upload = await client.uploadFrom(
        pathIn + files[i],
        pathOut + files[i]
      );
      if (upload.code < 200 || upload.code > 299) {
        arrErr.push(files[i]);
      } else {
        if (!existsSync(newPath)) {
          mkdirSync(newPath);
        }
        const newFilename =
          key === "COT" || key === "CAE"
            ? newPath + "/" + files[i]
            : `${newPath}${files[i].split(".")[0]}_ok.${
                files[i].split(".")[1]
              }`;
        renameSync(pathIn + files[i], newFilename);
        arrSucces.push(files[i]);
      }
    }
    client.close();
  } catch (err) {
    return {
      status: false,
      message: key + " - " + err.message,
    };
  }

  if (arrSucces.length === 0) {
    return {
      status: false,
      message:
        key +
        " - Error en la conexión FTP. Los archivos no pudieron ser sincronizados",
      data: arrErr,
    };
  }

  if (arrErr.length > 0 && arrSucces.length > 0) {
    return {
      status: false,
      message: key + " - Error en la conexión FTP. Sincronización parcial",
      data: { error: arrErr, success: arrSucces },
    };
  }

  if (arrErr.length === 0) {
    return {
      status: true,
      message: key + " - Conexión FTP OK",
      data: arrSucces,
    };
  }
}
