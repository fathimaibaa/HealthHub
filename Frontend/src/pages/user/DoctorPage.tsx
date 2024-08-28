import React from 'react';
import Footer from '../../components/user/Footer/Footer';
import Navbar from '../../components/user/Navbar/Navbar';
import DoctorListingPage from '../../components/user/DoctorListPage';



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
