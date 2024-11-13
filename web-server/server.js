const HighMark = require("./highMark");

const PORT = 8080;

const server = new HighMark();

server.route("get", "/", (req, res) => {
  res.sendFile("./public/index.html", "text/html");
});
server.route("get", "/styles.css", (req, res) => {
  res.sendFile("./public/styles.css", "text/css");
});
server.route("get", "/script.js", (req, res) => {
  res.sendFile("./public/script.js", "text/javascript");
});

server.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});
