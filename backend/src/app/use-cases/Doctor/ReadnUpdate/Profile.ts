import { DoctorInterface } from '../../../../Types/DoctorInteface';
import { doctorDbInterface } from '../../../Interfaces/DoctorDBRepository';

export const getDoctorProfile = async(doctorID :string,DoctorRepository:ReturnType<doctorDbInterface>)=>{
    const doctor = await DoctorRepository.getDoctorById(doctorID);
    return doctor ;
}

export const   updateDoctor = async (
    doctorID: string,
    updateData: DoctorInterface,
    doctorRepository: ReturnType<doctorDbInterface>
  ) => {

    return await doctorRepository.updateProfile(doctorID, updateData);
}

