import { useState, useEffect } from "react";
import axiosJWT from "../../Utils/AxiosService";
import { USER_API } from "../../Constants/Index";
import { DoctorInterface } from "../../Types/DoctorInterface";
import { DepartmentInterface } from "../../Types/DepartmentInterface";
import Calender from '../../Assets/Images/Calender.svg';
import axios from "axios";

const AppointmentsListPage = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<DoctorInterface[]>([]);
  const [departments, setDepartments] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response:any = await axiosJWT.get(`${USER_API}/allAppoinments`);
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

  console.log(appointments)

  return (
    <div className="container mx-auto px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Appointments List</h1>

      {appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
        <p className="text-xl text-center mb-4">You have no appointments booked.</p>
        <img src={Calender} alt="calender pic" className="mx-auto" />
      </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="w-full bg-gray-800 text-white">
                <th className="py-2 px-4 border-b">Patient Name</th>
                {/* <th className="py-2 px-4 border-b">Age</th> */}
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Time Slot</th>
                <th className="py-2 px-4 border-b">Doctor</th>
                {/* <th className="py-2 px-4 border-b">Fees</th> */}
                <th className="py-2 px-4 border-b">Specialty</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment: any) => (
                <tr key={appointment._id} className="hover:bg-gray-200 transition duration-300">
                  <td className="py-2 px-4 border-b text-center">
                    {appointment.patientName}
                  </td>
                  {/* <td className="py-2 px-4 border-b text-center">
                    {appointment.patientAge}
                  </td> */}
                  <td className="py-2 px-4 border-b text-center">
                    {formatDate(appointment.date)}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {appointment.timeSlot}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {getDoctorName(appointment.doctorId)}
                  </td>
                  {/* <td className="py-2 px-4 border-b text-center">
                    {appointment.fee}
                  </td> */}
                  <td className="py-2 px-4 border-b text-center">
                    {getDepartmentName(appointment.doctorId)}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <button
                      className="bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
                      onClick={() => window.location.href = `/appoinmentDetails/${appointment._id}`}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AppointmentsListPage;
