"use client";

import Image from "next/image";
import the_logo from "./../../assets/images/logo.webp"
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
// import BtnSaveForLater from "./BtnSaveForLater";
import { usePathname, useRouter } from "next/navigation";

import dynamic from "next/dynamic";
import { createClient } from "@/utils/supabase";
import { LogIn } from "lucide-react";
import { authActions } from "@/lib/features/auth/authSlice";
import BtnSaveForPaymentPurposesWrap from "@/app/Editor/Template/[template_slug]/BtnSaveForPaymentPurposesWrap";
import BtnSaveForLaterClient from "./BtnSaveForLaterClient";

const BtnSaveForLater = dynamic(
  () => import('./BtnSaveForLater'),
  { ssr: false }
);


export default function Header(
  { continueLink, customContinueButton }:
    { continueLink?: string, customContinueButton?: React.ReactNode }) {


  const supabase = createClient();
  const router = useRouter();

  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);

  const selectedTemplate = useSelector((state: RootState) => state.template.selectedTemplate);
  // const continueButtonDisabled = useSelector((state: RootState) => state.template.ContinueButttonDisabled);
  // const items = useSelector((state: RootState) => state.editor.items);
  // const items = useSelector((state: RootState) => state.editor.konvaData?.pages[0].children);

  const pathname = usePathname();

  // Check if the path includes the specific segments
  const isTemplateEditor = pathname?.includes('Editor/Template');
  const isCheckout = pathname?.includes('/checkout');

  const _continueLink = () => {
    if (selectedTemplate) {
      return `/Editor/Template/${selectedTemplate.slug}`
    }
    return continueLink ? continueLink : "/";
  }

  const __DOLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
    }
    router.refresh();
  }

  return (
    <>
      <header className="app-header">
        <div className="header-left">
          <Link href="/">
            <Image src={the_logo} alt="Logo" className="logo" width={400} height={400} />
          </Link>
          <nav className="header-nav" style={{
            // pointerEvents: "none"
          }}>
            <Link href="/" className={`nav-step ${pathname === "/" ? "active" : ""} ${isTemplateEditor || isCheckout ? "completed" : ""}`} onClick={() => {
              // console.log("goToScreen(1):");
            }}>
              <div className="nav-step-number">✓</div>
              <span>Magazine</span>
            </Link>

            <Link
              style={{
                pointerEvents: selectedTemplate == null ? "none" : "auto",
                opacity: selectedTemplate == null ? 0.5 : 1,
              }}
              href={`${selectedTemplate ? `/Editor/Template/${selectedTemplate.slug}` : "/Editor"}`} className={`nav-step ${isTemplateEditor ? "active" : ""} ${isCheckout ? "completed" : ""}`} onClick={() => {
                // console.log("goToScreen(1):");
              }}>
              <div className="nav-step-number">2</div>
              <span>Editor</span>
            </Link>

            <Link
              style={{
                pointerEvents: "none"
              }}
              href="/Checkout" className={`nav-step ${isCheckout ? "active" : ""}`} onClick={() => {
                // console.log("goToScreen(1):");
              }}>
              <div className="nav-step-number">3</div>
              <span>Checkout</span>
            </Link>
          </nav>
        </div>
        <div className="header-right">
          {
            // isTemplateEditor && items.length > 0 && <BtnSaveForLater />
          }
          {
            /*<button className="btn btn-primary" id="headerCTA" onClick={() => {
            console.log("nextStep()");
          }}>Continue →</button>*/
          }

          {
            isTemplateEditor && <BtnSaveForLaterClient />
          }

          {
            // here customContinueButton come from out
            // customContinueButton !== undefined && customContinueButton
            isTemplateEditor ? <BtnSaveForPaymentPurposesWrap /> : <Link href={_continueLink()}
              className={`btn btn-primary `} id="headerCTA" onClick={() => {
                console.log("nextStep()");
              }}
              style={{
                pointerEvents: selectedTemplate == null ? "none" : "auto",
                opacity: selectedTemplate == null ? 0.5 : 1,
              }}
            >
              Continue →
            </Link>
          }
          {
            // when we have custom button customContinueButton, we don't show 
            /*<Link href={_continueLink()} 
            customContinueButton === undefined && <Link href={_continueLink()}
              className={`btn btn-primary `} id="headerCTA" onClick={() => {
                console.log("nextStep()");
              }}
              style={{
                pointerEvents: selectedTemplate == null ? "none" : "auto",
                opacity: selectedTemplate == null ? 0.5 : 1,
              }}
            >
              Continue →
            </Link> */
          }

          {
            authState.user !== null && <Link href="/Profile" onClick={(e) => {
              console.log("logout");
              e.preventDefault();

              __DOLogout();
            }} className="btn btn-primary">Logout</Link>
          }
          {
            authState.user === null && <Link href="/Login" onClick={(e) => {
              console.log("login");
              e.preventDefault();
              dispatch(authActions.setModalSignInOpen({
                open: true,
                intentAfterSignIn: "SUBSCRIPTION"
              }));
            }} className="btn btn-secondary">
              Login 👤
            </Link>
          }

        </div>
      </header>
    </>
  );
}