import { FC } from "react";
import { useAppSelector } from "../Redux/Store/Store";
import { Navigate,Outlet } from "react-router-dom";
import ZegoCloud from "../utils/ZegoService";


const ProtectedRoute: FC = () => {
    const { isAuthenticated, role } = useAppSelector((state) => state.UserSlice);
    return isAuthenticated && role === "user" ? (
    <ZegoCloud>
      <Outlet />
    </ZegoCloud>
    ) : (
      <Navigate to={"/user/login"} replace />
    );
  };

  export const DoctorProtectedRoute: FC = () => {
    const { isAuthenticated, role } = useAppSelector((state) => state.DoctorSlice);
    return isAuthenticated && role === "doctor" ? (
      <Outlet />
    ) : (
      <Navigate to={"/doctor/login"} replace />
    );
  };
  
  export const AdminProtectedRoute: FC = () => {
    const { isAuthenticated, role } = useAppSelector((state) => state.UserSlice);
    return isAuthenticated !== null && role === "admin" ? (
      <Outlet />
    ) : (
      <Navigate to={"/admin/login"} replace />
    );
  };
  
  export default ProtectedRoute;