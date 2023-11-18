import sgClient from "../config/sendgrid";
import { sendMail, setLog } from "../functions/main.functions";
import { schedule } from "node-cron";
import axios from "axios";
import config from "../config/config";

//Enviar mensajes
schedule("2,7,12,17,22,27,32,37,42,47,52,57 * * * *", async () => {
  try {
    const { data } = await axios({
      method: "post",
      url: "http://harbueds1001:5000/sendPendingMessage",
      headers: {
        "Content-type": "application/json",
      },
    });
    if (data.code === 207) {
      for (let i = 0; i < data.error.length; i++) {
        const message = `${data.error[i].error[0].message} - id msg ${data.error[i].error[0].reference}`;
        setLog({ status: false, message: ("sendPendingMessage -", message) });
      }
    }
  } catch (error) {
    if (
      error.response !== undefined &&
      error.response.data !== undefined &&
      error.response.data.error !== undefined
    ) {
      for (let i = 0; i < error.response.data.error.length; i++) {
        const message = `${error.response.data.error[i].error[0].message} - id msg ${error.response.data.error[i].error[0].reference}`;
        setLog({ status: false, message: ("sendPendingMessage -", message) });
      }
    } else {
      setLog({
        status: false,
        message: ("sendPendingMessage -", error.message),
      });
    }
  }
});

//Obtener respuesta de mails
schedule("29 16 * * *", async () => {
  const jsonOut = {},
    now = new Date(),
    date = new Date(
      `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate() - 2}`
    ),
    unixTs = new Date(date.getTime());
  try {
    const headers = {
        Accept: "application/json",
      },
      queryParams = {
        start_time: unixTs / 1000,
      };

    let request = {
      url: `/v3/suppression/bounces`,
      method: "GET",
      headers: headers,
      qs: queryParams,
    };
    const bounces = await sgClient.request(request);
    jsonOut.bounces = bounces[1];

    request = {
      url: `/v3/suppression/blocks`,
      method: "GET",
      qs: queryParams,
    };
    const blocks = await sgClient.request(request);
    jsonOut.blocks = blocks[1];

    request = {
      url: `/v3/suppression/spam_reports`,
      method: "GET",
      qs: queryParams,
    };
    const spamReports = await sgClient.request(request);
    jsonOut.spamReports = spamReports[1];
  } catch (error) {
    jsonOut.error = error.message;
  }
  let message = "";
  for (const key in jsonOut) {
    if (Object.hasOwnProperty.call(jsonOut, key)) {
      const arr = jsonOut[key];
      if (arr.length > 0) {
        message =
          message +
          "****************" +
          key.toUpperCase() +
          "****************" +
          "\n\n";
        for (let i = 0; i < arr.length; i++) {
          const mail = arr[i];
          message = message + `Mail: ${mail.email}\n${mail.reason}\n\n`;
        }
        message =
          message +
          "****************" +
          key.toUpperCase() +
          "****************" +
          "\n\n\n";
      }
    }
  }
  if (message.trim() !== "") {
    const mail = config.env
        ? ["marialaura.muccillo@hafele.com.ar", "diego.vercelli@hafele.com.ar"]
        : ["diego.vercelli@hafele.com.ar"],
      options = {
        header: {
          msgTo: { mail },
          msgSubject: "Reporte de envío de mails fallidos",
        },
        body: {
          msgText: message,
        },
      };
    await sendMail(options);
  }
});
