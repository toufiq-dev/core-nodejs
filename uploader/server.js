const net = require("net");
const fs = require("fs/promises");

const server = net.createServer();

server.on("connection", (socket) => {
  console.info(
    `New connection from ${socket.remoteAddress}:${socket.remotePort}`
  );
  socket.write("Connection established\n");

  let fileHandle, fileWriteStream;

  socket.on("data", async (data) => {
    try {
      if (!fileHandle) {
        // Open the file only once at the beginning
        fileHandle = await fs.open("files/test.txt", "w");
        fileWriteStream = fileHandle.createWriteStream();
        console.log("File opened for writing.");

        fileWriteStream.on("drain", () => {
          socket.resume();
        });

        fileWriteStream.on("finish", async () => {
          console.log("Finished writing to file.");
          await fileHandle.close();
        });
      }

      if (!fileWriteStream.write(data)) {
        socket.pause(); // Pause socket when stream buffer is full
      }
    } catch (err) {
      console.error("Error during file handling", err);
    }
  });

  socket.on("end", async () => {
    console.log("Client disconnected.");
    if (fileWriteStream) {
      fileWriteStream.end(); // End the write stream
    }
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });
});

server.listen(8080, () => {
  console.log("Server listening on port 8080");
});
