import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../Redux/Reducer/Reducer";
import showToast from "../../../uuu/Toaster";
import { clearUser } from "../../../Redux/Slices/UserSlice";
import logo from '../../../Assets/Images/logo.png';
import { removeItemFromLocalStorage } from "../../../uuu/Setnget";
import { FiMenu, FiX } from 'react-icons/fi'; 

const Navbar: React.FC = () => {
  const user = useSelector((state: RootState) => state.UserSlice);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(clearUser());
    removeItemFromLocalStorage("access_token");
    removeItemFromLocalStorage("refresh_token");
    showToast("Logged out successfully", "success");
    navigate("/user/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-purple-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-6">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src={logo} alt="HealthHub Logo" className="h-10" />
            <span className="self-center text-4xl font-semibold whitespace-nowrap dark:text-white">HealthHub</span>
          </Link>
        </div>
        {/* Hamburger Icon */}
        <div className="flex md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white hover:text-gray-300 focus:outline-none focus:text-gray-300"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />} {/* Menu toggle icon */}
          </button>
        </div>
        {/* Navigation Links */}
        <div className="hidden md:flex items-center mr-20">
          <Link
            to="/"
            className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white hover:text-purple-900 md:ml-2"
          >
            Home
          </Link>
          
          <Link to="/user/profile" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white hover:text-purple-900 md:ml-2">Profile</Link>

          <Link
            to="/user/doctor"
            className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white hover:text-purple-900 md:ml-2"
          >
            Doctors
          </Link>
          <Link to="/user/aboutus" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white hover:text-purple-900 md:ml-2">About us</Link>


          <Link to="/user/contact" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white hover:text-purple-900 md:ml-2">Contact us</Link>
          {/* Profile and Login/Logout */}
          {user.isAuthenticated && user.role === "user" ? (
            <>
              <Link
                to="/user/appoinmentlist"
                className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white hover:text-purple-900 md:ml-2"
              >
                Appointments
              </Link>
              
              <button
                onClick={handleLogout}
                className="text-purple-900 px-3 py-2 text-sm font-medium bg-gray-100 hover:bg-white hover:text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 rounded-md mt-2 md:mt-0 md:ml-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/user/login"
                className="px-3 py-2 text-sm font-medium bg-gray-100 hover:bg-white hover:text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 rounded-md mt-2 md:mt-0 md:ml-2 text-purple-900"
              >
                Patient Login
              </Link>
              
              <Link
                to="/doctor/login"
                className="px-3 py-2 text-sm font-medium bg-gray-100 hover:bg-white hover:text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 rounded-md mt-2 md:mt-0 md:ml-2 text-purple-900"
              >
                Doctor Login
              </Link>
            </>
          )}
        </div>
      </div>
  
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white hover:text-purple-900"
            >
              Home
            </Link>
            <Link
              to="/user/aboutus"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white hover:text-purple-900"
            >
              About Us
            </Link>
            <Link
              to="/user/doctor"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white hover:text-purple-900"
            >
              Doctors
            </Link>
            {user.isAuthenticated && user.role === "user" ? (
              <>
                <Link
                  to="/user/appoinmentlist"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white hover:text-purple-900"
                >
                  Appointments
                </Link>
                <Link
                  to="/user/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white hover:text-purple-900"
                >
                  Profile
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="w-full text-purple-900 px-3 py-2 text-base font-medium bg-gray-100 hover:bg-white hover:text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/user/login"
                  className="block px-3 py-2 text-base font-medium bg-gray-100 hover:bg-white hover:text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 rounded-md text-purple-900"
                >
                  Patient Login
                </Link>
                
                <Link
                  to="/doctor/login"
                  className="block px-3 py-2 text-base font-medium bg-gray-100 hover:bg-white hover:text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 rounded-md text-purple-900"
                >
                  Doctor Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
