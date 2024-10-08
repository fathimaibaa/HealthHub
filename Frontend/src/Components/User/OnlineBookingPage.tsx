import React, { useEffect, useState } from "react";
import { USER_API } from "../../Constants/Index";
import axiosJWT from "../../Utils/AxiosService";
import { useParams } from "react-router-dom";
import Modal from "react-modal";
import showToast from "../../Utils/Toaster";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Navigate, useNavigate } from "react-router-dom";
import {  useSelector } from "react-redux";
import { RootState } from "../../Redux/Reducer/Reducer";
import { DepartmentInterface } from "../../Types/DepartmentInterface";


const AppointmentOnlineBookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [patientDetails, setPatientDetails] = useState({
    patientName: "",
    patientAge: "",
    patientNumber: "",
    patientGender: "",
  });
  const [departments, setDepartments] = useState<{ [key: string]: string }>({});
  const [ dates,setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [existingPatientDetails, setExistingPatientDetails] =
    useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const userId = useSelector((state: RootState) => state.UserSlice.id);



useEffect(()=>{
  const fetchDoctorsAndDepartments = async () => {
    try {
      const response:any = await axiosJWT.get(`${USER_API}/doctor/${id}`);
     
     
      if (response.data.doctor) {
        setDoctor(response.data.doctor);
      } else {
        navigate("/error"); // Redirect to error page if doctor is not found
      }
      const deptResponse:any = await axiosJWT.get(`${USER_API}/department/list`);
      const listedDepartments = deptResponse.data.departments.filter(
        (dept: DepartmentInterface) => dept.isListed
      );

      const departmentMap = listedDepartments.reduce(
        (acc: { [key: string]: string }, dept: DepartmentInterface) => {
          acc[dept._id] = dept.departmentName;
          return acc;
        },
        {}
      );

      setDepartments(departmentMap);

      try {
        const datesResponse :any= await axiosJWT.get(
          `${USER_API}/time-slots/${id}/dates`
        );
        const formattedDates: string[] = datesResponse.data.dateSlots.map(
          (date: any) => {
            const splittedDate = date.date.split("T")[0]; 
            return splittedDate;
          }
        );

       const currentDate = new Date().toISOString().split("T")[0];
        const futureDates = formattedDates.filter(
          (date) => date >= currentDate
        );
        const uniqueDates = Array.from(new Set(futureDates)).sort();

        setDates(uniqueDates);
      } catch (error) {
        console.error("Error fetching scheduled dates:", error);
      }
    } catch (error) {
      console.error("Error fetching doctor and department details:", error);
      navigate("/error"); // Redirect to error page if there's an issue fetching doctor details
    }
  };
  fetchDoctorsAndDepartments();

},[id,navigate]);



  useEffect(() => {


   




    const fetchDoctorDetails = async () => {
      try {
        const response:any = await axiosJWT.get(`${USER_API}/doctor/${id}`);
        setDoctor(response.data.doctor);
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      }
    };
    fetchDoctorDetails();
  }, [id]);

  useEffect(() => {
    setSelectedDate(new Date());
  }, []);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (selectedDate) {
        try {
          const response:any = await axiosJWT.get(
            `${USER_API}/timeslots/${id}?date=${selectedDate.toISOString()}`
          );

          if (response.data.timeSlots.length > 0) {
            const selectedDay = selectedDate.getDay();
            const timeSlotsForDay = response.data.timeSlots[0].slots.find(
              (slot: any) => slot.day === selectedDay
            );

            let availableSlots = timeSlotsForDay
            ? timeSlotsForDay.times.map((time: any) => ({
                start: time.start,
                end: time.end,
              }))
            : [];



if (selectedDate.toDateString() === new Date().toDateString()) {
  const currentTime = new Date();

  availableSlots = availableSlots.filter((slot: any) => {
    const [hourPart, minutePart] = slot.start.split(":");

    const isPM = slot.start.includes("PM");
    const startHour = parseInt(hourPart, 10);
    const startMinutes = minutePart
      ? parseInt(minutePart.slice(0, 2), 10)
      : 0; 


    const hourIn24Format =
      isPM && startHour !== 12 ? startHour + 12 : !isPM && startHour === 12 ? 0 : startHour;

    const slotTime = new Date(selectedDate);
    slotTime.setHours(hourIn24Format, startMinutes, 0, 0);

    console.log(slotTime.getTime(), "Slot time in milliseconds");
    console.log(currentTime.getTime(), "Current time in milliseconds");

    return slotTime.getTime() > currentTime.getTime();
  });
}


setTimeSlots(
  availableSlots.length > 0
    ? availableSlots.map((slot: any) => `${slot.start} - ${slot.end}`)
    : []
);

           
          } else {
            setTimeSlots([]);
          }
        } catch (error) {
          console.error("Error fetching time slots:", error);
        }
      }
    };
    fetchTimeSlots();
  }, [selectedDate, id]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response:any = await axiosJWT.get(`${USER_API}/bookings/${userId}`);
        setBookings(response.data.data.bookingDetails);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchBookings();
  }, [id]);

  function stripDate(dateString: any) {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

  const stripePromise = loadStripe(
    "pk_test_51Phr0W2MEaCJUhJiFEoCveh2HCXFchEMI6AUSQ9kczuQFvBcLV9U0BGXPVePiZZJ22KeQ1Tep0HAZ0XnXoh1FsU100bl7EW4uK"
  );

  const handleBookAppointment = async () => {
    try {
      const appointmentData = {
        userId:userId,
        doctorId: id,
        patientDetails: existingPatientDetails || patientDetails,
        consultationType: "Online",
        fee: 300,
        paymentStatus: "Pending",
        appoinmentStatus: "Booked",
        appoinmentCancelReason: "",
        date: stripDate(selectedDate),
        timeSlot: selectedTimeSlot,
      };

      const response:any = await axiosJWT.post(
        `${USER_API}/appointments`,
        appointmentData
     ,);
      if (response.data.id) {
        const stripe = await stripePromise;
        const result = await stripe?.redirectToCheckout({
          sessionId: response.data.id,
        });
        if (result?.error) console.error(result.error);

        const bookingId = response.data.booking.bookingId;
        Navigate({
          to: `${"https:/health-hub-one.vercel.app"}/payment_status/${bookingId}?success=true`,
        });
      }
       else {
        showToast(response.data.message, "error");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      showToast("Error booking appointment. Please try again later.", "error");
    }
  };

  const handleWalletPayment = async () => {
    try {
      const appointmentData = {
        doctorId: id,
        patientDetails: existingPatientDetails || patientDetails,
        consultationType: "Online",
        fee: 300,
        paymentStatus: "Pending",
        appoinmentStatus: "Booked",
        appoinmentCancelReason: "",
        date: stripDate(selectedDate),
        timeSlot: selectedTimeSlot,
      };

      const response:any = await axiosJWT.post(
        `${USER_API}/walletPayment`,
        appointmentData
      );

      if (response.data.success) {
        const bookingId = response.data.createBooking._id;


        navigate(`/payment_status/${bookingId}?success=true`);
      } else {
        showToast(response.data.message, "error");
      }
    } catch (error) {
      console.log(error);
    }
  };


  const handleNextStepBookAppointment = () => {
    if (selectedTimeSlot) {
      setIsModalOpen(true);
    } else {
      showToast("Please select a time slot", "error");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "patientName") {
      const formattedValue = value
        .replace(/[^a-zA-Z ]/g, "")
        .replace(/\b\w/g, (char) => char.toUpperCase());
      setPatientDetails({ ...patientDetails, [name]: formattedValue });
    } else if (name === "patientAge") {
      const formattedValue = value.replace(/\D/g, "");
      setPatientDetails({ ...patientDetails, [name]: formattedValue });
    } else if (name === "patientNumber") {
      const formattedValue = value.replace(/\D/g, "").slice(0, 10);
      setPatientDetails({ ...patientDetails, [name]: formattedValue });
    } else {
      setPatientDetails({ ...patientDetails, [name]: value });
    }
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPatientDetails({ ...patientDetails, [name]: value });
  };

  const handleAddDetails = () => {
    setIsDetailsModalOpen(true);
  };

  const handleSelectExisting = (patientDetails: any) => {
    setIsDetailsModalOpen(true);
    setPatientDetails(patientDetails);
    setIsModalOpen(false);
  };

  const handleAddPatientDetails = () => {
    if (
      patientDetails.patientName &&
      patientDetails.patientAge &&
      patientDetails.patientGender
    ) {
      setIsDetailsModalOpen(false);
      setIsModalOpen(false);
      setExistingPatientDetails(patientDetails);
    } else {
      showToast("Please fill in all fields", "error");
    }
  };

  const handleTimeSlotSelection = (slot: string) => {
    setSelectedTimeSlot(selectedTimeSlot === slot ? null : slot);
  };
console.log(dates)
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Book an Appointment</h1>
  
      {doctor && (
        <div>
          <div className="flex flex-col md:flex-row items-center mb-8">
            <img
              src={doctor.profileImage}
              alt={doctor.doctorName}
              className="w-40 h-40 md:w-60 md:h-60 rounded mb-4 md:mb-0 mr-0 md:mr-4"
            />
            <div className="ml-0 md:ml-8 text-center md:text-left">
              <h2 className="text-xl font-bold">{doctor.doctorName}</h2>
              <p> {departments[doctor?.department as string]}</p>
              <p className="text-green-600 font-semibold">Verified</p>
              <div className="text-gray-800 bg-blue-100 p-4 rounded-md mt-5 font-bold">
                <p className="mb-2">Consultation: Online</p>
                <p>Fee: 300/-</p>
              </div>
            </div>
          </div>
  
          <div className="mb-4">
            <h1 className="ml-4 mt-6 font-medium text-blue-950 text-lg">
              Select The Scheduled Date
            </h1>
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => setSelectedDate(date)}
              className="rounded-lg px-4 py-2 w-full mt-2"
              dateFormat="MM/dd/yyyy"
              minDate={new Date()}
              placeholderText="Select Date"
              customInput={
                <div className="relative">
                  <input
                    className="border shadow-2xl border-gray-900 rounded-lg px-4 py-2 w-full font-medium text-gray-900"
                    value={selectedDate ? selectedDate.toDateString() : ""}
                    readOnly
                    placeholder="Select Date"
                  />
                  <Calendar className="absolute right-3 top-3 text-gray-800 cursor-pointer mr-3" />
                </div>
              }
            />
          </div>
  
          {timeSlots.length > 0 ? (
            <div className="max-w-md mx-auto lg:mx-0 lg:mr-auto lg:w-1/3">
              <h1 className="text-2xl font-bold mb-4">Schedule Time Slots</h1>
              <div className="grid grid-cols-2 gap-4">
                {timeSlots.map((slot, index) => (
                  <button
                    key={index}
                    className={`w-full rounded-md py-3 border border-blue-900 px-4 text-sm font-medium ${
                      selectedTimeSlot === slot
                        ? "bg-purple-400 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-200"
                    } shadow-md`}
                    onClick={() => handleTimeSlotSelection(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <p className="text-red-600 mt-4 text-lg">The doctor is on leave</p>
              <p className="text-red-600 mt-4">
                No slots scheduled for the selected date.
              </p>
            </>
          )}
  
          <Modal
            isOpen={isModalOpen}
            onRequestClose={handleModalClose}
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
              content: {
                position: "relative",
                top: "auto",
                left: "auto",
                right: "auto",
                bottom: "auto",
                width: "90%",
                maxWidth: "400px",
                borderRadius: "8px",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
                padding: "20px",
                margin: "0 auto",
              },
            }}
          >
            <button
              onClick={handleModalClose}
              className="absolute top-0 right-0 m-4 bg-gray-400 p-2 rounded"
            >
              close
            </button>
            <h2 className="text-xl font-bold mb-4">Patient Details</h2>
            {bookings.length > 0 ? (
              bookings.map((booking, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 mb-4 cursor-pointer"
                  onClick={() => handleSelectExisting(booking)}
                >
                  <p>Name: {booking.patientName}</p>
                  <p>Age: {booking.patientAge}</p>
                  <p>Gender: {booking.patientGender}</p>
                </div>
              ))
            ) : (
              <p className="mb-4">No existing patient details</p>
            )}
            <button
              onClick={handleAddDetails}
              className="bg-purple-700 text-white py-2 px-4 rounded-lg mr-2"
            >
              Add Details +
            </button>
          </Modal>
  
          <Modal
            isOpen={isDetailsModalOpen}
            onRequestClose={() => setIsDetailsModalOpen(false)}
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
              content: {
                position: "relative",
                top: "auto",
                left: "auto",
                right: "auto",
                bottom: "auto",
                width: "90%",
                maxWidth: "400px",
                borderRadius: "8px",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
                padding: "20px",
                margin: "0 auto",
              },
            }}
          >
            <button
              onClick={() => setIsDetailsModalOpen(false)}
              className="absolute top-0 right-0 m-4 bg-gray-400 p-2 rounded"
            >
              close
            </button>
            <h2 className="text-xl font-bold mb-4">Enter Patient Details</h2>
            <div className="mb-4">
              <label className="block mb-1">Name:</label>
              <input
                type="text"
                name="patientName"
                value={patientDetails.patientName}
                onChange={handleInputChange}
                className="border border-gray-400 rounded-lg px-4 py-2 w-full mt-1"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Age:</label>
              <input
                type="text"
                name="patientAge"
                value={patientDetails.patientAge}
                onChange={handleInputChange}
                className="border border-gray-400 rounded-lg px-4 py-2 w-full mt-1"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Gender:</label>
              <select
                name="patientGender"
                value={patientDetails.patientGender}
                onChange={handleGenderChange}
                className="border border-gray-400 rounded-lg px-4 py-2 w-full mt-1"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
              </select>
            </div>
            <button
              onClick={handleAddPatientDetails}
              className="bg-purple-700 text-white py-2 px-4 rounded-lg mt-4"
            >
              Submit
            </button>
          </Modal>
        </div>
      )}
  
      <div className="mt-8">
        {existingPatientDetails ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-500 p-4 rounded-md">
              <h2 className="font-bold mb-3 text-lg">Patient Details</h2>
              <p>Name: {existingPatientDetails.patientName}</p>
              <p>Age: {existingPatientDetails.patientAge}</p>
              <p>Gender: {existingPatientDetails.patientGender}</p>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
  
      <div className="flex flex-col md:flex-row justify-start mt-8">
        {existingPatientDetails ? (
          <>
          <button
            onClick={handleBookAppointment}
            disabled={timeSlots.length === 0}
            className={`bg-purple-700 text-white py-2 px-4 rounded-lg mb-4 md:mb-0 ${
              timeSlots.length === 0 ? "opacity-50 cursor-not-allowed" : ""
            } hover:bg-purple-700 hover:text-white focus:outline-none `}
          >
            Online Payment
          </button>
          <button
            onClick={handleWalletPayment}
            disabled={timeSlots.length === 0}
            className={`bg-blue-950 text-white py-2 px-4 rounded-lg md:ml-5 ${
              timeSlots.length === 0 ? "opacity-50 cursor-not-allowed" : ""
            } hover:bg-blue-800 hover:text-white focus:outline-none `}
          >
            Wallet Payment
          </button>
        </>
        
        ) : (
          <button
            onClick={handleNextStepBookAppointment}
            disabled={timeSlots.length === 0}
            className={`bg-purple-700 text-white py-2 px-4 rounded-lg ${
              timeSlots.length === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Book an Appointment
          </button>
        )}
      </div>
    </div>
  );
};

export default AppointmentOnlineBookingPage;
