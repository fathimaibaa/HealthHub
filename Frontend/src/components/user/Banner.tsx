import React from 'react';
import doctorWindow from '../../Assets/Images/doctorWindow.png'; 

const Banner: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between w-full h-[80vh] bg-purple-900 text-white py-12 lg:py-24 px-6 lg:px-20 rounded-lg shadow-md">
      <div className="lg:w-1/2 flex flex-col items-start justify-center text-left space-y-4">
        <h1 className="text-4xl lg:text-5xl font-bold">
          Effortless Doctor Appointments
        </h1>
        <p className="text-lg lg:text-xl font-light">
          Streamline your healthcare experience with our intuitive scheduling platform.
        </p>
        
      </div>
      <div className="lg:w-1/2 flex justify-center lg:justify-end mt-8 lg:mt-0">
        <img
          src={doctorWindow}
          alt="Doctor Consultation"
          className="w-full max-w-md lg:max-w-lg rounded-md "
        />
      </div>
    </div>
  );
};

export default Banner;
