import { Request } from "express";
import { BookingDbRepositoryInterface } from "../../interfaces/BookingDbRepository";



export const getPatients = async (bookingDbRepository: ReturnType<BookingDbRepositoryInterface>) =>
  await bookingDbRepository.getAllPatients();

export const getPatientFullDetails = async (id:string,bookingDbRepository: ReturnType<BookingDbRepositoryInterface>) =>
    await bookingDbRepository.getSinglePatient(id);

