const highMark = require("../web-server/highMark");
const { USERS, POSTS, SESSIONS } = require("./public/db");

const PORT = 8081;

const server = new highMark();

server.beforeEach((req, res, next) => {});

server.route("get", "/", (req, res) => {
  res.sendFile("./public/index.html", "text/html");
});
server.route("get", "/login", (req, res) => {
  res.sendFile("./public/index.html", "text/html");
});
server.route("get", "/profile", (req, res) => {
  res.sendFile("./public/index.html", "text/html");
});
server.route("get", "/styles.css", (req, res) => {
  res.sendFile("./public/styles.css", "text/css");
});
server.route("get", "/scripts.js", (req, res) => {
  res.sendFile("./public/scripts.js", "text/javascript");
});

server.route("get", "/api/user", (req, res) => {
  const token = req.headers.cookie.split("=")[1];
  const session = SESSIONS.find((session) => session.token === token);

  if (session) {
    const user = USERS.find((user) => user.id === session.userId);
    console.log("User authenticated");
    res.status(200).json(user);
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

server.route("put", "/api/user", (req, res) => {});

server.route("get", "/api/posts", (req, res) => {
  const posts = POSTS.map((post) => {
    const user = USERS.find((user) => user.id === post.userId);

    post.author = user.name;
    return post;
  });

  res.status(200).json(posts);
});

server.route("post", "/api/posts", (req, res) => {});

server.route("post", "/api/login", (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    const { username, password } = JSON.parse(body);
    const user = USERS.find((user) => user.username === username);

    if (user && user.password === password) {
      const token = Math.floor(Math.random() * 10000000000).toString();
      SESSIONS.push({ token, userId: user.id });

      res.setHeader("Set-Cookie", `token=${token}; Path=/; HttpOnly`);
      res.status(200).json({ message: "Login successful" });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });
});

server.route("post", "/api/logout", (req, res) => {});

server.listen(PORT, () => {
  console.log("ServerOne listening on port", PORT);
});
