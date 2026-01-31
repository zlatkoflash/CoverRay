"use client";

import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { EditorActions } from "@/lib/features/editor/editorSlice";
import { IKonvaTemplateImageItem, IKonvaTemplateTextItem } from "@/utils/interfaceTemplate";

export default function EditorSizeOfTheComponent() {
  const dispatch = useDispatch();
  const selectedItem = useSelector((state: RootState) => state.editor.selectedKonvaItem);

  // Use a ref to track the starting values for history
  const startValuesRef = useRef({ width: 0, height: 0 });

  if (!selectedItem) return null;

  const isImage = selectedItem.type === "image";
  const currentWidth = Math.round(selectedItem.width || 0);
  const currentHeight = Math.round(selectedItem.height || 0);

  const handleFocus = () => {
    startValuesRef.current = { width: currentWidth, height: currentHeight };
  };

  const handleUpdate = (field: "width" | "height", value: string, addToHistory: boolean = false) => {
    const numValue = parseInt(value) || 0;

    dispatch(
      EditorActions.updateItem({
        id: selectedItem.id,
        changes: { [field]: numValue },
        addToHistory
      })
    );
  };

  const handleBlur = (field: "width" | "height", value: string) => {
    const numValue = parseInt(value) || 0;
    const startValue = field === "width" ? startValuesRef.current.width : startValuesRef.current.height;

    if (numValue !== startValue) {
      handleUpdate(field, value, true);
    }
  };

  return (
    <div className="panel-section">
      <div className="section-title">Component Dimensions</div>

      <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
        {/* WIDTH INPUT */}
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label" style={{ fontSize: '12px' }}>Width (px)</label>
          <input
            type="number"
            className="form-input"
            value={currentWidth}
            onFocus={handleFocus}
            onChange={(e) => handleUpdate("width", e.target.value, false)}
            onBlur={(e) => handleBlur("width", e.target.value)}
          />
        </div>

        {/* HEIGHT INPUT */}
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label" style={{ fontSize: '12px' }}>Height (px)</label>
          {
            isImage ? <>
              <p className="text-sm text-gray-500 text-center grow-1">-</p>
            </> :
              <input
                type="number"
                className={`form-input ${isImage ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}`}
                value={currentHeight}
                disabled={isImage} // Image height is automatic
                onFocus={handleFocus}
                onChange={(e) => handleUpdate("height", e.target.value, false)}
                onBlur={(e) => handleBlur("height", e.target.value)}
              />
          }
        </div>
      </div>

      {isImage && (
        <div style={{ fontSize: '11px', color: '#666', marginTop: '8px', fontStyle: 'italic' }}>
          * Height for images is calculated automatically based on proportions.
        </div>
      )}
    </div>
  );
}