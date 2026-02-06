import { LS_SaveTemplateIntoIndexDB } from "@/utils/editor-local-storage";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useState } from "react";
import { IKonvaTemplate } from "@/utils/interfaceTemplate";
import { ITemplate } from "@/utils/interfaceDatabase";

export default function BtnSaveForLaterClient() {

  const [isSaved, setIsSaved] = useState(false);
  const stateEditor = useSelector((state: RootState) => state.editor);
  const stateTemplate = useSelector((state: RootState) => state.template);
  // const items = stateEditor.items;
  const template = stateTemplate.selectedTemplate;
  const imageCoverURL = stateEditor.imageUrl;

  const ___SaveTheTemplate = async () => {
    console.log("saveTheTemplate(), we have same function for mobile so if you change here you should chnage there too:");
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


  return (
    <>
      {
        isSaved && (
          <div className="save-status" id="saveStatus">
            <span>✓</span> Saved{
              // Auto-saved
            }
          </div>
        )
      }
      <button className="btn btn-secondary" onClick={() => {
        ___SaveTheTemplate();
      }}>💾 Save for Later</button>
    </>
  );
}