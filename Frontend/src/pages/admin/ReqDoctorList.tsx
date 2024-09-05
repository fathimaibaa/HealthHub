import React, { useState } from 'react';
import AdminHeader from '../../components/admin/HeaderSidebar/Header';
import AdminSidebar from '../../components/admin/HeaderSidebar/Sidebar';
import useDoctors from '../../Hooks/Usedoctors';
import ReqDoctorData from '../../components/admin/ReqDoctorData';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DoctorList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 8;
  const { doctors } = useDoctors();

  const ListedDoctors = doctors.filter((doctor) => doctor.status !== "approved");

  const totalDoctors = ListedDoctors.length;
  const totalPages = Math.ceil(totalDoctors / doctorsPerPage);
  const currentDoctors = ListedDoctors.slice((currentPage - 1) * doctorsPerPage, currentPage * doctorsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex flex-col w-full">
        <AdminHeader />
        <div className="p-6 flex flex-col flex-grow">
          <ToastContainer />
          <h1 className="text-4xl font-bold mb-4 text-center">Req . Doctor List</h1>
          <div className="overflow-x-auto flex-grow">
            <div className="max-w-5xl mx-auto">
              <table className="table-auto w-full">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-3 text-left">Sl.No</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-1 py-3 text-left">Reject/Pending</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                    <th className="px-4 py-3 text-left">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDoctors.map((doctor, index) => (
                    <ReqDoctorData
                      {...doctor}
                      key={doctor._id}
                      serialNo={(currentPage - 1) * doctorsPerPage + index + 1}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="ml-10 px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="mr-10 px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorList;
