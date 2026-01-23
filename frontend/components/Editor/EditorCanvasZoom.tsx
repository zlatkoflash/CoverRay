"use client";

import { useDispatch, useSelector } from "react-redux";
import { EditorActions } from "@/lib/features/editor/editorSlice";
import { RootState } from "@/lib/store";

export default function EditorCanvasZoom() {
  const dispatch = useDispatch();

  // Use 'scale' from your state (defaulting to 1)
  const currentScale = useSelector((state: RootState) => state.editor.view.scale || 1);

  const handleZoom = (increment: number) => {
    console.log("It is working...");
    console.log(currentScale + increment);
    dispatch(EditorActions.setScale(currentScale + increment));
  };

  return (
    <div className="canvas-zoom">
      <button className="zoom-btn" onClick={() => handleZoom(-0.1)}>−</button>
      <button className="zoom-btn" onClick={() => handleZoom(0.1)}>+</button>
    </div>
  );
}