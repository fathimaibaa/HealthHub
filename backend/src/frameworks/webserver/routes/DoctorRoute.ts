import express from 'express'
import doctorController from '../../../adapters/DoctorController'
import { doctorDbRepository } from '../../../app/interfaces/DoctorDBRepository'
import { userRepositoryMongodb } from '../../database/repositories/UserRepositoryMongodb'
import { authService } from '../../services/AuthService'
import { doctorRepositoryMongodb } from '../../database/repositories/DoctorRepositoryMongodb'
import { userDbRepository } from "../../../app/interfaces/UserDbRepository"
import { authServiceInterface } from '../../../app/service-interface/AuthServiceInterface'
import { authenticateDoctor } from '../middlewares/AuthMiddleware'
import { departmentDbRepository } from '../../../app/interfaces/DepartmentRepositoryInterface'
import { departmentRepositoryMongodb } from '../../database/repositories/DepartmentRepositoryMongodb'
import { timeSlotRepositoryMongodb } from '../../database/repositories/TimeSlotRepositoryMongodb'
import { timeSlotDbRepository } from '../../../app/interfaces/TimeSlotDbRepository'
import { prescriptionDbRepository } from "../../../app/interfaces/PrescriptionDbRepository";
import { PrescriptionRepositoryMongodbType, prescriptionRepositoryMongodb } from "../../database/repositories/PrescriptionRepositoryMongodb";

import bookingController from "../../../adapters/BookingController";
import { bookingDbRepository } from '../../../app/interfaces/BookingDbRepository'
import { bookingRepositoryMongodb } from '../../database/repositories/BookingRepositoryMongodb'


const doctorRoutes = () => {
    const router = express.Router();
    const controller = doctorController(
        authServiceInterface,
        authService,
        userDbRepository,
        userRepositoryMongodb,
        doctorDbRepository,
        doctorRepositoryMongodb,
        departmentDbRepository,
        departmentRepositoryMongodb,
        timeSlotDbRepository,
        timeSlotRepositoryMongodb,
        prescriptionDbRepository,
        prescriptionRepositoryMongodb,
        bookingDbRepository,
        bookingRepositoryMongodb,
       
    )

    const _bookingController = bookingController(
        userDbRepository,
        userRepositoryMongodb,
        doctorDbRepository,
        doctorRepositoryMongodb,
        timeSlotDbRepository,
        timeSlotRepositoryMongodb,
        bookingDbRepository,
       bookingRepositoryMongodb
       
    )



    router.post('/register',controller.signup);
    router.post('/verify-token/:token',controller.verifyToken);
    router.post("/login", controller.login);
    
    router.get("/profile",authenticateDoctor,controller.doctorProfile);
    router.get('/department/list', controller.listDepartmentsHandler);
   
    router.patch("/profile/edit",authenticateDoctor,controller.updateDoctorInfo);
    router.get("/status",authenticateDoctor,controller.doctorStatus);
    

    router.post("/addSlot",authenticateDoctor,controller.addSlot);

    router.post("/getTimeSlots",authenticateDoctor,controller.getTimeSlots);
    router.delete("/deleteSlot/:id",authenticateDoctor,controller.deleteSlot);
    router.get("/patients",authenticateDoctor,controller.getPatientList);
    router.get("/patients/:id",authenticateDoctor,controller.getPatientDetails);
   

    router.post("/addPrescription",authenticateDoctor,controller.addPrescription);
    router.get("/prescription/:id",authenticateDoctor,controller.fetchPrescription);
    router.delete("/prescription/:id",authenticateDoctor,controller.deletePrescription);
    

    router.get("/bookingdetails/:id",authenticateDoctor,_bookingController.getAppoinmentList)
    router.get("/user/:id", authenticateDoctor,controller.userDetails);


    return router
} 

export default doctorRoutes