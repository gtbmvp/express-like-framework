const Server = require("./framework/Server");
const postRouter = require("./posts/post-router");
const writeHead = require("./middlewares/writeHead");
const parseReqBody = require("./middlewares/parseReqBody");
const parseURL = require("./middlewares/parseURL");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;
const DB_URL = "mongodb://localhost:27017/express-like-framework";

const server = new Server();

server.addRouter(postRouter);
server.use(writeHead);
server.use(parseReqBody);
server.use(parseURL("http://localhost:5000"));

const start = async () => {
  try {
    await mongoose.connect(DB_URL);
    server.listen(PORT, () => {
      console.log(`server alive on ${PORT}`);
    });
  } catch (error) {
    console.log(error.message);
  }
};

start();
