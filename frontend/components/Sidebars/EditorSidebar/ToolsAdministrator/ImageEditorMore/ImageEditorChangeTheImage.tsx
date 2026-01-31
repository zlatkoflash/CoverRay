"use client";

import { updateItem } from "@/lib/features/editor/editorSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { createClient } from "@/utils/supabase";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { createClient } from "@/utils/supabase/client"; // Ensure this path is correct for your project

export default function ImageEditorChangeTheImage({
  onUploadSuccess
}: {
  onUploadSuccess?: (publicUrl: string) => void
}) {

  const dispatch = useDispatch<AppDispatch>();
  const editorState = useSelector((state: RootState) => state.editor);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Please select an image file.");
      return;
    }

    try {
      setIsUploading(true);

      // 1. Create a unique file path (prevent overwriting)
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `uploads-from-editor/${fileName}`;

      // 2. Upload to Supabase Bucket 'assets'
      const { data, error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, file);

      console.log("Data after uploading: ", data);

      if (uploadError) throw uploadError;

      // 3. Get the Public URL (Live Link)
      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);

      console.log("Upload successful. Live link:", publicUrl);
      dispatch(updateItem({
        id: editorState.selectedKonvaItem?.id as string,
        changes: {
          src: publicUrl,
        },
        addToHistory: true,
      }))


      // 4. Pass the link to your Redux state via the parent
      if (onUploadSuccess) {
        onUploadSuccess(publicUrl);
      }

    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
      // Reset input so the same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <button
        className={`toolbar-btn ${isUploading ? 'opacity-50 cursor-wait' : ''}`}
        onClick={handleButtonClick}
        disabled={isUploading}
      >
        {isUploading ? (
          <span className="flex items-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            Uploading...
          </span>
        ) : (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            Change Photo
          </>
        )}
      </button>
    </>
  );
}