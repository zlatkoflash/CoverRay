"use client";

import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EditorActions } from "@/lib/features/editor/editorSlice";
import { RootState } from "@/lib/store";

export default function EditorTextSize() {
  const dispatch = useDispatch();
  const selectedItem = useSelector((state: RootState) => state.editor.selectedKonvaItem);

  // This ref stores the size BEFORE the user starts sliding
  const startSizeRef = useRef<number>(0);

  const currentSize = selectedItem?.fontSize || 56;
  const min = 12;
  const max = 150;

  const percentage = ((currentSize - min) / (max - min)) * 100;

  const handleSizeChange = (newSize: number, addToHistory: boolean = false) => {
    if (!selectedItem) return;

    const clampedSize = Math.max(min, Math.min(max, newSize));

    // If we are committing to history, we use your special action
    // const actionType = addToHistory ? EditorActions.commitItemChange : EditorActions.updateItem;

    dispatch(
      EditorActions.updateItem({
        id: selectedItem.id,
        changes: {
          fontSize: clampedSize,
          scaleX: 1,
          scaleY: 1
        },
        addToHistory
      })
    );
  };

  if (!selectedItem || selectedItem.type !== 'text') return null;

  return (
    <div className="panel-section">
      <div className="section-title">Text Size</div>
      <div className="size-slider-container">
        <div className="size-slider-row" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

          {/* DECREASE BUTTON */}
          <button
            className="size-label"
            onClick={() => handleSizeChange(currentSize - 1, true)}
            type="button"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px' }}
          >
            A
          </button>

          <input
            type="range"
            className="size-slider"
            id="sizeSlider"
            min={min}
            max={max}
            value={currentSize}
            // 1. Record the size when the mouse goes down
            onMouseDown={() => {
              startSizeRef.current = currentSize;
            }}
            // 2. Update visual state live (no history)
            onChange={(e) => handleSizeChange(parseInt(e.target.value), false)}
            // 3. Logic for mouse release
            onMouseUp={() => {
              // Only add to history if the value actually changed from the start
              if (currentSize !== startSizeRef.current) {
                console.log("Size changed, adding to history...");
                handleSizeChange(currentSize, true);
              } else {
                console.log("No change in size, skipping history.");
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
            onClick={() => handleSizeChange(currentSize + 1, true)}
            type="button"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '20px' }}
          >
            A
          </button>

        </div>
        <div className="size-value" id="sizeValue" style={{ textAlign: 'center', marginTop: '5px' }}>
          {currentSize}px
        </div>
      </div>
    </div>
  );
}