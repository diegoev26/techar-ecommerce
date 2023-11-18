import { schedule } from "node-cron";
import axios from "axios";
import { dateToString } from "../functions/main.functions";

schedule("8 8 * * *", async () => {
  try {
    const date = new Date();
    date.setDate(date.getDate() - 1);

    const { data } = await axios({
      method: "post",
      url: "http://harbueds1001:5000/sendSql",
      headers: {
        "Content-type": "application/json",
      },
      data: {
        data: [
          {
            db: "har_qv",
            to: [
              "daniel.gomez@hafele.com.ar",
              "valeria.zorelle@hafele.com.ar",
              "walter.lepore@hafele.com.ar",
            ],
            file: "//harbueerp003/SoftlandUtilities/SQL/CONSULTA PARA BI - DIARIA.sql",
            filename: "Parte Diario " + dateToString(date),
            subject: "Envío de parte diario",
            message:
              "Envío realizado de manera automática. Se adjunta documento.",
          },
        ],
      },
    });
    if (data.code !== 200) {
      console.log("bi.tasks", data);
    }
  } catch (error) {
    if (
      error.response !== undefined &&
      error.response.data !== undefined &&
      error.response.data.error !== undefined
    ) {
      console.log("bi.tasks", error.response.data.error);
      return;
    }
    console.log("bi.tasks", error.message);
  }
});
