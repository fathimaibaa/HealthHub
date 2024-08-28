import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosJWT from '../../utils/AxiosService';
import { USER_API } from '../../constants/Index';
import { FaCalendarAlt } from 'react-icons/fa';
import { DepartmentInterface } from '../../types/DepartmentInterface';

interface Doctor {
  profileImage: string;
  department: string | { departmentName: string };
  tenture: string;
  doctorName: string;
  description: string;
  wokringHospital: string;
  
}

const DoctorDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [departments, setDepartments] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorsAndDepartments = async () => {
      try {
        const response = await axiosJWT.get(`${USER_API}/doctor/${id}`);
        const doctorData = response.data.doctor;
        setDoctor(doctorData);
    
        const deptResponse = await axiosJWT.get(`${USER_API}/department/list`);
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
    
      } catch (error) {
        console.error('Error fetching doctor details:', error);
        setError('Failed to fetch doctor details. Please try again later.');
      }
    };

    
    fetchDoctorsAndDepartments();
    
  }, [id]);

  
  

  const handleBookAppointment = () => {
    navigate(`/user/appoinmentOnline/${id}`);
  };

  const renderAppointmentButton = () => {
    return (
      <button
        onClick={handleBookAppointment}
        className="bg-purple-600 text-white py-2 px-4 rounded-lg mt-4 flex items-center hover:bg-purple-700 transition-colors duration-300"
      >
        <FaCalendarAlt className="mr-2" /> Book Appointment
      </button>
    );
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!doctor) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="container bg-gray-100 mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Doctor Details</h1>
      <div className="flex flex-col md:flex-row items-center justify-center   ">
        <div className="md:w-1/3 mb-4 md:mb-0 flex justify-center">
          <img
            src={doctor.profileImage}
            alt="Doctor"
            className="h-96 w-96 rounded-lg shadow-md object-cover border-4 border-white"
          />
        </div>
        <div className="md:w-2/3 md:pl-8">
          <div className="bg-white p-6 rounded-lg mb-4 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Dr. {doctor.doctorName}
            </h2>
            <span className="text-sl text-gray-700">
              {departments[doctor.department as string]} ,
            </span>
           
            {doctor.tenture && (
              <>
               <span className="text-sm text-gray-800 ">
                  {doctor.tenture} years of Experience
            </span>

              </>
            ) }
             {doctor.wokringHospital && (
              <>
               <h2 className="text-sm text-gray-800 mb-1">
                Working Hospital :  {doctor.wokringHospital} 
              </h2>
              </>
            ) }
           
            <p className="text-lg text-purple-900 font-bold mb-4">Consultation Fee - ₹300</p>
            {renderAppointmentButton()}
          </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">About</h3>
              <p className="text-lg text-gray-700">{doctor.description}</p>
            </div>
        </div>
      </div>
     
    </div>
  );
};

export default DoctorDetailsPage;
