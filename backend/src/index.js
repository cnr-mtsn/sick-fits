const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

require("dotenv").config({ path: "variables.env" });
const createServer = require("./createServer");
const db = require("./db");

const server = createServer();
server.express.use(cookieParser());

//decode JWT so we can get user ID on every request
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    //put userId onto request for further requests to access
    req.userId = userId;
  }
  next();
});

// 2. create middleware that populates user on each request
server.express.use(async (req, res, next) => {
  //if not logged in, skip
  if (!req.userId) return next();
  const user = await db.query.user(
    {
      where: {
        id: req.userId,
      },
    },
    "{id, permissions, email, name}",
  );
  req.user = user;
  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
  },
  deets => {
    console.log(`server running on http://localhost:${process.env.PORT}`);
  },
);
