const express = require("express");
const app = express();

app.get("/", (req, resp) => {
  resp.send({ msg: "hello world" });
});

app.listen(80, () => {
  console.log("running on port 80");
});
