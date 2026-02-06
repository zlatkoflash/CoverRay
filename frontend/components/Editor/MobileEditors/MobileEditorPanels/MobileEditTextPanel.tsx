"use client";

import { RootState } from "@/lib/store";
import { useDispatch, useSelector } from "react-redux";
import { EditorActions } from "@/lib/features/editor/editorSlice";
import { IKonvaTemplateTextItem } from "@/utils/interfaceTemplate";
import { useRef } from "react";

export default function MobileEditTextPanel() {

  const dispatch = useDispatch();
  const stateEditor = useSelector((state: RootState) => state.editor);
  const selectedKonvaItem = useSelector((state: RootState) => state.editor.selectedKonvaItem);
  const selectedKonvaItemText = selectedKonvaItem as IKonvaTemplateTextItem;


  const originalTextRef = useRef<string>("");

  // 3. CRITICAL: Prevent "Duplicate" or "Empty" rendering
  // If no item is selected, or if it's an image (not text), we show nothing
  if (!selectedKonvaItem || selectedKonvaItem.type !== "text") {
    return null;
  }

  const handleFocus = () => {
    console.log("Don't forget you have duplicated events for desctop too");
    // Save the starting text value
    originalTextRef.current = selectedKonvaItemText.text || "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Update the canvas in real-time (NO history here)
    console.log("Don't forget you have duplicated events for desctop too");
    dispatch(
      EditorActions.updateItem({
        id: selectedKonvaItem.id,
        changes: { text: e.target.value }
      })
    );
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    console.log("Don't forget you have duplicated events for desctop too");
    const finalValue = e.target.value;
    console.log("Blur event");

    // 4. Compare: Only "Commit" to history if text actually changed
    if (finalValue !== originalTextRef.current) {
      console.log("Change detected: Committing to history.");

      // Dispatch the action you created that triggers recordHistory
      dispatch(
        EditorActions.updateItem({
          id: selectedKonvaItem.id,
          changes: { text: finalValue },
          addToHistory: true
        })
      );
    } else {
      console.log("No change: Skipping history.");
    }
  };


  return <>
    <div className={`edit-panel ${stateEditor.mobileTextEditorPanelVisible ? "visible" : ""}`} id="text-panel">
      <div className="edit-panel-handle"></div>
      <div className="edit-panel-header">
        <div className="edit-panel-title">Edit Text</div>
        <button className="close-panel" onClick={() => {
          dispatch(EditorActions.setMobileTextEditorPanelVisible(false));
        }}>✕</button>
      </div>

      {/* Headline Text Input */}
      {
        /*<div style={{ marginBottom: "16px" }}>
        <div className="panel-section-label">Headline</div>
        <input type="text" className="text-input-field" id="headlineInput" value="DOGUE" onInput={() => { }} placeholder="Enter headline..." />
      </div>*/
      }

      {/* Tagline Text Input */}
      <div style={{ marginBottom: "16px" }}>
        {
          //  <div className="panel-section-label">Tagline</div>
        }
        <div className="panel-section-label">Text Content</div>
        {
          /*<input type="text" className="text-input-field" id="taglineInput" value="WHO'S A GOOD BOY?" onInput={() => { }} placeholder="Enter tagline..." />*/
        }

        <textarea
          key={selectedKonvaItem.id} // Forces React to treat different items separately
          className="text-input-field min-h-[100px] resize-none"
          id="headlineInput"
          rows={4}
          value={selectedKonvaItemText.text || ""}
          onFocus={handleFocus}
          onChange={handleChange}
          onBlur={handleBlur}
        />

      </div>

      {/* Font Weight Options */}
      <div style={{ marginBottom: "16px" }}>
        <div className="panel-section-label">Font Weight</div>
        <div className="style-options">
          <button className={`style-btn ${selectedKonvaItemText.fontWeight === "normal" ? "selected" : ""}`} onClick={() => {
            dispatch(
              EditorActions.updateItem({
                id: selectedKonvaItem.id,
                changes: { fontWeight: "normal" },
                addToHistory: true
              })
            );
          }}>Regular</button>
          <button className={`style-btn ${selectedKonvaItemText.fontWeight === "bold" ? "selected" : ""}`} onClick={() => {
            dispatch(
              EditorActions.updateItem({
                id: selectedKonvaItem.id,
                changes: { fontWeight: "bold" },
                addToHistory: true
              })
            );
          }}>Bold</button>
          <button className={`style-btn ${selectedKonvaItemText.fontStyle === "italic" ? "selected" : ""}`} onClick={() => {
            dispatch(
              EditorActions.updateItem({
                id: selectedKonvaItem.id,
                changes: { fontStyle: selectedKonvaItemText.fontStyle === "italic" ? "normal" : "italic" },
                addToHistory: true
              })
            );
          }}>Italic</button>
        </div>
      </div>
    </div>
  </>
}