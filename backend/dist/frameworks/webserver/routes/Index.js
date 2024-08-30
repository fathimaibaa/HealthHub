"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserRoute_1 = __importDefault(require("./UserRoute"));
const DoctorRoute_1 = __importDefault(require("./DoctorRoute"));
const AdminRoute_1 = __importDefault(require("./AdminRoute"));
const RefreshTokenRoute_1 = __importDefault(require("./RefreshTokenRoute"));
const ChatRoutes_1 = __importDefault(require("./ChatRoutes"));
const routes = (app) => {
    app.use("/api/user", (0, UserRoute_1.default)());
    app.use("/api/doctor", (0, DoctorRoute_1.default)());
    app.use('/api/admin', (0, AdminRoute_1.default)());
    app.use("/api/token", (0, RefreshTokenRoute_1.default)());
    app.use("/api/chat", (0, ChatRoutes_1.default)());
};
exports.default = routes;
