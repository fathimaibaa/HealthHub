import TimeSlotEntity from "../../../Entities/TimeSlotEntity";
import { HttpStatus } from "../../../Types/HttpStatus";
import { TimeSlotDbInterface } from "../../Interfaces/TimeSlotDbRepository";
import { TimeSlotDataInterface } from "../../../Types/TimeSlotInterface";
import CustomError from "../../../Utils/CustomError";

export const addTimeSlot = async (
  data: any, 
  dbTimeSlotRepository: ReturnType<TimeSlotDbInterface>
) => {
  const { doctorId, startDate, endDate, slotTime } = data; 
  const existingSlot:any = await dbTimeSlotRepository.exsitingSlotAvailables(doctorId, startDate, endDate);
 
  if (existingSlot) {
    existingSlot.slotTime = [...new Set([...existingSlot.slotTime, ...slotTime])];
    await existingSlot.save();
    return { status: true, message: 'Slots updated successfully' };
  } else {
    const newSlot = await dbTimeSlotRepository.addtimeSlot(doctorId, startDate, endDate, slotTime);
    return newSlot;
  }
}



  export const getAllTimeSlotsByDoctorId = async (
    doctorId: string,
    date: any,
    dbTimeSlotRepository: ReturnType<TimeSlotDbInterface>
  ) => await dbTimeSlotRepository.getAllTimeSlotsBydate(doctorId,date);



  export const getTimeSlotsByDoctorId = async (
    doctorId: string,
    dbTimeSlotRepository: ReturnType<TimeSlotDbInterface>
  ) => await dbTimeSlotRepository.getAllTimeSlots(doctorId);
  


  export const deleteTimeSlot = async (
    timeSlotId: string,
    dbTimeSlotRepository: ReturnType<TimeSlotDbInterface>
  ) => await dbTimeSlotRepository.removeTimeSlotbyId(timeSlotId);


  export const getDateSlotsByDoctorId = async (
    doctorId: string,
    dbTimeSlotRepository: ReturnType<TimeSlotDbInterface>
  ) => await dbTimeSlotRepository.getAllDateSlots(doctorId);

  