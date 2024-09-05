"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authenticateUser;
exports.authenticateDoctor = authenticateDoctor;
exports.authenticateAdmin = authenticateAdmin;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const HttpStatus_1 = require("../../../Types/HttpStatus");
const Config_1 = __importDefault(require("../../../Config"));
function authenticateUser(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(HttpStatus_1.HttpStatus.FORBIDDEN).json("Your are not authenticated");
    }
    const access_token = authHeader.split(" ")[1];
    jsonwebtoken_1.default.verify(access_token, Config_1.default.ACCESS_SECRET, (err, user) => {
        if (err) {
            res
                .status(HttpStatus_1.HttpStatus.FORBIDDEN)
                .json({ success: false, message: "Token is not valid" });
        }
        else {
            req.user = user.id;
        }
    });
    next();
}
function authenticateDoctor(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res
                    .status(HttpStatus_1.HttpStatus.FORBIDDEN)
                    .json("Your are not authenticated");
            }
            const access_token = authHeader.split(" ")[1];
            const user = jsonwebtoken_1.default.verify(access_token, Config_1.default.ACCESS_SECRET);
            if (user.role === "doctor") {
                req.doctor = user.id;
                return next();
            }
            return res.status(HttpStatus_1.HttpStatus.FORBIDDEN).json({
                success: false,
                message: "Your are not allowed to access this resource",
                user,
            });
        }
        catch (error) {
            res
                .status(HttpStatus_1.HttpStatus.FORBIDDEN)
                .json({ success: false, message: "Token is not valid" });
        }
    });
}
function authenticateAdmin(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(HttpStatus_1.HttpStatus.FORBIDDEN).json("You are not authenticated");
    const access_token = authHeader.split(" ")[1];
    jsonwebtoken_1.default.verify(access_token, Config_1.default.ACCESS_SECRET, (err, user) => {
        if (err) {
            res
                .status(HttpStatus_1.HttpStatus.FORBIDDEN)
                .json({ success: false, message: "Token is not valid" });
        }
        else {
            if (user.role === "admin") {
                return next();
            }
            return res.status(HttpStatus_1.HttpStatus.FORBIDDEN).json({
                success: false,
                message: "Your are not allowed to access this resource",
                user,
            });
        }
    });
}
