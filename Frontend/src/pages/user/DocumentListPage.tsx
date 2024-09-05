import React from "react";
import Navbar from "../../Components/User/Navbar/Navbar";
import Navbars from "../../Components/User/Navbar/Navbar";
import DocumentList from "../../Components/User/DocumentList";
import { useAppSelector } from "../../Redux/Store/Store";

const DocumentListPageUser: React.FC = () => {
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

export default DocumentListPageUser;
