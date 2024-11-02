const net = require("net");

const socket = net.createConnection(
  {
    host: "192.168.0.104",
    port: 3000,
  },
  () => {
    const buff = Buffer.alloc(4);
    buff[0] = 10;
    buff[2] = 11;
    socket.write(buff);
  }
);
