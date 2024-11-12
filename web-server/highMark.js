const http = require("node:http");

class HighMark {
  constructor() {
    this.server = http.createServer();

    this.server.on("request", (req, res) => {
      res.end("Hello World");
    });
  }

  listen = (port, cb) => {
    this.server.listen(port, () => {
      cb();
    });
  };
}

module.exports = HighMark;
