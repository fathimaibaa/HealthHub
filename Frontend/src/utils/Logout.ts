import showToast, { ToastType } from "./Toaster";
import store from "../rrrr/Store/Store";
import { clearUser } from "../rrrr/Slices/UserSlice";
import { clearDoctor } from "../rrrr/Slices/DoctorSlice";

const logout = (message: string, type: ToastType = "success"): void => {
  store.dispatch(clearUser());
  showToast(message, type);
};

 export const doctorlogout = (message: string, type: ToastType = "success"): void => {
  store.dispatch(clearDoctor());
  showToast(message, type);
};

export default logout;