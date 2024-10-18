import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppointmentState {
  doctorId: string;
  doctorName: string;
  doctorImage:string;
  fee: number;
  timeSlot: string;
  date: string;
  patientName: string;
  patientAge: number;
  patientNumber: string;
  patientProblem: string;
}

const initialState: AppointmentState = {
  doctorId: "",
  doctorName: "",
  doctorImage :"",
  fee: 0,
  timeSlot: "",
  date: "",
  patientName: "",
  patientAge: 0,
  patientNumber: "",
  patientProblem: "",
};

const appointmentSlice = createSlice({
  name: "appointmentSlice",
  initialState,
  reducers: {
    setAppointmentData: (state, action: PayloadAction<AppointmentState>) => {
      return { ...state, ...action.payload };
    },
    clearAppointmentData: () => initialState,
  },
});

export const { setAppointmentData, clearAppointmentData } = appointmentSlice.actions;
export default appointmentSlice.reducer;
