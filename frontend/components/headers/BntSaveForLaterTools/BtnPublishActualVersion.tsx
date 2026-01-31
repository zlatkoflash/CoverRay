"use client";

import { EditorActions } from "@/lib/features/editor/editorSlice";
import { templatesActions } from "@/lib/features/templates/templatesSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { getApiData } from "@/utils/api";
import { ITemplateVersion } from "@/utils/interfaceDatabase";
import { useState } from "react"; // Added useState
import { useDispatch, useSelector } from "react-redux";

export default function BtnPublishActualVersion() {
  const dispatch = useDispatch<AppDispatch>();
  const [isPublishing, setIsPublishing] = useState(false); // Loading state

  const templateState = useSelector((state: RootState) => state.template);
  const templateId = templateState.selectedTemplate?.id;
  const editorState = useSelector((state: RootState) => state.editor);

  const ____PublishTheActualKanvaDataToLiveTemplate = async () => {
    if (!confirm("Are you sure you want to publish this template?")) return;

    try {
      setIsPublishing(true);

      const data = await getApiData<{
        ok: true,
        versions: ITemplateVersion[]
      }>("/administrator/publish-actual-kanva-data-to-live", "POST", {
        template_id: templateId,
        dataForKonva: editorState.konvaData
      }, "authorize");

      if (data.ok) {
        dispatch(templatesActions.setVersions(data.versions));
      }
    } catch (error) {
      console.error("Publish failed:", error);
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <button
      className="btn btn-secondary"
      onClick={____PublishTheActualKanvaDataToLiveTemplate}
      disabled={isPublishing}
      style={{
        opacity: isPublishing ? 0.5 : 1,
        pointerEvents: isPublishing ? 'none' : 'auto',
        transition: 'opacity 0.2s ease' // Smooth transition for better feel
      }}
    >
      📤 Publish
    </button>
  );
}