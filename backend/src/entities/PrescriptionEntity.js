"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PrescriptionEntity;
function PrescriptionEntity(doctorId, userId, appointmentId, prescriptionDate, medicines) {
    return {
        doctorId: () => doctorId,
        userId: () => userId,
        appointmentId: () => appointmentId,
        prescriptionDate: () => prescriptionDate,
        medicines: () => medicines,
    };
}
