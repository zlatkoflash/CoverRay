import { ISupabaseUser } from "@/utils/interfaceSupabase";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IAuthState {
  user: ISupabaseUser /*{
    id: string;
    email: string;
    name: string;
    role: "administrator" | "client";

  }*/ | null,
  // token: string,

  modalSignInOpen: boolean,
  modalSignUpOpen: boolean,

  logingProcessingStatus: "idle" | "processing" | "success" | "failed" | "error";
  logingProcessingMessage: string;

  signupProcessingStatus: "idle" | "processing" | "success" | "failed" | "error";
  signupProcessingMessage: string;

  modalIntentAfterSignIn: "CHECKOUT" | "SUBSCRIPTION",
  modalIntentAfterSignUp: "CHECKOUT" | "SUBSCRIPTION",
}


const initialState: IAuthState = {
  user: null,
  // token: "",

  modalSignInOpen: false,
  modalSignUpOpen: false,

  modalIntentAfterSignIn: "SUBSCRIPTION",
  modalIntentAfterSignUp: "SUBSCRIPTION",

  logingProcessingStatus: "idle",
  logingProcessingMessage: "",

  signupProcessingStatus: "idle",
  signupProcessingMessage: "",
}


export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IAuthState['user']>) => {
      state.user = action.payload;
    },
    /*setToken: (state, action: PayloadAction<IAuthState['token']>) => {
      state.token = action.payload;
    },*/

    setModalSignInOpen: (state, action: PayloadAction<{ open: boolean, intentAfterSignIn: "CHECKOUT" | "SUBSCRIPTION" }>) => {
      state.modalSignInOpen = action.payload.open;
      state.modalIntentAfterSignIn = action.payload.intentAfterSignIn;
    },
    setModalSignUpOpen: (state, action: PayloadAction<{ open: boolean, intentAfterSignUp: "CHECKOUT" | "SUBSCRIPTION" }>) => {
      state.modalSignUpOpen = action.payload.open;
      state.modalIntentAfterSignUp = action.payload.intentAfterSignUp;
    },

    setLogingProcessingStatus: (state, action: PayloadAction<IAuthState['logingProcessingStatus']>) => {
      state.logingProcessingStatus = action.payload;
    },
    setLogingProcessingMessage: (state, action: PayloadAction<IAuthState['logingProcessingMessage']>) => {
      state.logingProcessingMessage = action.payload;
    },

    setSignupProcessingStatus: (state, action: PayloadAction<IAuthState['signupProcessingStatus']>) => {
      state.signupProcessingStatus = action.payload;
    },
    setSignupProcessingMessage: (state, action: PayloadAction<IAuthState['signupProcessingMessage']>) => {
      state.signupProcessingMessage = action.payload;
    },
  },
});

export const selectIsLoggedIn = (state: IAuthState) => state.user !== null;
// export const 

export const authActions = authSlice.actions;
export default authSlice.reducer;
