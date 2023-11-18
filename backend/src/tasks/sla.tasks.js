import { schedule } from "node-cron";
import axios from "axios";
import { setLog } from "../functions/main.functions";

schedule("*/8 * * * *", async () => {
  try {
    await axios({
      method: "post",
      url: "http://harbueds1001:5000/carriers/sla",
    });
  } catch (error) {
    if (error.response !== undefined && error.response.data !== undefined) {
      const data = error.response.data;
      if (data.error !== undefined) {
        await setLog({ status: false, message: data.error.message });
      } else {
        await setLog({
          status: false,
          message: `slaTask - ${data.response.message} - Hay remitos que no pudieron ser marcados`,
        });
      }
    } else {
      await setLog({
        status: false,
        message: `slaTask - Ocurrio un error inesperado - ${error.message}`,
      });
    }
  }
});
