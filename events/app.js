const event = require("./events");

event.emit("userLoggedIn", { userId: 1124 });

event.emit("connection");

event.emit("connection", "hello");
