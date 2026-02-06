"use client";

import { useDispatch, useSelector } from "react-redux";
import { EditorActions } from "@/lib/features/editor/editorSlice";
import { RootState } from "@/lib/store";
import { useDevice } from "@/Providers/DeviceProvider";

export default function EditorCanvasZoom() {

  const { isMobile } = useDevice();

  const dispatch = useDispatch();

  // Use 'scale' from your state (defaulting to 1)
  const currentScale = useSelector((state: RootState) => state.editor.view.scale || 1);

  const handleZoom = (increment: number) => {
    console.log("It is working...");
    console.log(currentScale + increment);
    dispatch(EditorActions.setScale(currentScale + increment));
  };

  if (isMobile === true) {
    return null;
    {
      /*
      Maybe zoom will need
      return <div className="zoom-controls">
      <button className="zoom-btn" onClick={() => handleZoom(-0.05)}>−</button>
      <button className="zoom-btn" onClick={() => handleZoom(0.05)}>+</button>
    </div>*/
    }
  }

  return (
    <div className="canvas-zoom">
      <button className="zoom-btn" onClick={() => handleZoom(-0.1)}>−</button>
      <button className="zoom-btn" onClick={() => handleZoom(0.1)}>+</button>
    </div>
  );
}