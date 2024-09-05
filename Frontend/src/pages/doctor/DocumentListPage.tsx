import React from "react";
import Navbar from "../../components/doctor/Navbar/Navbar";
import Navbars from "../../components/doctor/Navbar/Navbar";
import DocumentList from "../../components/doctor/DocumentList";
import { useAppSelector } from "../../redux/store/Store";

const DocumentListPage: React.FC = () => {
  const user = useAppSelector((state) => state.UserSlice);
  return (
    <>
     {user.role === "user" ? (
      <Navbar />):(

      <Navbars/>
      )}
      <DocumentList />
    </>
  );
};

export default DocumentListPage;