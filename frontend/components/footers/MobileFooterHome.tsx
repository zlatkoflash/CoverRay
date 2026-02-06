"use client";
import { RootState } from "@/lib/store";
import Link from "next/link";
import { useSelector } from "react-redux";

// Required if you are using state or click handlers

export default function MobileFooterHome({ selectedMagazine = "Dogue" }) {

  const templateState = useSelector((state: RootState) => state.template);

  /*const handleNextStep = () => {
    // In React/Next.js, use a state manager or router instead of goToScreen(2)
    console.log("Navigating to step 2...");
    // Example: router.push('/upload');
    
  };*/

  return (
    <div className="mobile-footer screen1-footer">
      <div className="footer-info">
        Step 1 of 3 • Selected: <span className="highlight" id="selectedMagName">{selectedMagazine}</span>
      </div>

      <Link
        style={{
          textDecoration: "none",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: templateState.selectedTemplate === null ? 0.5 : 1,
          pointerEvents: templateState.selectedTemplate === null ? "none" : "auto",
          cursor: templateState.selectedTemplate === null ? "none" : "pointer",
        }}
        className="footer-btn-full"
        // type="button"
        // onClick={handleNextStep}
        href={`/Editor/Template/${templateState.selectedTemplate?.slug}`}
      >
        Upload Your Photo <span style={{ marginLeft: '6px' }}>→</span>
      </Link>

      <div className="trust-indicator">
        <span>⚡ 30 sec</span>
        <span>🔒 Secure</span>
        <span>✓ No signup</span>
      </div>
    </div>
  );
}