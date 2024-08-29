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
exports.getDoctorById = exports.getDoctorProfile = exports.doctorLogin = exports.verifyAccount = exports.addNewDoctor = void 0;
const DoctorEntity_1 = __importDefault(require("../../../entities/DoctorEntity"));
const HttpStatus_1 = require("../../../types/HttpStatus");
const CustomError_1 = __importDefault(require("../../../utils/CustomError"));
const DoctorVerifyEmailPage_1 = require("../../../utils/DoctorVerifyEmailPage");
const SendMail_1 = __importDefault(require("../../../utils/SendMail"));
const addNewDoctor = (doctorData, doctorRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    const { doctorName, email, phoneNumber, password } = doctorData;
    const isEmailExist = yield doctorRepository.getDoctorByEmail(email);
    if (isEmailExist)
        throw new CustomError_1.default("Email already exists", HttpStatus_1.HttpStatus.BAD_REQUEST);
    const hashedPassword = yield authService.encryptPassword(password);
    const verificationToken = authService.getRandomString();
    const doctor = (0, DoctorEntity_1.default)(doctorName, email, phoneNumber, hashedPassword, verificationToken);
    const createdDoctor = yield doctorRepository.addDoctor(doctor);
    if (createdDoctor) {
        const emailSubject = "Doctor verification ";
        (0, SendMail_1.default)(email, emailSubject, (0, DoctorVerifyEmailPage_1.doctorVerifyEmailPage)(doctorName, verificationToken));
    }
    return createdDoctor;
});
exports.addNewDoctor = addNewDoctor;
const verifyAccount = (token, doctorRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const updateVerification = yield doctorRepository.verifyDoctor(token);
    if (!updateVerification)
        throw new CustomError_1.default("Invalid token", HttpStatus_1.HttpStatus.BAD_REQUEST);
    return updateVerification;
});
exports.verifyAccount = verifyAccount;
const doctorLogin = (email, password, doctorRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    const isEmailExist = yield doctorRepository.getDoctorByEmail(email);
    if (!isEmailExist)
        throw new CustomError_1.default("Email is not existed, go nd register", HttpStatus_1.HttpStatus.UNAUTHORIZED);
    if (!isEmailExist.isVerified)
        throw new CustomError_1.default("Please verify your email", HttpStatus_1.HttpStatus.UNAUTHORIZED);
    if (isEmailExist.isBlocked)
        throw new CustomError_1.default("Your account is Blocked by Admin", HttpStatus_1.HttpStatus.UNAUTHORIZED);
    const message = "Your account has not been approved by the admin yet. Please wait for approval.";
    const isPasswordMatch = yield authService.comparePassword(password, isEmailExist.password);
    if (!isPasswordMatch)
        throw new CustomError_1.default("Wrong Password", HttpStatus_1.HttpStatus.BAD_REQUEST);
    const { accessToken, refreshToken } = authService.doctorCreateTokens(isEmailExist.id, isEmailExist.doctorName, isEmailExist.role);
    return { accessToken, isEmailExist, refreshToken };
});
exports.doctorLogin = doctorLogin;
const getDoctorProfile = (doctorId, doctorRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const doctor = yield doctorRepository.getDoctorById(doctorId);
    return doctor;
});
exports.getDoctorProfile = getDoctorProfile;
const getDoctorById = (id, doctorRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield doctorRepository.getDoctorById(id); });
exports.getDoctorById = getDoctorById;
