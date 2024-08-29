"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const Server_1 = __importDefault(require("./frameworks/webserver/Server"));
const Index_1 = __importDefault(require("./frameworks/webserver/routes/Index"));
const Connection_1 = __importDefault(require("./frameworks/database/Connection"));
const ExpressConfig_1 = __importDefault(require("./frameworks/webserver/ExpressConfig"));
const ErrorhandleMiddleware_1 = __importDefault(require("./frameworks/webserver/middlewares/ErrorhandleMiddleware"));
const CustomError_1 = __importDefault(require("./utils/CustomError"));
const socket_io_1 = require("socket.io");
const Socket_1 = __importDefault(require("./frameworks/webserver/webSocket/Socket"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
(0, ExpressConfig_1.default)(app);
(0, Connection_1.default)();
const io = new socket_io_1.Server(server, {
    cors: {
        origin: true,
        methods: ["GET", "POST"],
        credentials: true,
    },
});
(0, Socket_1.default)(io);
(0, Index_1.default)(app);
(0, Server_1.default)(server).startServer();
app.use(ErrorhandleMiddleware_1.default);
app.all("*", (req, res, next) => {
    next(new CustomError_1.default(`Not found : ${req.url}`, 404));
});
