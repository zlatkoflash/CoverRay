"use client";

import { useDispatch, useSelector } from "react-redux";
import { updateItem } from "@/lib/features/editor/editorSlice";
import { RootState } from "@/lib/store";
import { IKonvaTemplateTextItem } from "@/utils/interfaceTemplate";

export default function EditorTextAlign() {
  const dispatch = useDispatch();
  const selectedItem = useSelector((state: RootState) => state.editor.selectedKonvaItem) as IKonvaTemplateTextItem;

  if (!selectedItem || selectedItem.type !== "text") return null;

  // Konva 'align' values: 'left' | 'center' | 'right' | 'justify'
  const currentAlign = selectedItem.align || "left";

  const handleAlignChange = (newAlign: "left" | "center" | "right" | "justify") => {
    dispatch(
      updateItem({
        id: selectedItem.id,
        changes: { align: newAlign },
        addToHistory: true,
      })
    );
  };

  return (
    <div className="panel-section">
      <div className="section-title">Text Alignment</div>
      <div className="editor-tools">

        {/* LEFT ALIGN */}
        <button
          className={`tool-btn ${currentAlign === "left" ? "active" : ""}`}
          onClick={() => handleAlignChange("left")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <line x1="17" y1="10" x2="3" y2="10"></line>
            <line x1="21" y1="6" x2="3" y2="6"></line>
            <line x1="21" y1="14" x2="3" y2="14"></line>
            <line x1="17" y1="18" x2="3" y2="18"></line>
          </svg>
          <span className="tool-label">Left</span>
        </button>

        {/* CENTER ALIGN */}
        <button
          className={`tool-btn ${currentAlign === "center" ? "active" : ""}`}
          onClick={() => handleAlignChange("center")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <line x1="18" y1="10" x2="6" y2="10"></line>
            <line x1="21" y1="6" x2="3" y2="6"></line>
            <line x1="21" y1="14" x2="3" y2="14"></line>
            <line x1="18" y1="18" x2="6" y2="18"></line>
          </svg>
          <span className="tool-label">Center</span>
        </button>

        {/* RIGHT ALIGN */}
        <button
          className={`tool-btn ${currentAlign === "right" ? "active" : ""}`}
          onClick={() => handleAlignChange("right")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <line x1="21" y1="10" x2="7" y2="10"></line>
            <line x1="21" y1="6" x2="3" y2="6"></line>
            <line x1="21" y1="14" x2="3" y2="14"></line>
            <line x1="21" y1="18" x2="7" y2="18"></line>
          </svg>
          <span className="tool-label">Right</span>
        </button>

        {/* JUSTIFY */}
        {
          /*<button
          className={`tool-btn ${currentAlign === "justify" ? "active" : ""}`}
          onClick={() => handleAlignChange("justify")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <line x1="21" y1="10" x2="3" y2="10"></line>
            <line x1="21" y1="6" x2="3" y2="6"></line>
            <line x1="21" y1="14" x2="3" y2="14"></line>
            <line x1="21" y1="18" x2="3" y2="18"></line>
          </svg>
          <span className="tool-label">Justify</span>
        </button>*/
        }

      </div>
    </div>
  );
}