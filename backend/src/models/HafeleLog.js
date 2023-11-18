import { Schema, model } from "mongoose";
import { dateToString, timeToString } from "../functions/main.functions";

const HafeleLogSchema = new Schema(
  {
    interface: { type: String, default: "Hafele" },
    message: { type: String, default: null },
    data: { type: Schema.Types.Mixed, default: null },
    reference: { type: Schema.Types.Mixed, default: null },
    date: { type: String, default: dateToString() },
    time: { type: String, default: timeToString() },
  },
  {
    versionKey: false,
  }
);

const HafeleLog = model("HafeleLog", HafeleLogSchema, "Logs");
export default HafeleLog;
