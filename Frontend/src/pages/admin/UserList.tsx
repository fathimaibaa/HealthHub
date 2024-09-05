import React ,  { useState } from 'react';
import UserData from "../../Components/Admin/UserData";
import useUsers from "../../hhh/UseUsers";
import AdminHeader from '../../Components/Admin/HeaderSidebar/Header';
import AdminSidebar from '../../Components/Admin/HeaderSidebar/Sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 7;
  const { users } = useUsers(); 

  const totalUsers = users.length;
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  const currentUsers = users.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

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

          <h1 className="text-4xl font-bold mb-4 text-center">User List</h1>
          
          <div className="overflow-x-auto flex-grow">
            <table className="table-auto w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-6 py-4 text-left">Sl.No</th>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user,index) => {
                  return <UserData {...user} key={user._id} serialNo={(currentPage - 1) * usersPerPage + index + 1} />;
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

export default UserList;
