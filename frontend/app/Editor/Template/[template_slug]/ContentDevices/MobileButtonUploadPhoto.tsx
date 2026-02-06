"use client";

import { updateEditorImage } from "@/lib/features/editor/editorSlice";
import { AppDispatch } from "@/lib/store";
import React, { useRef } from "react";
import { useDispatch } from "react-redux";

export default function MobileButtonUploadPhoto({ className }: { className?: string }) {
  // Create a reference to the hidden file input

  const dispatch = useDispatch<AppDispatch>();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    // When the custom button is clicked, trigger the hidden input
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] as File;

    if (file) {
      // Check if the file is an image (extra safety)
      if (file.type.startsWith("image/")) {
        console.log("File selected:", file.name);

        // Pass the file back to the parent component for "other purposes"
        // if (onFileSelect) {
        //   onFileSelect(file);
        // }
        dispatch(updateEditorImage(file));
      } else {
        alert("Please select an image file (png, jpg, etc.)");
      }
    }
  };

  return (
    <>
      {/* Hidden File Input - restricted to images only */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />

      <button className={`upload-photo-btn ${className}`} onClick={handleButtonClick}>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
        <span>Change Photo</span>
      </button>
    </>
  );
}