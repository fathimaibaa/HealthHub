import express, { Application, NextFunction } from "express";
import http from "http";
import serverConfig from "./frameworks/webserver/Server";
import routes from "./frameworks/webserver/routes";
import connectDb from "./frameworks/database/Connection";
import expressConfig from "./frameworks/webserver/ExpressConfig";
import errorHandlingMiddleware from "./frameworks/webserver/middlewares/ErrorhandleMiddleware";
import CustomError from "./utils/CustomError";
import { Server } from "socket.io";
import socketConfig from "./frameworks/webserver/webSocket/Socket";


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
  socketConfig(io);

routes(app);
serverConfig(server).startServer()

app.use(errorHandlingMiddleware)

app.all("*",(req, res, next: NextFunction)=>{
    next(new CustomError(`Not found : ${req.url}`, 404));
});
