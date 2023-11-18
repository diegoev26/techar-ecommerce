const nodemailer = require("nodemailer");
import config from "./config";
import { setLog } from "../functions/main.functions";

const transporter = nodemailer.createTransport({
  host: config.mailer.server,
  port: config.mailer.port,
  secure: true,
  auth: {
    user: config.mailer.user,
    pass: config.mailer.pass,
  },
});

transporter
  .verify()
  .then(() => {
    console.log("Ready to send email");
  })
  .catch(async (err) => {
    await setLog({
      status: false,
      message: "Error al conectar con el mail sender - " + err.message,
    });
  });

export default transporter;
