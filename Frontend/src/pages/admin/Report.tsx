import React ,  { useState } from 'react';
import ReportData from "../../components/admin/ReportData";
import AdminHeader from '../../components/admin/HeaderSidebar/Header';
import AdminSidebar from '../../components/admin/HeaderSidebar/Sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useReports from '../../Hooks/UseReport';


const ReportList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 7;
  const { reports } = useReports(); 

  const totalUsers = reports.length;
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  const currentReport = reports.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

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

        <h1 className="text-4xl font-bold mb-4 text-center">Appionment Report</h1>
          
          <div className="overflow-x-auto flex-grow">
            <table className="table-auto w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-6 py-4 text-left">Sl.No</th>
                  <th className="px-6 py-4 text-left">Patient Name</th>
                  <th className="px-6 py-4 text-left">Doctor Name</th>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Time</th>
                </tr>
              </thead>
            
              <tbody>
                {currentReport.map((report,index) => {
                  return <ReportData {...report} key={report._id} serialNo={(currentPage - 1) * usersPerPage + index + 1} />;
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>


        </div>
      </div>
    </div>
  );
};

export default ReportList;
