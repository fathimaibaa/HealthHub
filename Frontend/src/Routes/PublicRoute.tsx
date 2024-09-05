import { FC } from "react";
import { useAppSelector } from "../Redux/Store/Store";
import { Navigate, Outlet } from "react-router-dom";


export const PublicRoute: FC = () => {
    const { isAuthenticated, role } = useAppSelector((state) => state.UserSlice);
    if (role === "user") {
      return isAuthenticated ? <Navigate to={"/"} replace /> : <Outlet />;
    }   else if (role === "admin") {
        return isAuthenticated ? (<Navigate to={"/admin"} replace />) : ( <Outlet /> );
      }
    return <Outlet />; 
  };
  

  export const DoctorPublicRoute: FC = () => {
    const { isAuthenticated, role } = useAppSelector((state) => state.DoctorSlice);
    if (role === "doctor") {
      return isAuthenticated ? <Navigate to={"/doctor"} replace /> : <Outlet />;
    } 
    return <Outlet />; 
  };
  
