"use client";

import Image from "next/image";
import the_logo from "./../../assets/images/logo.webp"
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
// import BtnSaveForLater from "./BtnSaveForLater";
import { usePathname, useRouter } from "next/navigation";

import dynamic from "next/dynamic";
import { createClient } from "@/utils/supabase";

const BtnSaveForLater = dynamic(
  () => import('./BtnSaveForLater'),
  { ssr: false }
);


export default function Header(
  { continueLink, customContinueButton }:
    { continueLink?: string, customContinueButton?: React.ReactNode }) {


  const supabase = createClient();
  const router = useRouter();

  const authState = useSelector((state: RootState) => state.auth);

  const selectedTemplate = useSelector((state: RootState) => state.template.selectedTemplate);
  const continueButtonDisabled = useSelector((state: RootState) => state.template.ContinueButttonDisabled);
  const items = useSelector((state: RootState) => state.editor.items);

  const pathname = usePathname();

  // Check if the path includes the specific segments
  const isTemplateEditor = pathname?.includes('Editor/Template');

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
          <Image src={the_logo} alt="Logo" className="logo" width={400} height={400} />
          <nav className="header-nav">
            <Link href="/" className="nav-step completed" onClick={() => {
              // console.log("goToScreen(1):");
            }}>
              <div className="nav-step-number">✓</div>
              <span>Magazine</span>
            </Link>

            <Link href="/Editor" className="nav-step active" onClick={() => {
              // console.log("goToScreen(1):");
            }}>
              <div className="nav-step-number">2</div>
              <span>Editor</span>
            </Link>

            <Link href="/Checkout" className="nav-step " onClick={() => {
              // console.log("goToScreen(1):");
            }}>
              <div className="nav-step-number">3</div>
              <span>Checkout</span>
            </Link>
          </nav>
        </div>
        <div className="header-right">
          {
            isTemplateEditor && items.length > 0 && <BtnSaveForLater />
          }
          {
            /*<button className="btn btn-primary" id="headerCTA" onClick={() => {
            console.log("nextStep()");
          }}>Continue →</button>*/
          }

          {
            customContinueButton !== undefined && customContinueButton
          }
          {
            customContinueButton === undefined && <Link href={_continueLink()}
              className={`btn btn-primary `} id="headerCTA" onClick={() => {
                console.log("nextStep()");
              }}
              style={{
                pointerEvents: continueButtonDisabled ? "none" : "auto",
                opacity: continueButtonDisabled ? 0.5 : 1,
              }}
            >
              Continue →
            </Link>
          }

          {
            authState.user !== null && <Link href="/Profile" onClick={(e) => {
              console.log("logout");
              e.preventDefault();

              __DOLogout();
            }} className="btn btn-primary">Logout</Link>
          }

        </div>
      </header>
    </>
  );
}