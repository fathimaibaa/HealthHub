import React from "react";
import Navbar from "../../components/user/Navbar/Navbar";
import Navbars from "../../components/user/Navbar/Navbar";
import DocumentList from "../../components/user/DocumentList";
import { useAppSelector } from "../../redux/store/Store";

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
