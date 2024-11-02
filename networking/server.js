const net = require("net");

const server = net.createServer((socket) => {
  // socket is an instance of net.Socket and it is a duplex stream
  socket.on("data", (data) => {
    console.log(data);
  });
});

server.listen(3000, "192.168.0.104", () => {
  console.log("Server listening ", server.address());
});
