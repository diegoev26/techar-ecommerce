const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
require("./tasks/index");
require("./database/mongoConnection");

import config from "./config/config";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

import routes from "./routes/main.routes";
import carriersRoutes from "./routes/carriers.routes";
import silharRoutes from "./routes/silhar.routes";
import PAHRoutes from "./routes/pah.routes";
import ecommRoutes from "./routes/ecomm.routes";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
config.env ? null : app.use(morgan("tiny"));
app.use(express.static(__dirname + "/public"));
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hafele API",
      version: "1.0.0",
      description: "Documentación interna",
    },
    servers: [
      {
        url: "http://harbueds1001:5000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};
const specs = swaggerJsDoc(swaggerOptions);

app.use(routes);
app.use("/carriers", carriersRoutes);
app.use("/silhar", silharRoutes);
app.use("/pah", PAHRoutes);
app.use("/ecomm", ecommRoutes);
app.use(
  "/docs",
  swaggerUI.serve,
  swaggerUI.setup(specs, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Hafele API",
  })
);

app.set("port", config.port);
app.listen(app.get("port"), console.log(app.get("port")));
