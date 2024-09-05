"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getUserById = exports.authenticateGoogleSignInUser = exports.verifyTokenAndRestPassword = exports.sendResetVerificationCode = exports.deleteOtp = exports.verifyOtpUser = exports.login = exports.userRegister = void 0;
const UserEntity_1 = __importStar(require("../../../../Entities/UserEntity"));
const HttpStatus_1 = require("../../../../Types/HttpStatus");
const CustomError_1 = __importDefault(require("../../../../Utils/CustomError"));
const SendMail_1 = __importDefault(require("../../../../Utils/SendMail"));
const UserEmail_1 = require("../../../../Utils/UserEmail");
const userRegister = (user, userRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, phoneNumber, password } = user;
    const authenticationMethod = "password";
    const isEmailExist = yield userRepository.getUserbyEmail(email);
    if (isEmailExist)
        throw new CustomError_1.default("Email already exists", HttpStatus_1.HttpStatus.BAD_REQUEST);
    const hashedPassword = yield authService.encryptPassword(password);
    const userEntity = (0, UserEntity_1.default)(name, email, phoneNumber, hashedPassword, authenticationMethod);
    const createdUser = yield userRepository.addUser(userEntity);
    const wallet = yield userRepository.addWallet(createdUser.id);
    const OTP = authService.generateOTP();
    const emailSubject = "Account verification";
    yield userRepository.addOTP(OTP, createdUser.id);
    (0, SendMail_1.default)(createdUser.email, emailSubject, (0, UserEmail_1.otpEmail)(OTP, createdUser.name));
    return createdUser;
});
exports.userRegister = userRegister;
const login = (user, userDbRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = user;
    const isEmailExist = yield userDbRepository.getUserbyEmail(email);
    if (!isEmailExist) {
        throw new CustomError_1.default("Email does not existing", HttpStatus_1.HttpStatus.UNAUTHORIZED);
    }
    if ((isEmailExist === null || isEmailExist === void 0 ? void 0 : isEmailExist.authenticationMethod) === "google") {
        throw new CustomError_1.default("Only login with google", HttpStatus_1.HttpStatus.BAD_REQUEST);
    }
    if (isEmailExist === null || isEmailExist === void 0 ? void 0 : isEmailExist.isBlocked) {
        throw new CustomError_1.default("Account is Blocked ", HttpStatus_1.HttpStatus.FORBIDDEN);
    }
    if (!(isEmailExist === null || isEmailExist === void 0 ? void 0 : isEmailExist.isVerified)) {
        throw new CustomError_1.default("your account is not verified", HttpStatus_1.HttpStatus.UNAUTHORIZED);
    }
    if (!isEmailExist.password) {
        throw new CustomError_1.default("Invalid Credentials", HttpStatus_1.HttpStatus.UNAUTHORIZED);
    }
    const isPasswordMatched = yield authService.comparePassword(password, isEmailExist === null || isEmailExist === void 0 ? void 0 : isEmailExist.password);
    if (!isPasswordMatched) {
        throw new CustomError_1.default("Password is Wrong", HttpStatus_1.HttpStatus.UNAUTHORIZED);
    }
    const { accessToken, refreshToken } = authService.createTokens(isEmailExist.id, isEmailExist.name, isEmailExist.role);
    return { accessToken, isEmailExist, refreshToken };
});
exports.login = login;
const verifyOtpUser = (userOTP, userId, userRepository) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userOTP)
        throw new CustomError_1.default("Please provide an OTP", HttpStatus_1.HttpStatus.BAD_REQUEST);
    const otpUser = yield userRepository.findOtpUser(userId);
    if (!otpUser)
        throw new CustomError_1.default("Invalid otp , try resending the otp", HttpStatus_1.HttpStatus.BAD_REQUEST);
    if (otpUser.OTP === userOTP) {
        yield userRepository.updateProfile(userId, {
            isVerified: true,
        });
        return true;
    }
    else {
        throw new CustomError_1.default("Invalid OTP,try again", HttpStatus_1.HttpStatus.BAD_REQUEST);
    }
});
exports.verifyOtpUser = verifyOtpUser;
const deleteOtp = (userId, userDbRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    const newOtp = authService.generateOTP();
    const deleted = yield userDbRepository.deleteOtpUser(userId);
    if (deleted) {
        yield userDbRepository.addOTP(newOtp, userId);
    }
    const user = yield userDbRepository.getUserbyId(userId);
    if (user) {
        const emailSubject = "Account verification , New OTP";
        (0, SendMail_1.default)(user.email, emailSubject, (0, UserEmail_1.otpEmail)(newOtp, user.name));
    }
});
exports.deleteOtp = deleteOtp;
const sendResetVerificationCode = (email, userDbRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    const isEmailExist = yield userDbRepository.getUserbyEmail(email);
    if (!isEmailExist)
        throw new CustomError_1.default(`${email} does not exist`, HttpStatus_1.HttpStatus.BAD_REQUEST);
    if (isEmailExist.authenticationMethod === 'google')
        throw new CustomError_1.default(`${email} is sign in using google signin method,So it has no password to reset :-)`, HttpStatus_1.HttpStatus.BAD_REQUEST);
    const verificationCode = authService.getRandomString();
    const isUpdated = yield userDbRepository.updateVerificationCode(email, verificationCode);
    (0, SendMail_1.default)(email, "Reset password", (0, UserEmail_1.forgotPasswordEmail)(isEmailExist.name, verificationCode));
});
exports.sendResetVerificationCode = sendResetVerificationCode;
const verifyTokenAndRestPassword = (verificationCode, password, userDbRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    if (!verificationCode)
        throw new CustomError_1.default("Please provide a verification code", HttpStatus_1.HttpStatus.BAD_REQUEST);
    const hashedPassword = yield authService.encryptPassword(password);
    const isPasswordUpdated = yield userDbRepository.verifyAndResetPassword(verificationCode, hashedPassword);
    if (!isPasswordUpdated)
        throw new CustomError_1.default("Invalid token or token expired", HttpStatus_1.HttpStatus.BAD_REQUEST);
});
exports.verifyTokenAndRestPassword = verifyTokenAndRestPassword;
const authenticateGoogleSignInUser = (userData, userDbRepository, authService) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, picture, email_verified } = userData;
    const authenticationMethod = "google";
    const isEmailExist = yield userDbRepository.getUserbyEmail(email);
    if ((isEmailExist === null || isEmailExist === void 0 ? void 0 : isEmailExist.authenticationMethod) === "password") {
        throw new CustomError_1.default("you have another from this Email", HttpStatus_1.HttpStatus.BAD_REQUEST);
    }
    if (isEmailExist === null || isEmailExist === void 0 ? void 0 : isEmailExist.isBlocked)
        throw new CustomError_1.default("Your account is blocked by administrator", HttpStatus_1.HttpStatus.FORBIDDEN);
    if (isEmailExist) {
        const { accessToken, refreshToken } = authService.createTokens(isEmailExist.id, isEmailExist.name, isEmailExist.role);
        return { accessToken, isEmailExist, refreshToken };
    }
    else {
        const googleSignInUser = (0, UserEntity_1.googleSignInUserEntity)(name, email, picture, email_verified, authenticationMethod);
        const createdUser = yield userDbRepository.registerGoogleSignedUser(googleSignInUser);
        const userId = createdUser._id;
        const wallet = yield userDbRepository.addWallet(userId);
        const { accessToken, refreshToken } = authService.createTokens(userId, createdUser.name, createdUser.role);
        return { accessToken, createdUser, refreshToken };
    }
});
exports.authenticateGoogleSignInUser = authenticateGoogleSignInUser;
const getUserById = (id, userRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield userRepository.getUserbyId(id); });
exports.getUserById = getUserById;
