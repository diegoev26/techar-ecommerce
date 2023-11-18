import { Schema, model } from "mongoose";
import { dateToString, timeToString } from "../functions/main.functions";

const TranslogLogSchema = new Schema(
  {
    interface: { type: String, default: "Translog" },
    centroEmisor: String,
    numeroComprobante: String,
    letra: String,
    codfor: String,
    resultado: String,
    mensaje: String,
    date: { type: String, default: dateToString() },
    time: { type: String, default: timeToString() },
  },
  {
    versionKey: false,
  }
);

const TranslogLog = model("TranslogLog", TranslogLogSchema, "Logs");
export default TranslogLog;
