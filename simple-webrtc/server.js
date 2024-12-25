const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

// Setup Express
const app = express();
app.use(express.static("public"));

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO for signaling
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle signaling data
  socket.on("offer", (data) => {
    console.log("Offer received:", data);
    socket.broadcast.emit("offer", data); // Broadcast to all other clients
  });

  socket.on("answer", (data) => {
    console.log("Answer received:", data);
    socket.broadcast.emit("answer", data); // Broadcast to all other clients
  });

  socket.on("ice-candidate", (data) => {
    console.log("ICE Candidate received:", data);
    socket.broadcast.emit("ice-candidate", data); // Broadcast to all other clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
