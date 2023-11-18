import config from "../config/config";
import { setLog } from "../functions/main.functions";

//opciones conexion
const opts = { useNewUrlParser: true, connectTimeoutMS: 20000, family: 4 };
//importo driver
const mongoose = require("mongoose");
//Pruebo conexion
mongoose.set("strictQuery", true);
mongoose.connect(config.dbOptions.uri, opts).then(
  () => {},
  async (err) => {
    await setLog({ status: false, message: err.message });
  }
);
