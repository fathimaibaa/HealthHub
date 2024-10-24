import express, { Application, NextFunction } from "express";
import http from "http";
import serverConfig from "./Frameworks/Webserver/Server";
import routes from "./Frameworks/Webserver/Routes/Index";
import connectDb from "./Frameworks/Database/Connection";
import expressConfig from "./Frameworks/Webserver/ExpressConfig";
import errorHandlingMiddleware from "./Frameworks/Webserver/Middlewares/ErrorhandleMiddleware";
import CustomError from "./Utils/CustomError";
import { Server } from "socket.io";
import socketConfig from "./Frameworks/Webserver/WebSocket/Socket";
// import path from "path";


const app : Application = express();

const server = http.createServer(app);

expressConfig(app);

connectDb();

const io = new Server(server, {
    cors: {
      origin: true,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // app.use(
  //   express.static(path.join(__dirname, "../../Frontend/dist"))
  // );


  socketConfig(io);




routes(app);
serverConfig(server).startServer()

app.use(errorHandlingMiddleware)

app.all("*",(req, res, next: NextFunction)=>{
    next(new CustomError(`Not found : ${req.url}`, 404));
});
