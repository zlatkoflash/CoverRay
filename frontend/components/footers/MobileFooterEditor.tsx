"use client"

import { useState } from "react";
import EditorMobileNavbar from "../Editor/MobileEditors/EditorMobileNavbar"
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { IKonvaTemplate } from "@/utils/interfaceTemplate";
import { ITemplate } from "@/utils/interfaceDatabase";
import { LS_SaveTemplateIntoIndexDB } from "@/utils/editor-local-storage";
import MobileEditorPanels from "../Editor/MobileEditors/MobileEditorPanels/Index";
import { useRouter } from "next/navigation";
import Link from "next/link";

import dynamic from "next/dynamic";

// We use dynamic import HERE to force SSR to skip this specific component
// I do this because of konva because konva is not compatible with ssr
const DynamicBtnMobileSaveDetailsForCheckout = dynamic(
  () => import("./BtnMobileSaveDetailsForCheckout"),
  {
    ssr: false,
    loading: () => <div className="footer-btn primary">Loading...</div>
  }
);

export default function MobileFooterEditor() {

  const router = useRouter();

  const [isSaved, setIsSaved] = useState(false);
  const stateEditor = useSelector((state: RootState) => state.editor);
  const stateTemplate = useSelector((state: RootState) => state.template);
  // const items = stateEditor.items;
  const template = stateTemplate.selectedTemplate;
  const imageCoverURL = stateEditor.imageUrl;
  const selectedItem = stateEditor.selectedKonvaItem;

  const ___SaveTheTemplate = async () => {
    console.log("saveTheTemplate(), we have same function for desktop so if you change here you should chnage there too:");
    const detailsForSaving = {
      // edited_template_items: items,
      konvaData: stateEditor.konvaData as IKonvaTemplate,
      templateDB: template as ITemplate,
      // templateDB: templateDB as ITemplate,
      coverImageURL: imageCoverURL as string,
      thumbnailDataUrl: null
    };
    await LS_SaveTemplateIntoIndexDB(detailsForSaving);
    setIsSaved(true);
  }

  //return null;

  return (
    <>
      <div className="footer-mobile-for-editor">

        {
          selectedItem ? <EditorMobileNavbar /> : null
        }

        <div className="mobile-footer">
          <div className="footer-info">
            Step 2 of 3 • Editing: <span className="highlight" id="editingText">Headline</span>
          </div>
          <div className="footer-buttons">
            {
              /*<button className="footer-btn back" onClick={() => {
              
            }}>←</button>*/
            }
            <Link className="footer-btn back" href="/" style={{
              textDecoration: "none"
            }}>←</Link>
            {
              /*<button className="footer-btn primary" onClick={() => { }}>
              Checkout →
            </button>*/
            }
            <DynamicBtnMobileSaveDetailsForCheckout />
            <button className="footer-btn save" onClick={() => {
              ___SaveTheTemplate();
            }}>💾</button>
          </div>
        </div>
      </div>

      <MobileEditorPanels />
    </>
  );
}