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
exports.doctorRepositoryMongodb = void 0;
const Doctor_1 = __importDefault(require("../models/Doctor"));
const TimeSlots_1 = __importDefault(require("../models/TimeSlots"));
const Booking_1 = __importDefault(require("../models/Booking"));
const doctorRepositoryMongodb = () => {
    const getDoctorById = (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const doc = yield Doctor_1.default.findById(id).populate('department').select("-password -isVerified -isApproved -verificationToken").exec();
            return doc;
        }
        catch (error) {
            console.error(`Error fetching doctor with ID ${id}:`, error);
            throw error;
        }
    });
    const getDoctorByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
        const doctor = yield Doctor_1.default.findOne({
            email
        });
        return doctor;
    });
    const addDoctor = (doctorData) => __awaiter(void 0, void 0, void 0, function* () {
        const newDoctor = new Doctor_1.default({
            doctorName: doctorData.getDoctorName(),
            email: doctorData.getEmail(),
            password: doctorData.getPassword(),
            verificationToken: doctorData.getVerificationToken()
        });
        return yield newDoctor.save();
    });
    const verifyDoctor = (token) => __awaiter(void 0, void 0, void 0, function* () {
        return yield Doctor_1.default.findOneAndUpdate({ verificationToken: token }, { isVerified: true, verificationToken: null });
    });
    const updateDoctorInfo = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
        const doc = yield Doctor_1.default.findByIdAndUpdate(id, updateData, { new: true });
        return doc;
    });
    const getDoctorByIdUpdate = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
        return yield Doctor_1.default.findByIdAndUpdate(id, { status: status, isApproved: true }).select("-password -isVerified -isApproved -verificationToken");
    });
    const updateDoctorBlock = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
        yield Doctor_1.default.findByIdAndUpdate(id, { isBlocked: status });
    });
    const getAllDoctors = () => __awaiter(void 0, void 0, void 0, function* () { return yield Doctor_1.default.find({ isVerified: true }); });
    const getDoctorByIdUpdateRejected = (id, status, reason) => __awaiter(void 0, void 0, void 0, function* () { return yield Doctor_1.default.findByIdAndUpdate(id, { status: status, isApproved: false, rejectedReason: reason }).select("-password -isVerified -isApproved -verificationToken"); });
    const registerGoogleSignedDoctor = (doctor) => __awaiter(void 0, void 0, void 0, function* () {
        return yield Doctor_1.default.create({
            doctorName: doctor.doctorName(),
            email: doctor.email(),
            profileImage: doctor.picture(),
            isVerified: doctor.email_verified(),
        });
    });
    const getFilteredDoctors = (_a) => __awaiter(void 0, [_a], void 0, function* ({ searchQuery, department, selectedDate, selectedTimeSlot, page, limit, }) {
        let query = {};
        if (searchQuery) {
            query.doctorName = { $regex: searchQuery, $options: 'i' };
        }
        if (department) {
            query.department = department;
        }
        let doctorIds = [];
        if (selectedDate) {
            const date = new Date(selectedDate);
            const dateFilteredTimeSlots = yield TimeSlots_1.default.find({
                startDate: { $lte: date },
                endDate: { $gte: date },
                available: true,
            }).select('doctorId');
            doctorIds = dateFilteredTimeSlots.map((slot) => slot.doctorId.toString());
            if (doctorIds.length === 0) {
                return { total: 0, doctors: [] };
            }
        }
        if (selectedTimeSlot) {
            const [startTime, endTime] = selectedTimeSlot.split(' - ');
            const timeFilteredTimeSlots = yield TimeSlots_1.default.find({
                available: true,
                'slots.times.start': startTime,
                'slots.times.end': endTime,
            }).select('doctorId');
            const timeFilteredDoctorIds = timeFilteredTimeSlots.map((slot) => slot.doctorId.toString());
            if (selectedDate) {
                const dayOfWeek = new Date(selectedDate).getDay();
                const dateFilteredTimeSlots = yield TimeSlots_1.default.find({
                    available: true,
                    'slots.day': dayOfWeek,
                }).select('doctorId');
                const dateFilteredDoctorIds = dateFilteredTimeSlots.map((slot) => slot.doctorId.toString());
                doctorIds = doctorIds.filter(id => timeFilteredDoctorIds.includes(id) && dateFilteredDoctorIds.includes(id));
            }
            else {
                doctorIds = timeFilteredDoctorIds;
            }
            if (doctorIds.length === 0) {
                return { total: 0, doctors: [] };
            }
        }
        if (doctorIds.length > 0) {
            query._id = { $in: doctorIds };
        }
        const total = yield Doctor_1.default.countDocuments(query);
        const doctors = yield Doctor_1.default.find(query)
            .skip((page - 1) * limit)
            .limit(limit);
        return { total, doctors };
    });
    const getAllAppoinments = () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield Booking_1.default.find({
            appoinmentStatus: { $in: ["Booked", "Consulted"] }
        });
        console.log(res, "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        return res;
    });
    return {
        getDoctorById,
        getDoctorByEmail,
        addDoctor,
        verifyDoctor,
        updateDoctorInfo,
        getDoctorByIdUpdate,
        updateDoctorBlock,
        getAllDoctors,
        getDoctorByIdUpdateRejected,
        registerGoogleSignedDoctor,
        getFilteredDoctors,
        getAllAppoinments
    };
};
exports.doctorRepositoryMongodb = doctorRepositoryMongodb;
