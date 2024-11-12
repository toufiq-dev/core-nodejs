const HighMark = require("./highMark");

const PORT = 8080;

const server = new HighMark();

server.route("GET", "/upload", (req, res) => {
  res.status(200).sendFile("./public/index.html", "text/html");
});

server.listen(PORT, () => {
  console.log("Server listening ");
});
