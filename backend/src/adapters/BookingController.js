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
const BookingUser_1 = require("../app/use-cases/user/Booking/BookingUser");
const HttpStatus_1 = require("../types/HttpStatus");
const UserAuth_1 = require("../app/use-cases/user/auth/UserAuth");
const BookingController = (userDbRepository, userRepositoryImpl, doctorDbRepository, doctorDbRepositoryImpl, timeSlotDbRepository, timeSlotDbRepositoryImpl, bookingDbRepository, bookingDbRepositoryImpl) => {
    const dbRepositoryUser = userDbRepository(userRepositoryImpl());
    const dbDoctorRepository = doctorDbRepository(doctorDbRepositoryImpl());
    const dbTimeSlotRepository = timeSlotDbRepository(timeSlotDbRepositoryImpl());
    const dbBookingRepository = bookingDbRepository(bookingDbRepositoryImpl());
    const BookAppoinment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = req.body;
            const userId = req.user;
            const checkBooking = yield (0, BookingUser_1.checkIsBooked)(data, userId, dbBookingRepository);
            if (checkBooking) {
                res.status(HttpStatus_1.HttpStatus.OK).json({
                    success: false,
                    message: "slot already booked select another slot",
                });
            }
            else {
                const createBooking = yield (0, BookingUser_1.appoinmentBooking)(data, userId, dbBookingRepository, dbDoctorRepository);
                const user = yield (0, UserAuth_1.getUserById)(userId, dbRepositoryUser);
                const sessionId = yield (0, BookingUser_1.createPayment)(user === null || user === void 0 ? void 0 : user.name, user === null || user === void 0 ? void 0 : user.email, createBooking.id, createBooking.fee);
                res.status(HttpStatus_1.HttpStatus.OK).json({
                    success: true,
                    message: "Booking created successfully",
                    id: sessionId,
                });
            }
        }
        catch (error) {
            next(error);
        }
    });
    const updatePaymentStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { paymentStatus } = req.body;
            const updateStatus = yield (0, BookingUser_1.updateBookingStatusPayment)(id, dbBookingRepository);
            yield (0, BookingUser_1.updateBookingStatus)(id, paymentStatus, dbBookingRepository);
            res
                .status(HttpStatus_1.HttpStatus.OK)
                .json({ success: true, message: "Booking status updated" });
        }
        catch (error) {
            next(error);
        }
    });
    const cancelAppoinment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { appoinmentStatus } = req.body;
            const { cancelReason } = req.body;
            const { id } = req.params;
            const updateBooking = yield (0, BookingUser_1.changeAppoinmentstaus)(appoinmentStatus, cancelReason, id, dbBookingRepository);
            res
                .status(HttpStatus_1.HttpStatus.OK)
                .json({ success: true, message: "Cancel Appoinment" });
        }
        catch (error) {
            next(error);
        }
    });
    const getBookingDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const data = yield (0, BookingUser_1.getBookingByBookingId)(id, dbBookingRepository);
            res.status(HttpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "Bookings details fetched successfully",
                data,
            });
        }
        catch (error) {
            next(error);
        }
    });
    const getAllBookingDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const data = yield (0, BookingUser_1.getBookingByUserId)(id, dbBookingRepository);
            res.status(HttpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "Bookings details fetched successfully",
                data,
            });
        }
        catch (error) {
            next(error);
        }
    });
    const getAllAppoinments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userID = req.user;
            const bookings = yield (0, BookingUser_1.getBookingByUserId)(userID, dbBookingRepository);
            res.status(HttpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "Bookings fetched successfully",
                bookings,
            });
        }
        catch (error) {
            next(error);
        }
    });
    const getAppoinmentList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const data = yield (0, BookingUser_1.getBookingByDoctorId)(id, dbBookingRepository);
            res.status(HttpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "Bookings details fetched successfully",
                data,
            });
        }
        catch (error) {
            next(error);
        }
    });
    const walletPayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = req.body;
            const userId = req.user;
            const checkBooking = yield (0, BookingUser_1.checkIsBooked)(data, userId, dbBookingRepository);
            if (checkBooking) {
                res.status(HttpStatus_1.HttpStatus.OK).json({
                    success: false,
                    message: "slot already booked select another slot",
                });
            }
            else {
                const walletBalance = yield (0, BookingUser_1.getWalletBalance)(userId, dbBookingRepository);
                const requiredAmount = data.fee;
                if (walletBalance >= requiredAmount) {
                    const createBooking = yield (0, BookingUser_1.appoinmentBooking)(data, userId, dbBookingRepository, dbDoctorRepository);
                    const walletChange = yield (0, BookingUser_1.changeWalletAmounti)(userId, requiredAmount, dbBookingRepository);
                    const walletTransaction = yield (0, BookingUser_1.walletDebit)(userId, requiredAmount, dbBookingRepository);
                    res.status(HttpStatus_1.HttpStatus.OK).json({
                        success: true,
                        message: "Booking successfully",
                        createBooking,
                    });
                }
                else {
                    res.status(HttpStatus_1.HttpStatus.OK).json({
                        success: false,
                        message: "Insufficient balance in wallet",
                    });
                }
            }
        }
        catch (error) {
            next(error);
        }
    });
    const changeWalletAmount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { bookingId, fees } = req.body;
            const updateWallet = yield (0, BookingUser_1.changeWallet)(bookingId, fees, dbBookingRepository);
            res.status(HttpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "Bookings details fetched successfully",
            });
        }
        catch (error) {
            next(error);
        }
    });
    return { BookAppoinment,
        updatePaymentStatus,
        getBookingDetails,
        getAllBookingDetails,
        getAllAppoinments,
        cancelAppoinment,
        getAppoinmentList,
        walletPayment,
        changeWalletAmount,
    };
};
exports.default = BookingController;
