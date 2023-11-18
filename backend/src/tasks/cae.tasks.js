import { schedule } from "node-cron";
import { getConnection, mainQuerys, sqlHafele } from "../database";
import { setLog } from "../functions/main.functions";
import config from "../config/config";
import axios from "axios";

schedule("*/5 * * * *", async () => {
  try {
    const response = await getData();
    if (typeof response === "string" || response === undefined) {
      setLog({ status: false, message: `Upload CAE - ${response}` });
      return;
    }
    if (response.length < 1) {
      return;
    }
    const { data } = await axios({
      method: "post",
      url: config.urlApiInterface + "/uploadCae",
      headers: {
        "Content-type": "application/json",
      },
      data: response,
    });

    let cont = 0;
    const arrResp = [];
    while (data.response.data.length > cont) {
      arrResp.push(
        await updateCae(
          data.response.data[cont].modfor,
          data.response.data[cont].codfor,
          data.response.data[cont].nrofor,
          data.response.data[cont].nrocae,
          data.response.data[cont].vtocae
        )
      );
      cont++;
    }
  } catch (error) {
    if (
      error.response !== undefined &&
      error.response.data !== undefined &&
      error.response.data.error !== undefined
    ) {
      setLog({
        status: false,
        message: `Upload CAE - ${error.response.data.error.message}`,
      });
      return;
    }
    setLog({ status: false, message: `Upload CAE - ${error.message}` });
  }
});

async function getData() {
  try {
    const pool = await getConnection();
    const { recordset } = await pool.request().query(mainQuerys.getMissingCae);
    return recordset;
  } catch (error) {
    return error.message;
  }
}

async function updateCae(modfor, codfor, nrofor, nrocae, vtocae) {
  try {
    const pool = await getConnection();
    const response = await pool
      .request()
      .input("modfor", sqlHafele.VarChar, modfor)
      .input("codfor", sqlHafele.VarChar, codfor)
      .input("nrofor", sqlHafele.Int, nrofor)
      .input("nrocae", sqlHafele.VarChar, nrocae)
      .input("vtocae", sqlHafele.VarChar, vtocae)
      .query(mainQuerys.updateCae);
    return response;
  } catch (error) {
    return error.message;
  }
}
