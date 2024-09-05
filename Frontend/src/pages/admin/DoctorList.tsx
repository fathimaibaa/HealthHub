import React, { useState } from 'react';
import AdminHeader from '../../Components/Admin/HeaderSidebar/Header';
import AdminSidebar from '../../Components/Admin/HeaderSidebar/Sidebar';
import useDoctors from '../../Hooks/Usedoctors';
import DoctorData from '../../Components/Admin/DoctorData';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSearch } from 'react-icons/fa';

const DoctorList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 8;
  const {doctors,setDoctors} = useDoctors();
  const [searchTerm, setSearchTerm] = useState("");

  const ListedDoctors = doctors.filter((doctor) => doctor.status === "approved");
  const filteredDoctors = ListedDoctors.filter(doctor =>
    doctor.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const totalDoctors = filteredDoctors.length;
  const totalPages = Math.ceil(totalDoctors / doctorsPerPage);
  const currentDoctors = filteredDoctors.slice((currentPage - 1) * doctorsPerPage, currentPage * doctorsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
console.log(setDoctors)
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex flex-col w-full">
        <AdminHeader />
        <div className="p-6 flex flex-col flex-grow">
          <ToastContainer />
          <h1 className="text-4xl font-bold mb-4 text-center">Approved Doctor List</h1>
         
          <div className="relative ml-20">
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-fuchsia-200 text-fuchsia-800 px-3 py-1 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-fuchsia-500" />
              </div>

          <div className="overflow-x-auto flex-grow">
            <div className="max-w-5xl mx-auto">
              <table className="table-auto w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left bg-transparent">Sl.No</th>
                    <th className="px-4 py-3 text-left bg-transparent">Name</th>
                    <th className="px-4 py-3 text-left bg-transparent">Email</th>
                    <th className="px-4 py-3 text-left bg-transparent">Approved/not</th>
                    <th className="px-4 py-3 text-left bg-transparent">Status</th>
                    <th className="px-4 py-3 text-left bg-transparent">Actions</th>
                    <th className="px-4 py-3 text-left bg-transparent">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDoctors.map((doctor, index) => (
                    <DoctorData
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
              className="ml-10 px-4 py-2 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="mr-10 px-4 py-2 rounded disabled:opacity-50"
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
