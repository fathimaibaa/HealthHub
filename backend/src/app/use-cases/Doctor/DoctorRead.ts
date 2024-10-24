import { BookingDbRepositoryInterface } from "../../Interfaces/BookingDbRepository";
import { userDbInterface } from "../../Interfaces/UserDbRepository";



export const getPatients = async (bookingDbRepository: ReturnType<BookingDbRepositoryInterface>) =>
  await bookingDbRepository.getAllPatients();

export const getPatientFullDetails = async (id:string,bookingDbRepository: ReturnType<BookingDbRepositoryInterface>) =>
    await bookingDbRepository.getSinglePatient(id);

export const getSingleUser = async ( id: string, userDbRepository: ReturnType<userDbInterface>) =>
  await userDbRepository.getUserbyId(id);

