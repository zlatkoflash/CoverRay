"use client";

import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import {
  // CanvasItemText, 
  // IKonvaTemplateTextItem,
  EditorActions

} from "@/lib/features/editor/editorSlice";
import { IKonvaTemplateTextItem } from "@/utils/interfaceTemplate";

const measurementCanvas = document.createElement("canvas");
const measurementContext = measurementCanvas.getContext("2d") as CanvasRenderingContext2D;

const getTextWidth = (text: string, fontSize: number, fontFamily: string): number => {
  if (!text) return 0;

  measurementContext.font = `${fontSize}px ${fontFamily}`;

  // Split by newline and measure each line individually
  const lines = text.split('\n');
  let maxWidth = 0;

  for (let i = 0; i < lines.length; i++) {
    const lineWidth = measurementContext.measureText(lines[i]).width;
    if (lineWidth > maxWidth) {
      maxWidth = lineWidth;
    }
  }

  return maxWidth;
};

export default function EditorTextInput() {
  const dispatch = useDispatch();
  // 1. Get the current selection
  /*const selectedKonvaItem = useSelector(
    (state: RootState) => state.editor.selectedKonvaItem
  ) as IKonvaTemplateTextItem | null;*/
  const selectedKonvaItem = useSelector((state: RootState) => state.editor.selectedKonvaItem);
  const selectedKonvaItemText = selectedKonvaItem as IKonvaTemplateTextItem;
  // as CanvasItemText | null

  // 2. Capture the text state when the user starts typing to compare later
  const originalTextRef = useRef<string>("");

  // 3. CRITICAL: Prevent "Duplicate" or "Empty" rendering
  // If no item is selected, or if it's an image (not text), we show nothing
  if (!selectedKonvaItem || selectedKonvaItem.type !== "text") {
    return null;
  }

  const handleFocus = () => {
    console.log("Don't forget you have duplicated events for mobile too");
    // Save the starting text value
    originalTextRef.current = selectedKonvaItemText.text || "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Update the canvas in real-time (NO history here)
    console.log("Don't forget you have duplicated events for mobile too");
    /*dispatch(
      EditorActions.updateItem({
        id: selectedKonvaItem.id,
        changes: { text: e.target.value }
      })
    );*/

    const selectedKOnvaItemText = selectedKonvaItem as IKonvaTemplateTextItem;
    const newValue = e.target.value;
    const { x, text, fontSize, fontFamily, align } = selectedKOnvaItemText;

    // 1. Measure the width of the text BEFORE the change
    const oldWidth = getTextWidth(text, fontSize, fontFamily);

    // 2. Measure the width of the text AFTER the change
    const newWidth = getTextWidth(newValue, fontSize, fontFamily);

    // 3. Calculate the difference
    const widthDiff = newWidth - oldWidth;

    let newX = x;

    // 4. Adjust X based on alignment logic
    if (align === 'right') {
      // Move X left by the full difference to keep the right edge pinned
      newX = x - widthDiff;
    } else if (align === 'center') {
      // Move X left by half the difference to keep the center point pinned
      newX = x - (widthDiff / 2);
    }

    // Update the canvas in real-time
    dispatch(
      EditorActions.updateItem({
        id: selectedKonvaItem.id,
        changes: {
          text: newValue,
          x: newX
        }
      })
    );

  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    console.log("Don't forget you have duplicated events for mobile too");
    const finalValue = e.target.value;
    console.log("Blur event");
    const selectedKonvaItemText = selectedKonvaItem as IKonvaTemplateTextItem;

    // 4. Compare: Only "Commit" to history if text actually changed
    if (finalValue !== originalTextRef.current) {
      console.log("Change detected: Committing to history.");

      // Dispatch the action you created that triggers recordHistory
      /**/
      dispatch(
        EditorActions.updateItem({
          id: selectedKonvaItem.id,
          changes: { text: finalValue },
          addToHistory: true
        })
      );

      /*console.log("selectedKonvaItemText:", selectedKonvaItemText);

      // A simple way to get the width without rendering
      const getTextWidth = (text: string, fontSize: number, fontFamily: string) => {
        const canvas = document.createElement("canvas");
        const context: any = canvas.getContext("2d");
        context.font = `${fontSize}px ${fontFamily}`;
        return context.measureText(text).width;
      };

      // Inside your change handler:
      const oldWidth = selectedKonvaItem.width;
      const newWidth = getTextWidth(finalValue, selectedKonvaItemText.fontSize, selectedKonvaItemText.fontFamily);
      console.log("oldWidth:", oldWidth, "newWidth:", newWidth);

      let newX = selectedKonvaItem.x;

      if (selectedKonvaItemText.align === 'right') {
        newX = selectedKonvaItem.x - (newWidth - oldWidth);
      } else if (selectedKonvaItemText.align === 'center') {
        newX = selectedKonvaItem.x - (newWidth - oldWidth) / 2;
      }

      console.log("newX:", newX);

      dispatch(
        EditorActions.updateItem({
          id: selectedKonvaItem.id,
          changes: {
            text: finalValue,
            x: !isNaN(newX) ? newX : selectedKonvaItem.x,
            // width: newWidth // Update width so the next change has a correct reference
          },
          addToHistory: true
        })
      );*/

    } else {
      console.log("No change: Skipping history.");
    }
  };

  return (
    <div className="panel-section">
      <div className="section-title">Text Content</div>

      <div className="form-group">
        {
          // <label className="form-label" htmlFor="headlineInput">Headline</label>
        }
        <textarea
          key={selectedKonvaItem.id} // Forces React to treat different items separately
          className="form-input min-h-[100px] resize-none"
          id="headlineInput"
          rows={4}
          value={selectedKonvaItemText.text || ""}
          onFocus={handleFocus}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <div className="char-count mt-1" style={{ fontSize: '12px', opacity: 0.8 }}>
          {selectedKonvaItemText.text?.length || 0} characters — ✓ Perfect length
        </div>
      </div>
    </div>
  );
}