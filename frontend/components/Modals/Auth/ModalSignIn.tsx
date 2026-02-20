"use client";

import ZButton from "@/components/buttons/ZButton";
import { authActions } from "@/lib/features/auth/authSlice";
import { shopActions } from "@/lib/features/shop/shopSlice";
import { RootState } from "@/lib/store";
import { getApiData } from "@/utils/api";
import { createClient } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ModalSignIn() {

  const clientSupabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);
  const SignInProcessingStatus = authState.logingProcessingStatus;

  const ___StartSignIn = async () => {
    dispatch(authActions.setLogingProcessingStatus("processing"));
    const loginDetails = await getApiData<{
      data: { user: any, session: any },
      error: boolean,
      ok: boolean,
      errorMessage: string
    }>("/auth/sign-in", "POST", {
      email,
      password
    }, "not-authorize", "application/json");
    console.log("loginDetails:", loginDetails);
    if (loginDetails.ok) {
      dispatch(authActions.setLogingProcessingStatus("success"));
      dispatch(authActions.setModalSignInOpen({
        open: false,
        intentAfterSignIn: authState.modalIntentAfterSignIn
      }));
      const { data, error } = await clientSupabase.auth.setSession(
        {
          access_token: loginDetails.data.session.access_token,
          refresh_token: loginDetails.data.session.refresh_token,
          // user: loginDetails.data.user
        }
      );
      console.log("setSession:", data, error);
      if (error) {
        dispatch(authActions.setLogingProcessingStatus("error"));
        dispatch(authActions.setLogingProcessingMessage(error.message));
        return;
      }
      if (authState.modalIntentAfterSignIn === "CHECKOUT") {
        dispatch(shopActions.setShowModalCardPayment(true));
      }
      router.refresh();
    }
    else {
      dispatch(authActions.setLogingProcessingStatus("error"));
      dispatch(authActions.setLogingProcessingMessage(loginDetails.errorMessage));
    }


  }

  return (
    <div className={`modal-overlay ${authState.modalSignInOpen ? "visible" : ""}`} id="accountModal">
      <div className="click-for-closing-area" style={{ zIndex: -1, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'transparent' }} onClick={() => {
        dispatch(authActions.setModalSignInOpen({
          open: false,
          intentAfterSignIn: authState.modalIntentAfterSignIn
        }))
      }}></div>
      <div className="modal-content">
        <div className="modal-icon account">👤</div>
        <div className="modal-title">Sign In</div>
        <div className="modal-message">Sign in to save your design and enjoy faster checkout</div>

        <div className="social-grid">
          <button className="social-btn google" onClick={() => { }}>
            <div className="social-icon">G</div>
            Google
          </button>
          <button className="social-btn apple" onClick={() => { }}>
            <div className="social-icon"></div>
            Apple
          </button>
          <button className="social-btn facebook" onClick={() => { }}>
            <div className="social-icon">f</div>
            Facebook
          </button>
        </div>

        <div className="divider-text">or sign in with email</div>

        <input type="email" className="modal-input" placeholder="Email address" value={email} onChange={(e) => { setEmail(e.target.value) }} />
        <input type="password" className="modal-input" placeholder="Password (6+ characters)" value={password} onChange={(e) => { setPassword(e.target.value) }} />

        <div className="modal-actions">
          {
            //<button className="modal-btn primary" onClick={() => { }}>Sign In</button>
          }
          <ZButton
            buttonVariant="modal-btn primary"
            loading={SignInProcessingStatus === "processing"}
            onClick={() => {

              ___StartSignIn()

            }}>Sign In</ZButton>

          {
            SignInProcessingStatus === "error" &&
            <div className="modal-error">{authState.logingProcessingMessage}</div>
          }

          <div className="divider-text">Don't have an account?</div>
          <button className="modal-btn secondary" onClick={() => {
            dispatch(authActions.setModalSignInOpen({
              open: false,
              intentAfterSignIn: authState.modalIntentAfterSignIn
            }));
            dispatch(authActions.setModalSignUpOpen({
              open: true,
              intentAfterSignUp: authState.modalIntentAfterSignIn
            }));
          }}>Create Account</button>
        </div>
      </div>
    </div>
  );
}