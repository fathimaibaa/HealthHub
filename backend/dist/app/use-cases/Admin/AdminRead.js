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
exports.getAllReports = exports.getAllTheAppoinments = exports.getDoctorRejected = exports.getDoctor = exports.getSingleUser = exports.getSingleDoctor = exports.getDoctors = exports.getAllTheDoctors = exports.getUsers = void 0;
const SendMail_1 = __importDefault(require("../../../Utils/SendMail"));
const DocRejectionEmail_1 = require("../../../Utils/DocRejectionEmail");
const getUsers = (userDbRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield userDbRepository.getAllUsers(); });
exports.getUsers = getUsers;
const getAllTheDoctors = (doctorDbRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield doctorDbRepository.getAllDoctors(); });
exports.getAllTheDoctors = getAllTheDoctors;
const getDoctors = (_a, doctorDbRepository_1) => __awaiter(void 0, [_a, doctorDbRepository_1], void 0, function* ({ searchQuery, department, selectedDate, selectedTimeSlot, page, limit }, doctorDbRepository) {
    return yield doctorDbRepository.getFilteredDoctors({
        searchQuery,
        department,
        selectedDate,
        selectedTimeSlot,
        page,
        limit
    });
});
exports.getDoctors = getDoctors;
const getSingleDoctor = (id, doctorDbRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield doctorDbRepository.getDoctorById(id); });
exports.getSingleDoctor = getSingleDoctor;
const getSingleUser = (id, userDbRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield userDbRepository.getUserbyId(id); });
exports.getSingleUser = getSingleUser;
const getDoctor = (id, status, doctorDbRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield doctorDbRepository.getDoctorByIdUpdate(id, status); });
exports.getDoctor = getDoctor;
const getDoctorRejected = (id, status, reason, doctorDbRepository) => __awaiter(void 0, void 0, void 0, function* () {
    yield doctorDbRepository.getDoctorByIdUpdateRejected(id, status, reason);
    const doctor = yield doctorDbRepository.getDoctorById(id);
    const { doctorName, email } = doctor;
    if (doctor) {
        const emailSubject = "Verification Rejected";
        (0, SendMail_1.default)(email, emailSubject, (0, DocRejectionEmail_1.doctorVerificationRejectedEmailPage)(doctorName, reason));
    }
    else {
        console.error("Doctor not found");
    }
});
exports.getDoctorRejected = getDoctorRejected;
const getAllTheAppoinments = (doctorDbRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield doctorDbRepository.getAllAppoinments(); });
exports.getAllTheAppoinments = getAllTheAppoinments;
const getAllReports = (bookingDbRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield bookingDbRepository.getReports(); });
exports.getAllReports = getAllReports;
