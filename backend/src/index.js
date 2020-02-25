const cookieParser = require("cookie-parser");

require("dotenv").config({ path: "variables.env" });
const createServer = require("./createServer");
const db = require("./db");

const server = createServer();

//TODO use express middleware to populate current users
//TODO use express middleware to handle cookies (JWT)
server.express.use();

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
