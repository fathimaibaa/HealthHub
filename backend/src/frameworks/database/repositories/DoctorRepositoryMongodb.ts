
import { doctorEntityType, googleSignInUserEntityType } from "../../../entities/DoctorEntity";
import { DoctorInterface } from "../../../types/DoctorInteface";
import Doctor from '../models/Doctor';
import department from "../models/Department";
import timeSlots from '../models/TimeSlots'
import Booking from "../models/Booking";

export const doctorRepositoryMongodb = () => {


    const getDoctorById = async(id:string) => {

       try {
        const doc =  await Doctor.findById(id).populate('department').select(
            "-password -isVerified -isApproved -verificationToken"
        ).exec();
       
        return doc
       } catch (error) {
        console.error(`Error fetching doctor with ID ${id}:`, error);
        throw error;
       }
    }


    const getDoctorByEmail = async(email:string) => {
        const doctor:DoctorInterface | null = await Doctor.findOne({
            email
        })
    return doctor
    }

    const addDoctor = async(doctorData:doctorEntityType) => {
        const newDoctor = new Doctor({
            doctorName:doctorData.getDoctorName(),
            email:doctorData.getEmail(),
            password:doctorData.getPassword(),
            verificationToken:doctorData.getVerificationToken()
        })
        return await newDoctor.save()
    }

    const verifyDoctor = async(token:string) => 
        await Doctor.findOneAndUpdate(
            {verificationToken : token },
            {isVerified:true,verificationToken:null}
        )

    const updateDoctorInfo = async (id: string, updateData:Record<string,any>)=>{

        const doc = await Doctor.findByIdAndUpdate(id,updateData,{new:true});

        return doc
    }
    
    const getDoctorByIdUpdate = async (id: string,status:string) => {
        return await Doctor.findByIdAndUpdate(id,{status:status, isApproved:true}).select("-password -isVerified -isApproved -verificationToken");}

    const updateDoctorBlock = async (id: string, status: boolean) =>{
        await Doctor.findByIdAndUpdate(id, { isBlocked: status });
      }
    
      const getAllDoctors = async () => await Doctor.find({ isVerified: true }); 

    const getDoctorByIdUpdateRejected = async (id: string,status:string,reason:string) =>await Doctor.findByIdAndUpdate(id,{status:status, isApproved:false, rejectedReason:reason}).select("-password -isVerified -isApproved -verificationToken");
    const registerGoogleSignedDoctor = async (doctor: googleSignInUserEntityType) =>
        await Doctor.create({
          doctorName: doctor.doctorName(),
          email: doctor.email(),
          profileImage: doctor.picture(),
          isVerified: doctor.email_verified(),
          
        });
        const getFilteredDoctors = async ({
            searchQuery,
            department,
            selectedDate,
            selectedTimeSlot,
            page,
            limit,
          }: {
            searchQuery?: string;
            department?: string;
            selectedDate?: string;
            selectedTimeSlot?: string;
            page: number;
            limit: number;
          }) => {
            let query: Record<string, any> = {};
          
            if (searchQuery) {
              query.doctorName = { $regex: searchQuery, $options: 'i' };
            }
          
            if (department) {
              query.department = department;
            }
          
            let doctorIds: string[] = [];
          
            if (selectedDate) {
              const date = new Date(selectedDate);
              const dateFilteredTimeSlots = await timeSlots.find({
                startDate: { $lte: date },
                endDate: { $gte: date },
                available: true,
              }).select('doctorId');
              doctorIds = dateFilteredTimeSlots.map((slot: any) => slot.doctorId.toString());
              
              if (doctorIds.length === 0) {
                return { total: 0, doctors: [] };
              }
            }
          
           
          if (selectedTimeSlot) {
          const [startTime, endTime] = selectedTimeSlot.split(' - ');
        
          const timeFilteredTimeSlots = await timeSlots.find({
            available: true,
            'slots.times.start': startTime,
            'slots.times.end': endTime,
          }).select('doctorId');
        
          const timeFilteredDoctorIds = timeFilteredTimeSlots.map((slot: any) => slot.doctorId.toString());
        
          if (selectedDate) {
            const dayOfWeek = new Date(selectedDate).getDay();
            const dateFilteredTimeSlots = await timeSlots.find({
              available: true,
              'slots.day': dayOfWeek,
            }).select('doctorId');
        
            const dateFilteredDoctorIds = dateFilteredTimeSlots.map((slot: any) => slot.doctorId.toString());
            doctorIds = doctorIds.filter(id => timeFilteredDoctorIds.includes(id) && dateFilteredDoctorIds.includes(id));
          } else {
            doctorIds = timeFilteredDoctorIds;
          }
        
          if (doctorIds.length === 0) {
            return { total: 0, doctors: [] };
          }
        }
          
            if (doctorIds.length > 0) {
              query._id = { $in: doctorIds };
            }
          
            const total = await Doctor.countDocuments(query);
            const doctors = await Doctor.find(query)
              .skip((page - 1) * limit)
              .limit(limit);
          
            return { total, doctors };
          };
          const getAllAppoinments =async () =>{
            const res = await Booking.find({ 
                appoinmentStatus: { $in: ["Booked", "Consulted"] } 
              });
              console.log(res,"@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
              return res
        } 

    return{
        getDoctorById,
        getDoctorByEmail,
        addDoctor,
        verifyDoctor,
        updateDoctorInfo,
        getDoctorByIdUpdate,
        updateDoctorBlock,
        getAllDoctors,
      
        getDoctorByIdUpdateRejected,
        registerGoogleSignedDoctor,
        getFilteredDoctors,
        getAllAppoinments
       
    }  
}

export type doctorRepositoryMongodbType = typeof doctorRepositoryMongodb;