import React from "react";
import Navbar from "../../Components/Doctor/Navbar/Navbar";
import Navbars from "../../Components/Doctor/Navbar/Navbar";
import DocumentList from "../../Components/Doctor/DocumentList";
import { useAppSelector } from "../../Redux/Store/Store";

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