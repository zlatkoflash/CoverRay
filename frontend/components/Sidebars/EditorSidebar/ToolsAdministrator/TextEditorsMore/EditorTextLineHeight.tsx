"use client";

import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EditorActions } from "@/lib/features/editor/editorSlice";
import { RootState } from "@/lib/store";
import { IKonvaTemplateTextItem } from "@/utils/interfaceTemplate";

export default function EditorTextLineHeight() {
  const dispatch = useDispatch();
  const selectedItem = useSelector((state: RootState) => state.editor.selectedKonvaItem);
  const selectedItemText = selectedItem as IKonvaTemplateTextItem;

  // Stores the value BEFORE the user starts sliding
  const startValueRef = useRef<number>(selectedItemText?.lineHeight || 1);

  // Default Konva line height is usually 1
  const currentLineHeight = selectedItemText?.lineHeight || 1;
  const min = 1;
  const max = 2.5;

  // Calculate percentage for the CSS gradient background
  const percentage = ((currentLineHeight - min) / (max - min)) * 100;

  const handleLineHeightChange = (newValue: number, addToHistory: boolean = false) => {
    if (!selectedItem) return;

    // Clamp between 1 and 2.5
    const clampedValue = Math.max(min, Math.min(max, newValue));

    dispatch(
      EditorActions.updateItem({
        id: selectedItem.id,
        changes: {
          lineHeight: clampedValue,
        },
        addToHistory
      })
    );
  };

  if (!selectedItem || selectedItemText.type !== 'text') return null;

  return (
    <div className="panel-section">
      <div className="section-title">Line Height</div>
      <div className="size-slider-container">
        <div className="size-slider-row" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

          {/* DECREASE BUTTON */}
          <button
            className="size-label"
            onClick={() => handleLineHeightChange(currentLineHeight - 0.1, true)}
            type="button"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px' }}
          >
            A
          </button>

          <input
            type="range"
            className="size-slider"
            min={min}
            max={max}
            step={0.1} // Allows for decimal increments
            value={currentLineHeight}
            onMouseDown={() => {
              startValueRef.current = currentLineHeight;
            }}
            onChange={(e) => handleLineHeightChange(parseFloat(e.target.value), false)}
            onMouseUp={() => {
              if (currentLineHeight !== startValueRef.current) {
                handleLineHeightChange(currentLineHeight, true);
              }
            }}
            style={{
              flex: 1,
              cursor: 'pointer',
              background: `linear-gradient(to right, rgb(63, 81, 181) ${percentage}%, rgb(224, 224, 224) ${percentage}%)`,
            }}
          />

          {/* INCREASE BUTTON */}
          <button
            className="size-label large"
            onClick={() => handleLineHeightChange(currentLineHeight + 0.1, true)}
            type="button"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '20px' }}
          >
            A
          </button>

        </div>
        <div className="size-value" style={{ textAlign: 'center', marginTop: '5px' }}>
          {currentLineHeight.toFixed(1)}
        </div>
      </div>
    </div>
  );
}