import React from "react";
import Navbar from "../../components/user/Navbar/Navbar";
import OnlineDoctors from "../../components/user/Online-consultation"

const OnlinePage: React.FC = () => {
  return (
    <>
      <Navbar />
      <OnlineDoctors />
    </>
  );
};

export default OnlinePage;
