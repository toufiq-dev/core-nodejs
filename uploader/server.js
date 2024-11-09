const net = require("net");
const fs = require("fs/promises");

const server = net.createServer();

server.on("connection", (socket) => {
  console.info(
    `New connection from ${socket.remoteAddress}:${socket.remotePort}`
  );

  socket.write("Connection established\n");
  let fileHandle;
  socket.on("data", async (data) => {
    fileHandle = await fs.open("files/test.txt", "w");
    const fileStream = fileHandle.createWriteStream();

    fileStream.write(data);
  });

  socket.on("end", () => {
    fileHandle.close();
    console.log("Connection ended");
  });
});

server.listen(8080, () => {
  console.log("Server listening on ", server.address());
});

server.on("error", (error) => {
  console.error(error);
});

server.on("close", () => {
  console.log("Server closed");
});
