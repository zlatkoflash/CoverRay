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

export default function ModalSignUp() {


  const clientSupabase = createClient();
  const router = useRouter();

  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const shopState = useSelector((state: RootState) => state.shop);

  const ___DoSignUp = async () => {
    console.log("Do SignUp");
    dispatch(authActions.setSignupProcessingStatus("processing"));
    const details = await getApiData<{ data: any, error: boolean, ok: boolean, errorMessage: string }>("/auth/sign-up", "POST", {
      email,
      password,
      confirmPassword
    }, "not-authorize", "application/json");
    console.log("details:", details);
    if (details.ok) {
      dispatch(authActions.setSignupProcessingStatus("success"));
      dispatch(authActions.setModalSignUpOpen(false));
      dispatch(shopActions.setShowModalCardPayment(true));
      clientSupabase.auth.setSession(
        {
          access_token: details.data.session.access_token,
          refresh_token: details.data.session.refresh_token,
          // user: details.data.user
        }
      );
      router.refresh();
    }
    else {
      dispatch(authActions.setSignupProcessingStatus("error"));
      dispatch(authActions.setSignupProcessingMessage(details.errorMessage));
    }
  }

  return (
    <div className={`modal-overlay ${authState.modalSignUpOpen ? "visible" : ""}`} id="accountModal">

      <div className="click-for-closing-area" style={{ zIndex: -1, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'transparent' }} onClick={() => { dispatch(authActions.setModalSignInOpen(false)) }}></div>

      <div className="modal-content">
        <div className="modal-icon account">👤</div>
        <div className="modal-title">Sign Up</div>
        <div className="modal-message">Sign up to save your design and enjoy faster checkout</div>

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

        <div className="divider-text">or sign up with email</div>

        <input type="email" className="modal-input" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="modal-input" placeholder="Password (6+ characters)" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type="password" className="modal-input" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />


        <div className="modal-actions">
          {
            // <button className="modal-btn primary" onClick={() => { }}>Sign Up</button>
          }
          <ZButton
            buttonVariant="modal-btn primary"
            loading={authState.signupProcessingStatus === "processing"}
            onClick={() => {
              ___DoSignUp();
            }}
            disabled={authState.signupProcessingStatus === "processing"}
          >Sign Up</ZButton>
          {
            authState.signupProcessingStatus === "error" &&
            <div className="modal-error">{authState.signupProcessingMessage}</div>
          }
          <div className="divider-text">Already have an account?</div>
          <button className="modal-btn secondary" onClick={() => {
            dispatch(authActions.setModalSignInOpen(true));
            dispatch(authActions.setModalSignUpOpen(false));
          }}>Sign In</button>
        </div>
      </div>
    </div>
  );
}