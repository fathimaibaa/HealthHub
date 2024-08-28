import React from 'react';
import {   FaUser,FaCog } from 'react-icons/fa';

const AdminHeader: React.FC = () => {
  return (
    <header className="bg-purple-900 text-white py-5 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-semibold"></h1>
      <div className="flex items-center space-x-6">

      <button className="focus:outline-none">
          <FaCog className="text-xl text-white-300 hover:text-white " />
        </button>

        <button className="focus:outline-none">
          <FaUser className="text-xl text-white-300 hover:text-white " />
        </button>

      </div>
    </header>
  );
};

export default AdminHeader;
