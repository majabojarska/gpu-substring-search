const express = require("express");
const app = express();
const port = 2137;

app.use(
  express.static("../dist", {
    setHeaders(res) {
      res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
      res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
      res.setHeader("Cross-Origin-Resource-Policy", "same-site");
    },
  })
);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
