import React from 'react';
import Footer from '../../zzzz/User/Footer/Footer';
import Navbar from '../../zzzz/User/Navbar/Navbar';
import DoctorListingPage from '../../zzzz/User/DoctorListPage';



const DoctorList: React.FC = () => {
  return (
    <>
      <Navbar />
      <DoctorListingPage/>
      <Footer />
    </>
  );
};

export default DoctorList;
