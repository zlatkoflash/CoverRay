"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  // CanvasItem, CanvasItemText, 
  updateItem
} from "@/lib/features/editor/editorSlice";
import { RootState } from "@/lib/store";
import { Lock, Unlock, Edit3, EyeOff } from "lucide-react"; // Importing icons
import { IKonvaBaseCanvasItem } from "@/utils/interfaceTemplate";

export default function EditorLockDraggable() {
  const dispatch = useDispatch();
  const selectedItem = useSelector((state: RootState) => state.editor.selectedKonvaItem) as IKonvaBaseCanvasItem;
  // as CanvasItem

  if (!selectedItem) return null;

  /*const toggleFontStyle = (style: "bold" | "italic") => {
    const currentStyle = selectedItem.fontStyle || "normal";
    let newStyle: string;

    if (currentStyle.includes(style)) {
      newStyle = currentStyle.replace(style, "").trim() || "normal";
    } else {
      newStyle = currentStyle === "normal" ? style : `${currentStyle} ${style}`;
    }

    dispatch(updateItem({ id: selectedItem.id, changes: { fontStyle: newStyle }, addToHistory: true }));
  };*/

  /*const isBold = selectedItem.fontStyle?.includes("bold");
  const isItalic = selectedItem.fontStyle?.includes("italic");
  const hasShadow = (selectedItem.shadowBlur ?? 0) > 0;
  const hasOutline = (selectedItem.strokeWidth ?? 0) > 0;*/

  // New States
  const isLocked = selectedItem.draggable === false;
  const isEditable = selectedItem.contentEditable !== false; // Assuming textEditable prop

  return (
    <div className="panel-section">
      <div className="section-title">Draggable & Editable</div>
      <div className="editor-tools x2-in-row">

        {/* Existing Bold, Italic, Shadow, Outline buttons... */}
        {/* [I'm keeping your existing buttons here in the code flow] */}

        {/* <button className={`tool-btn ${isBold ? "active" : ""}`} onClick={() => toggleFontStyle("bold")}>
          <span className="tool-label">Bold</span>
        </button> */}

        {/* ... (Other existing buttons) */}

        {/* LOCK / UNLOCK TOGGLE */}
        <button
          className={`tool-btn ${isLocked ? "active red-theme" : ""}`}
          onClick={() => {
            dispatch(updateItem({
              id: selectedItem.id,
              changes: { draggable: isLocked }, // Toggles draggable state
              addToHistory: true
            }));
          }}
        >
          {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
          <span className="tool-label">{isLocked ? "Locked" : "Unlock"}</span>
        </button>

        {/* EDITABLE TOGGLE */}
        <button
          className={`tool-btn ${isEditable ? "active blue-theme" : ""}`}
          onClick={() => {
            dispatch(updateItem({
              id: selectedItem.id,
              changes: { contentEditable: !isEditable },
              addToHistory: true
            }));
          }}
        >
          {isEditable ? <Edit3 size={16} /> : <EyeOff size={16} />}
          <span className="tool-label">{isEditable ? "Editable" : "Read Only"}</span>
        </button>

      </div>
    </div>
  );
}