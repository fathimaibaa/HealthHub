import { doctorEntityType, googleSignInUserEntityType } from "../../Entities/DoctorEntity";
import { doctorRepositoryMongodbType } from "../../Frameworks/Database/Repositories/DoctorRepositoryMongodb";
import { DoctorInterface } from "../../Types/DoctorInteface";


interface DoctorFilterParams {
    searchQuery?: string;
    department?: string;
    selectedDate?: string;
    selectedTimeSlot?: string;
    page: number;
    limit: number;
  }


export const doctorDbRepository = (repository:ReturnType<doctorRepositoryMongodbType>) => {

    const getDoctorById = async(id:string)=>       
         await repository.getDoctorById(id);
        
    const getDoctorByEmail = async(email:string) => 
        await repository.getDoctorByEmail(email)
    
    const addDoctor = async(doctorData:doctorEntityType) => 
       await  repository.addDoctor(doctorData)
    
    const verifyDoctor = async(token:string) => 
        await repository.verifyDoctor(token)

    const updateProfile = async (doctorID:string, doctorData : Record<string,any>)=>{
        return await repository.updateDoctorInfo(doctorID,doctorData);}

    const getAllDoctors =  async () => await repository.getAllDoctors();

    const updateDoctorBlock = async (id:string,status:boolean) => await repository.updateDoctorBlock(id, status);

    const getDoctorByIdUpdate =  async (id: string, action:string) =>{
        return await repository.getDoctorByIdUpdate(id,action);
    }

    const getAllAppoinments = async () => await repository.getAllAppoinments();

    const getDoctorByIdUpdateRejected = async (id: string, status:string,reason:string) =>await repository.getDoctorByIdUpdateRejected(id,status,reason);


    const registerGoogleSignedDoctor = async (doctor: googleSignInUserEntityType) =>await repository.registerGoogleSignedDoctor(doctor);

    // Update the function signature to use the defined type
const getFilteredDoctors = async ({
    searchQuery,
    department,
    selectedDate,
    selectedTimeSlot,
    page,
    limit,
  }: DoctorFilterParams) => 
    await repository.getFilteredDoctors({
      searchQuery,
      department,
      selectedDate,
      selectedTimeSlot,
      page,
      limit,
    });
    
    return{
        getDoctorById,
        getDoctorByEmail,
        addDoctor,
        verifyDoctor,
        updateProfile,
        getAllDoctors,
        updateDoctorBlock,
        getDoctorByIdUpdate,
        registerGoogleSignedDoctor,
        getDoctorByIdUpdateRejected,
        getFilteredDoctors,
        getAllAppoinments
        
    }


}

export type doctorDbInterface = typeof doctorDbRepository