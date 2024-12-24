const http = require("node:http");
const fs = require("node:fs/promises");

class HighMark {
  constructor() {
    this.server = http.createServer();
    this.routes = {};
    this.middleware = [];

    this.server.on("request", (req, res) => {
      // send a file back to the client
      res.sendFile = async (path, mime) => {
        const fileHandle = await fs.open(path, "r");
        const fileStream = fileHandle.createReadStream();

        res.setHeader("Content-Type", mime);

        fileStream.pipe(res);
      };
      // set the status code of the response
      res.status = (code) => {
        res.statusCode = code;
        return res;
      };
      res.json = (data) => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(data));
      };

      // if routes object doesn't have a route for this request, send back 404
      const routePath = req.method.toLowerCase() + req.url;
      const executeMiddlewares = (index) => {
        if (index < this.middleware.length) {
          // Call the current middleware with the `next` function
          this.middleware[index](req, res, () => executeMiddlewares(index + 1));
        } else {
          // All middlewares have executed, now handle the route
          if (!this.routes[routePath]) {
            return res.status(404).json({ error: "Route not found" });
          }
          this.routes[routePath](req, res);
        }
      };

      // Start middleware execution
      executeMiddlewares(0);
    });
  }

  route(method, path, cb) {
    this.routes[method + path] = cb;
  }

  beforeEach(cb) {
    this.middleware.push(cb);
  }

  listen(port, cb) {
    this.server.listen(port, () => {
      cb();
    });
  }
}

module.exports = HighMark;
