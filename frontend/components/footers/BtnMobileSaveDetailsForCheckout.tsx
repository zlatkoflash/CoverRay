"use client";

import { globalSaveTemplateAndRedirect } from "@/app/Editor/Template/[template_slug]/BtnSaveForPaymentPurposes";
import { RootState } from "@/lib/store";
import { useState } from "react";
import { canvasRefs } from "../Editor/KonvaStage";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { GetKonvaBlob, getKonvaPDF } from "../Editor/utils/KonvaScripts";

export default function BtnMobileSaveDetailsForCheckout() {


  const [loading, setLoading] = useState(false);

  const stateEditor = useSelector((state: RootState) => state.editor);
  const stateTemplate = useSelector((state: RootState) => state.template);
  // const canvasRefs = useSelector((state: RootState) => state.editor.canvasRefs);
  const view = stateEditor.view;
  const konvaData = stateEditor.konvaData;
  const template = stateTemplate.selectedTemplate;
  const imageCoverURL = stateEditor.imageUrl;
  const router = useRouter();

  const PrepareAndRedirectToCheckout = async () => {
    setLoading(true);
    await globalSaveTemplateAndRedirect({
      canvasRefs: canvasRefs,
      view,
      konvaData,
      template,
      imageCoverURL: imageCoverURL as string,
      router,
      GetKonvaBlob,
      getKonvaPDF
    });
    setLoading(false);
  }

  return <>
    <button className="footer-btn primary" onClick={() => {
      PrepareAndRedirectToCheckout();
    }}>
      {loading ? "Processing..." : "Checkout →"}
    </button>
  </>
}
