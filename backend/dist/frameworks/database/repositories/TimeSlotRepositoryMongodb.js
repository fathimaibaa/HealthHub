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
exports.timeSlotRepositoryMongodb = void 0;
const TimeSlots_1 = __importDefault(require("../Models/TimeSlots"));
const transformSlotTime = (slotTime) => {
    return Object.entries(slotTime).map(([day, times]) => ({
        day: parseInt(day, 10),
        times: times.map(time => ({
            start: time.start,
            end: time.end,
        })),
    }));
};
const timeSlotRepositoryMongodb = () => {
    const addTimeSlots = (doctorId, startDate, endDate, slotTime) => __awaiter(void 0, void 0, void 0, function* () {
        const transformedSlotTime = transformSlotTime(slotTime);
        try {
            const newTimeSlot = yield TimeSlots_1.default.create({
                doctorId: doctorId,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                slots: transformedSlotTime,
                available: true,
            });
            return newTimeSlot;
        }
        catch (error) {
            console.error("Failed to add time slot:", error);
            throw error;
        }
    });
    const getSlotByTime = (doctorId, time) => __awaiter(void 0, void 0, void 0, function* () { return yield TimeSlots_1.default.findOne({ doctorId: doctorId, time: time }); });
    const getAllTimeSlots = (doctorId) => __awaiter(void 0, void 0, void 0, function* () { return yield TimeSlots_1.default.find({ doctorId }).sort({ slotTime: -1 }); });
    const getAllTimeSlotsByDate = (doctorId, date) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const timeSlots = yield TimeSlots_1.default.find({
                doctorId,
                startDate: { $lte: date },
                endDate: { $gte: date }
            }).sort({ slotTime: -1 });
            return timeSlots;
        }
        catch (error) {
            console.error('Error fetching time slots:', error);
            throw error;
        }
    });
    const getAllDateSlots = (doctorId) => __awaiter(void 0, void 0, void 0, function* () { return yield TimeSlots_1.default.find({ doctorId }).sort({ date: -1 }); });
    const removeTimeSlotbyId = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield TimeSlots_1.default.findByIdAndDelete(id); });
    const existingSlotAvailable = (doctorId, startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
        return yield TimeSlots_1.default.findOne({ doctorId, startDate, endDate });
    });
    const getAllTimeSlot = () => __awaiter(void 0, void 0, void 0, function* () { return yield TimeSlots_1.default.find({ available: true }); });
    const UpdateTheTimeslot = (doctorId, timeSlot, date) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield TimeSlots_1.default.findOneAndUpdate({
                doctorId: doctorId,
                slotTime: timeSlot,
                date: new Date(date),
            }, { $set: { available: true } }, { new: true });
            return result;
        }
        catch (error) {
            console.error("Error updating timeslot availability:", error);
            throw error;
        }
    });
    return {
        addTimeSlots,
        getAllTimeSlots,
        getSlotByTime,
        removeTimeSlotbyId,
        getAllDateSlots,
        existingSlotAvailable,
        getAllTimeSlotsByDate,
        getAllTimeSlot,
        UpdateTheTimeslot
    };
};
exports.timeSlotRepositoryMongodb = timeSlotRepositoryMongodb;
