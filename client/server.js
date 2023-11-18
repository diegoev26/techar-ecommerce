const express = require("express");
const path = require("path");
const app = express();
app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.set("port", 3000);
app.listen(app.get("port"), console.log(app.get("port")));
