"use client";

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Konva from "konva";
import { AppDispatch } from "@/lib/store";
import { EditorActions } from "@/lib/features/editor/editorSlice";
import FloatingEditorItemText from "./FloatingEditorItemText";
import { Pencil, Trash2, Copy, X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export default function FloatingEditorItem() {
  const selectedKonvaItem = useSelector((state: any) => state.editor.selectedKonvaItem);
  const [rect, setRect] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [isMoving, setIsMoving] = useState(false); // Track motion for transition disabling

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (typeof window === "undefined" || !selectedKonvaItem?.id || selectedKonvaItem.type !== 'text') return;

    const stage = (Konva as any).stages[0] as Konva.Stage | undefined;
    const nodeId = selectedKonvaItem.id.startsWith('#') ? selectedKonvaItem.id : `#${selectedKonvaItem.id}`;
    const node = stage?.findOne(nodeId) as Konva.Text | undefined;

    if (!node || !stage) return;

    const updatePosition = () => {
      // Use requestAnimationFrame for high-performance syncing
      requestAnimationFrame(() => {
        const box = node.getClientRect();
        const containerRect = stage.container().getBoundingClientRect();
        setRect({
          x: containerRect.left + box.x,
          y: containerRect.top + box.y,
          width: box.width,
          height: box.height,
        });
      });
    };

    updatePosition();

    const handleDragStart = () => setIsMoving(true);
    const handleDragEnd = () => {
      setIsMoving(false);
      updatePosition();
    };

    node.on("dragmove.floating transform.floating", updatePosition);
    node.on("dragstart.floating", handleDragStart);
    node.on("dragend.floating", handleDragEnd);

    return () => {
      node.off(".floating");
    };
  }, [selectedKonvaItem]);

  useEffect(() => { setIsEditing(false); }, [selectedKonvaItem?.id]);

  const handleDelete = () => {
    if (!selectedKonvaItem?.id) return;
    dispatch(EditorActions.deleteItem(selectedKonvaItem.id));
    dispatch(EditorActions.setselectedKonvaItem(null));
  };

  const handleDuplicate = () => {
    if (!selectedKonvaItem) return;
    const newId = uuidv4();
    const duplicatedItem = { ...selectedKonvaItem, id: newId, x: (selectedKonvaItem.x || 0) + 20, y: (selectedKonvaItem.y || 0) + 20 };
    dispatch(EditorActions.addItem(duplicatedItem));
    dispatch(EditorActions.setselectedKonvaItem(duplicatedItem));
  };

  if (!selectedKonvaItem || selectedKonvaItem.type !== 'text') return null;

  // We disable transitions while moving to prevent the "lagging" or "ghosting" effect
  const activeTransition = isMoving ? "none" : "all 0.1s ease-out";

  return (
    <>
      {/* 1. TOOLBAR AREA */}
      <div
        style={{
          position: "fixed",
          top: rect.y - 45,
          left: rect.x + rect.width / 2,
          transform: "translateX(-50%)",
          display: "flex",
          gap: "4px",
          padding: "4px",
          backgroundColor: "#1e1e1e",
          borderRadius: "6px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          zIndex: 1001,
          pointerEvents: "auto",
          //  transition: activeTransition, // Disables lag during drag
          opacity: rect.x === 0 ? 0 : 1, // Hide only on first initialization
        }}
      >
        <ToolbarButton
          onClick={() => setIsEditing(!isEditing)}
          icon={isEditing ? <X size={14} /> : <Pencil size={14} />}
          label={isEditing ? "Close" : "Edit"}
        />
        <ToolbarButton onClick={handleDuplicate} icon={<Copy size={14} />} label="Duplicate" />
        <ToolbarButton onClick={handleDelete} icon={<Trash2 size={14} color="#ff4d4d" />} label="Delete" />
      </div>

      {/* 2. SELECTION BOX AREA */}
      <div
        style={{
          position: "fixed",
          top: rect.y,
          left: rect.x,
          width: rect.width,
          height: rect.height,
          boxSizing: "border-box",
          zIndex: 1000,
          pointerEvents: isEditing ? "auto" : "none",
          transition: activeTransition,
        }}
        onDoubleClick={() => setIsEditing(true)}
      >
        <FloatingEditorItemText isEditing={isEditing} setIsEditing={setIsEditing} />
      </div>
    </>
  );
}

function ToolbarButton({ onClick, icon, label }: any) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        background: "transparent",
        border: "none",
        color: "white",
        fontSize: "11px",
        padding: "4px 8px",
        cursor: "pointer",
        borderRadius: "4px",
        transition: "background 0.2s"
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#333")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
    >
      {icon}
      {
        // <span>{label}</span>
      }
    </button>
  );
}