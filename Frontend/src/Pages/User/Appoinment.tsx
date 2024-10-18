import React from 'react';
// import Footer from '../../Components/User/Footer/Footer';
import Navbar from '../../Components/User/Navbar/Navbar';
import AppointmentBookingPage from '../../Components/User/BookingPage';



const DoctorList: React.FC = () => {
  return (
    <>
      <Navbar />
      <AppointmentBookingPage/>
      {/* <Footer /> */}
    </>
  );
};

export default DoctorList;