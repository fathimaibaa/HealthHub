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
const AdminAuth_1 = require("../App/Use-cases/Admin/AdminAuth");
const HttpStatus_1 = require("../Types/HttpStatus");
const AdminUpdate_1 = require("../App/Use-cases/Admin/AdminUpdate");
const AdminRead_1 = require("../App/Use-cases/Admin/AdminRead");
const AdminDepartment_1 = require("../App/Use-cases/Admin/AdminDepartment");
exports.default = (authServiceInterface, authServiceImpl, userDbRepository, userDbRepositoryImpl, bookingDbRepository, bookingDbRepositoryImpl, doctorDbRepository, doctorDbRepositoryImpl, departmentDbRepository, departmentDbRepositoryImpl) => {
    const dbUserRepository = userDbRepository(userDbRepositoryImpl());
    const dbBookingRepository = bookingDbRepository(bookingDbRepositoryImpl());
    const dbDoctorRepository = doctorDbRepository(doctorDbRepositoryImpl());
    const authService = authServiceInterface(authServiceImpl());
    const dbDepartmentRepository = departmentDbRepository(departmentDbRepositoryImpl());
    const adminLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            console.log(email, password, "lllllllllllllllllllllllllllllllllllllll");
            const { accessToken, refreshToken } = yield (0, AdminAuth_1.loginAdmin)(email, password, authService);
            return res.status(HttpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "Admin login success",
                admin: { name: "Admin user", role: "admin" },
                access_token: accessToken,
                refresh_token: refreshToken,
            });
        }
        catch (error) {
            next(error);
        }
    });
    const getAllUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield (0, AdminRead_1.getUsers)(dbUserRepository);
            return res.status(HttpStatus_1.HttpStatus.OK).json({ success: true, users });
        }
        catch (error) {
            next(error);
        }
    });
    const getAllDoctors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const doctors = yield (0, AdminRead_1.getAllTheDoctors)(dbDoctorRepository);
            return res.status(HttpStatus_1.HttpStatus.OK).json({ success: true, doctors });
        }
        catch (error) {
            next(error);
        }
    });
    const userBlock = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const updatedUser = yield (0, AdminUpdate_1.blockUser)(id, dbUserRepository);
            return res.status(HttpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "User block status updated successfully",
                user: updatedUser,
            });
        }
        catch (error) {
            next(error);
        }
    });
    const doctorBlock = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const updatedDoctor = yield (0, AdminUpdate_1.blockDoctor)(id, dbDoctorRepository);
            return res.status(HttpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "doctor block status updated successfully",
                doctor: updatedDoctor,
            });
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
    const updateDoctor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { action } = req.body;
            const doctor = yield (0, AdminRead_1.getDoctor)(id, action, dbDoctorRepository);
            return res
                .status(HttpStatus_1.HttpStatus.OK)
                .json({ success: true, doctor, message: "Verified Successfull" });
        }
        catch (error) {
            next(error);
        }
    });
    const rejectionDoctor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const { reason } = req.body;
            const doctor = yield (0, AdminRead_1.getDoctorRejected)(id, status, reason, dbDoctorRepository);
            return res
                .status(HttpStatus_1.HttpStatus.OK)
                .json({ success: true, doctor, message: "Verified Successfully" });
        }
        catch (error) {
            next(error);
        }
    });
    const getAllDepartmentsHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const departments = yield (0, AdminDepartment_1.getAllDepartments)(dbDepartmentRepository);
            return res.status(HttpStatus_1.HttpStatus.OK).json({ success: true, departments });
        }
        catch (error) {
            next(error);
        }
    });
    const addDepartmentHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { departmentName } = req.body;
            const newDept = yield (0, AdminDepartment_1.addDepartment)({ departmentName }, dbDepartmentRepository);
            return res
                .status(HttpStatus_1.HttpStatus.OK)
                .json({ success: true, message: "Department added successfully", newDept });
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
    const updateDepartmentHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const departmentName = req.body;
            yield (0, AdminDepartment_1.updateDepartment)(id, departmentName, dbDepartmentRepository);
            return res
                .status(HttpStatus_1.HttpStatus.OK)
                .json({ success: true, message: "Department updated successfully" });
        }
        catch (error) {
            next(error);
        }
    });
    const blockDepartmentHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            yield (0, AdminDepartment_1.blockDepartment)(id, dbDepartmentRepository);
            return res
                .status(HttpStatus_1.HttpStatus.OK)
                .json({ success: true, message: "Department blocked successfully" });
        }
        catch (error) {
            next(error);
        }
    });
    const unblockDepartmentHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            yield (0, AdminDepartment_1.unblockDepartment)(id, dbDepartmentRepository);
            return res
                .status(HttpStatus_1.HttpStatus.OK)
                .json({ success: true, message: "Department unblocked successfully" });
        }
        catch (error) {
            next(error);
        }
    });
    const getAllAppoinments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const appoinments = yield (0, AdminRead_1.getAllTheAppoinments)(dbDoctorRepository);
            return res.status(HttpStatus_1.HttpStatus.OK).json({ success: true, appoinments });
        }
        catch (error) {
            next(error);
        }
    });
    const getReports = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const reports = yield (0, AdminRead_1.getAllReports)(dbBookingRepository);
            return res.status(HttpStatus_1.HttpStatus.OK).json({ success: true, reports });
        }
        catch (error) {
            next(error);
        }
    });
    return {
        adminLogin,
        getAllUser,
        getAllDoctors,
        userBlock,
        doctorBlock,
        doctorDetails,
        updateDoctor,
        rejectionDoctor,
        getAllDepartmentsHandler,
        addDepartmentHandler,
        listDepartmentsHandler,
        updateDepartmentHandler,
        blockDepartmentHandler,
        unblockDepartmentHandler,
        getAllAppoinments,
        getReports
    };
};
