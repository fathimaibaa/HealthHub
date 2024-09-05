import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosJWT from "../../utils/AxiosService";
import { DOCTOR_API } from "../../Constants/Index";
import { RootState } from "../../rrrr/Reducer/Reducer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(8);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response:any = await axiosJWT.get(
          `${DOCTOR_API}/bookingdetails/${id}`
        );
        const bookingData = response.data.data.bookingDetails;
        setBookingDetails(bookingData);
      } catch (error) {
        console.error("Error fetching booking details:", error);
      }
    };
    fetchBookingDetails();
  }, [id]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const filteredAppointments = bookingDetails
    .filter((bookingDetail) => {
      if (!selectedDate) return true;
      return (
        new Date(bookingDetail.date).toLocaleDateString() ===
        selectedDate.toLocaleDateString()
      );
    })
    
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );

  const totalPages = Math.ceil(
    filteredAppointments.length / appointmentsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
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

      {currentAppointments.length === 0 ? (
        <p className="text-xl text-center">You have no appointments booked.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentAppointments.map((bookingDetail) => (
            <div
              key={bookingDetail._id}
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold mb-2">{bookingDetail.patientName}</h2>
              <p className="text-gray-600 mb-2">
                Date: {new Date(bookingDetail.date).toLocaleDateString()}
              </p>
              <p className="text-gray-600 mb-2">Time: {bookingDetail.timeSlot}</p>
              <Link
                to={`/patient-details/${bookingDetail._id}`}
                className="text-blue-500 hover:underline"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="bg-gray-800 text-white py-2 px-4 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="bg-gray-800 text-white py-2 px-4 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentDetails;
