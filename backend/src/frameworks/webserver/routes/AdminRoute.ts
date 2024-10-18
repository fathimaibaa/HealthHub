import { Router } from "express";
import adminController from "../../../Adapters/AdminController";

import { doctorDbRepository } from "../../../App/Interfaces/DoctorDBRepository";
import { userDbRepository } from "../../../App/Interfaces/UserDbRepository";
import { authServiceInterface } from "../../../App/Service-interface/AuthServiceInterface";
import { departmentDbRepository } from "../../../App/Interfaces/DepartmentRepositoryInterface";
import { departmentRepositoryMongodb } from "../../Database/Repositories/DepartmentRepositoryMongodb";

import { doctorRepositoryMongodb } from "../../Database/Repositories/DoctorRepositoryMongodb";
import { userRepositoryMongodb } from "../../Database/Repositories/UserRepositoryMongodb";
import { authService } from "../../Services/AuthService";
import { authenticateAdmin } from "../Middlewares/AuthMiddleware";
import { bookingDbRepository } from '../../../App/Interfaces/BookingDbRepository'
import { bookingRepositoryMongodb } from '../../Database/Repositories/BookingRepositoryMongodb'




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
    router.get("/users",controller.getAllUser);
    router.patch("/block_user/:id",controller.userBlock);

    router.get("/doctors",controller.getAllDoctors);
    router.patch("/block_doctor/:id", controller.doctorBlock);
    router.get("/doctors/:id", controller.doctorDetails);
    router.patch("/update_doctor/:id", controller.updateDoctor);
    router.patch("/verify_doctor_rejection/:id",controller.rejectionDoctor);
   
    router.get('/department',controller.getAllDepartmentsHandler);
    router.post('/addDepartment', controller.addDepartmentHandler);
    router.get('/department/list', controller.listDepartmentsHandler);
    router.put('/department/:id',controller.updateDepartmentHandler); 
    router.patch('/block_department/:id',controller.blockDepartmentHandler);
    router.patch('/unblock_department/:id', controller.unblockDepartmentHandler);
    router.get("/appoinments", controller.getAllAppoinments);
    router.get("/reports",controller.getReports);


    return router
}