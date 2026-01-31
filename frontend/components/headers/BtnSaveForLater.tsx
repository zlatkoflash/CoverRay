'use client';

import { RootState } from "@/lib/store";
import { LS_SaveTemplateIntoIndexDB } from "@/utils/editor-local-storage";
import { ITemplate } from "@/utils/interfaceDatabase";
// import { LS_SaveTemplateIntoIndexDB } from "@/utils/editor-local-storage";
import { useState } from "react";
import { useSelector } from "react-redux";
import { GetKonvaBlob, getKonvaPDF } from "../Editor/utils/KonvaScripts";
import jsPDF from "jspdf";
import { POSTER_H, POSTER_W } from "@/utils/editor";
import TemplateVersionsControl from "./BntSaveForLaterTools/TemplateVersionsControl";
import ZSelectDropdown from "../inputs/ZSelectDropdown";
import BtnAdministratorSaveDraft from "./BntSaveForLaterTools/BtnAdministratorSaveDraft";
import { IKonvaTemplate } from "@/utils/interfaceTemplate";
import DropdownWithTheVersions from "./BntSaveForLaterTools/DropdownWithTheVersions";
import BtnPublishActualVersion from "./BntSaveForLaterTools/BtnPublishActualVersion";

export default function BtnSaveForLater() {

  const [isSaved, setIsSaved] = useState(false);
  const stateAuth = useSelector((state: RootState) => state.auth);

  const stateEditor = useSelector((state: RootState) => state.editor);
  const stateTemplate = useSelector((state: RootState) => state.template);
  // const items = stateEditor.items;
  const template = stateTemplate.selectedTemplate;
  const imageCoverURL = stateEditor.imageUrl;
  const view = stateEditor.view;

  const ___SaveTheTemplate = async () => {
    console.log("saveTheTemplate():");
    const detailsForSaving = {
      // edited_template_items: items,
      konvaData: stateEditor.konvaData as IKonvaTemplate,
      templateDB: template as ITemplate,
      // templateDB: templateDB as ITemplate,
      coverImageURL: imageCoverURL as string,
      thumbnailDataUrl: null
    };
    setIsSaved(true);
    await LS_SaveTemplateIntoIndexDB(detailsForSaving);
  }

  const ___DownloadTestImage = async () => {
    console.log("downloadTestImage():");
    const details = await GetKonvaBlob(
      1, // quality
      1.4, // scaleThePoster
      view
    );
    console.log("details:", details);
    if (!details) return;
    const url = URL.createObjectURL(details.blob as Blob);
    const link = document.createElement('a');
    link.download = 'high-res-poster.jpg';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }

  const ___DownloadTestPDF = async () => {

    const detailsImageDataURL = await GetKonvaBlob(
      1, // quality
      1.4, // scaleThePoster
      view,
      "generateAsDataUrl"
    );
    // details?.blob

    if (!detailsImageDataURL) return;
    const doc = await getKonvaPDF(detailsImageDataURL?.dataUrl as string, view);
    doc.save("hello-world.pdf");


  }

  return (
    <>
      <div className="save-status" id="saveStatus" style={{ display: isSaved ? "block" : "none" }}>
        <span>✓</span> Auto-saved
      </div>
      <button className="btn btn-secondary" onClick={() => {
        console.log("saveForLater():");

        ___DownloadTestImage();

      }}>💾 Image</button>
      <button className="btn btn-secondary" onClick={() => {
        console.log("saveForLater():");

        ___DownloadTestPDF();

      }}>💾 PDF</button>

      {
        template && stateAuth.user?.role === "administrator" && <TemplateVersionsControl />
      }


      {
        /*<ZSelectDropdown
        dropdownStyle="for-forms"
        onSelect={(value) => {
          console.log("value:", value);
        }}
        options={[
          { value: "", label: "Live Template" },
          { value: "2", label: "Draft Template" },
          { value: "3", label: "Version 1" },
        ]}
        label="Select Version"
        selectedValue={templateDraftVersionOrPublic}
        
      />*/
      }
      <DropdownWithTheVersions />


      <BtnAdministratorSaveDraft />
      <BtnPublishActualVersion />

    </>
  );
}