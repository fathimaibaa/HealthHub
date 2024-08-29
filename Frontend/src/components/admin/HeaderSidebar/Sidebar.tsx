import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logout from "../../../utils/Logout";
import { useAppDispatch } from "../../../redux/store/Store";
import { clearUser } from "../../../redux/slices/UserSlice";
import {  Stethoscope } from "lucide-react";

const AdminSidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearUser());
    logout("Logout success");
    navigate("/admin/login");
  };

  return (
    <div className="bg-purple-900 text-white w-64 py-4 px-6 h-full flex flex-col">
      <Link to="/admin" className="flex ms-2 md:me-24">
        <span className="self-center text-5xl font-bold sm:text-3xl whitespace-nowrap dark:text-white mb-8">
          Health Hub
        </span>
      </Link>

      <ul className="space-y-2 font-medium">
        <li>
          <Link
            to={"/admin"}
            className="flex items-center p-4 text-white-900 rounded-lg dark:text-white hover:text-black hover:bg-white dark:hover:bg-white group"
          >
            <svg
              className="w-5 h-5 text-white-500 transition duration-75 dark:text-white-400 group-hover:text-gray-900 dark:group-hover:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 21"
            >
              <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
              <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
            </svg>
            <span className="ms-3 flex-1 ">Dashboard</span>
          </Link>
        </li>

        <li>
          <Link
            to="/admin/requesteddoctors"
            className="flex items-center p-4 text-white-900 rounded-lg dark:text-white hover:text-black hover:bg-white dark:hover:bg-white group"
          >
            <svg
              className="flex-shrink-0 w-6 h-6 text-white-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4 1.794 4 4 4zm0 2c-2.67 0-8 1.336-8 4v2h16v-2c0-2.664-5.33-4-8-4z" />
            </svg>
            <span className="flex-1 ms-3 whitespace-nowrap">Req. Doctor</span>
          </Link>
        </li>
        <li>
          <Link
            to="/admin/doctors"
            className="flex items-center p-4 text-white-900 rounded-lg dark:text-white hover:text-black hover:bg-white dark:hover:bg-white group"
          >
            <Stethoscope className="flex-shrink-0 w-6 h-6 text-white-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
            <span className="flex-1 ms-3 whitespace-nowrap">
              Approved Doctors
            </span>
          </Link>
        </li>

        <li>
          <Link
            to="/admin/users"
            className="flex items-center p-4 text-white-900 rounded-lg dark:text-white hover:text-black hover:bg-white dark:hover:bg-white group"
          >
            <svg
              className="flex-shrink-0 w-5 h-5 text-white-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 18"
            >
              <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
            </svg>
            <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
          </Link>
        </li>

        <li>
          <Link
            to="/admin/department"
            className="flex items-center p-4 text-white-900 rounded-lg dark:text-white hover:text-black hover:bg-white dark:hover:bg-white group"
          >
            <svg
              className="flex-shrink-0 w-5 h-5 text-white-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7 10h-2v-3H8v-2h2V8h2v3h2v2h-2v3zm-1-14h2v2h-2V2zm7 0h2v2h-2V2zM4 2h2v2H4V2zM2 22h20v2H2v-2zm18-2H4v-2h16v2z" />
            </svg>
            <span className="flex-1 ms-3 whitespace-nowrap">Departments</span>
          </Link>
        </li>

        <li onClick={handleLogout} className="cursor-pointer">
          <a className="flex items-center p-4 text-white-900 rounded-lg dark:text-white hover:text-black hover:bg-white dark:hover:bg-white group">
            <svg
              className="flex-shrink-0 w-5 h-5 text-white-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 18 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
              />
            </svg>
            <span className="flex-1 ms-3 whitespace-nowrap">Sign out</span>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
