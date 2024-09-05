import React from "react";
import Navbar from "../../Components/User/Navbar/Navbar";
import AppointmentsListPage from "../../Components/User/AppoinmentList";

const AppoinmentListPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <AppointmentsListPage />
    </>
  );
};

export default AppoinmentListPage;
