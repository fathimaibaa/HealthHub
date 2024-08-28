import { Router } from "express";
import adminController from "../../../adapters/AdminController";

import { doctorDbRepository } from "../../../app/interfaces/DoctorDBRepository";
import { userDbRepository } from "../../../app/interfaces/UserDbRepository";
import { authServiceInterface } from "../../../app/service-interface/AuthServiceInterface";
import { departmentDbRepository } from "../../../app/interfaces/DepartmentRepositoryInterface";
import { departmentRepositoryMongodb } from "../../database/repositories/DepartmentRepositoryMongodb";

import { doctorRepositoryMongodb } from "../../database/repositories/DoctorRepositoryMongodb";
import { userRepositoryMongodb } from "../../database/repositories/UserRepositoryMongodb";
import { authService } from "../../services/AuthService";
import { authenticateAdmin } from "../middlewares/AuthMiddleware";
import { bookingDbRepository } from '../../../app/interfaces/BookingDbRepository'
import { bookingRepositoryMongodb } from '../../database/repositories/BookingRepositoryMongodb'




export default () => {
    const router = Router ();

    const controller = adminController(
        authServiceInterface,
        authService,
        userDbRepository,
        userRepositoryMongodb,
        bookingDbRepository,
        bookingRepositoryMongodb,
        doctorDbRepository,
        doctorRepositoryMongodb,
        departmentDbRepository,
        departmentRepositoryMongodb
        
    );

    router.post('/login',controller.adminLogin)
    router.get("/users", controller.getAllUser);
    router.patch("/block_user/:id", controller.userBlock);

    router.get("/doctors", controller.getAllDoctors);
    router.patch("/block_doctor/:id", controller.doctorBlock);
    router.get("/doctors/:id", controller.doctorDetails);
    router.patch("/update_doctor/:id", controller.updateDoctor);
    router.patch("/verify_doctor_rejection/:id",controller.rejectionDoctor);
   
    router.get('/department', controller.getAllDepartmentsHandler);
    router.post('/addDepartment', controller.addDepartmentHandler);
    router.get('/department/list', controller.listDepartmentsHandler);
    router.put('/department/:id',controller.updateDepartmentHandler); 
    router.patch('/block_department/:id', controller.blockDepartmentHandler);
    router.patch('/unblock_department/:id', controller.unblockDepartmentHandler);
    router.get("/appoinments", controller.getAllAppoinments);
    router.get("/reports",controller.getReports);


    return router
}