import React from 'react';
import Footer from '../../Components/User/Footer/Footer';
import Navbar from '../../Components/User/Navbar/Navbar';
import DoctorListingPage from '../../Components/User/DoctorListPage';



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
