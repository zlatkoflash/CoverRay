"use client";

import { RootState } from "@/lib/store";
import { useDispatch, useSelector } from "react-redux";
import { EditorActions, updateItem } from "@/lib/features/editor/editorSlice";
import { IKonvaTemplateTextItem } from "@/utils/interfaceTemplate";
import { useRef } from "react";
import EditorFontsSelector from "@/components/Sidebars/EditorSidebar/EditorFontsSelector";

export default function MobileEditFontStyle() {

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

  /*const handleFocus = () => {
    console.log("Don't forget you have duplicated events for desctop too");
    // Save the starting text value
    originalTextRef.current = selectedKonvaItemText.text || "";
  };*/

  /*const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Update the canvas in real-time (NO history here)
    console.log("Don't forget you have duplicated events for desctop too");
    dispatch(
      EditorActions.updateItem({
        id: selectedKonvaItem.id,
        changes: { text: e.target.value }
      })
    );
  };*/

  /*const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
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
  };*/

  const toggleFontStyle = (style: "bold" | "italic", strctReplace: boolean = false) => {
    const currentStyle = selectedKonvaItemText.fontStyle || "normal";
    let newStyle: string;

    if (currentStyle.includes(style) || strctReplace) {
      // Remove the style
      newStyle = currentStyle.replace(style, "").trim() || "normal";
    } else {
      // Add the style
      newStyle = currentStyle === "normal" ? style : `${currentStyle} ${style}`;
    }

    dispatch(updateItem({ id: selectedKonvaItemText.id, changes: { fontStyle: newStyle }, addToHistory: true }));
  };

  const isBold = selectedKonvaItemText.fontStyle?.includes("bold");
  const isItalic = selectedKonvaItemText.fontStyle?.includes("italic");
  const hasShadow = (selectedKonvaItemText.shadowBlur ?? 0) > 0;
  const hasOutline = (selectedKonvaItemText.strokeWidth ?? 0) > 0;


  return <>
    <div className={`edit-panel ${stateEditor.mobileFontStylePanelVisible ? "visible" : ""}`} id="text-panel">
      <div className="edit-panel-handle"></div>
      <div className="edit-panel-header">
        <div className="edit-panel-title">Edit Font Style</div>
        <button className="close-panel" onClick={() => {
          dispatch(EditorActions.setMobileFontStylePanelVisible(false));
        }}>✕</button>
      </div>


      <div style={{ marginBottom: "16px" }}>
        {
          //  <div className="panel-section-label">Tagline</div>
        }
        {
          // the title is comming from the component <EditorFontsSelector />
          // <div className="panel-section-label">Font Family</div>
        }
        <EditorFontsSelector />
      </div>


      {/* Font Weight Options */}
      <div style={{ marginBottom: "16px" }}>
        <div className="panel-section-label">Font Weight / Style</div>
        <div className="style-options">
          <button className={`style-btn ${!isBold ? "selected" : ""}`} onClick={() => {
            /*dispatch(
              EditorActions.updateItem({
                id: selectedKonvaItem.id,
                changes: { fontWeight: "normal" },
                addToHistory: true
              })
            );*/
            toggleFontStyle("bold", true);
          }}>Regular</button>
          <button className={`style-btn ${isBold ? "selected" : ""}`} onClick={() => {
            /*dispatch(
              EditorActions.updateItem({
                id: selectedKonvaItem.id,
                changes: {
                  // fontWeight: "bold",
                  fontWeight: "bold"
                },
                addToHistory: true
              })
            );*/
            toggleFontStyle("bold")
          }}>Bold</button>
          <button className={`style-btn ${isItalic ? "selected" : ""}`} onClick={() => {
            /*dispatch(
              EditorActions.updateItem({
                id: selectedKonvaItem.id,
                changes: { fontStyle: selectedKonvaItemText.fontStyle === "italic" ? "normal" : "italic" },
                addToHistory: true
              })
            );*/
            toggleFontStyle("italic")
          }}>Italic</button>
        </div>
      </div>
    </div>
  </>
}