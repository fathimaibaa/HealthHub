import { doctorDbInterface } from "../../interfaces/DoctorDBRepository";
import { userDbInterface } from "../../interfaces/UserDbRepository";

export const blockUser = async (
    id: string,
    userDbRepository: ReturnType<userDbInterface>
  ) => {
    const user = await userDbRepository.getUserbyId(id);
  
    await userDbRepository.updateUserBlock(id, !user?.isBlocked); 
    return user;
  };

  export const blockDoctor = async (
    id: string,
    doctorDbRepository: ReturnType<doctorDbInterface>
  ) => {
    const doctor = await doctorDbRepository.getDoctorById(id);
   
  
    await doctorDbRepository.updateDoctorBlock(id, !doctor?.isBlocked); 
    return doctor;
  };