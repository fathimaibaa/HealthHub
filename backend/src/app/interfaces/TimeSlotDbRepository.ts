import { TimeSlotRepositoryMongodbType } from "../../Frameworks/Database/Repositories/TimeSlotRepositoryMongodb";
import { TimeSlotEntityType } from "../../Entities/TimeSlotEntity";

export const timeSlotDbRepository = (
  repository: ReturnType<TimeSlotRepositoryMongodbType>
) => {
  const addtimeSlot = async (doctorId:string, startDate:string,endDate:string,slotTime:any) =>{
    const timeslot = await repository.addTimeSlots(doctorId,startDate,endDate,slotTime);
    return timeslot
  }
  

  const isTimeSlotExist = async (
    doctorId: string,
    time: string,
    date:string,
  ) => await repository.getSlotByTime(doctorId,time);

  const exsitingSlotAvailables = async (doctorId: string, startDate: any, endDate: any) => {
    return await repository.existingSlotAvailable(doctorId, startDate, endDate);
}


  const getAllTimeSlotsBydate = async (doctorId: string,date:any) =>
    await repository.getAllTimeSlotsByDate(doctorId,date);

  const getAllTimeSlots = async (doctorId: string) =>
    await repository.getAllTimeSlots(doctorId);


  const getAllDateSlots = async (doctorId: string) =>
    await repository.getAllDateSlots(doctorId);

  const removeTimeSlotbyId = async (timeSlotId: string) =>
    await repository.removeTimeSlotbyId(timeSlotId);

  const getAllTimeSlot = async () => await repository.getAllTimeSlot();
  const UpdateTheTimeslot =  async (doctorId: string, timeSlot: string , date:string) =>
    await repository.UpdateTheTimeslot(doctorId,timeSlot,date);

  return {
    addtimeSlot,
    isTimeSlotExist,
    getAllTimeSlots,
    removeTimeSlotbyId,
    getAllDateSlots,
    exsitingSlotAvailables,
    getAllTimeSlotsBydate,
    getAllTimeSlot,
    UpdateTheTimeslot
  };
};
export type TimeSlotDbInterface = typeof timeSlotDbRepository;