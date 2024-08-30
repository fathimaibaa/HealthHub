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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDbRepository = void 0;
const userDbRepository = (repository) => {
    const getUserbyEmail = (email) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getUserbyEmail(email); });
    const addUser = (user) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.addUser(user); });
    const findOtpUser = (userId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.findOtpUser(userId); });
    const updateProfile = (userID, userData) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.updateUserInfo(userID, userData); });
    const deleteOtpUser = (userId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.deleteOtpUser(userId); });
    const addOTP = (otp, id) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.AddOTP(otp, id); });
    const getUserbyId = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getUserbyId(id); });
    const updateVerificationCode = (email, verificationCode) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.updateVerificationCode(email, verificationCode); });
    const verifyAndResetPassword = (verificationCode, password) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.findVerificationCodeAndUpdate(verificationCode, password); });
    const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getAllUsers(); });
    const updateUserBlock = (id, status) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.updateUserBlock(id, status); });
    const registerGoogleSignedUser = (user) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.registerGoogleSignedUser(user); });
    const addWallet = (userID) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.addWallet(userID); });
    const getWallet = (userId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getWalletUser(userId); });
    const getTransactions = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield repository.getAllTransaction(userId);
        return response;
    });
    return {
        getUserbyEmail,
        addUser,
        findOtpUser,
        updateProfile,
        deleteOtpUser,
        addOTP,
        getUserbyId,
        updateVerificationCode,
        verifyAndResetPassword,
        getAllUsers,
        updateUserBlock,
        registerGoogleSignedUser,
        addWallet,
        getWallet,
        getTransactions
    };
};
exports.userDbRepository = userDbRepository;
