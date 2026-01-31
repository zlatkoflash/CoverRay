"use client";

import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EditorActions } from "@/lib/features/editor/editorSlice";
import { RootState } from "@/lib/store";
import { IKonvaTemplateTextItem } from "@/utils/interfaceTemplate";

export default function EditorTextLetterSpacing() {
  const dispatch = useDispatch();
  const selectedItem = useSelector((state: RootState) => state.editor.selectedKonvaItem);
  const selectedItemText = selectedItem as IKonvaTemplateTextItem;

  // Stores the value BEFORE the user starts sliding for history tracking
  const startValueRef = useRef<number>(0);

  // Konva default letterSpacing is 0, but you requested 1 to 10
  const currentSpacing = selectedItemText?.letterSpacing || 0;
  const min = 0;
  const max = 30;

  // Calculate percentage for the CSS gradient background
  const percentage = ((currentSpacing - min) / (max - min)) * 100;

  const handleSpacingChange = (newValue: number, addToHistory: boolean = false) => {
    if (!selectedItem) return;

    // Clamp between 1 and 10
    const clampedValue = Math.max(min, Math.min(max, newValue));

    dispatch(
      EditorActions.updateItem({
        id: selectedItem.id,
        changes: {
          letterSpacing: clampedValue,
        },
        addToHistory
      })
    );
  };

  if (!selectedItem || selectedItemText.type !== 'text') return null;

  return (
    <div className="panel-section">
      <div className="section-title">Letter Spacing</div>
      <div className="size-slider-container">
        <div className="size-slider-row" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

          {/* DECREASE BUTTON */}
          <button
            onClick={() => handleSpacingChange(currentSpacing - 1, true)}
            type="button"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', letterSpacing: '-1px' }}
          >
            AV
          </button>

          <input
            type="range"
            className="size-slider"
            min={min}
            max={max}
            step={1} // Whole pixels usually look best for letter spacing
            value={currentSpacing}
            onMouseDown={() => {
              startValueRef.current = currentSpacing;
            }}
            onChange={(e) => handleSpacingChange(parseFloat(e.target.value), false)}
            onMouseUp={() => {
              if (currentSpacing !== startValueRef.current) {
                handleSpacingChange(currentSpacing, true);
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
            onClick={() => handleSpacingChange(currentSpacing + 1, true)}
            type="button"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', letterSpacing: '4px' }}
          >
            AV
          </button>

        </div>
        <div className="size-value" style={{ textAlign: 'center', marginTop: '5px', fontSize: '12px', opacity: 0.8 }}>
          {currentSpacing}px
        </div>
      </div>
    </div>
  );
}