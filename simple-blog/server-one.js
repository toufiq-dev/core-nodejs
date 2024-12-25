const highMark = require("../web-server/highMark");
const { USERS, POSTS, SESSIONS } = require("./public/db");

const PORT = 8081;

const server = new highMark();

server.beforeEach((req, res, next) => {
  const routesToAuthenticate = [
    "GET /api/user",
    "PUT /api/user",
    "POST /api/posts",
    "DELETE /api/logout",
  ];
  console.log("Middleware running on", req.method, req.url);

  if (routesToAuthenticate.includes(req.method + " " + req.url)) {
    const token = req.headers?.cookie.split("=")[1];
    const session = SESSIONS.find((session) => session.token === token);

    if (session) {
      req.userId = session.userId;
      return next();
    }

    res.status(401).json({ error: "Unauthorized" });
  } else {
    next();
  }
});

const parseJSON = (req, res, next) => {
  if (req.headers["content-type"] === "application/json") {
    let data = "";

    req.on("data", (chunk) => {
      data += chunk.toString("utf-8");
    });

    req.on("end", () => {
      req.body = JSON.parse(data);
      return next();
    });
  } else {
    next();
  }
};

// For parsing JSON request bodies
server.beforeEach(parseJSON);

// For different routes that need the index.html file
server.beforeEach((req, res, next) => {
  const routes = ["/", "/login", "/profile", "/new-post"];

  if (routes.includes(req.url) && req.method === "GET") {
    return res.status(200).sendFile("./public/index.html", "text/html");
  } else {
    next();
  }
});

server.route("get", "/styles.css", (req, res) => {
  res.sendFile("./public/styles.css", "text/css");
});
server.route("get", "/scripts.js", (req, res) => {
  res.sendFile("./public/scripts.js", "text/javascript");
});

server.route("get", "/api/user", (req, res) => {
  const user = USERS.find((user) => user.id === req.userId);
  console.log("User authenticated");
  res.status(200).json(user);
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
  const { username, password } = req.body;
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

server.route("post", "/api/logout", (req, res) => {});

server.listen(PORT, () => {
  console.log("ServerOne listening on port", PORT);
});
