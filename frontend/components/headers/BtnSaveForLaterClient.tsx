import { LS_SaveTemplateIntoIndexDB } from "@/utils/editor-local-storage";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { useState } from "react";
import { IKonvaTemplate } from "@/utils/interfaceTemplate";
import { ITemplate } from "@/utils/interfaceDatabase";
import { authActions } from "@/lib/features/auth/authSlice";
import { getApiData } from "@/utils/api";

export default function BtnSaveForLaterClient() {

  const [isSaved, setIsSaved] = useState(false);
  const stateEditor = useSelector((state: RootState) => state.editor);
  const stateTemplate = useSelector((state: RootState) => state.template);
  // const items = stateEditor.items;
  const template = stateTemplate.selectedTemplate;
  const imageCoverURL = stateEditor.imageUrl;
  const authState = useSelector((state: RootState) => state.auth);
  const loggedUser = authState.user;
  const [saving, setSaving] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const ___SaveTheTemplate = async () => {
    setSaving(true);
    console.log("saveTheTemplate(), we have same function for mobile so if you change here you should chnage there too:");

    /*const detailsForSaving = {
      // edited_template_items: items,
      konvaData: stateEditor.konvaData as IKonvaTemplate,
      templateDB: template as ITemplate,
      // templateDB: templateDB as ITemplate,
      coverImageURL: imageCoverURL as string,
      thumbnailDataUrl: null
    };
    await LS_SaveTemplateIntoIndexDB(detailsForSaving);
    setIsSaved(true);*/

    const results = await getApiData("/administrator-client/create-new-draft", "POST", {
      template_id: template?.id,
      template_data: stateEditor.konvaData,
      // coverImageURL: imageCoverURL,
    }, "authorize", "application/json");

    // CONTINUE FROM HERE

    console.log("results:", results);


    setSaving(false);
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
      <button className="btn btn-secondary" style={{
        pointerEvents: saving ? "none" : "auto",
        opacity: saving ? 0.5 : 1,
      }} onClick={() => {
        if (loggedUser === null) {
          dispatch(authActions.setModalSignInOpen({
            open: true,
            intentAfterSignIn: "SUBSCRIPTION"
          }));
        }
        else {
          ___SaveTheTemplate();
        }

      }}>💾 Save for Later</button>
    </>
  );
}