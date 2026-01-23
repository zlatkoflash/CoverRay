"use client";

import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { CanvasItemText, EditorActions } from "@/lib/features/editor/editorSlice";

export default function EditorTextInput() {
  const dispatch = useDispatch();

  // 1. Get the current selection
  const selectedKonvaItem = useSelector(
    (state: RootState) => state.editor.selectedKonvaItem
  ) as CanvasItemText | null;

  // 2. Capture the text state when the user starts typing to compare later
  const originalTextRef = useRef<string>("");

  // 3. CRITICAL: Prevent "Duplicate" or "Empty" rendering
  // If no item is selected, or if it's an image (not text), we show nothing
  if (!selectedKonvaItem || selectedKonvaItem.type !== "text") {
    return null;
  }

  const handleFocus = () => {
    // Save the starting text value
    originalTextRef.current = selectedKonvaItem.text || "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Update the canvas in real-time (NO history here)
    dispatch(
      EditorActions.updateItem({
        id: selectedKonvaItem.id,
        changes: { text: e.target.value }
      })
    );
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
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
  };

  return (
    <div className="panel-section">
      <div className="section-title">Text Content</div>

      <div className="form-group">
        <label className="form-label" htmlFor="headlineInput">Headline</label>
        <textarea
          key={selectedKonvaItem.id} // Forces React to treat different items separately
          className="form-input min-h-[100px] resize-none"
          id="headlineInput"
          rows={4}
          value={selectedKonvaItem.text || ""}
          onFocus={handleFocus}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <div className="char-count mt-1" style={{ fontSize: '12px', opacity: 0.8 }}>
          {selectedKonvaItem.text?.length || 0} characters — ✓ Perfect length
        </div>
      </div>
    </div>
  );
}