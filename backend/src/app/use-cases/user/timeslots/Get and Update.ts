import { TimeSlotDbInterface } from "../../../Interfaces/TimeSlotDbRepository";


export const getAllTimeSlot = async (timeSlotDbRepository: ReturnType<TimeSlotDbInterface>) =>
    await timeSlotDbRepository.getAllTimeSlot();