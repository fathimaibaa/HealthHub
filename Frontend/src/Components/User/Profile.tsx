import React from 'react';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';
import useProfile from "../../Hooks/UserProfile";
import { MdOutlineModeEdit } from "react-icons/md";
import { BsWallet } from "react-icons/bs";
import { Link } from "react-router-dom";


const Profile: React.FC = () => {
  const {
    profile,
    formData,
    imagePreview,
    handleInputChange,
    handleSubmit,
  } = useProfile();

  return (
    <>
      <Navbar />
      <h2 className="text-4xl font-bold mt-6 text-center text-fuchsia-950">Profile</h2>
      <div className="flex items-center justify-center bg-cover bg-center bg-no-repeat min-h-screen bg-gray-200">
        <Link
            to="/user/wallet"
            className="absolute top-4 right-4 bg-blue-100 hover:bg-blue-200 text-blue-900 rounded-md p-2 flex items-center"
          >
            <BsWallet className="h-7 w-7" />
            <span className="ml-2">Wallet</span>
          </Link>

        <div className="flex flex-col items-center w-full md:w-3/5 lg:w-2/5 bg-white rounded-lg p-6 shadow-xl">
          <div className="relative mb-4">
            <img
              src={
                imagePreview
                  ? imagePreview
                  : profile?.profilePicture ?? "https://picsum.photos/200/"
              }
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-gray-300 shadow-sm"
            />
            <label
              htmlFor="profile-image"
              className="absolute bottom-0 right-0 bg-fuchsia-800 text-white rounded-full cursor-pointer border-2 border-white p-1"
            >
              <input
                type="file"
                id="profile-image"
                name="imageFile"
                className="hidden"
                onChange={handleInputChange}
              />
              <MdOutlineModeEdit />
            </label>
          </div>
          <div className="w-full p-6 mb-3 rounded-lg shadow-lg bg-white">
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-semibold">Name:</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                name="name"
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-semibold">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profile?.email ?? ""}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="age" className="block text-gray-700 font-semibold">Age:</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData?.age ?? ""}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block text-gray-700 font-semibold">Phone Number:</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData?.phoneNumber ?? ""}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="gender" className="block text-gray-700 font-semibold">Gender:</label>
              <select
                id="gender"
                name="gender"
                value={formData?.gender ?? ""}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option className="text-gray-700" value="male">Male</option>
                <option className="text-gray-700" value="female">Female</option>
                <option className="text-gray-700" value="others">Others</option>
              </select>
            </div>
            <button
              className="bg-fuchsia-950 text-white py-2 px-4 mt-3 rounded-md hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              onClick={handleSubmit}
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
