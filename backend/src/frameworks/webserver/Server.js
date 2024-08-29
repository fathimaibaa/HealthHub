"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = __importDefault(require("../../Config"));
const serverConfig = (server) => {
    const startServer = () => {
        server.listen(Config_1.default.PORT, () => {
            console.log(`Server listening on Port  http://localhost:${Config_1.default.PORT}`);
        });
    };
    return {
        startServer
    };
};
exports.default = serverConfig;
