const net = require("net");
const fs = require("fs/promises");

const socket = net.createConnection(
  { host: "127.0.0.1", port: 8080 },
  async () => {
    const fileHandle = await fs.open("./text.txt", "r");
    const fileReadStream = fileHandle.createReadStream();

    fileReadStream.on("data", (data) => {
      if (!socket.write(data)) {
        fileReadStream.pause(); // Pause reading if socket buffer is full
      }
    });

    socket.on("drain", () => {
      fileReadStream.resume(); // Resume reading once socket buffer is drained
    });

    fileReadStream.on("end", async () => {
      console.log("File was successfully uploaded.");
      socket.end();
      await fileHandle.close(); // Close the file handle after the stream ends
    });

    fileReadStream.on("error", async (err) => {
      console.error("Error reading file:", err);
      await fileHandle.close();
    });
  }
);

socket.on("error", (err) => {
  console.error("Socket error:", err);
});


const net = require("net");
const fs = require("fs/promises");
const path = require("path");

const uploadDir = "files"; // Directory to store uploaded files

const server = net.createServer();

server.on("connection", (socket) => {
  console.info(`New connection from ${socket.remoteAddress}:${socket.remotePort}`);
  socket.write("Connection established\n");

  let fileHandle;
  let fileWriteStream;

  // Unique filename for each client
  const fileName = `upload_${socket.remoteAddress.replace(/[:.]/g, "_")}_${socket.remotePort}_${Date.now()}.txt`;
  const filePath = path.join(uploadDir, fileName);

  (async () => {
    try {
      // Ensure upload directory exists
      await fs.mkdir(uploadDir, { recursive: true });

      // Open a unique file for each connection
      fileHandle = await fs.open(filePath, "w");
      fileWriteStream = fileHandle.createWriteStream();
      console.log(`File opened for writing: ${filePath}`);

      // Handle backpressure
      fileWriteStream.on("drain", () => {
        socket.resume();
      });

      // Close file when writing is finished
      fileWriteStream.on("finish", async () => {
        console.log(`Finished writing to file: ${filePath}`);
        await fileHandle.close();
        fileHandle = null;
      });

      // Handle incoming data from the client
      socket.on("data", (data) => {
        if (!fileWriteStream.write(data)) {
          socket.pause(); // Pause socket if the stream buffer is full
        }
      });

      // Handle client disconnection
      socket.on("end", async () => {
        console.log("Client disconnected.");
        if (fileWriteStream) {
          fileWriteStream.end(); // End the write stream
        }
        if (fileHandle) {
          await fileHandle.close(); // Ensure file handle is closed
        }
        socket.end();
      });

    } catch (err) {
      console.error("Error during file handling", err);
    }
  })();

  // Handle socket errors
  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });
});

server.listen(8080, () => {
  console.log("Server listening on port 8080");
});

