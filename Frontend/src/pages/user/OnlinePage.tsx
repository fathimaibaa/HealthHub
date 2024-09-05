import React from "react";
import Navbar from "../../Components/User/Navbar/Navbar";
import OnlineDoctors from "../../Components/User/Online-consultation"

const OnlinePage: React.FC = () => {
  return (
    <>
      <Navbar />
      <OnlineDoctors />
    </>
  );
};

export default OnlinePage;
