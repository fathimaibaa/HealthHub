import { TimeSlotDbInterface } from "../../../interfaces/TimeSlotDbRepository";


export const getAllTimeSlot = async (timeSlotDbRepository: ReturnType<TimeSlotDbInterface>) =>
    await timeSlotDbRepository.getAllTimeSlot();