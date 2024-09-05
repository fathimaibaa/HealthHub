import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../rrrr/Reducer/Reducer";
import showToast from "../../../utils/Toaster";
import { clearDoctor } from "../../../rrrr/Slices/DoctorSlice";
import { removeItemFromLocalStorage } from "../../../utils/Setnget";
import logo from '../../../Assets/Images/logo.png';

const Navbar: React.FC = () => {
  const doctor = useSelector((state: RootState) => state.DoctorSlice);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearDoctor());
    removeItemFromLocalStorage("access_token");
    removeItemFromLocalStorage("refresh_token")
    navigate("/doctor/login");
    showToast("Logged out successfully", "success");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-purple-900 shadow-lg w-full">
      <div className="px-5">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
          <img src={logo} alt="Health Hub Logo" className="h-10" />
            
            <Link to="/doctor" className="text-white font-bold text-xl ml-10">
              HealthHub
            </Link>
          </div>
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-gray-300 focus:outline-none focus:text-gray-300"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
          <div className="hidden md:flex items-center mr-20">
            
            
            
            {doctor.isAuthenticated && doctor.role === "doctor" ? (
              <>
               <Link
              to="/doctor/slot"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white hover:text-purple-900"
            >
              Slot
            </Link>
            <Link
              to="/doctor/patientList"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white hover:text-purple-900"
            >
              Patients
            </Link>

                <Link
                  to="/doctor/profile"
                  className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white hover:text-purple-900 md:ml-2"
                >
                  KYC
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-purple-900 px-3 py-2 text-sm font-medium bg-gray-100 hover:bg-white hover:text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 rounded-md mt-2 md:mt-0 md:ml-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/doctor/login"
                className="px-3 py-2 text-sm font-medium bg-gray-100 hover:bg-white hover:text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 rounded-md mt-2 md:mt-0 md:ml-2 text-purple-900"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/doctor"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white hover:text-purple-900"
            >
              Home
            </Link>
            <Link
              to="/doctor/slot"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white hover:text-purple-900"
            >
              Slot
            </Link>
            <Link
              to="/doctor/patientList"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white hover:text-purple-900"
            >
              Patients
            </Link>
            {doctor.isAuthenticated && doctor.role === "doctor" ? (
              <>
                <Link
                  to="/doctor/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white hover:text-purple-900"
                >
                  KYC
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-purple-900 px-3 py-2 text-base font-medium bg-gray-100 hover:bg-white hover:text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/doctor/login"
                className="block px-3 py-2 text-base font-medium bg-gray-100 hover:bg-white hover:text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 rounded-md text-purple-900"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
