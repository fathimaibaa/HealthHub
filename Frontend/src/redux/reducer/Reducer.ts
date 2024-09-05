import { combineReducers } from "@reduxjs/toolkit";
import UserSlice from "../Slices/UserSlice";
import DoctorSlice from "../Slices/DoctorSlice";

export const rootReducer = combineReducers({
  UserSlice,
  DoctorSlice,

});
export type RootState = ReturnType<typeof rootReducer>;
