"use client";

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EditorActions } from "@/lib/features/editor/editorSlice";
import { RootState } from "@/lib/store";
import { v4 as uuidv4 } from "uuid";
import { POSTER_H, POSTER_W } from "@/utils/editor";

export default function AddRemoveItem() {
  const dispatch = useDispatch();
  const selectedItem = useSelector((state: RootState) => state.editor.selectedKonvaItem);

  const virtualWidth = POSTER_W;
  const virtualHeight = POSTER_H;

  // 1. Memoize the delete logic so it can be reused
  const handleDelete = useCallback(() => {
    if (selectedItem) {
      dispatch(EditorActions.deleteItem(selectedItem.id));
    }
  }, [dispatch, selectedItem]);

  // 2. Add Keyboard Listener for "Delete" and "Backspace"
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't delete if the user is typing in an input or textarea
      const isTyping = ["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName || "");

      if ((e.key === "Delete" || e.key === "Backspace") && !isTyping) {
        handleDelete();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleDelete]);

  const handleAddText = () => {
    const newText = {
      id: uuidv4(),
      type: "text",
      text: "New Text Block",
      fontSize: 80,
      fill: "#000000",
      x: virtualWidth / 2 - 150,
      y: virtualHeight / 2 - 40,
      width: 300,
      align: "center",
      draggable: true,
    };
    dispatch(EditorActions.addItem(newText));
  };

  const handleAddImage = () => {
    const newImage = {
      id: uuidv4(),
      type: "image",
      src: "https://placehold.co/600x400/EEE/31343C?text=Placeholder",
      x: virtualWidth / 2 - 150,
      y: virtualHeight / 2 - 150,
      width: 300,
      height: 300,
      draggable: true,
    };
    dispatch(EditorActions.addItem(newImage));
  };

  return (
    <div className="panel-section">
      <div className="section-title">Add/Remove Elements</div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          width: '100%'
        }}
      >
        {/* ADD TEXT */}
        <button
          className="btn btn-secondary"
          onClick={handleAddText}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}
        >
          <span style={{ fontSize: '1.2rem' }}>T</span>
        </button>

        {/* ADD IMAGE */}
        <button
          className="btn btn-secondary"
          onClick={handleAddImage}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}
        >
          <span style={{ fontSize: '1.2rem' }}>🖼️</span>
        </button>

        {/* REMOVE SELECTED */}
        <button
          className={`btn ${selectedItem ? 'btn-secondary' : 'btn-disabled'}`}
          onClick={handleDelete}
          disabled={!selectedItem}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '5px',
            color: selectedItem ? '#ef4444' : '#ccc',
            opacity: selectedItem ? 1 : 0.5,
            pointerEvents: selectedItem ? 'auto' : 'none',
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>🗑️</span>
        </button>

      </div>
    </div>
  );
}