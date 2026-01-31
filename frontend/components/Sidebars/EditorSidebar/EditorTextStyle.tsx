"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  // CanvasItemText, 
  updateItem
} from "@/lib/features/editor/editorSlice";
import { RootState } from "@/lib/store";
import { IKonvaTemplateTextItem } from "@/utils/interfaceTemplate";

export default function EditorTextStyle() {
  // const a: IKonvaTemplateTextItem
  const dispatch = useDispatch();
  const selectedItem = useSelector((state: RootState) => state.editor.selectedKonvaItem) as IKonvaTemplateTextItem
    // as CanvasItemText

    ;

  if (!selectedItem) return null;

  // Helper to toggle Font Styles (Bold/Italic)
  const toggleFontStyle = (style: "bold" | "italic") => {
    const currentStyle = selectedItem.fontStyle || "normal";
    let newStyle: string;

    if (currentStyle.includes(style)) {
      // Remove the style
      newStyle = currentStyle.replace(style, "").trim() || "normal";
    } else {
      // Add the style
      newStyle = currentStyle === "normal" ? style : `${currentStyle} ${style}`;
    }

    dispatch(updateItem({ id: selectedItem.id, changes: { fontStyle: newStyle }, addToHistory: true }));
  };

  // Check if styles are active for UI classes
  const isBold = selectedItem.fontStyle?.includes("bold");
  const isItalic = selectedItem.fontStyle?.includes("italic");
  const hasShadow = (selectedItem.shadowBlur ?? 0) > 0;
  const hasOutline = (selectedItem.strokeWidth ?? 0) > 0;

  return (
    <div className="panel-section">
      <div className="section-title">Text Style</div>
      <div className="editor-tools">

        {/* BOLD BUTTON */}
        <button
          className={`tool-btn ${isBold ? "active" : ""}`}
          onClick={() => toggleFontStyle("bold")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
            <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
          </svg>
          <span className="tool-label">Bold</span>
        </button>

        {/* ITALIC BUTTON */}
        <button
          className={`tool-btn ${isItalic ? "active" : ""}`}
          onClick={() => toggleFontStyle("italic")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="4" x2="10" y2="4"></line>
            <line x1="14" y1="20" x2="5" y2="20"></line>
            <line x1="15" y1="4" x2="9" y2="20"></line>
          </svg>
          <span className="tool-label">Italic</span>
        </button>

        {/* SHADOW BUTTON */}
        <button
          className={`tool-btn ${hasShadow ? "active" : ""}`}
          onClick={() => {
            dispatch(updateItem({
              id: selectedItem.id,
              changes: {
                shadowColor: "black",
                shadowBlur: hasShadow ? 0 : 5,
                shadowOffset: hasShadow ? { x: 0, y: 0 } : { x: 2, y: 2 },
                shadowOpacity: hasShadow ? 0 : 0.5
              },
              addToHistory: true
            }));
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <rect x="6" y="6" width="18" height="18" rx="2" fill="currentColor" opacity="0.3"></rect>
          </svg>
          <span className="tool-label">Shadow</span>
        </button>

        {/* OUTLINE BUTTON */}
        <button
          className={`tool-btn ${hasOutline ? "active" : ""}`}
          onClick={() => {
            dispatch(updateItem({
              id: selectedItem.id,
              changes: {
                stroke: hasOutline ? undefined : "black",
                strokeWidth: hasOutline ? 0 : 1
              },
              addToHistory: true
            }));
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="4 7 4 4 20 4 20 7"></polyline>
            <line x1="9" y1="20" x2="15" y2="20"></line>
            <line x1="12" y1="4" x2="12" y2="20"></line>
          </svg>
          <span className="tool-label">Outline</span>
        </button>

      </div>
    </div>
  );
}