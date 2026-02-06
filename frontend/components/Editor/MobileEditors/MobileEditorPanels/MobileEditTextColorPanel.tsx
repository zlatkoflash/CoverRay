"use client";

import { EditorActions } from "@/lib/features/editor/editorSlice";
import { RootState } from "@/lib/store";
import { useDispatch, useSelector } from "react-redux";

export default function MobileEditTextColorPanel() {
  const dispatch = useDispatch();
  const stateEditor = useSelector((state: RootState) => state.editor);

  // Find the currently selected item to know its current color
  const selectedItem = stateEditor.selectedKonvaItem;

  const currentColor = selectedItem?.fill || "#1a1a1a";

  const colors = [
    "#1a1a1a", "#ffffff", "#ef4444", "#f59e0b",
    "#10b981", "#3f51b5", "#8b5cf6", "#ec4899",
    "#64748b", "#f97316", "#14b8a6", "#6366f1"
  ];

  const handleColorClick = (color: string) => {
    console.log("stateEditor.selectedKonvaItem:", stateEditor.selectedKonvaItem);
    dispatch(EditorActions.updateItem({
      addToHistory: true,
      changes: {
        fill: color
      },
      id: stateEditor.selectedKonvaItem?.id as string
    }));
  };

  const handleClose = () => {
    dispatch(EditorActions.setMobileTextColorPickerVisible(false));
  };

  return (
    <div className={`edit-panel ${stateEditor.mobileTextColorPickerVisible ? "visible" : ""}`} id="color-panel">
      <div className="edit-panel-handle"></div>

      <div className="edit-panel-header">
        <div className="edit-panel-title">Colors</div>
        <button className="close-panel" onClick={handleClose}>✕</button>
      </div>

      <div className="color-section">
        <div className="color-section-title">Text Color</div>
        <div className="color-picker-grid">
          {colors.map((color) => {
            // Compare against the ACTUAL color of the selected item
            console.log("currentColor", currentColor);
            console.log("color", color);
            const isSelected = currentColor.toLowerCase() === color.toLowerCase();

            return (
              <div
                key={color}
                className={`color-swatch ${isSelected ? "selected" : ""}`}
                onClick={() => handleColorClick(color)}
                style={{
                  backgroundColor: color,
                  border: color.toLowerCase() === "#ffffff" ? "1px solid #e5e5e5" : "none"
                }}
              >
                {/* Optional: Add a checkmark icon or dot inside when isSelected is true */}
                {isSelected && <div className="swatch-check" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}