

import Stripe from "stripe";
import configKeys from "../../../../Config";
import bookingEntity from "../../../../Entities/BookingEntity";
import { BookingDbRepositoryInterface } from "../../../Interfaces/BookingDbRepository";
import { doctorDbInterface } from "../../../Interfaces/DoctorDBRepository";



export const appoinmentBooking = async(
    data: any,
    userId: string,
    bookingDbRepository: ReturnType<BookingDbRepositoryInterface>,
    doctorDbRepository: ReturnType<doctorDbInterface>,
)=>{
    const { doctorId,  patientName, patientAge,patientGender, patientNumber, patientProblem ,  fee, paymentStatus,appoinmentStatus,appoinmentCancelReason, date, timeSlot } = data;
    const doctorDetails = await doctorDbRepository.getDoctorById(doctorId);
    const appoinment = bookingEntity(
        userId,
        doctorId,
        patientName,
        patientAge,
        patientGender,
        patientNumber,
        patientProblem,
        fee,
        paymentStatus,
        appoinmentStatus,
        appoinmentCancelReason,
        date,
        timeSlot,

    );

    const booking = await bookingDbRepository.createBooking(appoinment);
    return booking;
}


export const checkIsBooked = async(
  data: any,
  userId:any,
  bookingDbRepository: ReturnType<BookingDbRepositoryInterface>,
)=>{
  const { doctorId, patientName, patientAge,patientGender, patientNumber, patientProblem ,  fee, paymentStatus,appoinmentStatus,appoinmentCancelReason, date, timeSlot } = data;


  const Booking = await bookingDbRepository.checkBookingStatus(doctorId,date,timeSlot)

  let temp:boolean = false

  if(Booking?.appoinmentStatus === "Cancelled"){
      temp=false
  }else if(Booking?.appoinmentStatus === "Booked"){
    temp=true
  }
  
  return temp

  // const appoinment = bookingEntity(
  //     userId,
  //     doctorId,
  //     patientName,
  //     patientAge,
  //     patientGender,
  //     patientNumber,
  //     patientProblem, 
  //     fee,
  //     paymentStatus,
  //     appoinmentStatus,
  //     appoinmentCancelReason,
  //     date,
  //     timeSlot,
  // );


  // const isBooked = await bookingDbRepository.deleteSlot(doctorId,date,timeSlot);
  // return isBooked;
}



export const createPayment = async (
    userName: string ,
    email: string,
    bookingId: string,
    totalAmount: number
  ) => {
    const stripe = new Stripe("sk_test_51Phr0W2MEaCJUhJikIT3TUIPISmQMTP7CA1UQ8rxmRrlIamjTe6eHl444qrEYfu501UcongTiXsyUlNyA4UyIn8H00kc40OSMB");
  
    const customer = await stripe.customers.create({
      name: userName,
      email: email,
      address: {
        line1: "Los Angeles, LA",
        country: "US",
      },
    });
    const session = await stripe.checkout.sessions.create({
        
      payment_method_types: ["card"],
      customer: customer.id,
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: "Gue", description: "HealthHub - Doctor Booking" },
            unit_amount: Math.round(totalAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${configKeys.CLIENT_PORT}/payment_status/${bookingId}?success=true`,
      cancel_url: `${configKeys.CLIENT_PORT}/payment_status/${bookingId}?success=false`,
    });
    return session.id;
  };


  export const updateBookingStatus = async (
    id: string,
    paymentStatus: "Paid" | "Failed",
    bookingRepository: ReturnType<BookingDbRepositoryInterface>,
  ) => {
    const bookingStatus = paymentStatus === "Paid" ? "Confirmed" : "Pending";
    const updationData: Record<string, any> = {
      paymentStatus,
      bookingStatus,
    };
  
    const bookingData = await bookingRepository.updateBookingDetails(
      id,
      updationData
    );

    return bookingData;
  };

  export const getBookingByBookingId = async (
    bookingID: string,
    bookingRepository: ReturnType<BookingDbRepositoryInterface>
  ) => {
    const bookingDetails = await bookingRepository.getBookingById(bookingID);
    return { bookingDetails };
  };

  export const getBookingByUserId = async (
    userId: string,
    bookingRepository: ReturnType<BookingDbRepositoryInterface>
  ) => {
    const bookingDetails = await bookingRepository.getAllBookingByUserId(userId);
    return { bookingDetails };
  };


  export const changeAppoinmentstaus = async (
    appoinmentStatus:string,
    cancelReason:string,
    refundAmount: number,
    id:any,
    bookingRepository:ReturnType<BookingDbRepositoryInterface>
  )=>{

    console.log(refundAmount,"^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
    const changeStatus = await bookingRepository.changeBookingstatus(appoinmentStatus,cancelReason,id);

  const booking = await bookingRepository.getBookingById(id);

  
  //ivide vech time date oka kond timeslot matta

  //@ts-ignore
  // const fee:any = booking?.fee;
   //@ts-ignore
  const UserId = booking?.userId;
   //@ts-ignore
   const doctorId:any = booking?.doctorId;
   //@ts-ignore
  const timeSlot = booking?.timeSlot;
   //@ts-ignore
   const date:any = booking?.date;

   const fee:any  = refundAmount;


   //@ts-ignore
  const changeWalletAmount = await bookingRepository.changeWallet(fee,UserId);

  const walletTransaction = await bookingRepository.creditAmount(fee,UserId);

     return {doctorId,timeSlot,date };
  }


  export const changeAppoinmentStatus = async (
    appoinmentStatus:string,
    id:any,
    bookingRepository:ReturnType<BookingDbRepositoryInterface>
  )=> await bookingRepository.changeBookingAppoinmentStatus(appoinmentStatus,id);


  export const getWalletBalance = async (
    userId:any,
    bookingRepository:ReturnType<BookingDbRepositoryInterface>
  )=>{
    const balance = await bookingRepository.getBalanceAmount(userId);
    return balance;
  }

  export const walletDebit = async (
    userId:any,
    Amount:any,
    bookingRepository:ReturnType<BookingDbRepositoryInterface>
  )=>{
    const debit = await bookingRepository.debitAmount(userId,Amount);
  }


  export const changeWalletAmounti = async (
    UserId:any,
    fees:any,
    bookingRepository:ReturnType<BookingDbRepositoryInterface>
  )=>{
    const changeupdated = await bookingRepository.changeTheWalletAmount(fees,UserId)
  }
  




  export const changeWallet = async (
    bookingId:string,
    fees:any,
    bookingRepository:ReturnType<BookingDbRepositoryInterface>
  )=>{

     // Retrieve the booking entity by its ID
  const booking = await bookingRepository.getBookingById(bookingId);

     //@ts-ignore
    const UserId  = booking?.userId;
    
    const changeupdated = await bookingRepository.changeTheWalletAmount(fees,UserId)
  }


 


  /**doctor use cases */

  export const getBookingByDoctorId = async (
    doctorId: string,
    bookingRepository: ReturnType<BookingDbRepositoryInterface>
  ) => {
    const bookingDetails = await bookingRepository.getAllBookingByDoctorId(doctorId);
    return { bookingDetails };
  };


  export const updateBookingStatusPayment = async(
    id:string,
    bookingRepository:ReturnType<BookingDbRepositoryInterface>
  )=>{
    const status = await bookingRepository.changeBookingstatusPayment(id);
    return status;
  }