"use strict";
// src/entities/Booking.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = bookingEntity;
function bookingEntity(userId, doctorId, patientName, patientAge, patientGender, patientNumber, patientProblem, fee, paymentStatus, appoinmentStatus, appoinmentCancelReason, date, timeSlot) {
    return {
        getUserId: () => userId,
        getDoctorId: () => doctorId,
        getPatientName: () => patientName,
        getPatientAge: () => patientAge,
        getPatientGender: () => patientGender,
        getPatientNumber: () => patientNumber,
        getPatientProblem: () => patientProblem,
        getFee: () => fee,
        getPaymentStatus: () => paymentStatus,
        getAppoinmentStatus: () => appoinmentStatus,
        getAppoinmentCancelReason: () => appoinmentCancelReason,
        getDate: () => date,
        getTimeSlot: () => timeSlot,
    };
}
