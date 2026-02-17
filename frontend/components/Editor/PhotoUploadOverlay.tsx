"use client";

import { useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { updateEditorImage } from "@/lib/features/editor/editorSlice";

export default function PhotoUploadOverlay() {
  const dispatch = useDispatch<AppDispatch>();
  const coverURL = useSelector((state: RootState) => state.editor.imageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    const isImage = file.type.startsWith("image/")
      || /\.(heic|heif|jpg|jpeg|png|webp)$/i.test(file.name || "");
    if (file && isImage) {
      dispatch(updateEditorImage(file));
    }
  }, [dispatch]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  // Don't show if a photo is already uploaded
  if (coverURL) return null;

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        background: isDragging
          ? "rgba(44, 62, 107, 0.08)"
          : "transparent",
        transition: "background 0.2s ease",
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
          padding: "28px 32px",
          borderRadius: "16px",
          width: "calc(100% - 48px)",
          border: isDragging
            ? "2px solid var(--color-primary, #2c3e6b)"
            : "2px dashed var(--color-border, #e5e5e0)",
          background: "var(--color-surface, #ffffff)",
          boxShadow: "var(--shadow-lg, 0 12px 32px rgba(0,0,0,0.12))",
          transition: "border-color 0.2s ease, transform 0.2s ease",
          transform: isDragging ? "scale(1.02)" : "scale(1)",
          maxWidth: "380px",
          textAlign: "center",
        }}
      >
        {/* Upload icon */}
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "var(--color-primary-light, #e8ecf4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            color: "var(--color-primary, #2c3e6b)",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>

        <div>
          <div
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "var(--color-text, #1a1a1a)",
              marginBottom: "4px",
              fontFamily: "var(--font-sans, sans-serif)",
            }}
          >
            Upload Your Photo
          </div>
          <div
            style={{
              fontSize: "13px",
              color: "var(--color-text-muted, #666660)",
              fontFamily: "var(--font-sans, sans-serif)",
            }}
          >
            Tap to browse your photos
          </div>
        </div>

        <div
          style={{
            padding: "10px 28px",
            borderRadius: "8px",
            background: "var(--color-primary, #2c3e6b)",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: 600,
            fontFamily: "var(--font-sans, sans-serif)",
          }}
        >
          Choose Photo
        </div>

        <div
          style={{
            fontSize: "11px",
            color: "var(--color-text-muted, #666660)",
            fontFamily: "var(--font-sans, sans-serif)",
          }}
        >
          JPG, PNG or WEBP
        </div>
      </div>
    </div>
  );
}
