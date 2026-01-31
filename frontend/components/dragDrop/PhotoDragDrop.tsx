"use client";
import { LS_GetData, LS_KEY_IMAGE_URL, LS_SaveData } from "@/utils/editor-local-storage";
import {
  // UploadFile 

} from "@/utils/files";
import { useState, useRef, useEffect } from "react";

export default function PhotoDragDrop(
  { onImageUploaded }: { onImageUploaded: (imageUrl: string) => void }
) {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [temporaryFileAttachedURL, setTemporaryFileAttachedURL] = useState<string | null>(null);

  const UploadFile = async (
    file: File,
    folder: string,
    custom_ref: string,
    auth: "authorize" | "not-authorize",
    metadata: any
  ) => {

    console.log("Temporary UploadFile is this, in case you see this it means the functions is not completed, is missing, or the component and the related page of it should be deleted, maybe is old, please check good.");

    /*const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    formData.append("custom_ref", custom_ref);
    formData.append("metadata", JSON.stringify(metadata));

    const response = await fetch("http://localhost:3000/api/upload", {
      method: "POST",
      body: formData,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    });

    const data = await response.json();
    return data;*/
    return {} as any;
  }

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