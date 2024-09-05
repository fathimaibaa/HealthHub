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
exports.userRepositoryMongodb = void 0;
const Otp_1 = __importDefault(require("../Models/Otp"));
const User_1 = __importDefault(require("../Models/User"));
const Wallet_1 = __importDefault(require("../Models/Wallet"));
const Transaction_1 = __importDefault(require("../Models/Transaction"));
const userRepositoryMongodb = () => {
    const getUserbyEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield User_1.default.findOne({ email });
        return user;
    });
    const getUserbyId = (id) => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield User_1.default.findById(id);
        return res;
    });
    const addUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = new User_1.default({
            name: user.name(),
            email: user.getEmail(),
            password: user.getPassword(),
            phoneNumber: user.getphoneNumber(),
            authenticationMethod: user.getAuthenticationMethod(),
        });
        yield newUser.save();
        return newUser;
    });
    const findOtpUser = (userId) => __awaiter(void 0, void 0, void 0, function* () { return yield Otp_1.default.findOne({ userId: userId }); });
    const updateUserInfo = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () { return yield User_1.default.findByIdAndUpdate(id, updateData, { new: true }); });
    const deleteOtpUser = (userId) => __awaiter(void 0, void 0, void 0, function* () { return yield Otp_1.default.deleteOne({ userId }); });
    const AddOTP = (OTP, userId) => __awaiter(void 0, void 0, void 0, function* () {
        yield Otp_1.default.create({ OTP, userId });
    });
    const updateVerificationCode = (email, code) => __awaiter(void 0, void 0, void 0, function* () { return yield User_1.default.findOneAndUpdate({ email }, { verificationCode: code }); });
    const findVerificationCodeAndUpdate = (code, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
        return yield User_1.default.findOneAndUpdate({ verificationCode: code }, { password: newPassword, verificationCode: null }, { upsert: true });
    });
    const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () { return yield User_1.default.find({ isVerified: true }); });
    const updateUserBlock = (id, status) => __awaiter(void 0, void 0, void 0, function* () { return yield User_1.default.findByIdAndUpdate(id, { isBlocked: status }); });
    const registerGoogleSignedUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
        return yield User_1.default.create({
            name: user.name(),
            email: user.email(),
            profilePicture: user.picture(),
            isVerified: user.email_verified(),
            authenticationMethod: user.authenticationMethod(),
        });
    });
    const addWallet = (userId) => __awaiter(void 0, void 0, void 0, function* () { return yield Wallet_1.default.create({ userId }); });
    const getWalletUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield Wallet_1.default.findOne({ userId: userId });
        return response;
    });
    const getAllTransaction = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        const transactions = yield Transaction_1.default.find({ userId: userId });
        return transactions;
    });
    return {
        getUserbyEmail,
        addUser,
        findOtpUser,
        updateUserInfo,
        deleteOtpUser,
        AddOTP,
        getUserbyId,
        updateVerificationCode,
        findVerificationCodeAndUpdate,
        getAllUsers,
        updateUserBlock,
        registerGoogleSignedUser,
        addWallet,
        getWalletUser,
        getAllTransaction
    };
};
exports.userRepositoryMongodb = userRepositoryMongodb;
