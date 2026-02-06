"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { EditorActions } from "@/lib/features/editor/editorSlice";

export default function MobileEditTextSizePanel({ initialSize = 42, onClose, onSizeChange }: { initialSize?: number, onClose?: () => void, onSizeChange?: (size: number) => void }) {

  const dispatch = useDispatch();
  const stateEditor = useSelector((state: RootState) => state.editor);

  const [size, setSize] = useState(initialSize);

  const min = 12;
  const max = 96;

  // This calculates the percentage for the blue progress bar background
  const getBackgroundSize = () => {
    return {
      backgroundSize: `${((size - min) * 100) / (max - min)}% 100%`,
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value, 10);
    setSize(newSize);
    if (onSizeChange) onSizeChange(newSize);
  };

  return (
    <div className={`edit-panel ${stateEditor.mobileTextFontSizePickerVisible ? "visible" : ""}`} id="size-panel">
      <div className="edit-panel-handle"></div>

      <div className="edit-panel-header">
        <div className="edit-panel-title">Adjust Size</div>
        <button className="close-panel" onClick={() => {
          dispatch(EditorActions.setMobileTextFontSizePickerVisible(false))
        }}>✕</button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <div className="panel-section-label">Font Size</div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <span style={{ fontSize: "12px", color: "#999", fontWeight: "600" }}>A</span>

          <input
            type="range"
            min={min}
            max={max}
            value={size}
            onChange={handleChange}
            className="size-slider-input"
            style={{
              flex: "1",
              height: "6px",
              borderRadius: "3px",
              outline: "none",
              appearance: "none",
              cursor: "pointer",
              backgroundImage: "linear-gradient(#3f51b5, #3f51b5)",
              backgroundRepeat: "no-repeat",
              backgroundColor: "#e0e0e0",
              ...getBackgroundSize(), // Spreads the dynamic width
            }}
          />

          <span style={{ fontSize: "24px", color: "#999", fontWeight: "600" }}>A</span>
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "13px", color: "#666" }}>Current Size</div>
          <div style={{ fontSize: "32px", fontWeight: "700", color: "#3f51b5" }}>
            {size}px
          </div>
        </div>
      </div>
    </div>
  );
}