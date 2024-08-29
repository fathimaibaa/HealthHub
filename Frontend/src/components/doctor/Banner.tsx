import React from 'react';
import doctor from '../../assets/images/doctor.jpeg'; 

const Banner: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between w-full h-[80vh] bg-white text-purple-900 py-12 lg:py-24 px-6 lg:px-20 rounded-lg shadow-md">
      <div className="lg:w-1/2 flex flex-col items-start justify-center text-left space-y-4">
        <h1 className="text-4xl lg:text-5xl font-bold">
          Welcome, Doctor!
        </h1>
        <p className="text-lg lg:text-xl font-light">
          Manage your appointments and patient information effortlessly with our platform.
        </p>
       
      </div>
      <div className="lg:w-1/2 flex justify-center lg:justify-end mt-8 lg:mt-0">
        <img
          src={doctor}
          alt="Doctor Consultation"
          className="w-full max-w-md lg:max-w-lg rounded-md shadow-lg"
        />
      </div>
    </div>
  );
};

export default Banner;
