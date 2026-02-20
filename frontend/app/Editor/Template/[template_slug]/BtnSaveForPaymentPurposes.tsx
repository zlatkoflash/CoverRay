"use client";

import { INDEX_DB_TEMPLATE_REF_FOR_PAYMENT, LS_GetTemplateFromIndexDB, LS_SaveCoverAndPDF_ForFinalPayment, LS_SaveTemplateIntoIndexDB } from "@/utils/editor-local-storage";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { ITemplate } from "@/utils/interfaceDatabase";
import { canvasRefs } from "../../../../components/Editor/KonvaStage";
import { IEditedTemplateForSave } from "@/lib/features/editor/editorSlice";
import { useState } from "react";
import Konva from "konva";
import { POSTER_H, POSTER_W } from "@/utils/editor";
import { useRouter } from "next/navigation";
import { GetKonvaBlob, getKonvaPDF } from "@/components/Editor/utils/KonvaScripts";

interface SaveTemplateParams {
  canvasRefs: { pageGroup: any };
  view: any;
  konvaData: any;
  template: any;
  imageCoverURL: string;
  router: any;
  GetKonvaBlob: Function;
  getKonvaPDF: Function;
}

/**
 * Global function to handle high-quality saving, 
 * local storage caching, and navigation to checkout.
 */
export const globalSaveTemplateAndRedirect = async ({
  canvasRefs,
  view,
  konvaData,
  template,
  imageCoverURL,
  router,
  GetKonvaBlob,
  getKonvaPDF
}: SaveTemplateParams) => {

  if (!canvasRefs.pageGroup) return;
  const group = canvasRefs.pageGroup;
  const stage = group?.getStage();

  if (!group || !stage) return;

  try {
    // 1. Generate low-res thumbnail for the UI/Review
    const thumbData = await GetKonvaBlob(0.8, 0.5, view, "generateAsBlob");
    const thumbnailDataUrl = URL.createObjectURL(thumbData?.blob as Blob);

    // 2. Prepare and save main template data
    const detailsForSaving = {
      konvaData,
      templateDB: template,
      coverImageURL: imageCoverURL,
      thumbnailDataUrl: thumbnailDataUrl
    };

    await LS_SaveTemplateIntoIndexDB(detailsForSaving, INDEX_DB_TEMPLATE_REF_FOR_PAYMENT);

    // 3. Generate HIGH-RES image and PDF for the actual print/product
    const highResDataUrl = await GetKonvaBlob(0.95, 1.4, view, "generateAsDataUrl");

    // Generate PDF
    const konvaPDF = await getKonvaPDF(highResDataUrl?.dataUrl as string, view);
    const pdfBlob = konvaPDF.output("blob");

    // Get final high-res image blob
    const highResBlobData = await GetKonvaBlob(0.95, 1.4, view, "generateAsBlob");
    const imageBlob = highResBlobData?.blob as Blob;

    // 4. Save Final Blobs to IndexedDB for Checkout
    await LS_SaveCoverAndPDF_ForFinalPayment(imageBlob, pdfBlob);

    // 5. Navigate
    router.push("/checkout");

    return { success: true, thumbnailUrl: thumbnailDataUrl };

  } catch (error) {
    console.error("Global Save Error:", error);
    return { success: false, error };
  }
};



export default function BtnSaveForPaymentPurposes() {

  const stateEditor = useSelector((state: RootState) => state.editor);
  // const items = stateEditor.items;
  const konvaData = stateEditor.konvaData;
  const template = useSelector((state: RootState) => state.template.selectedTemplate);
  const imageCoverURL = stateEditor.imageUrl;
  const view = stateEditor.view;

  const [temporaryImageUrl, setTemporaryImageUrl] = useState<string>("");

  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);



  const ___ProcessAndRedirectToCheckout = async () => {
    setIsProcessing(true);
    await globalSaveTemplateAndRedirect({
      canvasRefs,
      view,
      konvaData,
      template,
      imageCoverURL: imageCoverURL as string,
      router,
      GetKonvaBlob,
      getKonvaPDF
    });
    // setIsProcessing(false);
  }

  return (
    <>
      <Link href={"/"}

        className={`btn btn-primary `} id="headerCTA" onClick={(e) => {
          console.log("nextStep()");
          e.preventDefault();
          // this is for testing purposes
          // __SaveTemplateForPaymentPurposes();
          // __SaveTemplateToIndexDB();
          /*globalSaveTemplateAndRedirect({
            canvasRefs,
            view,
            konvaData,
            template,
            imageCoverURL: imageCoverURL as string,
            router,
            GetKonvaBlob,
            getKonvaPDF
          });*/
          ___ProcessAndRedirectToCheckout();
        }}
        style={{
          // pointerEvents: continueButtonDisabled ? "none" : "auto",
          // opacity: continueButtonDisabled ? 0.5 : 1,
          pointerEvents: isProcessing ? "none" : "auto",
          opacity: isProcessing ? 0.5 : 1,
        }}
      >
        {isProcessing ? "Processing..." : "Continue →"}
      </Link>

      {
        // debugging image
        // <img src={temporaryImageUrl} alt="temporaryImageUrl" style={{ width: "1000px", height: "auto", position: "fixed", bottom: "10px", right: "10px" }} />
      }

    </>

  );
}