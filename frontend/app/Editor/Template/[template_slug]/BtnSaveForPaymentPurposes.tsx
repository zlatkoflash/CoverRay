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


export default function BtnSaveForPaymentPurposes() {

  const items = useSelector((state: RootState) => state.editor.items);
  const template = useSelector((state: RootState) => state.template.selectedTemplate);
  const imageCoverURL = useSelector((state: RootState) => state.editor.imageUrl);
  const view = useSelector((state: RootState) => state.editor.view);

  const [temporaryImageUrl, setTemporaryImageUrl] = useState<string>("");

  const router = useRouter();


  const __SaveTemplateToIndexDB = async () => {

    if (!canvasRefs.pageGroup) return;
    console.log("__SaveTemplateForPaymentPurposes():");
    // console.log("canvasRefs.pageGroup:", canvasRefs.pageGroup?.toObject());
    // const jsonCanva = canvasRefs.pageGroup?.toObject();
    // console.log("jsonCanva:", jsonCanva);

    const group = canvasRefs.pageGroup;
    const stage = group?.getStage(); // Get the stage reference

    if (!group || !stage) return;

    // 1. Get the absolute position of the group on the stage
    // This ignores shadows, strokes, or overlapping elements
    const transform = group.getAbsoluteTransform().getTranslation();

    const detailsForThumbnail = await GetKonvaBlob(
      .8, // quality
      .5, // scaleThePoster
      view,
      "generateAsBlob"
    );
    const generatedThumbnailUrl = URL.createObjectURL(detailsForThumbnail?.blob as Blob);

    /**
     * Saving the details about the template for processing to purchasing
     */
    // console.log("thumbnailDataUrl:", thumbnailDataUrl);
    const detailsForSaving = {
      edited_template_items: items,
      template: template as ITemplate,
      coverImageURL: imageCoverURL as string,
      thumbnailDataUrl: generatedThumbnailUrl
    } as IEditedTemplateForSave;
    console.log("detailsForSaving:", detailsForSaving);
    await LS_SaveTemplateIntoIndexDB(detailsForSaving, INDEX_DB_TEMPLATE_REF_FOR_PAYMENT);
    // template

    const detailsLoadTemp = await LS_GetTemplateFromIndexDB(INDEX_DB_TEMPLATE_REF_FOR_PAYMENT);
    console.log("detailsLoadTemp:", detailsLoadTemp);
    setTemporaryImageUrl(detailsForSaving.thumbnailDataUrl as string);

    /*const konvaFinalBlob = await GetKonvaBlob(
      .95, // quality
      1.4, // scaleThePoster
      view,
      "generateAsBlob"
    );*/
    const konvaFinalDataUrl = await GetKonvaBlob(
      .95, // quality
      1.4, // scaleThePoster
      view,
      "generateAsDataUrl"
    );
    const konvaPDFFinal = await getKonvaPDF(
      konvaFinalDataUrl?.dataUrl as string,
      view
    );
    const konvaPDFFinalBlob = konvaPDFFinal.output("blob");
    const responseImageForBlob = await fetch(konvaFinalDataUrl?.dataUrl as string);
    // const imageBlob = await responseImageForBlob.blob();
    const imageBlobData = await GetKonvaBlob(
      .95, // quality
      1.4, // scaleThePoster
      view,
    );
    const imageBlob = imageBlobData?.blob as Blob;
    /**
     * Now will save the blobs into the indexDB,
     * for final payment purposes for checkout
     */
    const detailsAfterSaving = await LS_SaveCoverAndPDF_ForFinalPayment(imageBlob, konvaPDFFinalBlob);
    console.log("detailsAfterSaving:", detailsAfterSaving);

    router.push("/checkout");
  }

  return (
    <>
      <Link href={"/"}

        className={`btn btn-primary `} id="headerCTA" onClick={(e) => {
          console.log("nextStep()");
          e.preventDefault();
          // this is for testing purposes
          // __SaveTemplateForPaymentPurposes();
          __SaveTemplateToIndexDB();
        }}
        style={{
          // pointerEvents: continueButtonDisabled ? "none" : "auto",
          // opacity: continueButtonDisabled ? 0.5 : 1,
        }}
      >
        Continue →
      </Link>

      {
        // debugging image
        // <img src={temporaryImageUrl} alt="temporaryImageUrl" style={{ width: "1000px", height: "auto", position: "fixed", bottom: "10px", right: "10px" }} />
      }

    </>

  );
}