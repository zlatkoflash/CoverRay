"use client";

import { useDispatch, useSelector } from "react-redux";
import { updateItem } from "@/lib/features/editor/editorSlice";
import { RootState } from "@/lib/store";

const COLORS = [
  "#ffffff", // White
  "#1a1a1a", // Dark
  "#ef4444", // Red
  "#f59e0b", // Amber
  "#10b981", // Emerald
  "#3f51b5", // Indigo
  "#ec4899", // Pink
  "#06b6d4", // Cyan
];

export default function EditorColor(



) {
  const dispatch = useDispatch();

  // Get the selected item to show which color is currently active
  const selectedItem = useSelector((state: RootState) => state.editor.selectedKonvaItem);

  const selectedColor = () => {
    if (selectedItem?.type === "text") {
      return selectedItem?.fill.toLocaleLowerCase();
    }
    // return selectedItem?.stroke;
    return "";
  }

  const handleColorChange = (color: string) => {
    if (!selectedItem) return;

    /*dispatch(
      updateItem({
        id: selectedItem.id,
        changes: { fill: color }, // In Konva, 'fill' is the text/shape color
      })
    );*/

    if (selectedItem?.type === "text") {
      dispatch(
        updateItem({
          id: selectedItem.id,
          changes: { fill: color }, // In Konva, 'fill' is the text/shape color
          addToHistory: true
        })
      );
    }

  };

  return (
    <div className="panel-section">
      <div className="section-title">Text Color</div>
      <div className="color-grid">
        {COLORS.map((color) => {
          // Check if this specific color is the one currently on the item
          // const isSelected = selectedItem?.fill === color;

          // console.log(color, selectedColor());

          return (
            <div
              key={color}
              className={`color-swatch ${color === selectedColor() ? "selected" : ""}`}
              style={{
                background: color,
                border: color === selectedColor() ? "1px solid #e0e0e0" : "none",
              }}
              onClick={() => handleColorChange(color)}
              title={color}
            />
          );
        })}
      </div>
    </div>
  );
}