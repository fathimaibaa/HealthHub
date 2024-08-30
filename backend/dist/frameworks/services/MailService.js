"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const Config_1 = __importDefault(require("../../Config"));
const transporter = nodemailer_1.default.createTransport({
    service: "Gmail",
    auth: {
        user: Config_1.default.APP_EMAIL,
        pass: Config_1.default.APP_PASSWORD,
    },
});
exports.default = transporter;
