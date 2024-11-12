const http = require("node:http");

const server = http.createServer();

server.on("request", (request, response) => {
  console.log(request.headers);
  console.log(request.method);

  let data = "";
  request.on("data", (chunk) => {
    data += chunk.toString();
    // console.log(data);
  });

  request.on("end", () => {
    try {
      const parsedData = JSON.parse(data);
      console.log(parsedData);
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      response.writeHead(400, { "Content-Type": "text/plain" });
      response.end("Invalid JSON");
      return;
    }

    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ status: "Success" }));
  });
});

server.listen(8080, () => {
  console.log("Server listening on port 8080");
});
