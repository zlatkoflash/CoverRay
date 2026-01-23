"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { EditorActions } from "@/lib/features/editor/editorSlice";

export default function EditorCanvasUndoRedo() {
  const dispatch = useDispatch();

  const canUndo = useSelector((state: RootState) => state.editor.history.past.length > 0);
  const canRedo = useSelector((state: RootState) => state.editor.history.future.length > 0);
  const undoArray = useSelector((state: RootState) => state.editor.history.past);
  console.log("state.editor.history.past:", undoArray);

  // Define styles in JS for easy copy-pasting, or move to a .css file
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '10px'
  };

  const baseButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#f8f9fa',
    cursor: 'pointer',
    transition: 'opacity 0.2s, background-color 0.2s',
    color: '#333',
    fontSize: '14px',
    fontWeight: 500
  };

  const disabledStyle: React.CSSProperties = {
    opacity: 0.3,           // This gives you the 0.7 transparency effect
    pointerEvents: 'none',  // This "traps" the clicks
    cursor: 'default'
  };

  return (
    <div style={containerStyle}>
      {/* UNDO BUTTON */}
      <button
        style={{
          ...baseButtonStyle,
          ...(!canUndo ? disabledStyle : {})
        }}
        disabled={!canUndo}
        onClick={() => dispatch(EditorActions.undo())}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
          <path d="M3 7v6h6"></path>
          <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"></path>
        </svg>
        <span>Undo</span>
      </button>

      {/* REDO BUTTON */}
      <button
        style={{
          ...baseButtonStyle,
          ...(!canRedo ? disabledStyle : {})
        }}
        disabled={!canRedo}
        onClick={() => dispatch(EditorActions.redo())}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
          <path d="M21 7v6h-6"></path>
          <path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7"></path>
        </svg>
        <span>Redo</span>
      </button>
    </div>
  );
}