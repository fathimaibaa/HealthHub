import { useState, useEffect } from "react";
import axiosJWT from "../../utils/AxiosService";
import { USER_API } from "../../constants/Index";
import { DoctorInterface } from "../../types/DoctorInterface";
import { DepartmentInterface } from "../../types/DepartmentInterface";
import axios from "axios";

const AppointmentsListPage = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<DoctorInterface[]>([]);
  const [departments, setDepartments] = useState<{ [key: string]: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(6);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response :any= await axiosJWT.get(`${USER_API}/allAppoinments`);
        setAppointments(response.data.bookings.bookingDetails);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    const fetchDoctorsAndDepartments = async () => {
      try {
        const deptResponse:any = await axios.get(`${USER_API}/department/list`);
        const listedDepartments = deptResponse.data.departments;
        const departmentMap = listedDepartments.reduce((acc: { [key: string]: string }, dept: DepartmentInterface) => {
          acc[dept._id] = dept.departmentName;
          return acc;
        }, {});

        const docResponse:any = await axios.get(`${USER_API}/doctors`);
        const approvedDoctors = docResponse.data.doctors.filter((doctor: DoctorInterface) => doctor.isApproved);

        setDepartments(departmentMap);
        setDoctors(approvedDoctors);
      } catch (error) {
        console.error('Error fetching doctors or departments:', error);
      }
    };

    fetchDoctorsAndDepartments();
  }, []);

  const formatDate = (dateString: string) => {
    const options: any = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getDoctorName = (doctorId: string) => {
    const doctor = doctors.find(doc => doc._id === doctorId);
    return doctor ? doctor.doctorName : "Unknown Doctor";
  };

  const getDepartmentName = (doctorId: string) => {
    const doctor = doctors.find(doc => doc._id === doctorId);
    return doctor ? departments[doctor.department as string] : "Unknown Department";
  };

  const sortedAppointments = [...appointments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = sortedAppointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );

  const totalPages = Math.ceil(sortedAppointments.length / appointmentsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  return (
    <div className="container mx-auto px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Appointments List</h1>

      {appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-xl text-center mb-4">You have no appointments booked.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {currentAppointments.map((appointment: any) => (
            <div key={appointment._id} className="bg-white shadow-lg rounded-lg p-6 flex flex-col">
              <h2 className="text-xl font-bold mb-2">{appointment.patientName}</h2>
              <p className="text-gray-600">Date: {formatDate(appointment.date)}</p>
              <p className="text-gray-600">Time Slot: {appointment.timeSlot}</p>
              <p className="text-gray-600">Doctor: {getDoctorName(appointment.doctorId)}</p>
              <p className="text-gray-600">Fees: {appointment.fee}</p>
              <p className="text-gray-600">Specialty: {getDepartmentName(appointment.doctorId)}</p>
              <button
                className="mt-auto bg-purple-600 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => window.location.href = `/appoinmentDetails/${appointment._id}`}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between mt-4">
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
    </div>
  );
};

export default AppointmentsListPage;
