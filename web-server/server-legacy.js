const http = require("node:http");
const fs = require("node:fs/promises");

const server = http.createServer();

server.on("request", async (request, response) => {
  if (request.url === "/" && request.method === "GET") {
    response.writeHead(200, { "Content-Type": "text/html" });

    const fileHandle = await fs.open("public/index.html", "r");
    const fileStream = fileHandle.createReadStream();

    fileStream.pipe(response);
  }

  if (request.url === "/styles.css" && request.method === "GET") {
    response.writeHead(200, { "Content-Type": "text/css" });

    const fileHandle = await fs.open("public/styles.css", "r");
    const fileStream = fileHandle.createReadStream();

    fileStream.pipe(response);
  }

  if (request.url === "/script.js" && request.method === "GET") {
    response.writeHead(200, { "Content-Type": "text/javascript" });

    const fileHandle = await fs.open("public/script.js", "r");
    const fileStream = fileHandle.createReadStream();

    fileStream.pipe(response);
  }

  if (request.url === "/users" && request.method === "GET") {
    response.writeHead(200, { "Content-Type": "application/json" });

    const users = [
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Doe" },
    ];

    response.end(JSON.stringify(users));
  }

  if (request.url === "/upload" && request.method === "POST") {
    const fileHandle = await fs.open(`./file/${Date.now}.jpeg`, "w");
    const fileStream = fileHandle.createWriteStream();

    request.pipe(fileStream);

    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("File uploaded successfully");
  }
});

server.listen(8080, "127.0.0.1", () => {
  console.log("Server listening ", server.address());
});
