const EventEmitter = require("events");

const event = new EventEmitter();

event.on("userLoggedIn", (data) => {
  console.log(data);
});

event.on("userLoggedIn", () => {
  console.log("logged in 2");
});

event.on("userLoggedIn", (data) => {
  console.log(data + "logged in 3");
});

event.on("connection", () => console.log("New connection"));
event.on("connection", (stream) =>
  console.log(`New connection with ${stream}`)
);

module.exports = event;
