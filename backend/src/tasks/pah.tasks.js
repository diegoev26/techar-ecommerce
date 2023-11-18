import { schedule } from "node-cron";
import { setLog } from "../functions/main.functions";
import axios from "axios";

schedule("*/5 * * * *", async () => {
  try {
    const { data } = await axios({
      method: "post",
      url: "http://harbueds1001:5000/pah/retriveOrders",
      headers: {
        "Content-type": "application/json",
      },
    });
    //await analizeResponse(data);
  } catch (error) {
    await analizeResponse(error.response.data);
    //await setLog({ status: false, message: error.message });
  }
});

schedule("1,6,11,16,21,26,31,36,41,46,51,56 * * * *", async () => {
  const dataToSend = [
    "listasdeprecios",
    "vendedores",
    "condiciondepago",
    "familia",
    "familiacombobonificacion",
    "bonificaciongrupo",
    "zona",
    "transportistas",
    "productos",
    "precio",
    "stock",
    "clientes",
    "lugarentrega",
    "vendedoresclientes",
    "pedidos",
    "items",
  ];
  try {
    const { data } = await axios({
      method: "post",
      url: "http://harbueds1001:5000/pah/updateOnCloud",
      headers: {
        "Content-type": "application/json",
      },
      data: { data: dataToSend },
    });
    //await analizeResponse(data);
  } catch (error) {
    //await analizeResponse(error.response.data);
    await setLog({ status: false, message: error.message });
  }
});

schedule("0 23 * * *", async () => {
  const dataToSend = ["ultimascompras", "pendientesentrega"];
  try {
    const { data } = await axios({
      method: "post",
      url: "http://harbueds1001:5000/pah/updateOnCloud",
      headers: {
        "Content-type": "application/json",
      },
      data: { data: dataToSend },
    });
    //await analizeResponse(data);
  } catch (error) {
    //await analizeResponse(error.response.data);
    await setLog({ status: false, message: error.message });
  }
});
/*
async function analizeResponse(response) {
  if (response.code !== 200 && response.code !== 201) {
    console.log(response.error);
  }
}
*/
