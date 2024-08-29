"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TimeSlotEntity;
function TimeSlotEntity(doctorId, startDate, endDate, slotTime, isAvailable = true) {
    return {
        doctorId: () => doctorId,
        startDate: () => startDate,
        endDate: () => endDate,
        slotTime: () => slotTime,
        isAvailable: () => isAvailable,
    };
}
