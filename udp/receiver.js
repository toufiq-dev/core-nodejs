const dgram = require("dgram");

const receiver = dgram.createSocket("udp4");

receiver.on("message", (msg, rinfo) => {
  console.log(msg.toString());
  console.log(rinfo);
});

receiver.bind({
  port: 8080,
  address: "127.0.0.1",
});

receiver.on("listening", () => {
  console.log(
    `Listening on ${receiver.address().address}:${receiver.address().port}`
  );
});
