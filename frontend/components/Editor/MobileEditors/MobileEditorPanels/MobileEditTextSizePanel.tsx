"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { EditorActions } from "@/lib/features/editor/editorSlice";
import { IKonvaTemplateTextItem } from "@/utils/interfaceTemplate";

export default function MobileEditTextSizePanel() {
  const dispatch = useDispatch();
  const stateEditor = useSelector((state: RootState) => state.editor);
  const selectedItem = stateEditor.selectedKonvaItem as IKonvaTemplateTextItem;

  const [size, setSize] = useState(selectedItem?.fontSize || 42);

  useEffect(() => {
    if (selectedItem?.fontSize) {
      setSize(selectedItem.fontSize);
    }
  }, [selectedItem?.id, selectedItem?.fontSize]);

  const min = 12;
  const max = 120;

  const getBackgroundSize = () => {
    return {
      backgroundSize: `${((size - min) * 100) / (max - min)}% 100%`,
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedItem || typeof window === "undefined") return;

    const newSize = parseInt(e.target.value, 10);
    setSize(newSize);

    // FIX: Access Konva through the window to avoid the "canvas" module error
    const konvaGlobal = (window as any).Konva;
    const stage = konvaGlobal?.stages[0];
    const node = stage?.findOne(`#${selectedItem.id}`);

    let newX = selectedItem.x;

    if (node && selectedItem.align === 'right') {
      const oldWidth = node.width();
      node.fontSize(newSize); // Measure temporary new width
      const newWidth = node.width();

      // Formula to keep right edge static: move left by the growth amount
      newX = selectedItem.x - (newWidth - oldWidth);
    }

    dispatch(EditorActions.updateItem({
      id: selectedItem.id,
      changes: {
        fontSize: newSize,
        x: newX
      },
      addToHistory: false,
    }));
  };

  const handleDragEnd = () => {
    if (!selectedItem) return;
    dispatch(EditorActions.updateItem({
      id: selectedItem.id,
      changes: { fontSize: size },
      addToHistory: true
    }));
  };

  if (!selectedItem || selectedItem.type !== 'text') return null;

  return (
    <div
      className={`edit-panel ${stateEditor.mobileTextFontSizePickerVisible ? "visible" : ""}`}
      style={{
        position: 'fixed',
        bottom: stateEditor.mobileTextFontSizePickerVisible ? 0 : '-100%',
        left: 0,
        right: 0,
        backgroundColor: 'white',
        padding: '20px 20px env(safe-area-inset-bottom, 20px) 20px', // Mobile safe areas
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
        transition: 'bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 2000
      }}
    >
      <div style={{ width: '40px', height: '4px', background: '#ddd', borderRadius: '2px', margin: '0 auto 15px' }}></div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ fontWeight: '700', fontSize: '18px', color: '#333' }}>Adjust Size</div>
        <button
          onClick={() => dispatch(EditorActions.setMobileTextFontSizePickerVisible(false))}
          style={{ background: '#f5f5f5', border: 'none', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          ✕
        </button>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <span style={{ fontSize: "14px", color: "#999", fontWeight: "600" }}>A</span>
          <input
            type="range"
            min={min}
            max={max}
            value={size}
            onChange={handleChange}
            onMouseUp={handleDragEnd}
            onTouchEnd={handleDragEnd}
            style={{
              flex: "1",
              height: "8px",
              borderRadius: "4px",
              outline: "none",
              appearance: "none",
              cursor: "pointer",
              backgroundImage: "linear-gradient(#3f51b5, #3f51b5)",
              backgroundRepeat: "no-repeat",
              backgroundColor: "#f0f0f0",
              ...getBackgroundSize(),
            }}
          />
          <span style={{ fontSize: "24px", color: "#999", fontWeight: "600" }}>A</span>
        </div>

        <div style={{ textAlign: "center", background: '#f8f9ff', padding: '15px', borderRadius: '12px' }}>
          <div style={{ fontSize: "11px", color: "#888", textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Font Size</div>
          <div style={{ fontSize: "32px", fontWeight: "800", color: "#3f51b5" }}>
            {size}<span style={{ fontSize: '14px', fontWeight: '400', marginLeft: '2px' }}>px</span>
          </div>
        </div>
      </div>
    </div>
  );
}