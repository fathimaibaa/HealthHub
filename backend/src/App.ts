import express, { Application, NextFunction } from "express";
import http from "http";
import serverConfig from "./frameworks/webserver/Server";
import routes from "./frameworks/webserver/routes/Index";
import connectDb from "./frameworks/database/Connection";
import expressConfig from "./frameworks/webserver/ExpressConfig";
import errorHandlingMiddleware from "./frameworks/webserver/middlewares/ErrorhandleMiddleware";
import CustomError from "./utils/CustomError";
import { Server } from "socket.io";
import socketConfig from "./frameworks/webserver/webSocket/Socket";
import path from "path";


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

  app.use(
    express.static(path.join(__dirname, "../../client/Dine_Delight_Client/dist"))
  );


  socketConfig(io);




routes(app);
serverConfig(server).startServer()

app.use(errorHandlingMiddleware)

app.all("*",(req, res, next: NextFunction)=>{
    next(new CustomError(`Not found : ${req.url}`, 404));
});
