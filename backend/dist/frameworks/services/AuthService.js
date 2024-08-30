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
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Config_1 = __importDefault(require("../../Config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const authService = () => {
    const encryptPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
        const salt = yield bcryptjs_1.default.genSalt(10);
        return yield bcryptjs_1.default.hash(password, salt);
    });
    const comparePassword = (inputPassword, password) => __awaiter(void 0, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(inputPassword, password);
    });
    const getRandomString = () => crypto_1.default.randomUUID();
    const generateOTP = () => {
        const otp = Math.floor(100000 + Math.random() * 900000);
        return `${otp}`;
    };
    const createTokens = (id, name, role) => {
        const payload = {
            id,
            name,
            role,
        };
        const accessToken = jsonwebtoken_1.default.sign(payload, Config_1.default.ACCESS_SECRET, {
            expiresIn: "20s",
        });
        const refreshToken = jsonwebtoken_1.default.sign(payload, Config_1.default.REFRESH_SECRET, {
            expiresIn: "2d",
        });
        return { accessToken, refreshToken };
    };
    const doctorCreateTokens = (id, name, role) => {
        const payload = {
            id,
            name,
            role,
        };
        const accessToken = jsonwebtoken_1.default.sign(payload, Config_1.default.ACCESS_SECRET, {
            expiresIn: "20s",
        });
        const refreshToken = jsonwebtoken_1.default.sign(payload, Config_1.default.REFRESH_SECRET, {
            expiresIn: "2d",
        });
        return { accessToken, refreshToken };
    };
    return { encryptPassword, generateOTP, comparePassword, createTokens, getRandomString, doctorCreateTokens };
};
exports.authService = authService;
