import express from 'express'
import doctorController from '../../../Adapters/DoctorController'
import { doctorDbRepository } from '../../../App/Interfaces/DoctorDBRepository'
import { userRepositoryMongodb } from '../../Database/Repositories/UserRepositoryMongodb'
import { authService } from '../../Services/AuthService'
import { doctorRepositoryMongodb } from '../../Database/Repositories/DoctorRepositoryMongodb'
import { userDbRepository } from "../../../App/Interfaces/UserDbRepository"
import { authServiceInterface } from '../../../App/Service-interface/AuthServiceInterface'
import { authenticateDoctor } from '../Middlewares/AuthMiddleware'
import { departmentDbRepository } from '../../../App/Interfaces/DepartmentRepositoryInterface'
import { departmentRepositoryMongodb } from '../../Database/Repositories/DepartmentRepositoryMongodb'
import { timeSlotRepositoryMongodb } from '../../Database/Repositories/TimeSlotRepositoryMongodb'
import { timeSlotDbRepository } from '../../../App/Interfaces/TimeSlotDbRepository'
import { prescriptionDbRepository } from "../../../App/Interfaces/PrescriptionDbRepository";
import { PrescriptionRepositoryMongodbType, prescriptionRepositoryMongodb } from "../../Database/Repositories/PrescriptionRepositoryMongodb";

import bookingController from "../../../Adapters/BookingController";
import { bookingDbRepository } from '../../../App/Interfaces/BookingDbRepository'
import { bookingRepositoryMongodb } from '../../Database/Repositories/BookingRepositoryMongodb'


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