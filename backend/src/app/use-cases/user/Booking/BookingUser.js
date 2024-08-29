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
exports.changeWallet = exports.changeWalletAmounti = exports.walletDebit = exports.getWalletBalance = exports.updateBookingStatusPayment = exports.getBookingByDoctorId = exports.changeAppoinmentstaus = exports.getBookingByUserId = exports.getBookingByBookingId = exports.updateBookingStatus = exports.createPayment = exports.checkIsBooked = exports.appoinmentBooking = void 0;
const BookingEntity_1 = __importDefault(require("../../../../entities/BookingEntity"));
const Config_1 = __importDefault(require("../../../../Config"));
const stripe_1 = __importDefault(require("stripe"));
const appoinmentBooking = (data, userId, bookingDbRepository, doctorDbRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const { doctorId, patientDetails: { patientName, patientAge, patientNumber, patientGender }, consultationType, fee, paymentStatus, appoinmentStatus, appoinmentCancelReason, date, timeSlot } = data;
    const doctorDetails = yield doctorDbRepository.getDoctorById(doctorId);
    const appoinment = (0, BookingEntity_1.default)(userId, doctorId, patientName, patientAge, patientNumber, patientGender, consultationType, fee, paymentStatus, appoinmentStatus, appoinmentCancelReason, date, timeSlot);
    const booking = yield bookingDbRepository.createBooking(appoinment);
    return booking;
});
exports.appoinmentBooking = appoinmentBooking;
const checkIsBooked = (data, userId, bookingDbRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const { doctorId, patientDetails: { patientName, patientAge, patientNumber, patientGender }, consultationType, fee, paymentStatus, appoinmentStatus, appoinmentCancelReason, date, timeSlot } = data;
    const appoinment = (0, BookingEntity_1.default)(userId, doctorId, patientName, patientAge, patientNumber, patientGender, consultationType, fee, paymentStatus, appoinmentStatus, appoinmentCancelReason, date, timeSlot);
    const isBooked = yield bookingDbRepository.deleteSlot(doctorId, date, timeSlot);
    return isBooked;
});
exports.checkIsBooked = checkIsBooked;
const createPayment = (userName, email, bookingId, totalAmount) => __awaiter(void 0, void 0, void 0, function* () {
    const stripe = new stripe_1.default("sk_test_51Phr0W2MEaCJUhJikIT3TUIPISmQMTP7CA1UQ8rxmRrlIamjTe6eHl444qrEYfu501UcongTiXsyUlNyA4UyIn8H00kc40OSMB");
    const customer = yield stripe.customers.create({
        name: userName,
        email: email,
        address: {
            line1: "Los Angeles, LA",
            country: "US",
        },
    });
    const session = yield stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer: customer.id,
        line_items: [
            {
                price_data: {
                    currency: "inr",
                    product_data: { name: "Guests", description: "Doctor booking" },
                    unit_amount: Math.round(totalAmount * 100),
                },
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: `${Config_1.default.CLIENT_PORT}/payment_status/${bookingId}?success=true`,
        cancel_url: `${Config_1.default.CLIENT_PORT}/payment_status/${bookingId}?success=false`,
    });
    return session.id;
});
exports.createPayment = createPayment;
const updateBookingStatus = (id, paymentStatus, bookingRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingStatus = paymentStatus === "Paid" ? "Confirmed" : "Pending";
    const updationData = {
        paymentStatus,
        bookingStatus,
    };
    const bookingData = yield bookingRepository.updateBookingDetails(id, updationData);
    return bookingData;
});
exports.updateBookingStatus = updateBookingStatus;
const getBookingByBookingId = (bookingID, bookingRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingDetails = yield bookingRepository.getBookingById(bookingID);
    return { bookingDetails };
});
exports.getBookingByBookingId = getBookingByBookingId;
const getBookingByUserId = (userId, bookingRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingDetails = yield bookingRepository.getAllBookingByUserId(userId);
    return { bookingDetails };
});
exports.getBookingByUserId = getBookingByUserId;
const changeAppoinmentstaus = (appoinmentStatus, cancelReason, id, bookingRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const changeStatus = yield bookingRepository.changeBookingstatus(appoinmentStatus, cancelReason, id);
    const booking = yield bookingRepository.getBookingById(id);
    const fee = booking === null || booking === void 0 ? void 0 : booking.fee;
    const UserId = booking === null || booking === void 0 ? void 0 : booking.userId;
    const changeWalletAmount = yield bookingRepository.changeWallet(fee, UserId);
    const walletTransaction = yield bookingRepository.creditAmount(fee, UserId);
    return { changeStatus,
        changeWalletAmount
    };
});
exports.changeAppoinmentstaus = changeAppoinmentstaus;
const getBookingByDoctorId = (doctorId, bookingRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingDetails = yield bookingRepository.getAllBookingByDoctorId(doctorId);
    return { bookingDetails };
});
exports.getBookingByDoctorId = getBookingByDoctorId;
const updateBookingStatusPayment = (id, bookingRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const status = yield bookingRepository.changeBookingstatusPayment(id);
    return status;
});
exports.updateBookingStatusPayment = updateBookingStatusPayment;
const getWalletBalance = (userId, bookingRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const balance = yield bookingRepository.getBalanceAmount(userId);
    return balance;
});
exports.getWalletBalance = getWalletBalance;
const walletDebit = (userId, Amount, bookingRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const debit = yield bookingRepository.debitAmount(userId, Amount);
});
exports.walletDebit = walletDebit;
const changeWalletAmounti = (UserId, fees, bookingRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const changeupdated = yield bookingRepository.changeTheWalletAmount(fees, UserId);
});
exports.changeWalletAmounti = changeWalletAmounti;
const changeWallet = (bookingId, fees, bookingRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield bookingRepository.getBookingById(bookingId);
    const UserId = booking === null || booking === void 0 ? void 0 : booking.userId;
    const changeupdated = yield bookingRepository.changeTheWalletAmount(fees, UserId);
});
exports.changeWallet = changeWallet;
