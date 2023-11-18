import config from "../config/config";

if (config.env) {
  require("./cae.tasks");
  require("./exchange.tasks");
  require("./ftp.tasks");
  require("./message.tasks");
  require("./pah.tasks");
  require("./sla.tasks");
} else {
}
