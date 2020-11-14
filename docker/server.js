const fs = require("fs");
const express = require("express");
const app = express();
const https = require("https");

var credentials = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
};

app.use(
  express.static("../dist", {
    setHeaders(res) {
      res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
      res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
      res.setHeader("Cross-Origin-Resource-Policy", "same-site");
    },
  })
);

const port = 2138;
const sport = 2137;
https.createServer(credentials, app).listen(sport);
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
