import React from "react";
import Navbar from "../../zzzz/Doctor/Navbar/Navbar";
import Navbars from "../../zzzz/Doctor/Navbar/Navbar";
import DocumentList from "../../zzzz/Doctor/DocumentList";
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