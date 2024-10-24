import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosJWT from "../../Utils/AxiosService";
import { DOCTOR_API } from "../../Constants/Index";
import { RootState } from "../../Redux/Reducer/Reducer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import Calender from '../../Assets/Images/Calender.svg';

interface BookingDetail {
  _id: string;
  patientName: string;
  patientAge: number;
  date: string;
  timeSlot: string;
}

const AppointmentDetails: React.FC = () => {
  const id = useSelector((state: RootState) => state.DoctorSlice.id);
  const [bookingDetails, setBookingDetails] = useState<BookingDetail[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5; // Set how many bookings per page

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response: any = await axiosJWT.get(
          `${DOCTOR_API}/bookingdetails/${id}`
        );
        const bookingData = response.data.data.bookingDetails;
        console.log(bookingData);
        setBookingDetails(bookingData);
      } catch (error) {
        console.error("Error fetching booking details:", error);
      }
    };
    fetchBookingDetails();
  }, [id]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setCurrentPage(1); // Reset to first page when date changes
  };

  const filteredAppointments = bookingDetails.filter((bookingDetail) => {
    if (!selectedDate) return true;
    return (
      new Date(bookingDetail.date).toLocaleDateString() ===
      selectedDate.toLocaleDateString()
    );
  });

  // Pagination logic
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredAppointments.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );

  const totalPages = Math.ceil(filteredAppointments.length / bookingsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Appointment List</h1>

      <div className="flex justify-start mb-4">
        <div className="w-full max-w-xs relative">
          <div className="border border-gray-500 shadow-lg rounded-md relative">
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              className="rounded-md px-4 py-2 w-full pl-10"
              placeholderText="Select Date"
            />
            <div className="absolute top-3 left-2 text-gray-700">
              <FaCalendarAlt />
            </div>
          </div>
        </div>
      </div>

      {currentBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-xl text-center mb-4">
            You have no appointments booked.
          </p>
          <img src={Calender} alt="calendar pic" className="mx-auto" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="w-full bg-gray-800 text-white">
                <th className="py-2 px-4 border-b">Patient Name</th>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Time</th>
                <th className="py-2 px-4 border-b">Details</th>
              </tr>
            </thead>
            <tbody>
              {currentBookings.map((bookingDetail) => (
                <tr
                  key={bookingDetail._id}
                  className="hover:bg-gray-200 cursor-pointer transition duration-300"
                >
                  <td className="py-2 px-4 border-b text-center">
                    {bookingDetail.patientName}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {new Date(bookingDetail.date).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {bookingDetail.timeSlot}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <button
                      className="bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
                      onClick={() =>
                        (window.location.href = `/patient_details/${bookingDetail._id}`)
                      }
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentDetails;
