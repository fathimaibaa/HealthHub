import React from "react";
import Navbar from "../../Components/User/Navbar/Navbar";
import DoctorDetailsPage from "../../Components/User/SingleDoctor";

const singleDoctorDetails: React.FC = () => {
  return (
    <>
      <Navbar />

      <DoctorDetailsPage />
    </>
  );
};

export default singleDoctorDetails;
