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
