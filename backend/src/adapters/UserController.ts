import { NextFunction, Request, Response } from "express";
import asynchandler from "express-async-handler";
import { userDbInterface } from "../App/Interfaces/UserDbRepository";
import { AuthServiceInterfaceType } from "../App/Service-interface/AuthServiceInterface";
import { HttpStatus } from "../Types/HttpStatus";
import { IDepartmentRepository } from "../App/Interfaces/DepartmentRepositoryInterface";
import { listDepartments } from "../App/Use-cases/Admin/AdminDepartment";

import {
    
    userRegister,
  verifyOtpUser,
  deleteOtp,
  login,
  sendResetVerificationCode,
  verifyTokenAndRestPassword,
  authenticateGoogleSignInUser
 

    
  } from "../App/Use-cases/User/Auth/UserAuth";
import { userRepositoryMongodbType } from "../Frameworks/Database/Repositories/UserRepositoryMongodb";
import { GoogleResponseType } from "../Types/GoogleResponseType";

import { AuthService } from "../Frameworks/Services/AuthService";
import {doctorRepositoryMongodbType} from '../Frameworks/Database/Repositories/DoctorRepositoryMongodb'
import {doctorDbInterface} from '../App/Interfaces/DoctorDBRepository'
import { getDoctors,getSingleDoctor } from "../App/Use-cases/Admin/AdminRead";
import { TimeSlotDbInterface } from "../App/Interfaces/TimeSlotDbRepository";
import { TimeSlotRepositoryMongodbType } from "../Frameworks/Database/Repositories/TimeSlotRepositoryMongodb";
import { getDateSlotsByDoctorId, getTimeSlotsByDoctorId, getTimeSlotsByDoctorIdAndDate } from "../App/Use-cases/Doctor/Timeslot";
import { getUserProfile, getWalletUser, updateUser, WalletTransactions } from "../App/Use-cases/User/Auth/Read&Update/Profile";
import { fetchPrescriptionUsecase,uploadLabDocuments,getDocuments, deleteSingleDocument } from "../App/Use-cases/Prescription/PrescriptionUseCase";
import { PrescriptionDbInterface } from "../App/Interfaces/PrescriptionDbRepository";
import { PrescriptionRepositoryMongodbType } from "../Frameworks/Database/Repositories/PrescriptionRepositoryMongodb";



const userController =(
  authServiceInterface: AuthServiceInterfaceType,
  authServiceImpl: AuthService,
    userDbRepository: userDbInterface,
    userRepositoryImpl: userRepositoryMongodbType,
   doctorDbRepository: doctorDbInterface,
    doctorDbRepositoryImpl: doctorRepositoryMongodbType,
    timeSlotDbRepository: TimeSlotDbInterface,
    timeSlotDbRepositoryImpl: TimeSlotRepositoryMongodbType,
    prescriptionDbRepository:PrescriptionDbInterface,
    prescriptionDbRepositoryImpl:PrescriptionRepositoryMongodbType,
    
    departmentDbRepository: IDepartmentRepository,
  departmentDbRepositoryImpl: () => any,
 

  ) => {
    const authService = authServiceInterface(authServiceImpl());
      const dbRepositoryUser = userDbRepository(userRepositoryImpl());
    const dbDoctorRepository = doctorDbRepository(doctorDbRepositoryImpl());
    const dbDepartmentRepository = departmentDbRepository(departmentDbRepositoryImpl());
    const dbPrescriptionRepository = prescriptionDbRepository(prescriptionDbRepositoryImpl());
   
    const dbTimeSlotRepository = timeSlotDbRepository(timeSlotDbRepositoryImpl());
   
    

 const registerUser = async( req:Request,res:Response,next:NextFunction ) =>{
    try{
        const user = req.body;
        const newUser =   await userRegister(user,dbRepositoryUser,authService);
        res.json({
           message: "User registration successful,please verify your email",
           newUser,
        });
       } catch (error) {
        next(error);
    }
}
const verifyOtp = async (req: Request, res: Response,next:NextFunction)=>{
  try{
      const {otp,userId} = req.body;
      const isVerified = await verifyOtpUser(otp,userId,dbRepositoryUser);
      if(isVerified){
          return res.status(HttpStatus.OK)
          .json({message:"User account verified, please login"});
      }
  }catch(error){
      next(error);
  }
}


 const resendOtp = async (req:Request,res:Response,next:NextFunction)=>{
  try{
      const {userId} = req.body;
      await deleteOtp(userId,dbRepositoryUser,authService);
      res.json({message:"New otp sent to mail"});
  }catch(error){
      next(error);
  }
};



    


    const userLogin = asynchandler(
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { accessToken,refreshToken, isEmailExist } = await login(
            req.body,
            dbRepositoryUser,
            authService
          );
          
          res
          .status(HttpStatus.OK)
          .json({ message: "login success", user: isEmailExist ,
          access_token: accessToken,
          refresh_token : refreshToken ,
          });
      } catch (error) {
        next(error);
      }
    }
    ); 

const forgotPassword = async (req:Request,res:Response,next :NextFunction)=> {
  try {
      
      const {email} = req.body;
      await sendResetVerificationCode(email,dbRepositoryUser,authService);

      return res.status(HttpStatus.OK).json({
          success:true,
          message : "Reset password is send to your email,check it"
      })
      
  } catch (error) {
     
      next(error)
  }
}


const resetPassword = async(req:Request,res:Response,next :NextFunction) => {
  try {
      const {password} = req.body;
      const {token} = req.params;
      await verifyTokenAndRestPassword(token,password,dbRepositoryUser,authService)
      return res.status(HttpStatus.OK).json({
          success:true,
          message: "Reset password success,you can login with your new password",
      })
      
  } catch (error) {
      next (error)
  }
}


const doctorPage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { searchQuery, department, selectedDate, selectedTimeSlot} = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 8;
    

    const searchQueryStr = searchQuery as string | undefined;
    const departmentStr = department as string | undefined;
    const selectedDateStr = selectedDate as string | undefined;
    const selectedTimeSlotStr = selectedTimeSlot as string | undefined;
    
    
    const doctors = await getDoctors({
      searchQuery: searchQueryStr,
      department: departmentStr,
      selectedDate: selectedDateStr,
      selectedTimeSlot: selectedTimeSlotStr,
      page,
      limit,
    }, dbDoctorRepository);

    return res.status(200).json({ success: true, ...doctors });
  } catch (error) {
    next(error);
  }
};

 const doctorDetails = async(req:Request,res:Response,next:NextFunction)=>{
  try {
      const {id} = req.params;
      const doctor = await getSingleDoctor(id,dbDoctorRepository);
      return res.status(HttpStatus.OK).json({success:true, doctor})
      
  } catch (error) {
      next(error)
  }
}

  const googleSignIn = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userData: GoogleResponseType= req.body.user;
      const { accessToken,refreshToken, isEmailExist, createdUser } =
        await authenticateGoogleSignInUser(
          userData,
          dbRepositoryUser,
          authService
        );
      const user = isEmailExist ? isEmailExist : createdUser;
      res.status(HttpStatus.OK).json({ message: "login success", user , access_token: accessToken,refresh_token:refreshToken});
    } catch (error) {
      next(error);
    }
  };

// const getAllTimeSlots = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const timeslots = await getAllTimeSlot(dbTimeSlotRepository);
//     return res.status(HttpStatus.OK).json({ success: true, timeslots });
//   } catch (error) {
//     next(error);
//   }
// };


const getTimeslots = async(
  req:Request,
  res:Response,
  next:NextFunction
)=>{
  try{
  const {id} = req.params;
  const {date} = req.query; 

  const timeSlots = await getTimeSlotsByDoctorId(
    id,
    dbTimeSlotRepository
  )
  res.status(HttpStatus.OK).json({ success: true, timeSlots });
}catch (error) {
  next(error);
}
}


const getDateSlots = async(
  req:Request,
  res:Response,
  next:NextFunction
)=>{
  try{
  const {id} = req.params;
  const { date }  = req.query ;
  const dateString = date as string;
  if (date) {
    // Fetch time slots for a specific date
    const timeSlots = await getTimeSlotsByDoctorIdAndDate(id, dateString, dbTimeSlotRepository);
    return res.status(HttpStatus.OK).json({ success: true, timeSlots });
  } else {
    // Fetch all dates
    const dateSlots = await getDateSlotsByDoctorId(id, dbTimeSlotRepository);
    return res.status(HttpStatus.OK).json({ success: true, dateSlots });
  }
}catch (error) {
  next(error);
}
}

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

const userProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user;
    const user  = await getUserProfile(
      userId,
      dbRepositoryUser
    );
    
    res.status(200).json({ success: true, user});
  } catch (error) {
    next(error);
  }
};


 const updateUserInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user;
    const updateData = req.body;
    const user = await updateUser(userId, updateData, dbRepositoryUser);
    res
      .status(200)
      .json({ success: true, user, message: "Profile updated successfully" });
  } catch (error) {
    next(error);
  }
};



const fetchPrescription = async(
  req:Request,
  res:Response,
  next:NextFunction
)=>{
  try {
    const {appoinmentId} = req.body;
    const data = {appoinmentId}
    const response = await fetchPrescriptionUsecase(data,dbPrescriptionRepository);
    res.status(HttpStatus.OK).json({sucess:true,response});
  } catch (error) {
    next(error)
  }
}


const labRecords = async(
  req:Request,
  res:Response,
  next:NextFunction
)=>{
  try {
    const {documents} = req.body;
    const {id} = req.body
    const data = documents;
    const appoinmentId = id;
    const response = await uploadLabDocuments(appoinmentId,data,dbPrescriptionRepository);
    res.status(HttpStatus.OK).json({sucess:true,response});
  } catch (error) {
    next(error);
  }
}
const fetchDocuments = async(
  req:Request,
  res:Response,
  next:NextFunction
)=>{
  try {
    const {id} = req.params;
   const documents = await getDocuments(
    id,
    dbPrescriptionRepository,
  )
  res.status(HttpStatus.OK).json({success:true, documents}) 
  } catch (error) {
    next(error)
  }
}

const deleteDocument = async(
  req:Request,
  res:Response,
  next:NextFunction,
)=>{
  try {
    const id = req.params.id;
    const response = await deleteSingleDocument(id,dbPrescriptionRepository)
    
    res.status(HttpStatus.OK).json({success:true, response}) 
  } catch (error) {
    next(error);
  }
}




const getWallet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {id} = req.params;
    
    const getWallet = await getWalletUser(id,dbRepositoryUser);
    res.status(200).json({ success: true, getWallet});
  } catch (error) {
    next(error);
  }
};


 

const getTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user;
    const transaction = await WalletTransactions(userId, dbRepositoryUser);
    res.status(200).json({
      success: true,
      transaction,
      message: "Transactions fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};


return {
    registerUser,
    verifyOtp,
    resendOtp,
    userLogin,
    forgotPassword,
    resetPassword,
    doctorPage,
    doctorDetails,
    googleSignIn,
    // getAllTimeSlots,
    getTimeslots,
    getDateSlots,
    listDepartmentsHandler,
    userProfile,
    updateUserInfo,
    fetchPrescription,
    labRecords,
    fetchDocuments,
    deleteDocument,
    getWallet,
    getTransactions

    };

}
export default userController
  