const net = require("node:net");

const socket = net.createConnection(
  {
    host: "127.0.0.1",
    port: 8080,
  },
  () => {
    const body = Buffer.from(
      "5b7b227469746c65223a2248656c6c6f20576f726c642031222c22626f6479223a2248656c6c6f20576f726c642031222c22757365724964223a317d2c7b227469746c65223a2248656c6c6f20576f726c642032222c22626f6479223a2248656c6c6f20576f726c642032222c22757365724964223a327d2c7b226d657373616765223a225468697320697320676f696e6720746f20626520746865206c617374206d657373616765227d5d",
      "hex"
    );

    // Calculate Content-Length based on the body length
    const contentLength = Buffer.byteLength(body);
    const head = Buffer.from(
      `POST /create-post HTTP/1.1\r\n` +
        `Content-Type: application/json\r\n` +
        `Host: localhost:8080\r\n` +
        `Connection: keep-alive\r\n` +
        `Content-Length: ${contentLength}\r\n\r\n`,
      "utf-8"
    );

    // Send the request
    socket.write(Buffer.concat([head, body]));
  }
);

socket.on("data", (data) => {
  console.log(data.toString("utf-8"));
});
