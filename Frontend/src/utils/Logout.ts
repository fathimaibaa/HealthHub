import showToast, { ToastType } from "./Toaster";
import store from "../Redux/Store/Store";
import { clearUser } from "../Redux/Slices/UserSlice";
import { clearDoctor } from "../Redux/Slices/DoctorSlice";

const logout = (message: string, type: ToastType = "success"): void => {
  store.dispatch(clearUser());
  showToast(message, type);
};

 export const doctorlogout = (message: string, type: ToastType = "success"): void => {
  store.dispatch(clearDoctor());
  showToast(message, type);
};

export default logout;