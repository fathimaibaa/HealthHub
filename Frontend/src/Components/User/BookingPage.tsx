import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { USER_API } from "../../Constants/Index";
import {
  clearAppointmentData,
  setAppointmentData,
} from "../../Redux/Slices/BookingSlice";
import axiosJWT from "../../Utils/AxiosService";
import showToast from "../../Utils/Toaster";
import { DepartmentInterface } from "../../Types/DepartmentInterface";

const AppointmentBookingPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<any>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [departments, setDepartments] = useState<{ [key: string]: string }>({});
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [patientDetails, setPatientDetails] = useState({
    patientName: "",
    patientAge: "",
    patientGender: "",
    patientNumber: "",
    patientProblem: "",
  });

  // State to track whether time slot and package are selected
  // const [isTimeSlotSelected, setIsTimeSlotSelected] = useState(false);

  useEffect(() => {
    const fetchDoctorsAndDepartments = async () => {
      try {
        const response:any = await axiosJWT.get(`${USER_API}/doctor/${id}`);
        setDoctor(response.data.doctor);

        // Fetch departments
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

        // Fetch scheduled dates inside fetchDoctorsAndDepartments
        try {
          const datesResponse:any = await axiosJWT.get(
            `${USER_API}/time-slots/${id}/dates`
          );
          // Parse dates to format them as needed
          const formattedDates: string[] = datesResponse.data.dateSlots.map(
            (date: any) => {
              const splittedDate = date.date.split("T")[0]; // Split date and time, and take only the date part
              return splittedDate;
            }
          );

          // const uniqueDates: string[] = Array.from(new Set(formattedDates));
          // Filter out past dates and sort in ascending order
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
        console.error("Error fetching doctor n department details:", error);
      }
    };

    fetchDoctorsAndDepartments();
  }, [id]);

  const handleBookAppointment = () => {
    if (selectedTimeSlot) {
      // Check if the selected time slot is available
      const selectedSlot = timeSlots.find(
        (slot) => slot.slotTime === selectedTimeSlot
      );
  
      if (selectedSlot && selectedSlot.available) {
        setIsDetailsModalOpen(true);
      } else {
        showToast("The selected time slot is not available.", "error");
      }
    } else {
      showToast("Please select both time slot and package.", "error");
    }
  };
  

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPatientDetails({ ...patientDetails, [name]: value });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatientDetails({ ...patientDetails, [name]: value });
  };

  const handleAppointmentConfirmation = async () => {
    try {
      const {
        patientName,
        patientAge,
        patientNumber,
        patientGender,
        patientProblem,
      } = patientDetails;

      // Validation checks
      const nameRegex = /^[a-zA-Z]+$/; // Regex for name validation
      const ageRegex = /^\d+$/; // Regex for age validation
      const numberRegex = /^\d{10}$/; // Regex for phone number validation

      // Validate patient name
      if (!patientName || !nameRegex.test(patientName)) {
        showToast("Please enter a valid name .", "error");
        return;
      }

      // Validate patient age
      if (
        !patientAge ||
        !ageRegex.test(patientAge) ||
        parseInt(patientAge) < 3
      ) {
        showToast(
          "Please enter a valid age (numeric value, at least 3 years old).",
          "error"
        );
        return;
      }

      // Validate patient number
      if (!patientGender) {
        showToast("Please Select a gender ", "error");
        return;
      }

      // Validate patient number
      if (!patientNumber || !numberRegex.test(patientNumber)) {
        showToast(
          "Please enter a valid phone number (10 digits, numbers only).",
          "error"
        );
        return;
      }

      // Validate patient problem
      if (!patientProblem.trim()) {
        showToast("Please enter the patient's problem.", "error");
        return;
      }

      const appointmentData = {
        doctorId: id || "",
        doctorName: doctor.doctorName,
        doctorImage: doctor.profileImage,
        fee: 200,
        paymentStatus: "Pending",
        appoinmentStatus: "Booked",
        appoinmentCancelReason: "",
        timeSlot: selectedTimeSlot || "",
        date: selectedDate,
        patientName: patientName,
        patientAge: parseInt(patientAge, 10),
        patientGender: patientGender,
        patientNumber: patientNumber,
        patientProblem: patientProblem,
      };

      dispatch(clearAppointmentData());
      dispatch(setAppointmentData(appointmentData));
      navigate(`/user/checkout/${doctor?._id}`);

      // showToast('Appointment booked successfully.', 'success');
    } catch (error) {
      console.error("Error booking appointment:", error);
      showToast("Error booking appointment. Please try again later.", "error");
    }
  };

  const handleTimeSlotSelection = (timeSlot: string) => {
    // setIsTimeSlotSelected(true); // Update time slot selection state
    setSelectedTimeSlot(timeSlot);
  };

  const handleDateSelection = (date: string) => {
    // Deselect the date if it's already selected
    if (selectedDate === date) {
      setSelectedDate("");
      setSelectedDate(date);
    } else {
      setSelectedDate(date);
      // setIsTimeSlotSelected(false); // Reset time slot selection when date changes
      fetchTimeSlots(date);
    }
  };

  const fetchTimeSlots = async (selectedDate: string) => {
    try {
      const response:any = await axiosJWT.get(
        `${USER_API}/time-slots/${id}/dates`,
        {
          params: {
            date: selectedDate,
          },
        }
      );

      const timeSlots = response.data.timeSlots;
      const currentTime = new Date();
      // Format the selectedDate and currentTime for comparison
      const selectedDateTime = new Date(selectedDate);
      selectedDateTime.setHours(0, 0, 0, 0); // Normalize to start of day

      const isToday =
        selectedDateTime.getTime() === new Date().setHours(0, 0, 0, 0);

      let filteredTimeSlots = timeSlots;

      if (isToday) {
        filteredTimeSlots = timeSlots.filter((slot: any) => {
          const slotTime = new Date(`${selectedDate} ${slot.slotTime}`);
          return slotTime > currentTime;
        });
      }

      setTimeSlots(filteredTimeSlots);
    } catch (error) {
      console.error("Error fetching time slots:", error);
    }
  };

  const handleAddDetails = () => {
    handleBookAppointment();
  };

  const formatDate = (dateString: string | number | Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "numeric",
      month: "short",
    };
    const date = new Date(dateString);
    const formattedDate = date
      .toLocaleDateString("en-US", options)
      .toUpperCase();
    const [weekday, month, day] = formattedDate.split(" ");
    return { weekday, day, month };
  };

  const handleLeftArrowClick = () => {
    setVisibleStartIndex(Math.max(visibleStartIndex - 1, 0));
  };

  const handleRightArrowClick = () => {
    setVisibleStartIndex(Math.min(visibleStartIndex + 1, dates.length - 5));
  };

  const visibleDates = dates.slice(visibleStartIndex, visibleStartIndex + 5);

  return (
    // <div className="min-h-screen flex items-center justify-center bg-gray-100"> 
    <div className="mx-auto md:px-10 px-2 bg-gray-100  h-[85vh]">
    <div className="mx-auto md:px-20 pt-8 bg-gray-100 ">

      <h1 className="text-3xl font-bold mb-8">Book an Appointment</h1>

      {doctor && (
        <div>
          {/* Doctor Profile */}
          <div className="flex items-center mb-8">
            <img
              src={doctor.profileImage}
              alt={doctor.doctorName}
              className="w-28 h-28 rounded-full mr-4"
            />
            <div>
              <h2 className="text-xl font-bold">{doctor.doctorName}</h2>
              {departments[doctor?.department as string]}
              <p className="text-purple-600 font-semibold"> Fee : ₹200 </p>
            </div>
          </div>


          {visibleDates.length === 0 ?  (
             <div className="text-red-500 text-xl font-semibold">
                 No Scheduled Dates Available
             </div>
      ): <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Scheduled Dates</h2>
      <div className="flex items-center">

        <div
          className={`cursor-pointer text-2xl   ${
            visibleStartIndex === 0 ? "text-gray-400" : "text-black"
          }`}
          onClick={
            visibleStartIndex !== 0 ? handleLeftArrowClick : undefined
          }
          style={{
            color: visibleStartIndex === 0 ? "#A0A0A0" : "#000000",
          }}
        >
          &lt;
        </div>
        <div className="flex overflow-x-auto mx-4 space-x-4 ">
          {visibleDates &&
            visibleDates.map((date, index) => {
              const { weekday, day, month } = formatDate(date);
              const isSelected = selectedDate === date;
              return (
                <div
                  key={index}
                  className={`min-w-[80px] px-4 py-2 rounded-3xl shadow-md flex flex-col items-center cursor-pointer  ${
                    isSelected
                      ? "border-2 border-purple-800 bg-purple-700 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => handleDateSelection(date)}
                >
                  <input
                    type="radio"
                    id={`dateSlot${index}`}
                    name="dateSlot"
                    value={date}
                    hidden
                  />
                  <label
                    htmlFor={`dateSlot${index}`}
                    className="text-center"
                  >
                    <div
                      className={`text-sm ${
                        isSelected ? "text-white" : "text-gray-500"
                      }`}
                    >
                      {weekday}
                    </div>
                    <div
                      className={`text-2xl font-bold ${
                        isSelected ? "text-white" : "text-black"
                      }`}
                    >
                      {day}
                    </div>
                    <div
                      className={`text-sm ${
                        isSelected ? "text-white" : "text-gray-500"
                      }`}
                    >
                      {month}
                    </div>
                  </label>
                </div>
              );
            })}
        </div>
        <div
          className={`cursor-pointer text-2xl ${
            visibleStartIndex === dates.length - 5
              ? "text-gray-400"
              : "text-black"
          }`}
          onClick={
            visibleStartIndex !== dates.length - 5
              ? handleRightArrowClick
              : undefined
          }
          style={{
            color:
              visibleStartIndex === dates.length - 5
                ? "#A0A0A0"
                : "#000000",
          }}
        >
          &gt;
        </div>


      </div>
    </div> }
         
          {/* Time Slots */}
          {timeSlots.length > 0 ? (
          <div className="max-w-md mx-auto lg:mx-0 lg:mr-auto lg:w-1/3">
            <h2 className="text-xl font-bold mb-4">Available Time Slots</h2>
            <div className="grid grid-cols-3 gap-4 pb-4">
              {timeSlots &&
                timeSlots.map((slot: any, index: number) => (
                  <div
                    key={index}
                    className={`w-full rounded-md py-3 border border-gray-900 px-4 text-sm font-medium ${
                      selectedTimeSlot === slot.slotTime
                        ? "bg-purple-800 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-200"
                    } shadow-md`}
                    onClick={() => handleTimeSlotSelection(slot.slotTime)}
                  >
                    <div>
                      <label
                        htmlFor={`timeSlot${index}`}
                        className="text-lg font-bold"
                      >
                        {slot.slotTime}
                      </label>
                      <p
                        className={
                          slot.available ? "text-purple-700" : "text-red-600"
                        }
                      >
                        {slot.available ? "Available" : "Not Available"}
                      </p>
                      {/* Render availability status */}
                    </div>
                  </div>
                ))}
            </div>
          </div>
          ) : (
            <>
              <p className="text-red-600 mt-4 mb-2">
                No timeslots scheduled.
              </p>
            </>
          )}

          {/* Book Appointment Button */}
          <div className="flex justify-between mb-4">
            <button
              onClick={handleAddDetails}
              className="bg-purple-800 text-white py-2 px-4 rounded-lg"
            >
              Book an Appointment
            </button>
          </div>

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

            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block mb-2">
                Phone Number:
              </label>
              <input
                type="text"
                required
                id="phoneNumber"
                name="patientNumber"
                value={patientDetails.patientNumber}
                onChange={handleInputChange}
                className="border rounded-lg px-4 py-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="problem" className="block mb-2">
                Health Issue:
              </label>
              <input
                id="problem"
                required
                name="patientProblem"
                value={patientDetails.patientProblem}
                onChange={handleInputChange}
                className="border rounded-lg px-4 py-2 w-full"
              />
            </div>
            <button
              onClick={handleAppointmentConfirmation}
              className="bg-purple-700 text-white py-2 px-4 rounded-lg"
            >
              Book Appointment
            </button>
          </Modal>
          
        </div>
      )}
    </div>
    </div>
  );
};

export default AppointmentBookingPage;
