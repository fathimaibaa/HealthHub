import { TimeSlotEntityType } from "../../../Entities/TimeSlotEntity";
import { SlotTimeInterface, TimeSlotDataInterface } from "../../../Types/TimeSlotInterface";
import TimeSlot from "../Models/TimeSlots";



const transformSlotTime = (slotTime: TimeSlotDataInterface['slotTime']) => {
  return Object.entries(slotTime).map(([day, times]) => ({
    day: parseInt(day, 10),
    times: (times as SlotTimeInterface[]).map(time => ({
      start: time.start,
      end: time.end,
    })),
  }));
};


export const timeSlotRepositoryMongodb = () => {
  const addTimeSlots = async (doctorId:string, startDate:string, endDate:string, slotTime: TimeSlotDataInterface['slotTime']) => {
    const transformedSlotTime = transformSlotTime(slotTime);
    try {
      const newTimeSlot = await TimeSlot.create({
        doctorId: doctorId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        slots: transformedSlotTime,
        available: true,
      });
      return newTimeSlot;
    } catch (error) {
      console.error("Failed to add time slot:", error);
      throw error;
    }
  };
  




   const getSlotByTime = async (
    doctorId: string,
    time:string,
    
   ) => await TimeSlot.findOne({ doctorId:doctorId, time:time});

  
  const getAllTimeSlots = async (doctorId: string) =>
    await TimeSlot.find({ doctorId }).sort({ slotTime: -1 });

  const getAllTimeSlotsByDate = async (doctorId: string, date: Date) => {
    try {
      const timeSlots = await TimeSlot.find({
        doctorId,
        startDate: { $lte: date },
        endDate: { $gte: date }
      }).sort({ slotTime: -1 });
  
      return timeSlots;
    } catch (error) {
      console.error('Error fetching time slots:', error);
      throw error;
    }
  };

  const getAllDateSlots = async (doctorId: string) =>
    await TimeSlot.find({ doctorId  }).sort({ date: -1 });


  const removeTimeSlotbyId = async (id: string) =>
    await TimeSlot.findByIdAndDelete(id);

  const existingSlotAvailable = async (doctorId: string, startDate: any, endDate: any) => {
    return await TimeSlot.findOne({ doctorId, startDate, endDate });
}
const getAllTimeSlot = async () => await TimeSlot.find({ available: true }); 



  return {
    addTimeSlots,
    getAllTimeSlots,
    getSlotByTime,
    removeTimeSlotbyId,
    getAllDateSlots,
    existingSlotAvailable,
    getAllTimeSlotsByDate,
    getAllTimeSlot,
  };
};

export type TimeSlotRepositoryMongodbType = typeof timeSlotRepositoryMongodb;


