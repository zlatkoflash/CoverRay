"use client";

import { useDispatch, useSelector } from "react-redux";
import { EditorActions } from "@/lib/features/editor/editorSlice";
import { RootState } from "@/lib/store";

export default function EditorObjectStacking() {
  const dispatch = useDispatch();
  const selectedItem = useSelector((state: RootState) => state.editor.selectedKonvaItem);

  if (!selectedItem) return null;

  const handleStacking = (type: "front" | "back" | "forward" | "backward") => {
    dispatch(
      EditorActions.reorderItem({
        id: selectedItem.id,
        type: type,
      })
    );
  };

  return (
    <div className="panel-section">
      <div className="section-title">Layer Order</div>
      <div className="editor-tools" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>

        {/* BRING TO FRONT (Absolute Top) */}
        <button
          className="tool-btn"
          onClick={() => handleStacking("front")}
          title="Bring to Front"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className="tool-label">To Front</span>
        </button>

        {/* SEND TO BACK (Absolute Bottom) */}
        <button
          className="tool-btn"
          onClick={() => handleStacking("back")}
          title="Send to Back"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" style={{ opacity: 0.5 }}>
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className="tool-label">To Back</span>
        </button>

        {/* MOVE FORWARD (One step up) */}
        <button
          className="tool-btn"
          onClick={() => handleStacking("forward")}
          title="Bring Forward"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
          <span className="tool-label">Forward</span>
        </button>

        {/* MOVE BACKWARD (One step down) */}
        <button
          className="tool-btn"
          onClick={() => handleStacking("backward")}
          title="Send Backward"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
          <span className="tool-label">Backward</span>
        </button>

      </div>
    </div>
  );
}