import React from "react";
import Navbar from "../../components/user/Navbar/Navbar";
import AppointmentsListPage from "../../components/user/AppoinmentList";

const AppoinmentListPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <AppointmentsListPage />
    </>
  );
};

export default AppoinmentListPage;
