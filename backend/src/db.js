//connecting to remote prisma database via prisma-bindings, gives ability to query with js
const { Prisma } = require("prisma-binding");

const db = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  debug: false, //true == console.log(every process);
});

module.exports = db;
