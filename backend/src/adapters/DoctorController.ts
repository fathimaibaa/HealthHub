import { NextFunction, Request, Response } from "express";
import { doctorDbInterface } from "../app/interfaces/DoctorDBRepository";
import { userDbInterface } from "../app/interfaces/UserDbRepository";
import {
  AuthServiceInterfaceType
} from "../app/service-interface/AuthServiceInterface";
import { HttpStatus } from "../types/HttpStatus";
import { userRepositoryMongodbType } from "../frameworks/database/repositories/UserRepositoryMongodb";
import { AuthService } from "../frameworks/services/AuthService";
import {
    addNewDoctor,
    doctorLogin,
    verifyAccount
    
  } from "../app/use-cases/Doctor/AuthDoctor";
  import { doctorRepositoryMongodbType } from "../frameworks/database/repositories/DoctorRepositoryMongodb";
import { getDoctorProfile, updateDoctor } from "../app/use-cases/Doctor/ReadnUpdate/Profile";
import { listDepartments } from "../app/use-cases/Admin/AdminDepartment";
import { IDepartmentRepository } from "../app/interfaces/DepartmentRepositoryInterface";
import { addTimeSlot, deleteTimeSlot, getTimeSlotsByDoctorId } from "../app/use-cases/Doctor/Timeslot";
import { TimeSlotDbInterface, timeSlotDbRepository } from "../app/interfaces/TimeSlotDbRepository";
import { TimeSlotRepositoryMongodbType } from "../frameworks/database/repositories/TimeSlotRepositoryMongodb";
import { getPatientFullDetails, getPatients } from "../app/use-cases/Doctor/DoctorRead";
import { bookingDbRepository, BookingDbRepositoryInterface } from "../app/interfaces/BookingDbRepository";
import { BookingRepositoryMongodbType } from "../frameworks/database/repositories/BookingRepositoryMongodb";
import { PrescriptionDbInterface } from "../app/interfaces/PrescriptionDbRepository";
import { PrescriptionRepositoryMongodbType } from "../frameworks/database/repositories/PrescriptionRepositoryMongodb";
import { addPrescriptionToUser, deletePrescriptionData, fetchPrescriptionForDoctor, fetchPrescriptionUsecase } from "../app/use-cases/Prescription/PrescriptionUseCase";
import { getSingleUser } from "../app/use-cases/Admin/AdminRead";



  const doctorController = (
    authServiceInterface: AuthServiceInterfaceType,
    authServiceImpl: AuthService,
    userDbRepository: userDbInterface,
    userRepositoryImpl: userRepositoryMongodbType,
    doctorDbRepository: doctorDbInterface,
    doctorDbRepositoryImpl: doctorRepositoryMongodbType,
    departmentDbRepository: IDepartmentRepository,
    
    departmentDbRepositoryImpl: () => any,
    timeSlotDbRepository: TimeSlotDbInterface,
    timeSlotDbRepositoryImpl: TimeSlotRepositoryMongodbType,
    prescriptionDbRepository:PrescriptionDbInterface,
    prescriptionDbRepositoryImpl:PrescriptionRepositoryMongodbType,
    
    bookingDbRepository: BookingDbRepositoryInterface,
    bookingDbRepositoryImpl: BookingRepositoryMongodbType,
    
    
      
  ) => {
    const authService = authServiceInterface(authServiceImpl());
    const dbRepositoryUser = userDbRepository(userRepositoryImpl());
    const dbRepositoryDoctor = doctorDbRepository(doctorDbRepositoryImpl());
    const dbDepartmentRepository = departmentDbRepository(departmentDbRepositoryImpl());
    const dbPrescriptionRepository = prescriptionDbRepository(prescriptionDbRepositoryImpl());
    
    const dbTimeSlotRepository = timeSlotDbRepository(timeSlotDbRepositoryImpl());
    const dbBookingRepository = bookingDbRepository(bookingDbRepositoryImpl());
   

  const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const doctordata = req.body;
      const registerDoctor = await addNewDoctor(
        doctordata,
        dbRepositoryDoctor,
        authService
      );
      if (registerDoctor) {
        return res.status(HttpStatus.OK).json({
          success: true,
          message:
            "Registration success, please verify your email that we sent to your mail",
        });
      }
    } catch (error) {
      next(error);
    }
  };

const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.params;
    const verifying = await verifyAccount(token, dbRepositoryDoctor);
    if (verifying) {
      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Account is verified ,go n login",
      });
    }
  } catch (error) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const { accessToken,refreshToken, isEmailExist } = await doctorLogin(
      email,
      password,
      dbRepositoryDoctor,
      authService
    );

    return res.status(HttpStatus.OK).json({
      success: true,
      message: "Login successful",
      doctor: isEmailExist,
      access_token: accessToken,
      refresh_token : refreshToken ,
    });
  } catch (error) {
    next(error);
  }
};



const doctorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const doctorId = req.doctor;
    if (!doctorId) {
      return res.status(400).json({ success: false, message: "Doctor ID not found" });
    }
    const doctor = await getDoctorProfile(doctorId, dbRepositoryDoctor);
    res.status(200).json({ success: true, doctor });
  } catch (error) {
    next(error);
  }
};



 
 const updateDoctorInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const doctorId = req.doctor;
    const updateData = req.body;


    const doctor = await updateDoctor(
      doctorId,
      updateData,
      dbRepositoryDoctor
    );
    res
      .status(200)
      .json({ success: true, doctor, message: "KYC updated successfully" });
  } catch (error) {
    next(error);
  }
};


 
 const doctorStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const doctorId = req.doctor;
    const doctor = await getDoctorProfile(doctorId, dbRepositoryDoctor);
    res.status(200).json({ success: true, doctor });
  } catch (error) {
    next(error);
  }
};

 
  const listDepartmentsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const departments = await listDepartments(dbDepartmentRepository);
      return res.status(HttpStatus.OK).json({ success: true, departments });
    } catch (error) {
      next(error);
    }
  };



 
   
  const addSlot = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    try {
      const { doctorId, startDate, endDate, slotTime } = req.body;
      const data = { doctorId, startDate, endDate, slotTime };
      const response = await addTimeSlot(
        data,
        dbTimeSlotRepository
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: "slots added successfully",
        response, 
      });
    } catch (error) {
      next(error);
    }
  };



  
  const getTimeSlots = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const doctorId = req.doctor;
      const timeSlots = await getTimeSlotsByDoctorId(
        doctorId,
        dbTimeSlotRepository
      );
      res.status(HttpStatus.OK).json({ success: true, timeSlots });
    } catch (error) {
      next(error);
    }
  };

  const deleteSlot = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      
      const{ id } = req.params;
      await deleteTimeSlot(id, dbTimeSlotRepository);
      res
        .status(HttpStatus.OK)
        .json({ success: true, message: "Slot deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

   
  const getPatientList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const patients = await getPatients(dbBookingRepository);
      return res.status(HttpStatus.OK).json({ success: true, patients });
    } catch (error) {
      next(error);
    }
  }



  const getPatientDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {id} = req.params;
      const patient = await getPatientFullDetails(id,dbBookingRepository);
      return res.status(HttpStatus.OK).json({ success: true, patient });
    } catch (error) {
      next(error);
    }
  }


  const addPrescription = async (
    req:Request,
    res:Response,
    next:NextFunction
  )=>{
    try {
      const {userId,appointmentId,prescriptionDate, medicines }=req.body
      const data={userId,appointmentId,prescriptionDate,medicines}
      const response = await addPrescriptionToUser(
        data,
        dbPrescriptionRepository
      );
      res
        .status(HttpStatus.OK)
        .json({ success: true, message: "add Prescription successfully",response });
    } catch (error) {
      next(error);
    }
  }

const fetchPrescription = async(
  req:Request,
  res:Response,
  next:NextFunction
)=>{
  try {
    const { id } = req.params;
    const data =  id 
    const response = await fetchPrescriptionForDoctor(data,dbPrescriptionRepository);
    res.status(HttpStatus.OK).json({sucess:true,response});
  } catch (error) {
    next(error)
  }
}


const deletePrescription = async (
  req:Request,
  res:Response,
  next:NextFunction,
)=>{
  try {
    const prescriptionId = req.params.id;
    const response = await deletePrescriptionData(prescriptionId,dbPrescriptionRepository);
    res.status(HttpStatus.OK).json({sucess:true,response});
  } catch (error) {
    next(error);
  }
}


const receiverDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
 
    const {id} = req.params;

    const doctor = await getDoctorProfile(id,dbRepositoryDoctor);
    return res.status(HttpStatus.OK).json({ success: true, doctor });
  } catch (error) {
    next(error);
  }
}
 

const userDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    
    const {id} = req.params;
    const user = await getSingleUser(id,dbRepositoryUser);
    return res.status(HttpStatus.OK).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

  return{
    signup,
    verifyToken,
    login,
    doctorProfile,
    updateDoctorInfo,
    doctorStatus,
    listDepartmentsHandler,
    addSlot,
    getTimeSlots,
    deleteSlot,
    getPatientList,
    getPatientDetails,
    addPrescription,
    fetchPrescription,
    deletePrescription,
    receiverDetails,
    userDetails,
  }
}
export default doctorController;
