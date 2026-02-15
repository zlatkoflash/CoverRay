"use client";

import { EditorActions } from "@/lib/features/editor/editorSlice";
import { AppDispatch } from "@/lib/store";
import Konva from "konva";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function FloatingEditorItemText({ isEditing, setIsEditing }: any) {
  const selectedKonvaItem = useSelector((state: any) => state.editor.selectedKonvaItem);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  const [textStyle, setTextStyle] = useState({
    fontSize: "16px",
    fontFamily: "Arial",
    fontWeight: "normal",
    fontStyle: "normal",
    textDecoration: "none",
    textAlign: "left",
    fill: "#000",
    lineHeight: 1.2,
    letterSpacing: 0,
  });

  // Helper to get the Konva Node
  const getKonvaNode = () => {
    const stage = (Konva as any).stages[0] as Konva.Stage | undefined;
    const nodeId = selectedKonvaItem.id.startsWith('#') ? selectedKonvaItem.id : `#${selectedKonvaItem.id}`;
    return stage?.findOne(nodeId) as Konva.Text | undefined;
  };

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      );
    }
  }, [isEditing]);

  useEffect(() => {
    if (typeof window === "undefined" || !selectedKonvaItem?.id || selectedKonvaItem.type !== 'text') return;

    const node = getKonvaNode();
    if (!node) return;

    const updateStyle = () => {
      const absScale = node.getAbsoluteScale();
      const kStyle = node.fontStyle() || "normal";
      setTextStyle({
        fontSize: `${node.fontSize() * absScale.y}px`,
        fontFamily: node.fontFamily(),
        fontWeight: kStyle.includes("bold") ? "bold" : (node.getAttr("fontWeight") || "normal"),
        fontStyle: kStyle.includes("italic") ? "italic" : "normal",
        textDecoration: node.textDecoration(),
        textAlign: node.align(),
        fill: node.fill() as string,
        lineHeight: node.lineHeight(),
        letterSpacing: node.letterSpacing(),
      });
    };

    updateStyle();
    node.on("dragmove.floating transform.floating", updateStyle);
    return () => { node.off(".floating"); };
  }, [selectedKonvaItem]);

  return (
    <textarea
      ref={textareaRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        minWidth: "20px",
        minHeight: textStyle.fontSize,
        border: "none",
        outline: "none",
        resize: "none",
        padding: "0",
        margin: "0",
        boxSizing: "border-box",
        backgroundColor: "transparent",
        overflow: "hidden",
        cursor: isEditing ? "text" : "move",
        pointerEvents: isEditing ? "auto" : "none",
        color: "transparent",
        caretColor: textStyle.fill,
        fontSize: textStyle.fontSize,
        fontFamily: textStyle.fontFamily,
        fontWeight: textStyle.fontWeight,
        fontStyle: textStyle.fontStyle,
        textDecoration: textStyle.textDecoration,
        textAlign: textStyle.textAlign as any,
        lineHeight: textStyle.lineHeight,
        letterSpacing: `${textStyle.letterSpacing}px`,
        whiteSpace: "pre-wrap",
        wordWrap: "break-word",
      }}
      value={selectedKonvaItem.text || ""}
      spellCheck={false}
      onChange={(e) => {
        const newValue = e.target.value;
        const node = getKonvaNode();
        let newX = selectedKonvaItem.x;

        // --- RIGHT ALIGN LOGIC ---
        if (node && textStyle.textAlign === 'right') {
          const oldWidth = node.width();
          // Measure new width by temporarily updating node
          node.text(newValue);
          const newWidth = node.width();

          // Shift X by the difference to keep the right edge static
          newX = selectedKonvaItem.x - (newWidth - oldWidth);
        }

        dispatch(EditorActions.updateItem({
          id: selectedKonvaItem.id,
          changes: {
            text: newValue,
            x: newX
          },
          addToHistory: false,
        }));
      }}
      onBlur={() => {
        setIsEditing(false);
        dispatch(EditorActions.updateItem({
          id: selectedKonvaItem.id,
          changes: { text: selectedKonvaItem.text || "" },
          addToHistory: true,
        }));
      }}
    />
  );
}