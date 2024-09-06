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

    router.post('/login',authenticateAdmin,controller.adminLogin)
    router.get("/users", authenticateAdmin,controller.getAllUser);
    router.patch("/block_user/:id", authenticateAdmin,controller.userBlock);

    router.get("/doctors", authenticateAdmin,controller.getAllDoctors);
    router.patch("/block_doctor/:id",authenticateAdmin, controller.doctorBlock);
    router.get("/doctors/:id",authenticateAdmin, controller.doctorDetails);
    router.patch("/update_doctor/:id",authenticateAdmin, controller.updateDoctor);
    router.patch("/verify_doctor_rejection/:id",authenticateAdmin,controller.rejectionDoctor);
   
    router.get('/department', authenticateAdmin,controller.getAllDepartmentsHandler);
    router.post('/addDepartment',authenticateAdmin, controller.addDepartmentHandler);
    router.get('/department/list',authenticateAdmin, controller.listDepartmentsHandler);
    router.put('/department/:id',authenticateAdmin,controller.updateDepartmentHandler); 
    router.patch('/block_department/:id', authenticateAdmin,controller.blockDepartmentHandler);
    router.patch('/unblock_department/:id',authenticateAdmin, controller.unblockDepartmentHandler);
    router.get("/appoinments",authenticateAdmin, controller.getAllAppoinments);
    router.get("/reports",authenticateAdmin,controller.getReports);


    return router
}