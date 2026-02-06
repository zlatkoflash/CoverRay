"use client";

import { useState } from "react";
import { RootState } from "@/lib/store";
import { getApiData } from "@/utils/api";
import { useSelector } from "react-redux";

export default function BtnAdministratorSaveDraft() {
  const [isSaving, setIsSaving] = useState(false);

  const stateEditor = useSelector((state: RootState) => state.editor);
  const templateSlice = useSelector((state: RootState) => state.template);
  const konvaData = stateEditor.konvaData;
  const isDraft = templateSlice.isDraft;

  const ___SaveTheDraft = async () => {
    const templateId = templateSlice.selectedTemplate?.id;
    if (!templateId) return;

    try {
      setIsSaving(true);
      const DataFeedback = await getApiData<{
        error: boolean;
        ok: boolean;
        message: string;
      }>(
        `/administrator/update-draft`,
        "POST",
        {
          template_id: templateId,
          template_data: konvaData,
        },
        "authorize",
        "application/json"
      );
      console.log("DataFeedback:", DataFeedback);

      if (!DataFeedback.ok) {
        console.log(`Error: ${DataFeedback.message}`);
      }
    } catch (err) {
      console.log("An unexpected error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  // if (!isDraft) return null;

  return (
    <button
      className="btn btn-secondary"
      onClick={___SaveTheDraft}
      disabled={isSaving}
      style={{
        position: 'relative', // Necessary for absolute spinner positioning
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        opacity: isSaving ? 0.5 : 1,
        pointerEvents: isSaving ? 'none' : 'auto',
        transition: 'opacity 0.2s ease',
      }}
    >
      {/* Circle Preloader - Only visible when saving */}
      {isSaving && (
        <div
          className="animate-spin rounded-full border-2 border-current border-t-transparent"
          style={{
            width: '14px',
            height: '14px',
            position: 'absolute',
            left: '10px' // Adjust based on your button padding
          }}
        />
      )}

      <span style={{
        // marginLeft: isSaving ? '18px' : '0' 
      }}>
        💾 Save Draft
      </span>
    </button>
  );
}