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
const HttpStatus_1 = require("../types/HttpStatus");
const AuthDoctor_1 = require("../app/use-cases/Doctor/AuthDoctor");
const Profile_1 = require("../app/use-cases/Doctor/ReadnUpdate/Profile");
const AdminDepartment_1 = require("../app/use-cases/Admin/AdminDepartment");
const Timeslot_1 = require("../app/use-cases/Doctor/Timeslot");
const DoctorRead_1 = require("../app/use-cases/Doctor/DoctorRead");
const PrescriptionUseCase_1 = require("../app/use-cases/Prescription/PrescriptionUseCase");
const AdminRead_1 = require("../app/use-cases/Admin/AdminRead");
const doctorController = (authServiceInterface, authServiceImpl, userDbRepository, userRepositoryImpl, doctorDbRepository, doctorDbRepositoryImpl, departmentDbRepository, departmentDbRepositoryImpl, timeSlotDbRepository, timeSlotDbRepositoryImpl, prescriptionDbRepository, prescriptionDbRepositoryImpl, bookingDbRepository, bookingDbRepositoryImpl) => {
    const authService = authServiceInterface(authServiceImpl());
    const dbRepositoryUser = userDbRepository(userRepositoryImpl());
    const dbRepositoryDoctor = doctorDbRepository(doctorDbRepositoryImpl());
    const dbDepartmentRepository = departmentDbRepository(departmentDbRepositoryImpl());
    const dbPrescriptionRepository = prescriptionDbRepository(prescriptionDbRepositoryImpl());
    const dbTimeSlotRepository = timeSlotDbRepository(timeSlotDbRepositoryImpl());
    const dbBookingRepository = bookingDbRepository(bookingDbRepositoryImpl());
    const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const doctordata = req.body;
            const registerDoctor = yield (0, AuthDoctor_1.addNewDoctor)(doctordata, dbRepositoryDoctor, authService);
            if (registerDoctor) {
                return res.status(HttpStatus_1.HttpStatus.OK).json({
                    success: true,
                    message: "Registration success, please verify your email that we sent to your mail",
                });
            }
        }
        catch (error) {
            next(error);
        }
    });
    const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { token } = req.params;
            const verifying = yield (0, AuthDoctor_1.verifyAccount)(token, dbRepositoryDoctor);
            if (verifying) {
                return res.status(HttpStatus_1.HttpStatus.OK).json({
                    success: true,
                    message: "Account is verified ,go n login",
                });
            }
        }
        catch (error) {
            next(error);
        }
    });
    const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const { accessToken, refreshToken, isEmailExist } = yield (0, AuthDoctor_1.doctorLogin)(email, password, dbRepositoryDoctor, authService);
            return res.status(HttpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "Login successful",
                doctor: isEmailExist,
                access_token: accessToken,
                refresh_token: refreshToken,
            });
        }
        catch (error) {
            next(error);
        }
    });
    const doctorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const doctorId = req.doctor;
            if (!doctorId) {
                return res.status(400).json({ success: false, message: "Doctor ID not found" });
            }
            const doctor = yield (0, Profile_1.getDoctorProfile)(doctorId, dbRepositoryDoctor);
            res.status(200).json({ success: true, doctor });
        }
        catch (error) {
            next(error);
        }
    });
    const updateDoctorInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const doctorId = req.doctor;
            const updateData = req.body;
            const doctor = yield (0, Profile_1.updateDoctor)(doctorId, updateData, dbRepositoryDoctor);
            res
                .status(200)
                .json({ success: true, doctor, message: "KYC updated successfully" });
        }
        catch (error) {
            next(error);
        }
    });
    const doctorStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const doctorId = req.doctor;
            const doctor = yield (0, Profile_1.getDoctorProfile)(doctorId, dbRepositoryDoctor);
            res.status(200).json({ success: true, doctor });
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
    const addSlot = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { doctorId, startDate, endDate, slotTime } = req.body;
            const data = { doctorId, startDate, endDate, slotTime };
            const response = yield (0, Timeslot_1.addTimeSlot)(data, dbTimeSlotRepository);
            res.status(HttpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "slots added successfully",
                response,
            });
        }
        catch (error) {
            next(error);
        }
    });
    const getTimeSlots = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const doctorId = req.doctor;
            const timeSlots = yield (0, Timeslot_1.getTimeSlotsByDoctorId)(doctorId, dbTimeSlotRepository);
            res.status(HttpStatus_1.HttpStatus.OK).json({ success: true, timeSlots });
        }
        catch (error) {
            next(error);
        }
    });
    const deleteSlot = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            yield (0, Timeslot_1.deleteTimeSlot)(id, dbTimeSlotRepository);
            res
                .status(HttpStatus_1.HttpStatus.OK)
                .json({ success: true, message: "Slot deleted successfully" });
        }
        catch (error) {
            next(error);
        }
    });
    const getPatientList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const patients = yield (0, DoctorRead_1.getPatients)(dbBookingRepository);
            return res.status(HttpStatus_1.HttpStatus.OK).json({ success: true, patients });
        }
        catch (error) {
            next(error);
        }
    });
    const getPatientDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const patient = yield (0, DoctorRead_1.getPatientFullDetails)(id, dbBookingRepository);
            return res.status(HttpStatus_1.HttpStatus.OK).json({ success: true, patient });
        }
        catch (error) {
            next(error);
        }
    });
    const addPrescription = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId, appointmentId, prescriptionDate, medicines } = req.body;
            const data = { userId, appointmentId, prescriptionDate, medicines };
            const response = yield (0, PrescriptionUseCase_1.addPrescriptionToUser)(data, dbPrescriptionRepository);
            res
                .status(HttpStatus_1.HttpStatus.OK)
                .json({ success: true, message: "add Prescription successfully", response });
        }
        catch (error) {
            next(error);
        }
    });
    const fetchPrescription = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const data = id;
            const response = yield (0, PrescriptionUseCase_1.fetchPrescriptionForDoctor)(data, dbPrescriptionRepository);
            res.status(HttpStatus_1.HttpStatus.OK).json({ sucess: true, response });
        }
        catch (error) {
            next(error);
        }
    });
    const deletePrescription = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const prescriptionId = req.params.id;
            const response = yield (0, PrescriptionUseCase_1.deletePrescriptionData)(prescriptionId, dbPrescriptionRepository);
            res.status(HttpStatus_1.HttpStatus.OK).json({ sucess: true, response });
        }
        catch (error) {
            next(error);
        }
    });
    const receiverDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const doctor = yield (0, Profile_1.getDoctorProfile)(id, dbRepositoryDoctor);
            return res.status(HttpStatus_1.HttpStatus.OK).json({ success: true, doctor });
        }
        catch (error) {
            next(error);
        }
    });
    const userDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const user = yield (0, AdminRead_1.getSingleUser)(id, dbRepositoryUser);
            return res.status(HttpStatus_1.HttpStatus.OK).json({ success: true, user });
        }
        catch (error) {
            next(error);
        }
    });
    return {
        signup,
        verifyToken,
        login,
        doctorProfile,
        updateDoctorInfo,
        doctorStatus,
        listDepartmentsHandler,
        addSlot,
        getTimeSlots,
        deleteSlot,
        getPatientList,
        getPatientDetails,
        addPrescription,
        fetchPrescription,
        deletePrescription,
        receiverDetails,
        userDetails,
    };
};
exports.default = doctorController;
