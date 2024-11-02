const net = require("net");
const readline = require("readline/promises");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const clearLine = () => {
  process.stdout.moveCursor(0, -1);
  process.stdout.clearLine(0);
};

let id;
const socket = net.createConnection(
  { host: "127.0.0.1", port: 8080 },
  async () => {
    console.log("Connected to server");

    const ask = async () => {
      const message = await rl.question("Enter message: ");
      clearLine();
      socket.write(`Client ${id} - ${message}`);
    };

    ask();

    socket.on("data", (data) => {
      const dataString = data.toString();
      console.log();
      clearLine();

      if (dataString.includes("id")) {
        id = dataString.split("-")[1];
      } else {
        console.log(dataString);

        ask();
      }
    });
  }
);

socket.on("end", () => {
  console.log("Connection ended");
});
