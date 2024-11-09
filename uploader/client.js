const net = require("net");
const fs = require("fs/promises");

const socket = net.createConnection({ host: "::1", port: 8080 }, async () => {
  const fileHandle = await fs.open("./text.txt", "r");
  const fileStream = fileHandle.createReadStream();

  fileStream.on("data", (data) => {
    socket.write(data);
  });

  fileStream.on("end", () => {
    console.log("File was successfully uploaded");
    socket.end();
  });
});
