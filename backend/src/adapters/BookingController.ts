import { Request,Response,NextFunction } from "express";
import { doctorDbInterface } from "../app/interfaces/DoctorDBRepository";
import { doctorRepositoryMongodbType } from "../frameworks/database/repositories/DoctorRepositoryMongodb";
import { userDbInterface } from "../app/interfaces/UserDbRepository";
import { userRepositoryMongodbType } from "../frameworks/database/repositories/UserRepositoryMongodb";
import { TimeSlotDbInterface } from "../app/interfaces/TimeSlotDbRepository";
import { TimeSlotRepositoryMongodbType } from "../frameworks/database/repositories/TimeSlotRepositoryMongodb";
import { BookingDbRepositoryInterface} from "../app/interfaces/BookingDbRepository";
import { BookingRepositoryMongodbType } from "../frameworks/database/repositories/BookingRepositoryMongodb";
import { appoinmentBooking, changeAppoinmentstaus,  changeWallet,  changeWalletAmounti,  checkIsBooked, createPayment, getBookingByBookingId, getBookingByDoctorId, getBookingByUserId,  getWalletBalance,  updateBookingStatus, updateBookingStatusPayment, walletDebit } from "../app/use-cases/user/Booking/BookingUser";
import { HttpStatus } from "../types/HttpStatus";
import { getUserById } from "../app/use-cases/user/auth/UserAuth";



const BookingController=(
    userDbRepository: userDbInterface,
    userRepositoryImpl: userRepositoryMongodbType,
    doctorDbRepository: doctorDbInterface,
    doctorDbRepositoryImpl: doctorRepositoryMongodbType,
    timeSlotDbRepository: TimeSlotDbInterface,
    timeSlotDbRepositoryImpl: TimeSlotRepositoryMongodbType,
    bookingDbRepository: BookingDbRepositoryInterface,
    bookingDbRepositoryImpl: BookingRepositoryMongodbType,
)=>{
    const dbRepositoryUser = userDbRepository(userRepositoryImpl());
    const dbDoctorRepository = doctorDbRepository(doctorDbRepositoryImpl());
    const dbTimeSlotRepository = timeSlotDbRepository(timeSlotDbRepositoryImpl());
    const dbBookingRepository = bookingDbRepository(bookingDbRepositoryImpl());


    const BookAppoinment = async (
      req:Request,
      res:Response,
      next:NextFunction,
  )=>{
      try {
          const data = req.body;
          const userId = req.user;

          const checkBooking:any = await checkIsBooked(
            data,
            userId,
            dbBookingRepository,
          )

          if(checkBooking){
            res.status(HttpStatus.OK).json({
              success: false,
              message: "slot already booked select another slot",
            });
          }else {

            const createBooking = await appoinmentBooking(
                data,
                userId,
                dbBookingRepository,
                dbDoctorRepository,
                
            );


            const user = await getUserById(userId,dbRepositoryUser)
            const sessionId= await createPayment(
              user?.name!,
              user?.email!,
              createBooking.id,
              createBooking.fee,  
            );


            res.status(HttpStatus.OK).json({
                success: true,
                message: "Booking created successfully",
                id:sessionId,
              });
          }

          
      } catch (error) {
          next(error);
      }

  }


  
 


    

  const updatePaymentStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { paymentStatus } = req.body;

      const updateStatus = await updateBookingStatusPayment(
      id,
      dbBookingRepository,
      )


      await updateBookingStatus(
        id,
        paymentStatus,
        dbBookingRepository,
      );
      res
        .status(HttpStatus.OK)
        .json({ success: true, message: "Booking status updated" });
    } catch (error) {
      next(error)

    }
  }

  const cancelAppoinment = async(
    req:Request,
    res:Response,
    next:NextFunction
  )=>{
    try {
      const {appoinmentStatus} = req.body;
      const {cancelReason} = req.body;
      const {id} = req.params;

      const updateBooking = await changeAppoinmentstaus(
        appoinmentStatus,
        cancelReason,
        id,
        dbBookingRepository
      );

      res
        .status(HttpStatus.OK)
        .json({ success: true, message: "Cancel Appoinment" });

    } catch (error) {
      next(error)
    }
  }


  const getBookingDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const  data  = await getBookingByBookingId(
        id,
        dbBookingRepository
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Bookings details fetched successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  };


  
  const getAllBookingDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const  {id}  = req.params;
      const  data  = await getBookingByUserId(
        id,
        dbBookingRepository
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Bookings details fetched successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  };


  
  const getAllAppoinments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userID = req.user;
      const bookings = await getBookingByUserId(userID, dbBookingRepository);
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Bookings fetched successfully",
        bookings,
      });
    } catch (error) {
      next(error);
    }
  };


  const getAppoinmentList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const  {id}  = req.params;
      const  data  = await getBookingByDoctorId(
        id,
        dbBookingRepository
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Bookings details fetched successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  };



  const walletPayment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = req.body;
      const userId = req.user;

      const checkBooking:any = await checkIsBooked(
        data,
        userId,
        dbBookingRepository,
      )

      if(checkBooking){
        res.status(HttpStatus.OK).json({
          success: false,
          message: "slot already booked select another slot",
        });
      }else {

        const walletBalance:any|null = await getWalletBalance(userId,dbBookingRepository)

        const requiredAmount = data.fee;

        if(walletBalance >= requiredAmount){
          
          const createBooking = await appoinmentBooking(
              data,
              userId,
              dbBookingRepository,
              dbDoctorRepository,
              
          );

          const walletChange=await changeWalletAmounti(userId,requiredAmount,dbBookingRepository)
          const walletTransaction = await walletDebit(userId,requiredAmount,dbBookingRepository);

          res.status(HttpStatus.OK).json({
            success: true,
            message: "Booking successfully",
            createBooking,
          });
        }else{
          res.status(HttpStatus.OK).json({
            success: false,
            message: "Insufficient balance in wallet",
          });
        }
      }
    } catch (error) {
      next(error);
    }
  };

 const changeWalletAmount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId, fees } = req.body;

    
    
    const updateWallet = await changeWallet(
      bookingId,
      fees,
      dbBookingRepository
    );
    res.status(HttpStatus.OK).json({
      success: true,
      message: "Bookings details fetched successfully",
    });

  } catch (error) {
    next(error)

  }
}







    return {BookAppoinment,
        updatePaymentStatus,
        getBookingDetails,
        getAllBookingDetails,
        getAllAppoinments,
        cancelAppoinment,
        getAppoinmentList,
        walletPayment,
        changeWalletAmount,
        
        }
   
}

export default BookingController;


