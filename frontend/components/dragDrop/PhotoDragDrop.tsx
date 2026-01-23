"use client";
import { LS_GetData, LS_KEY_IMAGE_URL, LS_SaveData } from "@/utils/editor-local-storage";
import { UploadFile } from "@/utils/files";
import { useState, useRef, useEffect } from "react";

export default function PhotoDragDrop(
  { onImageUploaded }: { onImageUploaded: (imageUrl: string) => void }
) {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [temporaryFileAttachedURL, setTemporaryFileAttachedURL] = useState<string | null>(null);

  useEffect(() => {
    const savedImageUrl = LS_GetData(LS_KEY_IMAGE_URL);
    console.log("savedImageUrl:", savedImageUrl);
    if (savedImageUrl) {
      setTemporaryFileAttachedURL(savedImageUrl);
    }
  }, []);

  const handleFile = async (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setFile(file);
      // console.log();
      const urlImageAttached = URL.createObjectURL(file);
      console.log(urlImageAttached);
      // LS_SaveData(LS_KEY_IMAGE_URL, urlImageAttached);
      setTemporaryFileAttachedURL(urlImageAttached);
      console.log("File uploaded:", file.name);

      const uploadFeedback = await UploadFile(
        file,
        "temporary-photos",
        "",
        "not-authorize",
        {}
      );
      console.log("uploadFeedback:", uploadFeedback);
      LS_SaveData(LS_KEY_IMAGE_URL, uploadFeedback.uploadFeedback.publicUrl);

    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  return (
    <div className="photo-hero">
      <div className="photo-hero-title">See yourself on the cover</div>
      <div className="photo-hero-subtitle">Add your photo to preview templates</div>

      <div
        className="photo-upload-box"
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={() => {
          if (fileInputRef.current) {
            fileInputRef.current.click()
          }
        }}
        style={{
          cursor: 'pointer',
          ...(temporaryFileAttachedURL !== null ? {
            backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
            backgroundImage: `url(${temporaryFileAttachedURL})`
          } : {})
        }}
      >
        <div className="photo-upload-icon">📷</div>
        <div className="photo-upload-text">
          {
            // file ? file.name : "Drop photo or click"
          }
          Drop photo or click
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileSelect}
          accept="image/*"
          style={{ display: 'none' }}
        />
      </div>
      {/*temporaryFileAttachedURL && (
        <div className="photo-preview">
          <img src={temporaryFileAttachedURL} alt="Preview" />
        </div>
      )*/}
      {
        // <img src="http://localhost:3000/29faf4e9-7b98-4a5d-9f70-12ca88458b1f" alt="" />
      }
    </div>
  );
}