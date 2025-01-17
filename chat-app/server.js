const net = require("net");

const PORT = 8080;
const HOST = "172.31.15.178";

const server = net.createServer();

// An array of client sockets
const clients = [];

server.on("connection", (socket) => {
  console.log("A new connection to the server");

  let clientId = clients.length + 1;

  clients.map((socket) => {
    socket.write(`User ${clientId} connected\n`);
  });

  socket.write(`id-${clientId}`);

  socket.on("data", (data) => {
    clients.map((s) => s.write(data));
  });

  socket.on("end", () => {
    clients.forEach((socket) => {
      socket.write(`User ${clientId} disconnected\n`);
    });
  });

  clients.push(socket);
});

server.listen(PORT, HOST, () => {
  console.log("Server listening ", server.address());
});

server.on("error", (error) => {
  console.error(error);
});

server.on("end", () => {
  console.log("Server ended");
});

server.on("timeout", () => {
  console.log("Server timeout");
});
