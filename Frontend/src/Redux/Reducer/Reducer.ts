import { combineReducers } from "@reduxjs/toolkit";
import UserSlice from "../Slices/UserSlice";
import DoctorSlice from "../Slices/DoctorSlice";
import  setAppointmentData  from "../Slices/BookingSlice";

export const rootReducer = combineReducers({
  UserSlice,
  DoctorSlice,
  appointment : setAppointmentData

});
export type RootState = ReturnType<typeof rootReducer>;
