const http = require("node:http");

const agent = new http.Agent({
  keepAlive: true,
});

const request = http.request({
  agent,
  hostname: "localhost",
  port: 8080,
  method: "POST",
  path: "/create-post",
  headers: {
    "content-type": "application/json",
  },
});

request.on("response", (response) => {
  response.on("data", (chunk) => {
    console.log(chunk.toString()); // Convert buffer to string for readability
  });
});

const payload = JSON.stringify([
  {
    title: "Hello World 1",
    body: "Hello World 1",
    userId: 1,
  },
  {
    title: "Hello World 2",
    body: "Hello World 2",
    userId: 2,
  },
  {
    message: "This is going to be the last message",
  },
]);

request.write(payload);
request.end();
