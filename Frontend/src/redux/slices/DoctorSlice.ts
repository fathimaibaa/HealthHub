import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DoctorState {
    name: string | null;
    isAuthenticated: boolean | null;
    role: string | null;
    id?: string | null;
    access_token?: string | null;
    refresh_token?: string | null;
  }

  const initialState: DoctorState = {
    name: null,
    isAuthenticated: null,
    role: null,
    id: null,
    access_token: null,
    refresh_token: null,
  };

  const Doctorslice = createSlice({
    name: "doctorSlice",
    initialState,
    reducers: {
      setDoctor: (state, action: PayloadAction<DoctorState>) => {
        return { ...state, ...action.payload };
      },
      setTokens: (
        state,
        action: PayloadAction<{ access_token: string; refresh_token: string }>
      ) => {
        const { access_token, refresh_token } = action.payload;
        state.access_token = access_token;
        state.refresh_token = refresh_token;
      },
      clearDoctor: () => initialState,
    },
    
  });
  
  export const { setDoctor, clearDoctor } = Doctorslice.actions;
  export default Doctorslice.reducer;