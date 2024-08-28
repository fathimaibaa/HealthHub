import express from "express";
import userController from "../../../adapters/UserController";

import { userDbRepository } from "../../../app/interfaces/UserDbRepository";
import { authService } from "../../services/AuthService";
import { userRepositoryMongodb } from "../../database/repositories/UserRepositoryMongodb";
import { authServiceInterface } from "../../../app/service-interface/AuthServiceInterface";
import { doctorDbRepository } from "../../../app/interfaces/DoctorDBRepository";
import { doctorRepositoryMongodb } from "../../database/repositories/DoctorRepositoryMongodb";

import { timeSlotDbRepository } from "../../../app/interfaces/TimeSlotDbRepository";
import {  timeSlotRepositoryMongodb } from "../../database/repositories/TimeSlotRepositoryMongodb";

import BookingController from "../../../adapters/BookingController";
import { bookingDbRepository } from "../../../app/interfaces/BookingDbRepository";
import { bookingRepositoryMongodb } from "../../database/repositories/BookingRepositoryMongodb";
import { prescriptionDbRepository } from "../../../app/interfaces/PrescriptionDbRepository";
import { prescriptionRepositoryMongodb } from "../../database/repositories/PrescriptionRepositoryMongodb";


import { departmentDbRepository } from "../../../app/interfaces/DepartmentRepositoryInterface";
import { departmentRepositoryMongodb } from "../../database/repositories/DepartmentRepositoryMongodb";
import authenticateUser from '../middlewares/AuthMiddleware';



const userRoutes = () => {
    const router = express.Router();
    const controller = userController(
        authServiceInterface,
        authService,
        userDbRepository,
        userRepositoryMongodb,
        doctorDbRepository,
        doctorRepositoryMongodb,
        timeSlotDbRepository,
        timeSlotRepositoryMongodb,
        prescriptionDbRepository,
        prescriptionRepositoryMongodb,
       
        departmentDbRepository,
        departmentRepositoryMongodb,  
    )

    const _bookingController = BookingController(
        userDbRepository,
        userRepositoryMongodb,
        doctorDbRepository,
        doctorRepositoryMongodb,
        timeSlotDbRepository,
        timeSlotRepositoryMongodb,
        bookingDbRepository,
        bookingRepositoryMongodb,
    )









    router.post('/register',controller.registerUser)
    router.post('/verify_otp',controller.verifyOtp)
    router.post("/resend_otp",controller.resendOtp);
    router.post("/forgot_password",controller.forgotPassword);
    router.post("/reset_password/:token",controller.resetPassword);

    router.get("/profile",authenticateUser,controller.userProfile);
    router.patch("/profile/edit",authenticateUser,controller.updateUserInfo);
   

    router.post("/google_signIn", controller.googleSignIn);
    router.post("/login",controller.userLogin)
    router.get("/doctors",controller.doctorPage)
    router.get("/doctor/:id",controller.doctorDetails)

    router.get("/timeslots",authenticateUser,controller.getAllTimeSlots);
    router.get("/timeslots/:id",authenticateUser,controller.getTimeslots);
    router.get("/time-slots/:id/dates",authenticateUser,controller.getDateSlots);
    router.get('/department/list', controller.listDepartmentsHandler);

    router.post("/fetchPrescription",authenticateUser,controller.fetchPrescription);
    router.post("/uploadDocuments",authenticateUser,controller.labRecords);
router.get("/documents/:id",authenticateUser,controller.fetchDocuments);
router.delete("/documents/:id",authenticateUser,controller.deleteDocument);





  
/*  Booking Routes for booking Controller  */
router.post("/appointments",authenticateUser,_bookingController.BookAppoinment);
router.get("/allAppoinments",authenticateUser,_bookingController.getAllAppoinments);
router.patch("/payment_status/:id",authenticateUser,_bookingController.updatePaymentStatus);

router.get("/bookingdetails/:id",authenticateUser,_bookingController.getBookingDetails);
router.get("/bookings/:id",authenticateUser,_bookingController.getAllBookingDetails);
router.put("/bookingdetails/:id",authenticateUser,_bookingController.cancelAppoinment);

   
router.get("/fetchWallet/:id",authenticateUser,controller.getWallet);
router.get("/transactions", authenticateUser, controller.getTransactions);

router.post("/walletPayment",authenticateUser,_bookingController.walletPayment);
router.put("/updateWallet",authenticateUser,_bookingController.changeWalletAmount);


    



    return router
}

export default userRoutes