import DoctorEntity, { doctorEntityType } from "../../../Entities/DoctorEntity";

import { CreateDoctorInterfface } from "../../../Types/DoctorInteface";
import { HttpStatus } from "../../../Types/HttpStatus";
import CustomError from "../../../Utils/CustomError";
import { doctorVerifyEmailPage } from "../../../Utils/DoctorVerifyEmailPage";
import sentMail from "../../../Utils/SendMail";
import { doctorDbInterface } from "../../Interfaces/DoctorDBRepository";
import { AuthServiceInterfaceType } from "../../Service-interface/AuthServiceInterface";


export const addNewDoctor = async(
    doctorData: CreateDoctorInterfface,
    doctorRepository:ReturnType<doctorDbInterface>,
    authService:ReturnType<AuthServiceInterfaceType>
)=>{
    const { doctorName, email,phoneNumber,password } = doctorData;
  const isEmailExist = await doctorRepository.getDoctorByEmail(email);
  if (isEmailExist)
    throw new CustomError("Email already exists", HttpStatus.BAD_REQUEST);

  const hashedPassword: string = await authService.encryptPassword(password);
  const verificationToken = authService.getRandomString(); 
  const doctor: doctorEntityType = DoctorEntity(
    doctorName,
    email,
    phoneNumber,
    hashedPassword,
    verificationToken,
  );
  const createdDoctor = await doctorRepository.addDoctor(
    doctor
  );
  if (createdDoctor) {
    const emailSubject = "Doctor verification ";
    sentMail(
      email,
      emailSubject,
      doctorVerifyEmailPage(doctorName, verificationToken)
    );
  }
  return createdDoctor;
};




export const verifyAccount = async (
  token: string,
  doctorRepository: ReturnType<doctorDbInterface>
) => {
  const updateVerification = await doctorRepository.verifyDoctor(token);
  if (!updateVerification)
    throw new CustomError("Invalid token", HttpStatus.BAD_REQUEST);
  return updateVerification;
};

export const doctorLogin = async (
  email: string,
  password: string,
  doctorRepository: ReturnType<doctorDbInterface>,
  authService: ReturnType<AuthServiceInterfaceType>
) => {
  const isEmailExist = await doctorRepository.getDoctorByEmail(email);
  if (!isEmailExist)
    throw new CustomError("Email is not existed, go nd register", HttpStatus.UNAUTHORIZED);

  if (!isEmailExist.isVerified)
    throw new CustomError("Please verify your email", HttpStatus.UNAUTHORIZED);

  if(isEmailExist.isBlocked)
    throw new CustomError("Your account is Blocked by Admin", HttpStatus.UNAUTHORIZED);

  const message =
    "Your account has not been approved by the admin yet. Please wait for approval.";

  const isPasswordMatch = await authService.comparePassword(
    password,
    isEmailExist.password
  );
  if (!isPasswordMatch)
    throw new CustomError("Wrong Password", HttpStatus.BAD_REQUEST);
  const  { accessToken, refreshToken }   = authService.doctorCreateTokens(
    isEmailExist.id,
    isEmailExist.doctorName,
    isEmailExist.role
  );
  return { accessToken, isEmailExist , refreshToken };
};


export const getDoctorProfile = async(
  doctorId : string,
  doctorRepository:ReturnType<doctorDbInterface>
)=>{
  const doctor = await doctorRepository.getDoctorById(doctorId);
  return doctor;
}

export const getDoctorById = async (
  id: string,
  doctorRepository: ReturnType<doctorDbInterface>
) => await doctorRepository.getDoctorById(id);