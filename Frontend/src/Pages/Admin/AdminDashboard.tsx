import React, { useEffect, useState } from 'react';
import AdminHeader from '../../Components/Admin/HeaderSidebar/Header';
import AdminSidebar from '../../Components/Admin/HeaderSidebar/Sidebar';
import LineGraph from '../../Components/Admin/Graph/LineChart';
import DonutChart from '../../Components/Admin/Graph/DonutChart';
import axiosJWT from '../../uuu/AxiosService';
import { ADMIN_API } from '../../Constants/Index';
import { useNavigate } from 'react-router-dom';
import { FaClipboardList } from 'react-icons/fa'; 

const Dashboard: React.FC = () => {
  const [doctors, setDoctors] = useState<[]>([]);
  const [users, setUsers] = useState<[]>([]);
  const [appointments, setAppointments] = useState<[]>([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response :any= await axiosJWT.get(`${ADMIN_API}/doctors`);
        if (Array.isArray(response.data.doctors)) {
          setDoctors(response.data.doctors);
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response:any = await axiosJWT.get(`${ADMIN_API}/users`);
        if (Array.isArray(response.data.users)) {
          setUsers(response.data.users);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchAppointments = async () => {
      try {
        const response :any= await axiosJWT.get(`${ADMIN_API}/appoinments`);
        if (Array.isArray(response.data.appoinments)) {
          setAppointments(response.data.appoinments);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchDoctors();
    fetchUsers();
    fetchAppointments();
  }, []);

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex flex-col flex-grow">
        <AdminHeader />
        <div className="p-6 flex flex-col flex-grow overflow-auto">
          <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
          <div className="grid grid-cols-3 gap-6">

            <div
              className="shadow-md rounded-lg p-6 bg-orange-300 text-white cursor-pointer flex items-center justify-between"
              onClick={() => navigate('/admin/doctors')} 
            >
              <div>
                <h2 className="text-lg font-bold">Doctors Count</h2>
                <p className="text-3xl font-bold">{doctors.length}</p>
              </div>
            </div>

            <div
              className="shadow-md rounded-lg p-6 bg-purple-400 text-white cursor-pointer flex items-center justify-between"
              onClick={() => navigate('/admin/users')} 
            >
              <div>
                <h2 className="text-lg font-bold">Users Count</h2>
                <p className="text-3xl font-bold">{users.length}</p>
              </div>
            </div>

            <div
              className="shadow-md rounded-lg p-6 bg-blue-300 text-white cursor-pointer flex items-center justify-between"
              onClick={() => navigate('/admin/reports')} 
            >
              <div>
                <h2 className="text-lg font-bold">Appointments Report</h2>
                <p className="text-3xl font-bold">{appointments.length}</p>
              </div>
              <FaClipboardList size={40} />
            </div>

          </div>
          <div className="flex justify-between mt-4">
            <LineGraph doctors={doctors} users={users} appointments={appointments} />
            <DonutChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
