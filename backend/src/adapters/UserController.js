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
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const HttpStatus_1 = require("../types/HttpStatus");
const AdminDepartment_1 = require("../app/use-cases/Admin/AdminDepartment");
const UserAuth_1 = require("../app/use-cases/user/auth/UserAuth");
const AdminRead_1 = require("../app/use-cases/Admin/AdminRead");
const Get_and_Update_1 = require("../app/use-cases/user/timeslots/Get and Update");
const Timeslot_1 = require("../app/use-cases/Doctor/Timeslot");
const Profile_1 = require("../app/use-cases/user/auth/read&update/Profile");
const PrescriptionUseCase_1 = require("../app/use-cases/Prescription/PrescriptionUseCase");
const userController = (authServiceInterface, authServiceImpl, userDbRepository, userRepositoryImpl, doctorDbRepository, doctorDbRepositoryImpl, timeSlotDbRepository, timeSlotDbRepositoryImpl, prescriptionDbRepository, prescriptionDbRepositoryImpl, departmentDbRepository, departmentDbRepositoryImpl) => {
    const authService = authServiceInterface(authServiceImpl());
    const dbRepositoryUser = userDbRepository(userRepositoryImpl());
    const dbDoctorRepository = doctorDbRepository(doctorDbRepositoryImpl());
    const dbDepartmentRepository = departmentDbRepository(departmentDbRepositoryImpl());
    const dbPrescriptionRepository = prescriptionDbRepository(prescriptionDbRepositoryImpl());
    const dbTimeSlotRepository = timeSlotDbRepository(timeSlotDbRepositoryImpl());
    const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = req.body;
            const newUser = yield (0, UserAuth_1.userRegister)(user, dbRepositoryUser, authService);
            res.json({
                message: "User registration successful,please verify your email",
                newUser,
            });
        }
        catch (error) {
            next(error);
        }
    });
    const verifyOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { otp, userId } = req.body;
            const isVerified = yield (0, UserAuth_1.verifyOtpUser)(otp, userId, dbRepositoryUser);
            if (isVerified) {
                return res.status(HttpStatus_1.HttpStatus.OK)
                    .json({ message: "User account verified, please login" });
            }
        }
        catch (error) {
            next(error);
        }
    });
    const resendOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId } = req.body;
            yield (0, UserAuth_1.deleteOtp)(userId, dbRepositoryUser, authService);
            res.json({ message: "New otp sent to mail" });
        }
        catch (error) {
            next(error);
        }
    });
    const userLogin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { accessToken, refreshToken, isEmailExist } = yield (0, UserAuth_1.login)(req.body, dbRepositoryUser, authService);
            res
                .status(HttpStatus_1.HttpStatus.OK)
                .json({ message: "login success", user: isEmailExist,
                access_token: accessToken,
                refresh_token: refreshToken,
            });
        }
        catch (error) {
            next(error);
        }
    }));
    const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email } = req.body;
            yield (0, UserAuth_1.sendResetVerificationCode)(email, dbRepositoryUser, authService);
            return res.status(HttpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "Reset password is send to your email,check it"
            });
        }
        catch (error) {
            next(error);
        }
    });
    const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { password } = req.body;
            const { token } = req.params;
            yield (0, UserAuth_1.verifyTokenAndRestPassword)(token, password, dbRepositoryUser, authService);
            return res.status(HttpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "Reset password success,you can login with your new password",
            });
        }
        catch (error) {
            next(error);
        }
    });
    const doctorPage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { searchQuery, department, selectedDate, selectedTimeSlot } = req.query;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 8;
            const searchQueryStr = searchQuery;
            const departmentStr = department;
            const selectedDateStr = selectedDate;
            const selectedTimeSlotStr = selectedTimeSlot;
            const doctors = yield (0, AdminRead_1.getDoctors)({
                searchQuery: searchQueryStr,
                department: departmentStr,
                selectedDate: selectedDateStr,
                selectedTimeSlot: selectedTimeSlotStr,
                page,
                limit,
            }, dbDoctorRepository);
            return res.status(200).json(Object.assign({ success: true }, doctors));
        }
        catch (error) {
            next(error);
        }
    });
    const doctorDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const doctor = yield (0, AdminRead_1.getSingleDoctor)(id, dbDoctorRepository);
            return res.status(HttpStatus_1.HttpStatus.OK).json({ success: true, doctor });
        }
        catch (error) {
            next(error);
        }
    });
    const googleSignIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userData = req.body.user;
            const { accessToken, refreshToken, isEmailExist, createdUser } = yield (0, UserAuth_1.authenticateGoogleSignInUser)(userData, dbRepositoryUser, authService);
            const user = isEmailExist ? isEmailExist : createdUser;
            res.status(HttpStatus_1.HttpStatus.OK).json({ message: "login success", user, access_token: accessToken, refresh_token: refreshToken });
        }
        catch (error) {
            next(error);
        }
    });
    const getAllTimeSlots = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const timeslots = yield (0, Get_and_Update_1.getAllTimeSlot)(dbTimeSlotRepository);
            return res.status(HttpStatus_1.HttpStatus.OK).json({ success: true, timeslots });
        }
        catch (error) {
            next(error);
        }
    });
    const getTimeslots = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { date } = req.query;
            const timeSlots = yield (0, Timeslot_1.getAllTimeSlotsByDoctorId)(id, date, dbTimeSlotRepository);
            res.status(HttpStatus_1.HttpStatus.OK).json({ success: true, timeSlots });
        }
        catch (error) {
            next(error);
        }
    });
    const getDateSlots = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const dateSlots = yield (0, Timeslot_1.getDateSlotsByDoctorId)(id, dbTimeSlotRepository);
            res.status(HttpStatus_1.HttpStatus.OK).json({ success: true, dateSlots });
        }
        catch (error) {
            next(error);
        }
    });
    const listDepartmentsHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const departments = yield (0, AdminDepartment_1.listDepartments)(dbDepartmentRepository);
            return res.status(HttpStatus_1.HttpStatus.OK).json({ success: true, departments });
        }
        catch (error) {
            next(error);
        }
    });
    const userProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.user;
            const user = yield (0, Profile_1.getUserProfile)(userId, dbRepositoryUser);
            res.status(200).json({ success: true, user });
        }
        catch (error) {
            next(error);
        }
    });
    const updateUserInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.user;
            const updateData = req.body;
            const user = yield (0, Profile_1.updateUser)(userId, updateData, dbRepositoryUser);
            res
                .status(200)
                .json({ success: true, user, message: "Profile updated successfully" });
        }
        catch (error) {
            next(error);
        }
    });
    const fetchPrescription = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { appoinmentId } = req.body;
            const data = { appoinmentId };
            const response = yield (0, PrescriptionUseCase_1.fetchPrescriptionUsecase)(data, dbPrescriptionRepository);
            res.status(HttpStatus_1.HttpStatus.OK).json({ sucess: true, response });
        }
        catch (error) {
            next(error);
        }
    });
    const labRecords = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { documents } = req.body;
            const { id } = req.body;
            const data = documents;
            const appoinmentId = id;
            const response = yield (0, PrescriptionUseCase_1.uploadLabDocuments)(appoinmentId, data, dbPrescriptionRepository);
            res.status(HttpStatus_1.HttpStatus.OK).json({ sucess: true, response });
        }
        catch (error) {
            next(error);
        }
    });
    const fetchDocuments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const documents = yield (0, PrescriptionUseCase_1.getDocuments)(id, dbPrescriptionRepository);
            res.status(HttpStatus_1.HttpStatus.OK).json({ success: true, documents });
        }
        catch (error) {
            next(error);
        }
    });
    const deleteDocument = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const response = yield (0, PrescriptionUseCase_1.deleteSingleDocument)(id, dbPrescriptionRepository);
            res.status(HttpStatus_1.HttpStatus.OK).json({ success: true, response });
        }
        catch (error) {
            next(error);
        }
    });
    const getWallet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const getWallet = yield (0, Profile_1.getWalletUser)(id, dbRepositoryUser);
            res.status(200).json({ success: true, getWallet });
        }
        catch (error) {
            next(error);
        }
    });
    const getTransactions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.user;
            const transaction = yield (0, Profile_1.WalletTransactions)(userId, dbRepositoryUser);
            res.status(200).json({
                success: true,
                transaction,
                message: "Transactions fetched successfully",
            });
        }
        catch (error) {
            next(error);
        }
    });
    return {
        registerUser,
        verifyOtp,
        resendOtp,
        userLogin,
        forgotPassword,
        resetPassword,
        doctorPage,
        doctorDetails,
        googleSignIn,
        getAllTimeSlots,
        getTimeslots,
        getDateSlots,
        listDepartmentsHandler,
        userProfile,
        updateUserInfo,
        fetchPrescription,
        labRecords,
        fetchDocuments,
        deleteDocument,
        getWallet,
        getTransactions
    };
};
exports.default = userController;
