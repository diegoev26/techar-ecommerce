const { Client } = require("@sendgrid/client");
const config = require("./config").default;
const sgClient = new Client();

sgClient.setApiKey(config.mailer.pass);

export default sgClient;
